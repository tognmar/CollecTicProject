import {createSlice} from '@reduxjs/toolkit'

export const filterSlice = createSlice({
    name: 'filter',
    initialState: {
        filter: "My Tickets"
    },
    reducers: {

        load_filter: (state, action) => {
          state.filter = action.payload;
        },
        reset_filter: (state) => {
            state.filter = "My Tickets"
}
    },
})

export const {
    load_filter, reset_filter
} = filterSlice.actions

export default filterSlice.reducer