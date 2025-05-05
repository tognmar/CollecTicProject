import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import mapMarker from "../../assets/SVGs/map-marker.svg";
import { useParams } from 'react-router';

// This component handles the auto-fit bounds functionality
function SetBoundsToMarkers({ markers, singleMarkerZoom = 12 }) {
    const map = useMap();

    useEffect(() => {
        if (!markers || markers.length === 0) return;

        // For a single marker, center and zoom to it
        if (markers.length === 1) {
            const [lat, lng] = markers[0];
            map.setView([lat, lng], singleMarkerZoom);
            return;
        }

        // For multiple markers, fit bounds
        const bounds = L.latLngBounds(markers);
        map.fitBounds(bounds, { padding: [50, 50] });
    }, [markers, map, singleMarkerZoom]);

    return null;
}

export default function MapComp({ mapStyle = "positron", startingPosition = "default" }) {
    const tickets = useSelector(state => state.UserTickets.tickets);
    const dispatch = useDispatch();
    const { userId } = useParams();
    const mapRef = useRef(null);

    // Default center position (will be overridden by bounds)
    const defaultPosition = [51.505, -0.09];

    const styles = {
        streets: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        satellite: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        blackWhite: "https://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png",
        terrain: "https://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png",
        positron: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
    };

    const svgIcon = new L.Icon({
        iconUrl: mapMarker,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });

    // Fetch tickets when the map component mounts
    useEffect(() => {
        // Only fetch if we have a userId and the tickets array is empty
        if (userId && (!tickets || tickets.length === 0)) {
            // Using the same fetch pattern as in the user profile
            fetch(`${process.env.REACT_APP_API_URL}/users/${userId}/tickets/`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    // Dispatch to the same Redux store that UserProfile uses
                    dispatch({ type: 'UserTickets/setTickets', payload: data });
                })
                .catch(error => {
                    console.error('Error fetching tickets:', error);
                });
        }
    }, [userId, tickets, dispatch]);

    const groupTicketsByCity = () => {
        const groupedTickets = {};
        if (!tickets || tickets.length === 0) return groupedTickets;

        tickets.forEach(ticket => {
            const city = ticket.location?.split(",")[0] || "Unknown";
            if (groupedTickets[city]) {
                groupedTickets[city].push(ticket);
            } else {
                groupedTickets[city] = [ticket];
            }
        });
        return groupedTickets;
    };

    const groupedTickets = groupTicketsByCity();

    // Prepare marker positions for the bounds calculation
    const markerPositions = Object.keys(groupedTickets).map(city => {
        const ticketsAtCity = groupedTickets[city];
        const latitude = ticketsAtCity[0].latitude || 51.505;
        const longitude = ticketsAtCity[0].longitude || -0.09;
        return [latitude, longitude];
    });

    return (
        <div className="w-full" style={{ height: "calc(100vh - 65px)" }}>
            <MapContainer
                center={defaultPosition}
                zoom={5}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url={styles[mapStyle]}
                />

                {/* Auto-fit bounds component */}
                {markerPositions.length > 0 && (
                    <SetBoundsToMarkers markers={markerPositions} />
                )}

                {Object.keys(groupedTickets).map((city) => {
                    const ticketsAtCity = groupedTickets[city];
                    const latitude = ticketsAtCity[0].latitude || 51.505;
                    const longitude = ticketsAtCity[0].longitude || -0.09;

                    return (
                        <Marker
                            key={city}
                            position={[latitude, longitude]}
                            icon={svgIcon}
                        >
                            <Popup>
                                <p className="text-sm">Total Tickets in {city}: {ticketsAtCity.length}</p>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}