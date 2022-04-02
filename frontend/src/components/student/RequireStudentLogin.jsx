import React from "react";
import Spinner from "react-bootstrap/Spinner";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const selectStudent = state => state.student;

const RequireStudentLogin = ({ children }) => {
  const { isLoggingIn, student } = useSelector(selectStudent);

  return isLoggingIn ? (
    <>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Caricamento...</span>
      </Spinner>{" "}
      Caricamento...
    </>
  ) : student ? (
    children
  ) : (
    <Navigate to={"/student/login"} replace />
  );
};

export default RequireStudentLogin;
