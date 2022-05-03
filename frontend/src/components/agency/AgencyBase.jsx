import React from "react";

import { Outlet } from "react-router-dom";
import AgencyNavbar from "./AgencyNavbar";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../slices/agencyAuthSlice";

const AgencyBase = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(login());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <AgencyNavbar />
      <Outlet />
    </>
  );
};

export default AgencyBase;
