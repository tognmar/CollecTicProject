import {createSlice} from '@reduxjs/toolkit'

export const otherUserSlice = createSlice({
    name: 'otherUsers',
    initialState: {
        otherUsers: []
    },
    reducers: {

        load_other_users: (state, action) => {
            state.otherUsers = action.payload
        },
        reset_other_user: (state) => {
            state.otherUsers = []
        }
    },
})

export const {
    load_other_users, reset_other_user
} = otherUserSlice.actions

export default otherUserSlice.reducer