import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { useDispatch, useSelector } from "react-redux";
import GoogleLogin from "../GoogleLogin";
import { logout } from "../../slices/studentAuthSlice";

const selectStudent = state => state.student;

const StudentNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function dispatchLogout() {
    dispatch(logout());
  }

  const { student } = useSelector(selectStudent);

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="#" onClick={() => navigate("/")}>
          <img
            alt=""
            src="https://ssh.edu.it/images/logos/fermi.png"
            className="d-inline-block w-14"
          />
          <span className="ml-3">Occupa lo studente</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/student">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/joboffers">
              Offerte di lavoro
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>

        <div className="text-white">
          {
            // loginLoaded ? (
            student ? (
              <div className="flex">
                <p className="mr-5">
                  Ciao, <span className="underline">{student.firstName}</span>
                </p>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a href="#" onClick={dispatchLogout}>
                  Logout
                </a>
              </div>
            ) : (
              <GoogleLogin />
            )
            // ) : (
            //   <p>Caricamento...</p>
            // )
          }
        </div>
      </Container>
    </Navbar>
  );
};

export default StudentNavbar;
