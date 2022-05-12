import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";

const SecretaryNavbar = () => {
  const navigate = useNavigate();

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="#" onClick={() => navigate("/")}>
          <img
            loading="lazy"
            alt=""
            src="https://ssh.edu.it/images/logos/fermi.png"
            className="d-inline-block w-14"
          />
          <span className="ml-3 hidden md:inline">Occupa lo studente</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto hidden md:block">
            <Nav.Link as={Link} to="/student">
              Home
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>

        <div className="text-white">
          <div className="flex">
            <p className="mr-5 font-bold underline">Dashboard segreteria</p>
          </div>
        </div>
      </Container>
    </Navbar>
  );
};

export default SecretaryNavbar;
