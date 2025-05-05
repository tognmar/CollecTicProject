import {createSlice} from '@reduxjs/toolkit'


export const otherUserTicketsSlice = createSlice({
    name: 'otherUserTickets',
    initialState: {
        tickets: []
    },

    reducers: {
        load_tickets: (state, action) => {
            state.tickets = action.payload
        },
        reset_tickets: (state) => {
            state.tickets = null
        },
    },
})

export const {
    load_tickets, reset_tickets
} = otherUserTicketsSlice.actions

export default otherUserTicketsSlice.reducer