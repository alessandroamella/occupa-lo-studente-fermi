import React from "react";
import GoogleLogin from "../GoogleLogin";
import { useNavigate } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";

const StudentNavbar = ({ loginLoaded, student, logout }) => {
    const navigate = useNavigate();
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
                <div className="text-white">
                    {loginLoaded ? (
                        student ? (
                            <div className="flex">
                                <p className="mr-5">
                                    Ciao,{" "}
                                    <span className="underline">
                                        {student.firstName}
                                    </span>
                                </p>
                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                <a href="#" onClick={logout}>
                                    Logout
                                </a>
                            </div>
                        ) : (
                            <GoogleLogin />
                        )
                    ) : (
                        <p>Caricamento...</p>
                    )}
                </div>
            </Container>
        </Navbar>
    );
};

export default StudentNavbar;