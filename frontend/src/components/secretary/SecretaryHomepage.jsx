import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Placeholder from "react-bootstrap/Placeholder";
import { Check, X } from "react-bootstrap-icons";
import SecretaryLogin from "./SecretaryLogin";
import EditStudent from "./EditStudent";
import { useDispatch } from "react-redux";
import { setMessage } from "../../slices/alertSlice";
import SecretaryAgencyView from "./SecretaryAgencyView";
import EditButton from "../EditButton";

const SecretaryHomepage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [agencies, setAgencies] = useState(null);
  const [students, setStudents] = useState(null);
  const [disabled, setDisabled] = useState(true);

  const [editStudent, setEditStudent] = useState(null);

  const dispatch = useDispatch();

  const loaded = () => agencies && agencies.length > 0;

  async function fetchAgencies() {
    setAgencies(null);
    try {
      const { data } = await axios.get("/api/secretary/agencies", {
        params: { username, password }
      });
      console.log(data);
      setAgencies(data);
      setDisabled(false);
    } catch (err) {
      console.log(err);
      dispatch(
        setMessage({
          title: "Errore nel caricamento delle aziende",
          text: err?.response?.data?.err || "Errore sconosciuto"
        })
      );
    }
  }

  async function fetchStudents() {
    setStudents(null);
    try {
      const { data } = await axios.get("/api/secretary/students", {
        params: { username, password }
      });
      console.log(data);
      setStudents(data);
      setDisabled(false);
    } catch (err) {
      console.log(err);
      dispatch(
        setMessage({
          title: "Errore nel caricamento degli studenti",
          text: err?.response?.data?.err || "Errore sconosciuto"
        })
      );
    }
  }

  useEffect(() => {
    if (loggedIn) {
      fetchAgencies();
      fetchStudents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  /** @param {"approve" | "reject"} action */
  async function approveAgency(action, _id, name) {
    if (!agencies) {
      return dispatch(
        setMessage({
          title: "errore",
          text: "Aziende non ancora caricate"
        })
      );
    }

    if (
      !window.confirm(
        `Vuoi davvero ${
          action === "approve" ? "approvare" : "rifiutare"
        } l'azienda "${name}"?`
      )
    )
      return;

    try {
      await axios.post(
        `/api/secretary/approve/${_id}`,
        {},
        {
          params: { username, password, action }
        }
      );

      // Approval successful, update agencies array
      dispatch(
        setMessage({
          color: "green",
          title: "Approvazione",
          text: `Azienda ${
            action === "approve" ? "approvata" : "rifiutata"
          } con successo`
        })
      );
      await fetchAgencies();
    } catch (err) {
      setMessage({
        title: "errore",
        text: err?.response?.data?.err || "Errore sconosciuto"
      });
    }
  }

  async function deleteAgency(_id, name) {
    if (!agencies) {
      return dispatch(
        setMessage({
          title: "errore",
          text: "Aziende non ancora caricate"
        })
      );
    }

    if (!window.confirm(`Vuoi davvero eliminare l'azienda "${name}"?`)) return;

    try {
      await axios.delete(`/api/secretary/agency/${_id}`, {
        params: { username, password }
      });

      // Approval successful, update agencies array
      dispatch(
        setMessage({
          color: "green",
          title: "Eliminazione",
          text: "Azienda eliminata con successo"
        })
      );
      await fetchAgencies();
    } catch (err) {
      dispatch(
        setMessage({
          title: "errore",
          text: err?.response?.data?.err || "Errore sconosciuto"
        })
      );
    }
  }

  const waiting = agencies?.filter(e => e.approvalStatus === "waiting");
  const approved = agencies?.filter(e => e.approvalStatus === "approved");
  const rejected = agencies?.filter(e => e.approvalStatus === "rejected");

  return (
    <Container bg="dark" variant="dark" className="mt-8 mb-3">
      {!loggedIn && (
        <SecretaryLogin
          showLoginModal={showLoginModal}
          setShowLoginModal={setShowLoginModal}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          setLoggedIn={setLoggedIn}
        />
      )}
      {loggedIn && (
        <EditStudent
          editStudent={editStudent}
          setEditStudent={setEditStudent}
          setStudents={setStudents}
          username={username}
          password={password}
        />
      )}

      {loggedIn && !Array.isArray(agencies) ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Caricamento...</span>
        </Spinner>
      ) : (
        agencies && agencies.length < 0 && <p>Nessuna azienda nel database</p>
      )}

      <h1 className="text-xl font-semibold">
        Aziende in attesa ({waiting?.length || "0"})
      </h1>
      {!loggedIn || (loaded() && waiting.length > 0) ? (
        <Accordion defaultActiveKey="0" className="mt-2">
          <Row>
            {loggedIn ? (
              waiting.map((e, i) => (
                <Col key={e._id} xs={12} md={6}>
                  <Accordion.Item eventKey={i}>
                    <Accordion.Header>{e.agencyName}</Accordion.Header>
                    <Accordion.Body>
                      <SecretaryAgencyView agency={e}>
                        <Button
                          variant="outline-success"
                          className="mr-3"
                          onClick={() =>
                            approveAgency("approve", e._id, e.agencyName)
                          }
                          disabled={disabled}
                        >
                          Accetta
                        </Button>
                      </SecretaryAgencyView>
                      <Button
                        variant="outline-danger"
                        onClick={() =>
                          approveAgency("reject", e._id, e.agencyName)
                        }
                        disabled={disabled}
                      >
                        Rifiuta
                      </Button>
                    </Accordion.Body>
                  </Accordion.Item>
                </Col>
              ))
            ) : (
              <Col xs={12} md={6}>
                <Accordion.Item>
                  <Placeholder as={Accordion.Header} animation="glow">
                    <Placeholder xs={6} />
                  </Placeholder>

                  <Placeholder as={Accordion.Body} animation="glow">
                    <Placeholder xs={7} /> <Placeholder xs={4} />{" "}
                    <Placeholder xs={4} /> <Placeholder xs={6} />{" "}
                    <Placeholder xs={8} />
                  </Placeholder>
                </Accordion.Item>
              </Col>
            )}
          </Row>
        </Accordion>
      ) : (
        <p>Nessuna azienda approvata</p>
      )}

      <h1 className="text-xl font-semibold mt-3">
        Aziende approvate ({approved?.length || "0"})
      </h1>
      {!loggedIn || (loaded() && approved.length > 0) ? (
        <Accordion defaultActiveKey="0" className="mt-2">
          <Row>
            {loggedIn ? (
              approved.map((e, i) => (
                <Col key={e._id} xs={12} md={6}>
                  <Accordion.Item eventKey={i}>
                    <Accordion.Header>{e.agencyName}</Accordion.Header>
                    <Accordion.Body>
                      <SecretaryAgencyView agency={e} />
                      <Button
                        className="mt-3"
                        variant="outline-danger"
                        onClick={() => deleteAgency(e._id, e.agencyName)}
                      >
                        Elimina
                      </Button>
                    </Accordion.Body>
                  </Accordion.Item>
                </Col>
              ))
            ) : (
              <Col xs={12} md={6}>
                <Accordion.Item>
                  <Placeholder as={Accordion.Header} animation="glow">
                    <Placeholder xs={6} />
                  </Placeholder>

                  <Placeholder as={Accordion.Body} animation="glow">
                    <Placeholder xs={7} /> <Placeholder xs={4} />{" "}
                    <Placeholder xs={4} /> <Placeholder xs={6} />{" "}
                    <Placeholder xs={8} />
                  </Placeholder>
                </Accordion.Item>
              </Col>
            )}
          </Row>
        </Accordion>
      ) : (
        <p>Nessuna azienda approvata</p>
      )}

      <h1 className="text-xl font-semibold mt-3">
        Aziende rifiutate ({rejected?.length || "0"})
      </h1>
      {!loggedIn || (loaded() && rejected.length > 0) ? (
        <Accordion defaultActiveKey="0" className="mt-2" alwaysOpen={!loggedIn}>
          <Row>
            {loggedIn ? (
              rejected.map((e, i) => (
                <Col key={e._id} xs={12} md={6}>
                  <Accordion.Item eventKey={i}>
                    <Accordion.Header>{e.agencyName}</Accordion.Header>
                    <Accordion.Body>
                      <SecretaryAgencyView agency={e}>
                        <Button
                          variant="outline-danger"
                          className="mt-3"
                          onClick={() => deleteAgency(e._id, e.agencyName)}
                        >
                          Elimina
                        </Button>
                      </SecretaryAgencyView>
                    </Accordion.Body>
                  </Accordion.Item>
                </Col>
              ))
            ) : (
              <Col xs={12} md={6}>
                <Accordion.Item>
                  <Placeholder as={Accordion.Header} animation="glow">
                    <Placeholder xs={6} />
                  </Placeholder>

                  <Placeholder as={Accordion.Body} animation="glow">
                    <Placeholder xs={7} /> <Placeholder xs={4} />{" "}
                    <Placeholder xs={4} /> <Placeholder xs={6} />{" "}
                    <Placeholder xs={8} />
                  </Placeholder>
                </Accordion.Item>
              </Col>
            )}
          </Row>
        </Accordion>
      ) : (
        <p>Nessuna azienda rifiutata</p>
      )}

      <h1 className="text-xl font-semibold mt-5 mb-2">
        Studenti ({students?.length || "0"})
      </h1>

      <Accordion defaultActiveKey="0">
        {students?.map(s => (
          <Accordion.Item key={s._id} eventKey={s._id}>
            <Accordion.Header>
              {s.lastName} {s.firstName}
            </Accordion.Header>
            <Accordion.Body>
              <div className="mb-3 grid grid-cols-2">
                <p>Nome</p>
                <p>{s.firstName}</p>
              </div>

              <div className="mb-3 grid grid-cols-2">
                <p>Cognome</p>
                <p>{s.lastName}</p>
              </div>

              <div className="mb-3 grid grid-cols-2">
                <p>Email</p>
                <a href={`mailto:${s.email}`}>{s.email}</a>
              </div>

              <div className="mb-3 grid grid-cols-2">
                <p>Indirizzo di studio</p>
                <p>
                  {s.fieldOfStudy === "it"
                    ? "Informatica"
                    : s.fieldOfStudy === "electronics"
                    ? "Elettronica"
                    : s.fieldOfStudy === "chemistry"
                    ? "Chimica"
                    : "Altro (errore)"}
                </p>
              </div>

              <div className="mb-3 grid grid-cols-2">
                <p>Numero di telefono</p>
                <a href={`tel:${s.phoneNumber}`}>{s.phoneNumber}</a>
              </div>

              <div className="mb-3 grid grid-cols-2">
                <p>Codice fiscale</p>
                <p>{s.fiscalNumber}</p>
              </div>

              <div className="mb-3 grid grid-cols-2">
                <p>Spostamenti</p>
                <div>
                  <p className="flex items-center">
                    {s.hasDrivingLicense ? <Check /> : <X />} patente
                  </p>
                  <p className="flex items-center">
                    {s.canTravel ? <Check /> : <X />} viaggiare in autonomia
                  </p>
                </div>
              </div>

              <EditButton
                onClick={() => {
                  setEditStudent(s);
                  console.log(editStudent);
                }}
                showText
                purple
              />
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  );
};

export default SecretaryHomepage;
