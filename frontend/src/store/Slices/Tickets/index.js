import {createSlice} from '@reduxjs/toolkit'


export const UserTicketsSlice = createSlice({
    name: 'UserTickets',
    initialState: {
        tickets: []
    },

    reducers: {
        load_tickets: (state, action) => {
            state.tickets = action.payload
            console.log(state.tickets) // here is the log
        },
        reset_tickets: (state) => {
            state.tickets = []
        },
        update_ticket: (state, action) => {
         const updatedTicket = action.payload;
         const index = state.tickets.findIndex(ticket => ticket.id === updatedTicket.id);
         if (index !== -1) {
          state.tickets[index] = {
              ...state.tickets[index], // old ticket (full data)
              ...updatedTicket,        // new partial update
          };
         }
        },
        deleteTicket: (state, action) => {
            const ticketIdToDelete = action.payload;
            state.tickets = state.tickets.filter(
                ticket => ticket.id.toString() !== ticketIdToDelete
            );
        },
    },
})

export const {
    load_tickets, reset_tickets, update_ticket, deleteTicket
} = UserTicketsSlice.actions

export default UserTicketsSlice.reducer