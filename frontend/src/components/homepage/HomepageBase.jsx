import React from "react";
import { Outlet } from "react-router-dom";
import MainNavbar from "./HomepageNavbar";

const MainBase = () => {
  return (
    <>
      <MainNavbar />
      <Outlet />
    </>
  );
};

export default MainBase;
