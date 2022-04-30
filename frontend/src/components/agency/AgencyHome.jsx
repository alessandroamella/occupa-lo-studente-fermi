import React from "react";
import { Link, Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

const AgencyHome = () => {
  return (
    <Container bg="dark" variant="dark" className="mt-8 mb-4">
      <div>
        <p>
          Sono la <span className="font-semibold">agency homepage!!</span>
        </p>
        <div className="mt-4">
          <Button as={Link} to="signup" variant="outline-success">
            Crea azienda
          </Button>
        </div>
      </div>
      <Outlet />
    </Container>
  );
};

export default AgencyHome;
