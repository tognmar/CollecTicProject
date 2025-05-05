import {createSlice} from '@reduxjs/toolkit'

const savedDetails = localStorage.getItem("details");

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        access_token: undefined,
        details: savedDetails ? savedDetails : null,
    },
    reducers: {

        login_user: (state, action) => {
            state.access_token = action.payload
            localStorage.setItem("accessToken", action.payload)
        },
        logout_user: (state) => {
            state.access_token = null
            state.details = null
            localStorage.removeItem("accessToken")
            localStorage.removeItem("details")
        },
        load_user: (state, action) => {
            state.details = action.payload
            localStorage.setItem("details", action.payload)
        }
    },
})

export const {
    login_user, logout_user, load_user
} = userSlice.actions

export default userSlice.reducer