import React from "react";
import Spinner from "react-bootstrap/Spinner";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const selectAgency = state => state.agency;

const RequireAgencyLogin = ({ children }) => {
  const { isLoggingIn, agency } = useSelector(selectAgency);

  // console.log({ isLoggingIn, agency });

  return isLoggingIn ? (
    <div className="mt-3 flex w-full justify-center text-center items-center">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Caricamento...</span>
      </Spinner>{" "}
      <p className="ml-2">Caricamento...</p>
    </div>
  ) : agency ? (
    children
  ) : (
    <Navigate to={"/agency/login"} replace />
  );
};

export default RequireAgencyLogin;
