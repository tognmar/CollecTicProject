import { useSelector} from "react-redux";
import {useEffect, useRef, useState} from "react";
import TicketSingle from "../TicketSingle/index.jsx";
import NoTicketsAvailable from "../NoTicketsAvailable/index.jsx";
import TicketForm from "../tickets/TicketForm/index.jsx";
import {useNavigate} from "react-router";

export default function MyTickets({headerHeight = 0, footerHeight = '5vh', error, isFetching}) {

    const tickets = useSelector(state => state.UserTickets.tickets);
    const ticketRefs = useRef([]);
    const containerRef = useRef(null);
    const [activeTicket, setActiveTicket] = useState(0);
    const [editingTicketId, setEditingTicketId] = useState(null);
    const [viewportHeight, setViewportHeight] = useState(0);
    const [footerHeightPx, setFooterHeightPx] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const calculateFooterHeight = () => {
            const vh = window.innerHeight / 100;
            if (footerHeight.endsWith('vh')) {
                const vhValue = parseFloat(footerHeight);
                return vh * vhValue;
            }
            return parseFloat(footerHeight) || 0;
        };

        const updateSizes = () => {
            setViewportHeight(window.innerHeight);
            setFooterHeightPx(calculateFooterHeight());
        };

        updateSizes();
        window.addEventListener('resize', updateSizes);

        return () => window.removeEventListener('resize', updateSizes);
    }, [footerHeight]);



    useEffect(() => {
        if (tickets && tickets.length > 0) {
            ticketRefs.current = ticketRefs.current.slice(0, tickets.length);
        }
    }, [tickets]);

    useEffect(() => {
        const handleScroll = () => {
            if (!ticketRefs.current.length) return;

            let mostVisibleIndex = 0;
            let maxVisibility = 0;

            ticketRefs.current.forEach((ref, index) => {
                if (!ref) return;

                const rect = ref.getBoundingClientRect();
                const viewportTop = headerHeight;
                const viewportHeight = window.innerHeight - headerHeight - footerHeightPx;
                const viewportBottom = viewportTop + viewportHeight;

                const visibleTop = Math.max(viewportTop, rect.top);
                const visibleBottom = Math.min(viewportBottom, rect.bottom);
                const visibleHeight = Math.max(0, visibleBottom - visibleTop);
                const percentVisible = (visibleHeight / rect.height) * 100;

                if (percentVisible > maxVisibility) {
                    maxVisibility = percentVisible;
                    mostVisibleIndex = index;
                }
            });

            setActiveTicket(mostVisibleIndex);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [headerHeight, footerHeightPx, tickets]);


    if (isFetching) {
        return <div className="flex justify-center p-6"><span className="loading loading-spinner loading-lg"></span>
        </div>;
    }

    if (error) {
        return <div className="p-4 text-error">Error fetching tickets: {error.message}</div>;
    }

    if (!tickets || tickets.length === 0) {
        return (
            <NoTicketsAvailable/>
        );
    }

    // Function to scroll to a ticket - modified to respect headerHeight
    const scrollToTicket = (index) => {
        if (!ticketRefs.current[index]) return;

        const ticketElement = ticketRefs.current[index];
        const ticketRect = ticketElement.getBoundingClientRect();

        // Calculate the optimal position
        // We want the top of the ticket to be just below the header
        const targetScrollY = window.scrollY + ticketRect.top - headerHeight - 16; // 16px buffer

        // Smooth scroll to that position
        window.scrollTo({
            top: targetScrollY,
            behavior: 'smooth'
        });
    };

    return (
        <div ref={containerRef} className="mt-4 px-4 pb-4">
            <div className="space-y-6">
                {tickets.map((ticket, index) => {
                    const distance = Math.abs(index - activeTicket);
                    const opacity = distance === 0 ? 1 : Math.max(0.4, 1 - (distance * 0.2));
                    const isCurrentActive = index === activeTicket;

                    return (
                        <div
                            key={ticket.id}
                            ref={el => ticketRefs.current[index] = el}
                            className="transition-all duration-300 ease-in-out relative"
                            style={{opacity}}
                            onClick={(e) => {
                                if (!isCurrentActive) {
                                    e.stopPropagation();
                                    scrollToTicket(index);
                                }
                            }}
                        >
                            <div
                                className="transition-transform duration-300"
                                style={{
                                    transform: `scale(${distance === 0 ? 1 : 0.98 - (distance * 0.01)})`,
                                    zIndex: tickets.length - distance
                                }}
                            >
                                <TicketSingle
                                    ticket={ticket}
                                    isActive={isCurrentActive}
                                    onClick={() => navigate(`/ticket/${ticket.id}`)}
                                    onEdit={() => setEditingTicketId(ticket.id)}
                                />
                            </div>
                        </div>
                    );
                })}
                <div style={{height: `${viewportHeight * 0.5}px`}} className="w-full"/>
            </div>

            {/* Modal Popup for TicketForm */}
            {editingTicketId && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
                    onClick={() => setEditingTicketId(null)} // Click on backdrop closes modal
                >
                    <div
                        className="bg-white rounded-xl shadow-lg p-2 max-w-2xl w-full relative"
                        onClick={e => e.stopPropagation()} // Click inside modal does not close
                    >
                        <TicketForm
                            ticketId={editingTicketId}
                            onClose={() => setEditingTicketId(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}