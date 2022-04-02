import React from "react";
import Spinner from "react-bootstrap/Spinner";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const selectStudent = state => state.student;

const RequireStudentLogin = ({ children }) => {
  const { isLoggingIn, student } = useSelector(selectStudent);

  console.log({ isLoggingIn, student });

  return isLoggingIn ? (
    <div className="mt-3 flex w-full justify-center text-center items-center">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Caricamento...</span>
      </Spinner>{" "}
      <p className="ml-2">Caricamento...</p>
    </div>
  ) : student ? (
    children
  ) : (
    <Navigate to={"/student/login"} replace />
  );
};

export default RequireStudentLogin;
