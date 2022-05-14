import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { useDispatch, useSelector } from "react-redux";
import GoogleLogin from "./GoogleLogin";
import { logout } from "../../slices/studentAuthSlice";
import { setMessage } from "../../slices/alertSlice";

const selectStudent = state => state.student;

const StudentNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function dispatchLogout() {
    dispatch(logout());
    dispatch(
      setMessage({
        color: "green",
        title: "Logout",
        text: "Logout avvenuto con successo, sei stato reindirizzato alla homepage"
      })
    );
    navigate("/");
  }

  const { student, isLoggingIn } = useSelector(selectStudent);

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="#" onClick={() => navigate("/")}>
          <img
            alt=""
            loading="lazy"
            src="https://ssh.edu.it/images/logos/fermi.png"
            className="d-inline-block w-14"
          />
          <span className="ml-3 hidden md:inline">Occupa lo studente</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto hidden md:block">
            <Nav.Link as={Link} to="/student">
              Home studenti
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>

        <div className="text-white">
          {
            // loginLoaded ? (
            isLoggingIn ? (
              <p>Caricamento...</p>
            ) : student ? (
              <div className="flex items-center">
                <div
                  className="mr-5 flex items-center cursor-pointer hover:bg-gray-700 transition-colors rounded p-1"
                  onClick={() => navigate("/student/profile")}
                >
                  {student.pictureUrl ? (
                    <img
                      className="w-8 mr-2 rounded-full aspect-square"
                      loading="lazy"
                      src={student.pictureUrl}
                      alt="Profile pic"
                    />
                  ) : (
                    "Ciao, "
                  )}
                  <span>{student.firstName}</span>
                </div>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a href="#" onClick={dispatchLogout}>
                  Logout
                </a>
              </div>
            ) : (
              <GoogleLogin />
            )
          }
        </div>
      </Container>
    </Navbar>
  );
};

export default StudentNavbar;
