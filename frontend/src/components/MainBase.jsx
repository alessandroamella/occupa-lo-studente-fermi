import React from "react";
import { Outlet } from "react-router-dom";
import MainNavbar from "./MainNavbar";

const MainBase = () => {
    return (
        <>
            <MainNavbar />
            <Outlet />
        </>
    );
};

export default MainBase;
