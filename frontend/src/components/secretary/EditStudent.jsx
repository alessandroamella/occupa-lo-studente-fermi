import axios from "axios";
import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useDispatch } from "react-redux";
import { setMessage } from "../../slices/alertSlice";
import EditButton from "../EditButton";

const EditStudent = ({
  editStudent,
  setEditStudent,
  username,
  password,
  setStudents
}) => {
  const s = editStudent;

  const dispatch = useDispatch();

  const [googleId, setGoogleId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fiscalNumber, setFiscalNumber] = useState("");
  const [email, setEmail] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [hasDrivingLicense, setHasDrivingLicense] = useState("");
  const [canTravel, setCanTravel] = useState("");

  const [disabled, setDisabled] = useState(null);

  useEffect(() => {
    if (!s) return;

    setGoogleId(s.googleId);
    setFirstName(s.firstName);
    setLastName(s.lastName);
    setFiscalNumber(s.fiscalNumber);
    setEmail(s.email);
    setPictureUrl(s.pictureUrl);
    setPhoneNumber(s.phoneNumber);
    setFieldOfStudy(s.fieldOfStudy);
    setHasDrivingLicense(s.hasDrivingLicense);
    setCanTravel(s.canTravel);
  }, [s]);

  async function handleSubmit(e) {
    e.preventDefault();

    setDisabled(true);
    try {
      await axios.put(
        "/api/secretary/student/" + s._id,
        {
          googleId,
          firstName,
          lastName,
          fiscalNumber,
          email,
          pictureUrl,
          phoneNumber,
          fieldOfStudy,
          hasDrivingLicense,
          canTravel
        },
        { params: { username, password } }
      );

      // Update student by re-fetching it
      const { data } = await axios.get("/api/secretary/students", {
        params: { username, password }
      });
      console.log(data);
      setStudents(data);

      dispatch(
        setMessage({ color: "green", text: "Modifica avvenuta con successo" })
      );
    } catch (err) {
      console.log(err);
      dispatch(
        setMessage({
          title: "Errore nella modifica",
          text: err?.response?.data?.err || "Errore sconosciuto"
        })
      );
    }
    setDisabled(false);
    setEditStudent(null);
  }

  return (
    <Modal show={!!editStudent} onHide={() => setEditStudent(null)}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Login segreteria</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="email">
            <p className="mb-3">
              Google ID: <code>{googleId}</code>
            </p>

            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              onChange={e => setEmail(e.target.value)}
              value={email}
              disabled={disabled}
              required
            />
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
          </Form.Group>

          <Form.Group className="mb-3" controlId="fieldOfStudy">
            <Form.Label>Indirizzo di studio</Form.Label>
            <Form.Select
              disabled={disabled}
              aria-label="Indirizzo di studio"
              onChange={e => setFieldOfStudy(e.target.value)}
              value={fieldOfStudy}
            >
              <option value="it">Informatica</option>
              <option value="electronics">Elettronica</option>
              <option value="chemistry">Chimica</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="fieldOfStudy">
            <Form.Label>Spostamento casa-lavoro</Form.Label>
            <Form.Check
              type="checkbox"
              label="Ha la patente?"
              disabled={disabled}
              onChange={e => setHasDrivingLicense(e.target.checked)}
              checked={hasDrivingLicense}
            />
            <Form.Check
              type="checkbox"
              label="Può viaggiare autonomamente?"
              disabled={disabled}
              onChange={e => setCanTravel(e.target.checked)}
              checked={canTravel}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="fieldOfStudy">
            <Form.Label>URL foto profilo</Form.Label>
            <Form.Control
              type="text"
              onChange={e => setPictureUrl(e.target.value)}
              autoComplete="fiscal-number"
              pattern="https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)"
              disabled={disabled}
              value={pictureUrl}
              required
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <EditButton
            type="button"
            onClick={() => setEditStudent(null)}
            showText
            isClose
            disabled={disabled}
          />
          <EditButton type="submit" purple showText disabled={disabled} />
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditStudent;
