import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Placeholder from "react-bootstrap/Placeholder";
import SecretaryAgencyView from "./SecretaryAgencyView";
import SecretaryLogin from "./SecretaryLogin";
import { useDispatch } from "react-redux";
import { setMessage } from "../../slices/alertSlice";

const SecretaryHomepage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [agencies, setAgencies] = useState(null);
  const [disabled, setDisabled] = useState(true);

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
      // DEBUG
      console.log(err);
      alert(err?.response?.data?.err || "Errore sconosciuto");
    }
  }

  useEffect(() => {
    if (loggedIn) {
      fetchAgencies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  /** @param {"approve" | "reject"} action */
  async function approveAgency(action, _id) {
    if (!agencies) return alert("Agencies not loaded");
    try {
      await axios.get(`/api/secretary/approve/${_id}`, {
        params: { username, password, action }
      });

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
      // DEBUG
      alert(err?.response?.data?.err || "Errore sconosciuto");
    }
  }

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

      {loggedIn && !Array.isArray(agencies) ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Caricamento...</span>
        </Spinner>
      ) : (
        agencies && agencies.length < 0 && <p>Nessuna azienda nel database</p>
      )}

      <h1 className="text-xl font-semibold">Aziende in attesa</h1>
      {!loggedIn ||
      (loaded() &&
        agencies.filter(e => e.approvalStatus === "waiting").length > 0) ? (
        <Accordion defaultActiveKey="0" className="mt-2">
          <Row>
            {loggedIn ? (
              agencies
                .filter(e => e.approvalStatus === "waiting")
                .map((e, i) => (
                  <Col key={e._id} xs={12} md={6}>
                    <Accordion.Item eventKey={i}>
                      <Accordion.Header>{e.agencyName}</Accordion.Header>
                      <Accordion.Body>
                        <SecretaryAgencyView agency={e}>
                          <Button
                            variant="outline-success"
                            className="mr-3"
                            onClick={() => approveAgency("approve", e._id)}
                            disabled={disabled}
                          >
                            Accetta
                          </Button>
                        </SecretaryAgencyView>
                        <Button
                          variant="outline-danger"
                          onClick={() => approveAgency("reject", e._id)}
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

      <h1 className="text-xl font-semibold mt-3">Aziende approvate</h1>
      {!loggedIn ||
      (loaded() &&
        agencies.filter(e => e.approvalStatus === "approved").length > 0) ? (
        <Accordion defaultActiveKey="0" className="mt-2">
          <Row>
            {loggedIn ? (
              agencies
                .filter(e => e.approvalStatus === "approved")
                .map((e, i) => (
                  <Col key={e._id} xs={12} md={6}>
                    <Accordion.Item eventKey={i}>
                      <Accordion.Header>{e.agencyName}</Accordion.Header>
                      <Accordion.Body>
                        <SecretaryAgencyView agency={e}>
                          <Button
                            variant="outline-success"
                            className="mr-3"
                            onClick={() =>
                              alert(
                                "DEBUG apri popup offerte di lavoro azienda"
                              )
                            }
                          >
                            Visualizza offerte di lavoro
                          </Button>
                        </SecretaryAgencyView>
                        <Button
                          variant="outline-danger"
                          onClick={() => alert("DEBUG elimina azienda")}
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

      <h1 className="text-xl font-semibold mt-3">Aziende rifiutate</h1>
      {!loggedIn ||
      (loaded() &&
        agencies.filter(e => e.approvalStatus === "rejected").length > 0) ? (
        <Accordion defaultActiveKey="0" className="mt-2" alwaysOpen={!loggedIn}>
          <Row>
            {loggedIn ? (
              agencies
                .filter(e => e.approvalStatus === "rejected")
                .map((e, i) => (
                  <Col key={e._id} xs={12} md={6}>
                    <Accordion.Item eventKey={i}>
                      <Accordion.Header>{e.agencyName}</Accordion.Header>
                      <Accordion.Body>
                        <SecretaryAgencyView agency={e} />
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
    </Container>
  );
};

export default SecretaryHomepage;
