import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const login = createAsyncThunk("/student/login", async () => {
    try {
        const { data } = await axios.get("/api/student/current");
        // DEBUG
        // console.log("Student logged in", data);
        return data;
    } catch (err) {
        // console.log("Student not logged in");
        return null;
        // setStudent(null);
    }
});

export const logout = createAsyncThunk("/student/logout", async () => {
    try {
        await axios.get("/api/student/auth/logout");
        return true;
    } catch (err) {
        return false;
    }
});

export const studentAuthSlice = createSlice({
    name: "student",
    initialState: {
        student: null
    },
    // reducers: {
    //     login: (state, action) => {
    //         state.student = action.payload;
    //     },
    //     logout: state => {
    //         state.student = null;
    //     }
    // }
    extraReducers: builder => {
        builder.addCase(login.fulfilled, (state, action) => {
            if (action.payload) state.student = action.payload;
        });
        builder.addCase(logout.fulfilled, (state, action) => {
            // Logout returns true only if successful
            if (action.payload) state.student = null;
        });
    }
});

// export const { login, logout } = studentAuthSlice.actions;

export default studentAuthSlice.reducer;
