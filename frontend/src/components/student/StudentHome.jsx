import React from "react";
import Container from "react-bootstrap/Container";
import { Outlet } from "react-router-dom";

const StudentHome = () => {
  return (
    <div>
      <Container bg="dark" variant="dark" className="mt-8">
        <div>
          <p>
            Sono la <span className="font-semibold">student homepage!!</span>
          </p>
        </div>
        <Outlet />
      </Container>
    </div>
  );
};

export default StudentHome;
