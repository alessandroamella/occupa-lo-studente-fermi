import React, { useEffect, useState } from "react";
import {
  Outlet,
  useNavigate,
  useParams,
  useSearchParams
} from "react-router-dom";
import Container from "react-bootstrap/Container";
import Accordion from "react-bootstrap/Accordion";
import Spinner from "react-bootstrap/Spinner";
import {
  Dot,
  Envelope,
  GeoAlt,
  Telephone,
  ArrowRight
} from "react-bootstrap-icons";
import Placeholder from "react-bootstrap/Placeholder";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setMessage } from "../../slices/alertSlice";
import RequireStudentLogin from "./RequireStudentLogin";
import ViewFullAgency from "./ViewFullAgency";
import BackButton from "../BackButton";
import TextEditor from "../textEditor";

const ViewJobOffer = () => {
  const [agency, setAgency] = useState(null);
  const [jobOffer, setJobOffer] = useState(null);

  const dispatch = useDispatch();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const jobOfferId = searchParams.get("joboffer");
  const showFullAgency = searchParams.get("showagency");

  useEffect(() => {
    async function fetchAgency() {
      try {
        const { data } = await axios.get("/api/student/agency/" + params.id);
        console.log(data);
        setAgency(data);
      } catch (err) {
        console.log(err?.response?.data?.err || err);
        navigate("/student");
        dispatch(
          setMessage({
            title: "Errore",
            text:
              err?.response?.data?.err || "Errore nel caricamento dell'azienda"
          })
        );
        return;
      }
    }
    fetchAgency();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function removeCurrentJobOffer() {
    searchParams.delete("joboffer");
    setSearchParams(searchParams);
    setJobOffer(null);
    return;
  }

  useEffect(() => {
    if (!agency) return;
    if (!jobOfferId) return removeCurrentJobOffer();

    const j = agency.jobOffers.find(e => e._id === jobOfferId);
    if (!j) {
      console.log(
        "Job offer",
        jobOfferId,
        "not found in array",
        agency.jobOffers.map(e => e._id),
        "for agency",
        agency.agencyName,
        agency._id
      );
      dispatch(
        setMessage({ title: "Errore", text: "Offerta di lavoro non trovata" })
      );
      return removeCurrentJobOffer();
    }
    setJobOffer(j);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agency, jobOfferId]);

  return (
    <RequireStudentLogin>
      <Container bg="dark" variant="dark" className="mt-8 mb-4">
        <div className="mb-4">
          <BackButton path="/student" />
        </div>
        {!showFullAgency ? (
          <div className="rounded-md overflow-hidden border w-full mb-8">
            <div className="p-3 md:p-6">
              <div className="flex flex-col md:flex-row items-center md:px-3">
                <img
                  src={agency?.logoUrl}
                  alt="Agency logo"
                  className="max-h-28 rounded-full shadow-xl mr-6 aspect-square object-cover"
                />
                <div className="w-full overflow-hidden">
                  <h3 className="text-3xl tracking-tighter font-semibold">
                    {agency?.agencyName || (
                      <Placeholder animation="glow" xs={8} />
                    )}
                  </h3>
                  <div className="mb-2 w-full overflow-hidden whitespace-nowrap text-ellipsis">
                    {agency?.agencyDescription ? (
                      <TextEditor
                        readOnly
                        content={
                          agency.agencyDescription.length > 100
                            ? agency.agencyDescription.substring(0, 100) + "..."
                            : agency.agencyDescription
                        }
                      />
                    ) : (
                      <Placeholder xs={12} animation="glow" />
                    )}
                  </div>

                  <div className="flex items-center text-gray-600">
                    <p className="flex items-center italic">
                      <GeoAlt />{" "}
                      <span className="ml-1">
                        {agency?.agencyAddress || (
                          <Placeholder xs={6} animation="glow" />
                        )}
                      </span>
                    </p>

                    <Dot className="mx-1" />

                    <a
                      href={agency?.websiteUrl || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      {agency?.websiteUrl || (
                        <Placeholder xs={6} animation="glow" />
                      )}
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => {
                    searchParams.set("showagency", true);
                    setSearchParams(searchParams);
                  }}
                  className="ml-auto flex items-center p-2 border rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
                >
                  <span className="mx-1">Altro</span>
                  <ArrowRight />
                </button>
              </div>
            </div>
          </div>
        ) : agency ? (
          <ViewFullAgency agency={agency} />
        ) : (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Caricamento...</span>
          </Spinner>
        )}

        <Accordion
          activeKey={
            jobOfferId || (agency?.jobOffers.length ? agency.jobOffers[0] : "0")
          }
        >
          {agency?.jobOffers.map(j => (
            <Accordion.Item eventKey={j._id} key={j._id}>
              <Accordion.Header
                onClick={() => {
                  if (searchParams.get("joboffer") === j._id) {
                    searchParams.delete("joboffer");
                  } else searchParams.set("joboffer", j._id);
                  setSearchParams(searchParams);
                }}
              >
                {j.title || <Placeholder xs={6} />}
              </Accordion.Header>
              <Accordion.Body>
                <div key={j._id} className="overflow-hidden w-full">
                  <div className="md:px-3 w-full mb-5">
                    <div className="mt-3 mb-5 flex flex-col md:flex-row items-center">
                      <h1 className="text-5xl font-semibold tracking-tighter">
                        {j.title || <Placeholder xs={6} />}
                      </h1>
                    </div>

                    <div className="markdown">
                      <TextEditor readOnly content={j.description} />
                    </div>

                    <div className="px-5 md:px-20 lg:px-36 mt-10 grid grid-cols-2">
                      <p className="font-semibold mb-4">Sito web</p>
                      <a
                        href={agency?.websiteUrl || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="mb-4 font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        {agency?.websiteUrl || (
                          <Placeholder xs={6} animation="glow" />
                        )}
                      </a>

                      <p className="font-semibold mb-4">Indirizzo di studio</p>
                      <p className="mb-4">
                        {j.fieldOfStudy === "it" ? (
                          "Informatica"
                        ) : j.fieldOfStudy === "electronics" ? (
                          "Elettronica"
                        ) : j.fieldOfStudy === "chemistry" ? (
                          "Chimica"
                        ) : j.fieldOfStudy === "any" ? (
                          "Altro"
                        ) : (
                          <Placeholder xs={6} animation="glow" />
                        )}
                      </p>

                      <p className="font-semibold mb-4">Diploma richiesto</p>
                      <p className="mb-4">
                        {jobOffer ? (
                          jobOffer.mustHaveDiploma ? (
                            "Si"
                          ) : (
                            "No"
                          )
                        ) : (
                          <Placeholder xs={6} animation="glow" />
                        )}
                      </p>

                      <p className="font-semibold mb-4">
                        Posizioni disponibili
                      </p>
                      <p className="mb-4">
                        {j.numberOfPositions || (
                          <Placeholder xs={6} animation="glow" />
                        )}
                      </p>

                      <p className="font-semibold mb-4">Data di creazione</p>
                      <p className="mb-4">
                        {j.createdAt ? (
                          format(new Date(j.createdAt), "dd/MM/yyyy")
                        ) : (
                          <Placeholder xs={6} animation="glow" />
                        )}
                      </p>

                      <p className="font-semibold mb-4">Data di scadenza</p>
                      <p className="mb-4">
                        {j.expiryDate ? (
                          format(new Date(j.expiryDate), "dd/MM/yyyy")
                        ) : (
                          <Placeholder xs={6} animation="glow" />
                        )}
                      </p>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-center md:text-left mb-3 font-semibold tracking-tigher text-3xl">
                        Candidati
                      </h3>

                      <div className="flex flex-col md:flex-row items-center">
                        <a
                          className="mb-2 md:mb-0 flex items-center p-3 rounded-2xl transition-colors bg-purple-500 hover:bg-purple-600 text-white"
                          href={`tel:${agency?.phoneNumber}`}
                        >
                          <Telephone className="mr-1" />
                          {agency?.phoneNumber || <Placeholder xs={6} />}
                        </a>
                        <a
                          className="ml-3 flex items-center p-3 rounded-2xl transition-colors bg-[#F89A05] hover:bg-[#e68f05] text-white"
                          href={`mailto:${agency?.email}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Envelope className="mr-1" />
                          {agency?.email || <Placeholder xs={6} />}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>

        <Outlet />
      </Container>
    </RequireStudentLogin>
  );
};

export default ViewJobOffer;
