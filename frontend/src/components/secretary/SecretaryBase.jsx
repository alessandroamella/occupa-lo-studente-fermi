import React from "react";

import { Outlet } from "react-router-dom";
import SecretaryNavbar from "./SecretaryNavbar";

const SecretaryBase = () => {
  return (
    <>
      <SecretaryNavbar />
      <Outlet />
    </>
  );
};

export default SecretaryBase;
