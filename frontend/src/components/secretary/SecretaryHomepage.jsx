import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SecretaryAgencyView from "./SecretaryAgencyView";

const SecretaryHomepage = () => {
  const [agencies, setAgencies] = useState(null);

  const loaded = () => agencies && agencies.length > 0;

  useEffect(() => {
    async function fetchAgencies() {
      try {
        const { data } = await axios.get("/api/agency");
        console.log(data);
        setAgencies(data);
      } catch (err) {
        // DEBUG
        console.log(err);
        alert(err?.response?.data?.err || "Errore sconosciuto");
      }
    }

    fetchAgencies();
  }, []);

  return (
    <Container bg="dark" variant="dark" className="mt-8 mb-3">
      {!Array.isArray(agencies) ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Caricamento...</span>
        </Spinner>
      ) : (
        agencies && agencies.length < 0 && <p>Nessuna azienda nel database</p>
      )}

      <h1 className="text-xl font-semibold">Aziende in attesa</h1>
      {loaded() &&
        agencies.filter(e => e.approvalStatus === "waiting").length > 0 && (
          <Accordion defaultActiveKey="0" className="mt-2">
            <Row>
              {agencies
                .filter(e => e.approvalStatus === "waiting")
                .map((e, i) => (
                  <Col xs={12} md={6}>
                    <Accordion.Item eventKey={i}>
                      <Accordion.Header>{e.agencyName}</Accordion.Header>
                      <Accordion.Body>
                        <SecretaryAgencyView agency={e}>
                          <Button
                            variant="outline-success"
                            className="mr-3"
                            onClick={() => alert("DEBUG accetta azienda")}
                          >
                            Accetta
                          </Button>
                        </SecretaryAgencyView>
                        <Button
                          variant="outline-danger"
                          onClick={() => alert("DEBUG rifiuta azienda ")}
                        >
                          Rifiuta
                        </Button>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Col>
                ))}
            </Row>
          </Accordion>
        )}

      <h1 className="text-xl font-semibold mt-3">Aziende approvate</h1>
      {loaded() &&
      agencies.filter(e => e.approvalStatus === "approved").length > 0 ? (
        <Accordion defaultActiveKey="0" className="mt-2">
          <Row>
            {agencies
              .filter(e => e.approvalStatus === "approved")
              .map((e, i) => (
                <Col xs={12} md={6}>
                  <Accordion.Item eventKey={i}>
                    <Accordion.Header>{e.agencyName}</Accordion.Header>
                    <Accordion.Body>
                      <SecretaryAgencyView agency={e}>
                        <Button
                          variant="outline-success"
                          className="mr-3"
                          onClick={() =>
                            alert("DEBUG apri popup offerte di lavoro azienda")
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
              ))}
          </Row>
        </Accordion>
      ) : (
        <p>Nessuna azienda approvata</p>
      )}

      <h1 className="text-xl font-semibold mt-3">Aziende rifiutate</h1>
      {loaded() &&
      agencies.filter(e => e.approvalStatus === "rejected").length > 0 ? (
        <Accordion defaultActiveKey="0" className="mt-2">
          <Row>
            {agencies
              .filter(e => e.approvalStatus === "rejected")
              .map((e, i) => (
                <Col xs={12} md={6}>
                  <Accordion.Item eventKey={i}>
                    <Accordion.Header>{e.agencyName}</Accordion.Header>
                    <Accordion.Body>
                      <SecretaryAgencyView agency={e} />
                    </Accordion.Body>
                  </Accordion.Item>
                </Col>
              ))}
          </Row>
        </Accordion>
      ) : (
        <p>Nessuna azienda rifiutata</p>
      )}
    </Container>
  );
};

export default SecretaryHomepage;
