import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

const StudentHome = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Container bg="dark" variant="dark" className="mt-8">
        <div>
          <p>
            Sono la <span className="font-semibold">student homepage!!</span>
          </p>
        </div>
        <div className="mt-4">
          <Button
            variant="outline-success"
            onClick={() => navigate("joboffers")}
          >
            Offerte di lavoro
          </Button>
        </div>
        <Outlet />
      </Container>
    </div>
  );
};

export default StudentHome;
