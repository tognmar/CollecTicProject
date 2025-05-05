import React from 'react';
import { format } from 'date-fns';
import { Music, Trophy, Film, Landmark } from "lucide-react";

const getCategoryIcon = (category) => {
   switch (category) {
     case 'music':
      return Music;
     case 'sports':
      return Trophy;
     case 'shows':
      return Film;
     case 'attractions':
      return Landmark;
     default:
      return null;
   }
  };

export default function TicketSingle({ ticket, isActive = true, onClick }) {

  const CategoryIcon = getCategoryIcon(ticket.category);

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  if (!isActive) {
    return (
      <div className="flex justify-between items-center py-2 border rounded-lg bg-gray-100 shadow-sm px-4">
        <h3 className="text-lg font-bold">{ticket.title_artist}</h3>
        <span className="text-xs text-gray-500">{formatDate(ticket.date)}</span>
      </div>
    );
  }

  return (
    <div className="w-full cursor-pointer" onClick={onClick}>
      <div
        className="relative flex flex-col justify-between items-stretch rounded-2xl border-2 border-dashed border-gray-300 shadow-lg max-w-md mx-auto my-4 bg-cover bg-center"
        style={{
          backgroundImage: ticket.ticket_image ? `url('${ticket.ticket_image}')` : 'none',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 z-0" />
        {/* Decorative dots */}
        <div className="absolute left-0 top-1/4 w-3 h-3 bg-white border-2 border-gray-300 rounded-full -translate-x-1/2 z-10"></div>
        <div className="absolute left-0 bottom-1/4 w-3 h-3 bg-white border-2 border-gray-300 rounded-full -translate-x-1/2 z-10"></div>
        <div className="absolute right-0 top-1/4 w-3 h-3 bg-white border-2 border-gray-300 rounded-full translate-x-1/2 z-10"></div>
        <div className="absolute right-0 bottom-1/4 w-3 h-3 bg-white border-2 border-gray-300 rounded-full translate-x-1/2 z-10"></div>

        {/* Category icon top-right */}
        {CategoryIcon && (
          <div className="absolute -top-4 right-4 z-20 bg-white rounded-full p-2 shadow-lg">
            <CategoryIcon alt={ticket.category} className="w-5 h-5 "/>
          </div>
        )}

        <div className="relative z-10 flex flex-col flex-1 justify-between p-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-extrabold tracking-wide text-white drop-shadow">{ticket.title_artist}</h3>
              <span className="text-sm text-gray-100 font-mono">{formatDate(ticket.date)}</span>
            </div>
            <div className="flex justify-between gap-8 mb-2">
              <div>
                <span className="text-xs text-gray-200">VENUE</span>
                <p className="font-semibold text-white">{ticket.venue}</p>
              </div>
              <div>
                <span className="text-xs text-gray-200">LOCATION</span>
                <p className="font-semibold text-white">{ticket.location}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
