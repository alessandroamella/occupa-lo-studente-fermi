import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";

import axios from "axios";
import { useDispatch } from "react-redux";
import { setAgency } from "../../slices/agencyAuthSlice";
import { setMessage } from "../../slices/alertSlice";
import BackButton from "../BackButton";

const AgencySignup = () => {
  const [email, setEmail] = useState(""); // "user@example.com",
  const [password, setPassword] = useState(""); // "stringst",

  // const [value, setValue] = React.useState({ firstName, lastName, email });
  const [disabled, setDisabled] = React.useState(true);

  // Ensure form is loaded
  useEffect(() => setDisabled(false), []);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function submitForm(event) {
    event.preventDefault();

    const formData = { email, password };

    setDisabled(true);

    let agency;

    try {
      const res = await axios.post("/api/agency/login", formData);
      agency = res.data;
    } catch (err) {
      console.log(err?.response?.data || err);
      dispatch(
        setMessage({
          title: "Errore nel login",
          text:
            err?.response?.status === 401
              ? "Credenziali errate"
              : err?.response?.data?.err || "Errore sconosciuto"
        })
      );
      setDisabled(false);
      return false;
    }

    console.log(agency);
    dispatch(setAgency(agency));
    navigate("/agency/dashboard");
    setDisabled(false);
    return false;
  }

  return (
    <Container bg="dark" variant="dark" className="mt-8 mb-20">
      <BackButton path="/agency" />

      <h1 className="text-2xl font-light my-3">Login azienda</h1>

      <Form onSubmit={submitForm}>
        <Form.Group className="mb-3" controlId="phoneNumber">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="mario@rossi.it"
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            disabled={disabled}
            value={email}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="phoneNumber">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            onChange={e => setPassword(e.target.value)}
            disabled={disabled}
            value={password}
            minLength={8}
            maxLength={64}
            required
          />
        </Form.Group>

        <Link to="/agency/signup" className="block text-xs">
          Non sei ancora registrato?
        </Link>
        <Button variant="outline-primary" type="submit" className="mt-1">
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default AgencySignup;
