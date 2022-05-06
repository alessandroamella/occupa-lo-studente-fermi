import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";

const MainNavbar = () => {
  const navigate = useNavigate();
  return (
    <Navbar bg="dark" variant="dark" className="absolute top-0 w-screen z-10">
      <Container>
        <Navbar.Brand href="#" onClick={() => navigate("/")}>
          <img
            alt=""
            src="https://ssh.edu.it/images/logos/fermi.png"
            className="d-inline-block w-14"
          />
          <span className="ml-3">Occupa lo studente</span>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default MainNavbar;
