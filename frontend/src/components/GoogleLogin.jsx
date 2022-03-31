import React from "react";
import GoogleButton from "react-google-button";
import { useNavigate } from "react-router-dom";

const GoogleLogin = () => {
  const navigate = useNavigate();

  return (
    <GoogleButton
      /* disabled={disabled} */ type="dark"
      onClick={() => navigate("/student/login", { replace: true })}
    />
  );
};

export default GoogleLogin;
