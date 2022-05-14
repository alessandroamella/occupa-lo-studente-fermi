import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { logout } from "../../slices/agencyAuthSlice";
import { BoxArrowLeft } from "react-bootstrap-icons";

const selectAgency = state => state.agency;

const AgencyNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function dispatchLogout() {
    dispatch(logout());
  }

  const { agency, isLoggingIn } = useSelector(selectAgency);

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="#" onClick={() => navigate("/")}>
          <img
            alt=""
            src="https://ssh.edu.it/images/logos/fermi.png"
            className="d-inline-block w-14"
            loading="lazy"
          />
          <span className="ml-3 hidden md:inline">Occupa lo studente</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto hidden md:block">
            <Nav.Link as={Link} to="/agency">
              Home azienda
            </Nav.Link>
            {/* <Nav.Link as={Link} to="/agency">
              Offerte di lavoro
            </Nav.Link> */}
          </Nav>
        </Navbar.Collapse>

        <div className="text-white">
          {
            // loginLoaded ? (
            isLoggingIn ? (
              <p>Caricamento...</p>
            ) : agency ? (
              <div className="flex">
                <Link to="/agency/dashboard" className="mr-5">
                  Ciao, <span className="underline">{agency.agencyName}</span>
                </Link>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a
                  href="#"
                  onClick={dispatchLogout}
                  className="flex items-center"
                >
                  <BoxArrowLeft />
                  <span className="ml-1">Logout</span>
                </a>
              </div>
            ) : (
              <Button as={Link} to="/agency/login" variant="outline-light">
                Login o registrati
              </Button>
            )
          }
        </div>
      </Container>
    </Navbar>
  );
};

export default AgencyNavbar;
