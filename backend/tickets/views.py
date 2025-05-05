import base64
import json
import os
import re
from io import BytesIO

import openai
from dateutil.parser import parse as parse_date
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from pdf2image import convert_from_bytes
from rest_framework import generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Ticket
from .serializers import TicketReadSerializer, TicketWriteSerializer


class TicketListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Ticket.objects.filter(user_profile=self.request.user)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return TicketWriteSerializer
        return TicketReadSerializer

    def perform_create(self, serializer):
        serializer.save(user_profile=self.request.user)


class TicketRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Ticket.objects.filter(user_profile=self.request.user)

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return TicketWriteSerializer
        return TicketReadSerializer


class UserTicketsView(generics.ListAPIView):
    """
    API endpoint that allows the currently logged-in user to view their tickets.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TicketReadSerializer

    def get_queryset(self):
        """
        Return tickets belonging to the currently authenticated user, with latest on top
        """
        if self.request.user.is_anonymous:
            raise AuthenticationFailed("User must be authenticated to access tickets.")
        return Ticket.objects.filter(user_profile=self.request.user).order_by('-date')


class UserTicketsByIdView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]  # Adjust as needed (e.g., IsAdminUser)
    serializer_class = TicketReadSerializer

    def get_queryset(self):
        user_profile_id = self.kwargs['id']
        return Ticket.objects.filter(user_profile_id=user_profile_id).order_by('-date')


class LatestTicketView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        latest_ticket = (
            Ticket.objects
            .filter(user_profile=request.user)
            .order_by('-id')  # or '-date' if date is more reliable
            .first()
        )
        if not latest_ticket:
            return Response({"detail": "No ticket found."}, status=404)

        serializer = TicketReadSerializer(latest_ticket)
        return Response(serializer.data)


@csrf_exempt
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def upload_ticket(request):
    # Ensure the user is authenticated
    if request.user.is_anonymous:
        return JsonResponse({'error': 'User must be authenticated.'}, status=403)

    try:
        api_key = os.environ.get('OPENAI_API_KEY')
        if not api_key:
            return JsonResponse({'error': 'OpenAI API key not found in environment variables.'}, status=500)

        client = openai.OpenAI(api_key=api_key)
        if 'file' not in request.FILES:
            return JsonResponse({'error': 'No file uploaded.'}, status=400)

        file = request.FILES['file']

        # Check if the uploaded file is a PDF.
        if file.content_type == 'application/pdf' or file.name.lower().endswith('.pdf'):

            # Read the entire PDF file as bytes.
            pdf_bytes = file.read()
            try:
                # Convert first page of PDF to image.
                images = convert_from_bytes(pdf_bytes, first_page=1, last_page=1)
            except Exception as ex:
                return JsonResponse({'error': 'Failed to convert PDF to image: ' + str(ex)}, status=500)

            if not images:
                return JsonResponse({'error': 'PDF has no pages.'}, status=400)

            # Get the first (or only) page as a PIL image.
            pil_image = images[0]

            # Save the PIL image into a bytes buffer.
            buffer = BytesIO()
            pil_image.save(buffer, format='JPEG')
            image_bytes = buffer.getvalue()
            b64_image = base64.b64encode(image_bytes).decode('utf-8')
            buffer.seek(0)

            # Create an InMemoryUploadedFile from the buffer to be saved in the model.

            size = buffer.getbuffer().nbytes
            file = InMemoryUploadedFile(buffer, None, file.name.replace('.pdf', '.jpg'),
                                        'image/jpeg', size, None)
        else:
            # If the file is an image, process it as before.
            file_content = file.read()
            b64_image = base64.b64encode(file_content).decode('utf-8')
            file.seek(0)

        # System instructions for extraction (as before)
        system_instructions = (
            "You are a ticket information extractor. Your first task is to decide whether the uploaded image is a real-world event ticket. "
            "If the image does not resemble a physical or digital event ticket, return this JSON exactly: "
            "{ \"error\": \"Not a ticket\" }.\n\n"
            "If the image does appear to be a ticket, extract only the performance-related details."
            "Ignore any organizer, promoter, or ticket issuer info. Extract the following fields:\n"
            "from the ticket image. Ignore any organizer, promoter, or ticket issuer details. Extract these fields only:\n"
            "   - 'title_artist': list of performing bands or artists. If the event is a festival, set this to the festival name instead. "
            "If the value appears to be an organizer or promoter (e.g., 'Gadget', 'Ticketmaster'), leave it blank. "
            "If only one artist is found and it's not a festival, use that artist's name.\n"
            "   - 'event_image': a URL or null,\n"
            "   - 'ticket_image': leave as a placeholder (will be injected later),\n"
            "   - 'location': **strictly format as 'City, Country'** (e.g., 'Zürich, Switzerland'). "
            "**Remove any zip codes, districts, or sub-locations** (e.g., convert '8050 Zürich-Oerlikon' to 'Zürich, Switzerland').\n"
            "   - 'venue': the venue name,\n"
            "   - 'date': event date in 'YYYY-MM-DD' format,\n"
            "   - 'text': null,\n\n"
            "   - 'latitude': approximate latitude of the city (e.g., 47.3769 for Zürich). If unknown, set to null,\n"
            "   - 'longitude': approximate longitude of the city (e.g., 8.5417 for Zürich). If unknown, set to null,\n\n"
            "IMPORTANT: If the city already has a latitude and longitude stored in the database, always use the same values "
            "to maintain consistency. Do not extract new latitude and longitude if they are already available for the city.\n\n"
            "   - 'category': one of the following four values ONLY:"
            "- 'music' (for concerts, musicals, operas, live bands, orchestras)"
            "- 'sports' (for all competitive or professional sports events)"
            "- 'shows' (for theater, stand-up comedy, cinema, dance, spoken word)"
            "- 'attractions' (for museums, parks, zoos, exhibitions, science centers)"
            "Return only valid JSON without any extra keys or text. For example, if a ticket displays a promoter name "
            "like 'Gadget' and the actual performing band is 'Nothing But Thieves', the output should be:\n\n"
            "{\"title_artist\": \"Nothing But Thieves\", \"event_image\": null, "
            "\"ticket_image\": \"<ticket image URL>\", \"location\": \"8050 Zürich-Oerlikon\", \"venue\": \"Halle 622\", "
            "\"date\": \"2021-11-05\", \"text\": null, \"latitude\": 47.3769, \"longitude\": 8.5417}\n\n"
            "\"date\": \"2021-11-05\", \"text\": null, \"category\": music or sports or shows or attractions}\n\n"
            "If the ticket is for a festival like 'Openair Frauenfeld', and no individual artists are listed, output:\n"
            "{\"title_artist\": \"Openair Frauenfeld\", \"event_image\": null, "
            "\"ticket_image\": \"<ticket image URL>\", \"location\": \"Frauenfeld\", \"venue\": \"Openair Grounds\", "
            "\"date\": \"2023-07-07\", \"text\": null, \"latitude\": 47.5580, \"longitude\": 8.8980}"
            "\"date\": \"2023-07-07\", \"text\": null, \"category\": music or sports or shows or attractions}"
        )

        user_message = (
            "Extract the performance-related details from this ticket image. Return only the JSON with the above fields."
        )

        messages = [
            {"role": "system", "content": system_instructions},
            {"role": "user", "content": [
                {"type": "text", "text": user_message},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64_image}"}}
            ]}
        ]

        # Call the ChatGPT API.
        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=messages,
            max_tokens=500,
        )

        raw_extracted_info = (response.choices[0].message.content or "").strip()

        # Use regex to extract a JSON object from the API response.
        match = re.search(r'(\{.*\})', raw_extracted_info, re.DOTALL)
        if not match:
            return JsonResponse({'error': 'No JSON object found in the response.'}, status=500)

        json_str = match.group(1)
        try:
            extracted_data = json.loads(json_str)
        except json.JSONDecodeError as e:
            return JsonResponse({'error': f'JSON parsing error: {str(e)}'}, status=500)

        refined_data = extracted_data

        if refined_data.get("error") == "Not a ticket":
            return JsonResponse({"error": "Image does not appear to be a valid ticket."}, status=400)

        # Attempt to parse and reformat the date field.
        extracted_date = (refined_data.get("date", "") or "").strip()
        if extracted_date:
            try:
                parsed_date = parse_date(extracted_date)
                refined_data["date"] = parsed_date.strftime("%Y-%m-%d")
            except Exception:
                refined_data["date"] = None

        if not refined_data.get("date"):
            refined_data["date"] = timezone.now().strftime("%Y-%m-%d")

        # Create the Ticket instance. Note that `ticket_image` will be the image file (original or converted).
        ticket_data = {
            "title_artist": refined_data.get("title_artist") or "Unnamed Event",
            "location": refined_data.get("location") or "Unknown Location",
            "venue": refined_data.get("venue") or "Unknown Venue",
            "date": refined_data.get("date"),
            "text": refined_data.get("text"),
            "category": refined_data.get("category") or "Unnamed Category",
            "ticket_image": file,
            "event_image": None,
            "latitude": refined_data.get("latitude") or 0.0,
            "longitude": refined_data.get("longitude") or 0.0,
        }

        serializer = TicketWriteSerializer(data=ticket_data)
        if not serializer.is_valid():
            return JsonResponse({'error': serializer.errors}, status=400)

        ticket = serializer.save(user_profile=request.user)

        serialized_ticket = TicketReadSerializer(ticket)
        return JsonResponse(serialized_ticket.data)

    except Exception as e:
        return JsonResponse({'error': f'Server error: {str(e)}'}, status=500)
