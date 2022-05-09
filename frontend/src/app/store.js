import { configureStore } from "@reduxjs/toolkit";
import studentAuthSlice from "../slices/studentAuthSlice";
import agencyAuthSlice from "../slices/agencyAuthSlice";
import alertSlice from "../slices/alertSlice";

export default configureStore({
    reducer: {
        student: studentAuthSlice,
        agency: agencyAuthSlice,
        alert: alertSlice
    }
});
