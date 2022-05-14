import React, { useEffect, useState } from "react";
import { Link, Outlet, useSearchParams } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Placeholder from "react-bootstrap/Placeholder";
import { useDispatch, useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import RequireStudentLogin from "./RequireStudentLogin";
import { setMessage } from "../../slices/alertSlice";
import StudentJobOfferCard from "./StudentJobOfferCard";
import { Search } from "react-bootstrap-icons";
import SearchJobOffers from "./SearchJobOffers";

const selectStudent = state => state.student;

const StudentHome = () => {
  /**
   * Fetch job offers on load
   * If fail, set err to a string, else keep it null
   * Finally set loaded as true
   *
   * If loading: show loading screen
   * Else:
   *  If agencies: show agencies
   *  Else: show error screen with `err` message
   */
  const [agencies, setAgencies] = useState(null);
  const [err, setErr] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const [currentAgency, setCurrentAgency] = useState(null);
  const [currentJobOffer, setCurrentJobOffer] = useState(null);

  const dispatch = useDispatch();
  const { student } = useSelector(selectStudent);

  const [searchParams, setSearchParams] = useSearchParams();

  async function fetchAgencies(params) {
    try {
      const { data } = await axios.get("/api/student/agencies", { params });
      console.log(data);
      setAgencies(data);
    } catch (err) {
      console.log(err);
      setErr(err?.response?.data?.err || "Errore sconosciuto");
    } finally {
      setLoaded(true);
    }
  }
  useEffect(() => {
    if (!student) return;

    fetchAgencies();
    if (searchParams.get("loggedin")) {
      dispatch(
        setMessage({
          color: "green",
          text: `Bentornato, ${student.firstName}!`
        })
      );
      searchParams.delete("loggedin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student]);

  useEffect(() => {
    if (!agencies) return;
    // find first job offer to show

    for (const a of agencies) {
      if (a.jobOffers.length > 0) {
        setCurrentAgency(a);
        setCurrentJobOffer(a.jobOffers[0]);
        return;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!agencies]);

  return (
    <RequireStudentLogin>
      <Container bg="dark" variant="dark" className="mt-8 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col md:border-r-2">
            <div className="md:mr-3">
              <SearchJobOffers fetchAgenciesFn={fetchAgencies} />
            </div>
            {agencies?.map(a =>
              a.jobOffers.map(j => (
                <div
                  key={j._id}
                  className="border-b"
                  onClick={() => {
                    setCurrentAgency(a);
                    setCurrentJobOffer(j);
                  }}
                >
                  <StudentJobOfferCard
                    active={currentJobOffer?._id === j._id}
                    agency={a}
                    jobOffer={j}
                  />
                </div>
              ))
            )}
          </div>
          <div className="p-3 md:px-8 hidden md:block">
            {!agencies ? (
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Caricamento...</span>
              </Spinner>
            ) : !currentAgency ? (
              <div>non c'è lavoro amegu DEBUG</div>
            ) : (
              <div>
                <div className="rounded-xl overflow-hidden border w-full mb-4">
                  <div className="p-3 md:p-6 md:px-9">
                    <img
                      src={currentAgency.logoUrl}
                      alt="Agency logo"
                      className="h-24 w-24 object-cover rounded-full mr-6"
                    />
                    <div className="flex items-center mt-3">
                      <div className="w-full overflow-hidden">
                        <h3 className="text-3xl tracking-tighter font-semibold">
                          {currentAgency.agencyName || (
                            <Placeholder animation="glow" xs={8} />
                          )}
                        </h3>
                        <a
                          href={currentAgency.websiteUrl || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          {currentAgency.websiteUrl || (
                            <Placeholder xs={6} animation="glow" />
                          )}
                        </a>
                        <div className="mt-2 markdown mb-2 w-full overflow-hidden whitespace-nowrap text-ellipsis">
                          {currentAgency.agencyDescription ? (
                            <ReactMarkdown
                              children={
                                currentAgency.agencyDescription.length > 100
                                  ? currentAgency.agencyDescription.substring(
                                      0,
                                      100
                                    ) + "..."
                                  : currentAgency.agencyDescription
                              }
                            />
                          ) : (
                            <Placeholder xs={12} animation="glow" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="overflow-hidden w-full">
                  <div className="md:px-1 w-full mb-3">
                    <div className="mt-3 mb-5 flex flex-col md:flex-row items-center">
                      <h1 className="text-5xl font-semibold tracking-tighter">
                        {currentJobOffer.title || <Placeholder xs={6} />}
                      </h1>
                    </div>

                    <ReactMarkdown children={currentJobOffer.description} />

                    <div className="mt-8">
                      <Link
                        className="p-3 rounded-2xl transition-colors bg-purple-500 hover:bg-purple-600 text-white w-fit"
                        to={`joboffer/` + currentJobOffer._id}
                      >
                        Visualizza offerta di lavoro
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {!loaded ? (
          <div className="flex w-full justify-center text-center mt-3">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Caricamento...</span>
            </Spinner>
          </div>
        ) : Array.isArray(agencies) ? (
          <div className="mt-10">
            <p className="my-3 text-3xl font-semibold">Aziende registrate</p>
            {/* {JSON.stringify(agencies, null, 4)} */}
            <Row xs={1} lg={2}>
              {agencies.length > 0 ? (
                agencies.map((e, i) => (
                  <Col key={i} className="mb-3">
                    {/* <pre>
                      <code>{JSON.stringify(e, null, 4)}</code>
                    </pre> */}
                    <Card>
                      <div className="flex flex-col">
                        {e.logoUrl && (
                          <img
                            loading="lazy"
                            src={e.logoUrl}
                            alt="Agency logo"
                            className="max-w-xs mx-auto sm:p-2 md:p-3 lg:p-4 min-w-[4rem] object-contain"
                          />
                        )}
                        <Card.Body>
                          <Card.Title>{e.agencyName}</Card.Title>
                          <Card.Subtitle>
                            <a
                              href={e.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {e.websiteUrl}
                            </a>
                          </Card.Subtitle>
                          <Card.Text className="mb-2 text-muted">
                            <ReactMarkdown
                              children={
                                e.agencyDescription.length > 100
                                  ? e.agencyDescription.substring(0, 100) +
                                    "..."
                                  : e.agencyDescription
                              }
                            />
                          </Card.Text>
                          <Card.Text>
                            <strong>{e.jobOffers.length}</strong> offerte di
                            lavoro
                          </Card.Text>
                          <Button className="mt-2" variant="outline-primary">
                            Visualizza
                          </Button>
                        </Card.Body>
                      </div>
                    </Card>
                  </Col>
                ))
              ) : (
                <div>Nessuna offerta di lavoro disponibile :(</div>
              )}
            </Row>
          </div>
        ) : (
          <div>Errore: {err}</div>
        )}
        <Outlet />
      </Container>
    </RequireStudentLogin>
  );
};

export default StudentHome;
