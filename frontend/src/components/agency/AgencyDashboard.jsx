import React from "react";
import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";
import RequireAgencyLogin from "./RequireAgencyLogin";
import { useSelector } from "react-redux";

const selectAgency = state => state.agency;

const StudentHome = () => {
  const { agency } = useSelector(selectAgency);

  return (
    <RequireAgencyLogin>
      <Container bg="dark" variant="dark" className="mt-8 mb-4">
        <div>
          <p>
            Sono la <span className="font-semibold">agency dashboard!!</span>
          </p>
        </div>

        <div>
          La tua azienda:{" "}
          <pre>
            <code>{JSON.stringify(agency, null, 4)}</code>
          </pre>
        </div>
        <Outlet />
      </Container>
    </RequireAgencyLogin>
  );
};

export default StudentHome;
