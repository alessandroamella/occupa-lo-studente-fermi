import React, { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { useSelector } from "react-redux";

const selectAgency = state => state.agency;

const AgencyHome = () => {
  const navigate = useNavigate();
  const { isLoggingIn, agency } = useSelector(selectAgency);

  useEffect(() => {
    if (!isLoggingIn && agency) {
      navigate("dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agency, isLoggingIn]);

  return (
    <Container bg="dark" variant="dark" className="mt-8 mb-4">
      <div>
        <p>
          Sono la <span className="font-semibold">agency homepage!!</span>
        </p>
        <p>
          Qua dovrei spiegarti perché inserire la tua azienda all'interno di
          questo sito, che verrà esposta alla maestosità dell'Eccellenza.
        </p>
        <div className="mt-4">
          <Button as={Link} to="signup" variant="outline-success">
            Crea azienda
          </Button>{" "}
          <Button as={Link} to="login" variant="outline-info">
            Login
          </Button>
        </div>
      </div>
      <Outlet />
    </Container>
  );
};

export default AgencyHome;
