import axios from "axios";
import React, { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";

const SecretaryLogin = ({
  showLoginModal,
  setShowLoginModal,
  setLoggedIn,
  username,
  setUsername,
  password,
  setPassword
}) => {
  const navigate = useNavigate();

  const [err, setErr] = useState(null);
  const [disabled, setDisabled] = useState(false);

  /** @param {React.FormEvent<HTMLFormElement>} e */
  function handleSubmit(e) {
    console.log("submit");
    e.preventDefault();
    setDisabled(true);
    login();
    return false;
  }

  async function login() {
    try {
      setErr(null);
      await axios.get("/api/secretary/check-credentials", {
        params: { username, password }
      });
      setShowLoginModal(false);
    } catch (err) {
      setErr(err?.response?.data?.err || "Errore sconosciuto");
      setDisabled(false);
    }
  }

  return (
    <Modal
      show={showLoginModal}
      onExited={() => setLoggedIn(true)}
      backdrop="static"
      keyboard={false}
    >
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Login secreteria</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {err && <Alert variant="danger">{err}</Alert>}

          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="secretary-username"
              disabled={disabled}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="secretary-password"
              disabled={disabled}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => navigate("/")}>
            Homepage
          </Button>
          <Button disabled={disabled} variant="outline-primary" type="submit">
            Login
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default SecretaryLogin;
