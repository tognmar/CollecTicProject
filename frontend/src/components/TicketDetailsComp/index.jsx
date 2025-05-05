import React, { useState,  useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router';
import { MapPin, PencilIcon, Trash } from "lucide-react";
import { format } from 'date-fns';
import TicketForm from "../tickets/TicketForm/index.jsx";
import useFetchDelete from "../../utilities/CustomHooks/useFetchDelete.jsx";
import {deleteTicket} from "../../store/Slices/Tickets/index.js";
import { Music, Trophy, Film, Landmark } from "lucide-react";

export default function TicketDetailsComp() {
    const { ticketId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const tickets = useSelector(state => state.UserTickets.tickets);
    const ticket = tickets.find(ticket => ticket.id.toString() === ticketId);
    const user = useSelector(state => state.user.details);
    const isLoginUser = !!ticket?.user_profile?.id && !!user?.id && ticket.user_profile.id === user.id;

    // Use the custom hook with the ticket delete endpoint
    const {deleteResource,isDeleting,error,success,} = useFetchDelete(`/tickets/${ticketId}/`);

    // After successful delete, redirect to profile
    useEffect(() => {
        if (success && ticket?.user_profile?.id) {
            dispatch(deleteTicket(ticketId));
            navigate(`/profile/${ticket.user_profile.id}`); // Programmatic navigation
        }
    }, [success, navigate, ticket, dispatch, ticketId]);

    if (!ticket) return <div className="text-center text-gray-500 mt-10">Ticket not found</div>;

    return (
        <div className="max-w-xl mx-auto my-8 px-4 relative pb-20 overflow-y-auto">
            {/* Edit/Delete Buttons */}
            {isLoginUser && (
            <div className="flex justify-end mb-6">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-0.5 hover:bg-gray-200 px-2 py-2 rounded-full transition"
                    aria-label="Edit Ticket"
                >
                    <PencilIcon className="w-5 h-5"/>
                </button>

                <button
                    onClick={() => setShowConfirm(true)}
                    className="flex items-center gap-0.5 hover:bg-red-100 px-4 py-2 rounded-full transition"
                    aria-label="Delete Ticket"
                >
                    <Trash className="w-5 h-5 text-red-500"/>
                </button>
            </div>
            )}

            {/* Ticket Info Card */}
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-dashed">
                <div
                    className="h-40 bg-cover bg-center"
                    style={{ backgroundImage: ticket.ticket_image ? `url('${ticket.ticket_image}')` : 'none',
                    backgroundSize: 'contain',
                    backgroundPosition:'top',
                    backgroundRepeat: 'no-repeat'}}
                />

                <div className="p-4 space-y-3">
                    <h2 className="text-2xl font-bold text-gray-800">{ticket.title_artist || 'Untitled Ticket'}</h2>
                    <div className="flex justify-between items-center gap-2 text-sm text-gray-500 whitespace-nowrap">
                        <div>{format(new Date(ticket.date), 'dd MMM yyyy')}</div>

                        {ticket.location && (
                            <div className="flex items-center gap-1 text-gray-600">
                                <MapPin className="w-4 h-4 text-rose-500"/>
                                <span style={{ wordBreak: 'break-word' }}>{ticket.location}</span>
                            </div>
                        )}
                    </div>

                    {ticket.venue && (
                        <div className="text-sm text-gray-600">
                            <span className="font-medium">Venue:</span> {ticket.venue}
                        </div>
                    )}

                    {ticket.category && (
                       <div className="text-sm text-gray-600 flex items-center gap-1">

                          <span className="font-medium">Category:</span>{" "}

                           {ticket.category === 'music' && <Music className="w-4 h-4 text-gray-500" />}
                           {ticket.category === 'sports' && <Trophy className="w-4 h-4 text-gray-500" />}
                           {ticket.category === 'shows' && <Film className="w-4 h-4 text-gray-500" />}
                           {ticket.category === 'attractions' && <Landmark className="w-4 h-4 text-gray-500" />}

                           {ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)}
                       </div>
)}

                    <p className="text-gray-700 italic text-sm break-words whitespace-pre-line">
                         {ticket.text || 'No description provided.'}
                    </p>

                    {ticket.tags?.length > 0 && (
                        <div className="flex gap-2 flex-wrap mt-4">
                            {ticket.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-xs font-medium"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {ticket.event_image && (
                        <div className="mt-8">
                            <img
                                src={ticket.event_image}
                                alt="Event Memory"
                                className="rounded-xl shadow-md border border-gray-200"
                            />
                        </div>
                    )}

                    <Link to={`/profile/${ticket?.user_profile?.id}`} className="mt-6 block">← Back to Profile</Link>
                </div>
            </div>

            {/* Modal for Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ">
                    <div
                        className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
                    <TicketForm ticketId={ticket.id} onClose={() => setIsModalOpen(false)}/>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
                        <h3 className="text-lg font-semibold mb-4">Delete Ticket?</h3>
                        <p className="mb-6">Are you sure you want to delete this ticket? This action cannot be undone.</p>
                        {error && <div className="text-red-500 mb-2">{error}</div>}
                         <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => deleteResource()}
                                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                         </div>
                    </div>
                </div>
            )}

        </div>
    );
}
