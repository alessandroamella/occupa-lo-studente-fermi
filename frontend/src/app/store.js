import { configureStore } from "@reduxjs/toolkit";
import studentAuthSlice from "../slices/studentAuthSlice";
import agencyAuthSlice from "../slices/agencyAuthSlice";

export default configureStore({
    reducer: {
        student: studentAuthSlice,
        agency: agencyAuthSlice
    }
});
