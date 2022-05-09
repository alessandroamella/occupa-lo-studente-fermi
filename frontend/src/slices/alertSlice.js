import { createSlice } from "@reduxjs/toolkit";

export const alertSlice = createSlice({
    name: "alert",
    initialState: {
        type: "success",
        title: "Prova",
        text: "Benvenuto",
        isShown: false
    },
    reducers: {
        setMessage: (state, action) => {
            const { type, title, text } = action.payload;
            state.type = type;
            state.title = title;
            state.text = text;
            state.isShown = true;
        },
        removeMessage: (state, action) => {
            state.isShown = false;
        }
    }
});

export const { setMessage, removeMessage } = alertSlice.actions;

export default alertSlice.reducer;
