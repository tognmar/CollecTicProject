from django.urls import path

from .views import TicketListCreateView, TicketRetrieveUpdateDeleteView, upload_ticket, UserTicketsView, \
    LatestTicketView, UserTicketsByIdView

urlpatterns = [
    path('tickets/', TicketListCreateView.as_view()),
    path('tickets/<int:pk>/', TicketRetrieveUpdateDeleteView.as_view()),
    path('tickets/extraction/', upload_ticket, name='ticket_extraction'),
    path('tickets/me/', UserTicketsView.as_view()),
    path('tickets/latest/', LatestTicketView.as_view(), name='ticket-latest'),
    path('tickets/users/<int:id>/', UserTicketsByIdView.as_view(), name='user-tickets-by-id'),

]
