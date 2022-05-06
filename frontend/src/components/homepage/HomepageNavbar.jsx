import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";

const MainNavbar = () => {
  const navigate = useNavigate();
  return (
    <div className="absolute w-full py-6 top-0 left-0 right-0 bg-[rgba(255,255,255,0.3)]">
      <Container className="flex justify-center text-center items-center">
        <img
          alt=""
          src="/img/fermi_trimmed.png"
          className="d-inline-block w-14"
        />
        <span className="ml-3 text-3xl uppercase font-semibold text-white tracking-tight	">
          Occupa lo studente
        </span>
      </Container>
    </div>
  );
};

export default MainNavbar;
