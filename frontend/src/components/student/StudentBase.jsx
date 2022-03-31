import React from "react";

import StudentNavbar from "./StudentNavbar";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../slices/studentAuthSlice";

const StudentBase = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(login());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <StudentNavbar />
      <Outlet />
    </>
  );
};

export default StudentBase;
