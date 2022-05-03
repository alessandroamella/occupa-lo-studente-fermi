import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const login = createAsyncThunk("/agency/login", async () => {
    try {
        const { data } = await axios.get("/api/agency");
        // DEBUG
        // console.log("Agency logged in", data);
        return data;
    } catch (err) {
        // console.log("Agency not logged in");
        return null;
        // setAgency(null);
    }
});

export const logout = createAsyncThunk("/agency/logout", async () => {
    try {
        await axios.get("/api/agency/logout");
        return true;
    } catch (err) {
        return false;
    }
});

export const agencyAuthSlice = createSlice({
    name: "agency",
    initialState: {
        agency: null,
        isLoggingIn: true
    },
    reducers: {
        setIsLoggingIn: (state, action) => {
            state.isLoggingIn = action.payload;
        },
        setAgency: (state, action) => {
            state.agency = action.payload;
        }
    },
    extraReducers: builder => {
        builder.addCase(login.fulfilled, (state, action) => {
            if (action.payload) {
                state.agency = action.payload;
            }
            state.isLoggingIn = false;
        });
        builder.addCase(logout.fulfilled, (state, action) => {
            // Logout returns true only if successful
            if (action.payload) {
                state.agency = null;
            }
            state.isLoggingIn = false;
        });
    }
});

export const { setIsLoggingIn, setAgency } = agencyAuthSlice.actions;

export default agencyAuthSlice.reducer;
