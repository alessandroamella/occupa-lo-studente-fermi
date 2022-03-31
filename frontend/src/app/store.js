import { configureStore } from "@reduxjs/toolkit";
import studentAuthSlice from "../slices/studentAuthSlice";

export default configureStore({
    reducer: {
        student: studentAuthSlice
    }
});
