import {ArrowLeft, Search} from "lucide-react";
import {useNavigate} from "react-router";
import {useSelector} from "react-redux";
import {useState} from "react";
import {format} from 'date-fns';
import TicketSingle from "../TicketSingle/index.jsx";

export default function SearchTicketComp() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const allTickets = useSelector(state => state.UserTickets.tickets);

    const filteredTickets = allTickets.filter(ticket => {
        const formattedDate = ticket.date ? format(new Date(ticket.date), 'MMMM dd, yyyy') : '';
        const query = searchQuery.toLowerCase();

        return (
            ticket.title_artist.toLowerCase().includes(query) ||
            ticket.location.toLowerCase().includes(query) ||
            ticket.venue.toLowerCase().includes(query) ||
            ticket.category.toLowerCase().includes(query) ||
            formattedDate.toLowerCase().includes(query)
        );
    });

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto px-4">
            {/* Search Bar */}
            <div className="flex items-center gap-3 w-full my-6">
                <button
                    onClick={handleBack}
                    className="flex items-center justify-center p-2 rounded-full hover:bg-gray-200 transition"
                >
                    <ArrowLeft className="h-5 w-5 text-gray-600"/>
                </button>

                <label className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        <Search className="h-5 w-5"/>
                    </span>
                    <input
                        type="search"
                        placeholder="Search tickets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border border-gray-300 rounded-full py-2 pl-10 pr-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm bg-transparent"
                    />
                </label>
            </div>

            {/* Tickets List */}
            <div className="w-full">
                <div className="flex flex-col gap-4">
                    {(searchQuery.trim() === '' ? allTickets : filteredTickets).map(ticket => (
                        <TicketSingle
                            key={ticket.id}
                            ticket={ticket}
                            onClick={() => navigate(`/ticket/${ticket.id}`)}
                        />
                    ))}
                    {searchQuery.trim() !== '' && filteredTickets.length === 0 && (
                        <div className="text-center text-gray-500 mt-8">
                            No tickets found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
