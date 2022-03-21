import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";

import axios from "axios";

const StudentSignup = () => {
  const [searchParams] = useSearchParams();
  let navigate = useNavigate();

  // const email = searchParams.get("email");
  // const [firstName, lastName] = email
  //   .split("@")[0]
  //   .split(".")
  //   .map(capitalizeFirstLetter)
  //   .slice(0, 2);

  const emailParam = searchParams.get("email");
  const [firstNameFromEmail, lastNameFromEmail] = emailParam
    .split("@")[0]
    .split(".")
    .map(capitalizeFirstLetter)
    .slice(0, 2);

  // ["firstName", "lastName", "email", "fiscalNumber", "phoneNumber"]
  const [firstName, setFirstName] = useState(firstNameFromEmail);
  const [lastName, setLastName] = useState(lastNameFromEmail);
  const [fiscalNumber, setFiscalNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("it");

  // const [value, setValue] = React.useState({ firstName, lastName, email });
  const [disabled, setDisabled] = React.useState(true);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Ensure form is loaded
  useEffect(() => setDisabled(false), []);

  async function submitForm(event) {
    event.preventDefault();

    console.log({
      firstName,
      lastName,
      fiscalNumber,
      phoneNumber
    });

    setDisabled(true);
    try {
      const res = await axios.post("/api/student/auth/signup", {
        firstName,
        lastName,
        fiscalNumber,
        phoneNumber,
        fieldOfStudy
      });
      console.log(res.data);
      navigate("/student", { state: { student: res.data } });
      // DEBUG
      // alert(JSON.stringify(data));
    } catch (err) {
      if (err?.response?.status === 510) {
        // client needs to login again
        alert(
          "Si è verificato un errore e devi fare nuovamente il login con Google"
        );
        return (window.location = err.response.data.url);
      }
      // DEBUG
      alert(err?.response?.data?.err || err?.response?.data);
      console.log(err);
      setDisabled(false);
    }
    return false;
  }

  return (
    <Container bg="dark" variant="dark" className="mt-8">
      <h1 className="text-2xl font-light mb-3">Registrazione</h1>

      <Form onSubmit={submitForm}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" value={emailParam} disabled required />
          <Form.Text className="text-muted">
            La tua email istutizionale. Non può essere modificata.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="firstName">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            type="text"
            placeholder="Mario"
            onChange={e => setFirstName(e.target.value)}
            autoComplete="given-name"
            disabled={disabled}
            value={firstName}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="lastName">
          <Form.Label>Cognome</Form.Label>
          <Form.Control
            type="text"
            placeholder="Rossi"
            onChange={e => setLastName(e.target.value)}
            autoComplete="family-name"
            disabled={disabled}
            value={lastName}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="fiscalNumber">
          <Form.Label>Codice fiscale</Form.Label>
          <Form.Control
            type="text"
            placeholder="RSSMRA70A01F257E"
            onChange={e => setFiscalNumber(e.target.value)}
            autoComplete="fiscal-number"
            pattern="^[a-zA-Z]{6}[0-9]{2}[a-zA-Z][0-9]{2}[a-zA-Z][0-9]{3}[a-zA-Z]$"
            disabled={disabled}
            value={fiscalNumber}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="phoneNumber">
          <Form.Label>Numero di telefono</Form.Label>
          <Form.Control
            type="text"
            placeholder="3921234567"
            onChange={e => setPhoneNumber(e.target.value)}
            autoComplete="tel"
            disabled={disabled}
            value={phoneNumber}
            required
          />
          <Form.Text className="text-muted">
            Numero di telefono (senza prefisso +39)
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="fieldOfStudy">
          <Form.Label>Indirizzo di studio</Form.Label>
          <Form.Select
            aria-label="Indirizzo di studio"
            onChange={e => setFieldOfStudy(e.target.value)}
            value={fieldOfStudy}
          >
            <option value="it">Informatica</option>
            <option value="electronics">Elettronica</option>
            <option value="chemistry">Chimica</option>
          </Form.Select>
        </Form.Group>

        <Button variant="outline-primary" type="submit">
          Registra
        </Button>
      </Form>
    </Container>
  );
};

export default StudentSignup;
