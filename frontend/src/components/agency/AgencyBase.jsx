import React from "react";

import { Outlet } from "react-router-dom";
import AgencyNavbar from "./AgencyNavbar";

const AgencyBase = () => {
  return (
    <>
      <AgencyNavbar />
      <Outlet />
    </>
  );
};

export default AgencyBase;
