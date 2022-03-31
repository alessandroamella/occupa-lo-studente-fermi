import React, { useEffect } from "react";
import Container from "react-bootstrap/Container";
import axios from "axios";

const StudentLogin = () => {
  useEffect(() => {
    async function getLoginURL() {
      try {
        const { data } = await axios.get("/api/student/auth/google", {
          params: { redirectTo: window.location.href }
        });
        if (!data.url) throw new Error("No data.url");
        window.open(data.url, "_self");
      } catch (err) {
        // DEBUG - don't use alert
        alert("Error while loading Google auth URL");
        console.log(err?.response?.data);
      }
    }

    getLoginURL();
  }, []);

  return (
    <Container bg="dark" variant="dark" className="mt-8 pb-4">
      <h1>Reindirizamento al login con Google...</h1>
    </Container>
  );
};

export default StudentLogin;
