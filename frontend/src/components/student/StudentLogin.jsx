import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setMessage } from "../../slices/alertSlice";

const StudentLogin = () => {
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  async function getLoginURL() {
    try {
      setError(false);
      const { data } = await axios.get("/api/student/auth/google", {
        params: { redirectTo: window.location.href }
      });
      if (!data.url) throw new Error("No data.url");
      window.open(data.url, "_self");
    } catch (err) {
      dispatch(
        setMessage({
          text: "Errore nel caricamento dell'URL per il login con Google"
        })
      );
      setError(true);
      console.log(err?.response?.data);
    }
  }

  useEffect(() => {
    getLoginURL();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container bg="dark" variant="dark" className="mt-8 pb-4">
      {error ? (
        <p>
          Si è verificato un errore, premi il tasto sottostante per provare a
          generare un nuovo link
        </p>
      ) : (
        <p>Reindirizamento al login con Google...</p>
      )}

      {error && (
        <Button
          as={Link}
          to="/student/login"
          variant="outline-primary"
          className="mt-3"
          onClick={getLoginURL}
        >
          Login
        </Button>
      )}
    </Container>
  );
};

export default StudentLogin;
