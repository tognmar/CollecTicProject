import {createSlice} from '@reduxjs/toolkit'

export const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        userProfile: null,
    },
    reducers: {

        load_profile: (state, action) => {
          state.userProfile = {...action.payload};
        },
        reset_profile: (state) => {
            state.userProfile = null
}
    },
})

export const {
    load_profile, reset_profile
} = profileSlice.actions

export default profileSlice.reducer