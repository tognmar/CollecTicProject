import {createSlice} from '@reduxjs/toolkit'


export const themesSlice = createSlice({
    name: 'themes',
    initialState: {
        theme: "mycustomtheme"
    },

    reducers: {
        set_theme: (state, action) => {
            state.theme = action.payload
        },
    },
})

export const {
    set_theme
} = themesSlice.actions

export default themesSlice.reducer