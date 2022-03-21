import React, { useEffect, useState } from "react";
import { Box, Form, TextInput, FormField, Button } from "grommet";
import { useSearchParams, useNavigate } from "react-router-dom";
// import Button from "react-bootstrap/Button";
// import Form from "react-bootstrap/Form";

import axios from "axios";

const StudentSignup = () => {
  const [searchParams] = useSearchParams();
  let navigate = useNavigate();

  const email = searchParams.get("email");
  const [firstName, lastName] = email
    .split("@")[0]
    .split(".")
    .map(capitalizeFirstLetter)
    .slice(0, 2);

  // const emailParam = searchParams.get("email");
  // const [firstNameFromEmail, lastNameFromEmail] = emailParam
  //   .split("@")[0]
  //   .split(".")
  //   .map(capitalizeFirstLetter)
  //   .slice(0, 2);

  // ["firstName", "lastName", "email", "fiscalNumber", "phoneNumber"]
  // const [firstName, setFirstName] = useState(firstNameFromEmail);
  // const [lastName, setLastName] = useState(lastNameFromEmail);
  // const [email, setEmail] = useState(emailParam);
  // const [fiscalNumber, setFiscalNumber] = useState("");
  // const [phoneNumber, setPhoneNumber] = useState("");

  const [value, setValue] = React.useState({ firstName, lastName, email });
  const [disabled, setDisabled] = React.useState(true);

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Ensure form is loaded
  useEffect(() => setDisabled(false), []);

  async function submitForm() {
    setDisabled(true);
    try {
      const { data } = await axios.post(
        "/api/student/auth/signup",
        value
        // {
        //   firstName,
        //   lastName,
        //   email,
        //   fiscalNumber,
        //   phoneNumber
        // }
      );
      console.log(data);
      navigate("/", { state: { student: data } });
      // DEBUG
      // alert(JSON.stringify(data));
    } catch (err) {
      // DEBUG
      alert("Errore: " + err?.response?.data?.err);
      console.trace(err);
      setDisabled(false);
    }
  }

  return (
    <div>
      {/* <Form>
        <FormField
          name="firstName"
          htmlFor="firstName-input"
          label="Nome"
          disabled={disabled}
          required
        >
          <TextInput
            disabled={disabled}
            id="firstName-input"
            name="firstName"
            autocomplete="given-name"
          />
        </FormField>

        <Form.Group className="mb-3" controlId="firstName">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            onChange={setEmail}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form> */}

      <Box pad="large">
        <h1>Registrazione</h1>
        <Form
          value={value}
          onChange={nextValue => setValue(nextValue)}
          onSubmit={submitForm}
        >
          <FormField
            name="firstName"
            htmlFor="firstName-input"
            label="Nome"
            disabled={disabled}
            required
          >
            <TextInput
              disabled={disabled}
              id="firstName-input"
              name="firstName"
              autocomplete="given-name"
            />
          </FormField>
          <FormField
            name="lastName"
            htmlFor="lastName-input"
            label="Cognome"
            disabled={disabled}
            required
          >
            <TextInput
              disabled={disabled}
              id="lastName-input"
              name="lastName"
              autocomplete="family-name"
            />
          </FormField>
          <FormField
            name="email"
            htmlFor="email-input"
            label="Email"
            // this cannot be changed
            disabled={true}
            required
          >
            <TextInput
              disabled={true}
              id="email-input"
              name="email"
              type="email"
            />
          </FormField>
          <FormField
            name="fiscalNumber"
            htmlFor="fiscalNumber-input"
            label="Codice fiscale"
            disabled={disabled}
            pattern="^[a-zA-Z]{6}[0-9]{2}[a-zA-Z][0-9]{2}[a-zA-Z][0-9]{3}[a-zA-Z]$"
            required
          >
            <TextInput
              disabled={disabled}
              id="fiscalNumber-input"
              name="fiscalNumber"
              type="fiscalNumber"
              autocomplete="tel"
            />
          </FormField>
          <FormField
            name="phoneNumber"
            htmlFor="phoneNumber-input"
            label="Numero di telefono"
            disabled={disabled}
            required
          >
            <TextInput
              disabled={disabled}
              id="phoneNumber-input"
              name="phoneNumber"
              type="tel"
              autocomplete="tel"
            />
          </FormField>
          <Box direction="row" gap="medium">
            <Button
              type="submit"
              disabled={disabled}
              primary
              label="Registra"
            />
          </Box>
        </Form>
      </Box>
    </div>
  );
};

export default StudentSignup;
