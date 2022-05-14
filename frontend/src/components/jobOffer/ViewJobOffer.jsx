import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import { Dot, Envelope, GeoAlt, Telephone } from "react-bootstrap-icons";
import Placeholder from "react-bootstrap/Placeholder";
import "react-markdown-editor-lite/lib/index.css";
import RequireAgencyLogin from "../agency/RequireAgencyLogin";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import { useDispatch, useSelector } from "react-redux";
import { setMessage } from "../../slices/alertSlice";

const selectAgency = state => state.agency;

const ViewJobOffer = () => {
  const { agency } = useSelector(selectAgency);

  const [jobOffer, setJobOffer] = useState(null);

  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!params.id) {
      navigate("/agency/dashboard");
      dispatch(
        setMessage({
          title: "Errore",
          text: "ID offerta di lavoro non specificato"
        })
      );
      return;
    }
    if (!agency) return;
    const j = agency.jobOffers.find(j => j._id === params.id);
    if (!j) {
      navigate("/agency/dashboard");
      dispatch(
        setMessage({
          title: "404",
          text: "Offerta di lavoro non trovata"
        })
      );
      return;
    }
    setJobOffer(j);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!agency]);

  return (
    <RequireAgencyLogin>
      <Container bg="dark" variant="dark" className="mt-8 mb-4">
        <div className="rounded-xl overflow-hidden border w-full mb-8">
          <div className="p-3 md:p-6">
            <div className="flex items-center md:px-3">
              <img
                src={agency?.logoUrl}
                alt="Agency logo"
                className="max-h-28 rounded-full shadow-xl mr-6 aspect-square"
              />
              <div className="w-full overflow-hidden">
                <h3 className="text-3xl tracking-tighter font-semibold">
                  {agency?.agencyName || (
                    <Placeholder animation="glow" xs={8} />
                  )}
                </h3>
                <div className="mb-2 w-full overflow-hidden whitespace-nowrap text-ellipsis">
                  {agency?.agencyDescription ? (
                    <ReactMarkdown
                      children={
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
            </div>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden border w-full">
          <div className="p-3 md:p-6">
            <div className="md:px-3 w-full mb-5">
              <div className="mt-3 mb-5 flex flex-col md:flex-row items-center">
                <h1 className="text-5xl font-semibold tracking-tighter">
                  {jobOffer?.title || <Placeholder xs={6} />}
                </h1>
              </div>

              <ReactMarkdown children={jobOffer?.description} />

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
                  {jobOffer?.fieldOfStudy === "it" ? (
                    "Informatica"
                  ) : jobOffer?.fieldOfStudy === "electronics" ? (
                    "Elettronica"
                  ) : jobOffer?.fieldOfStudy === "chemistry" ? (
                    "Chimica"
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

                <p className="font-semibold mb-4">Posizioni disponibili</p>
                <p className="mb-4">
                  {jobOffer?.numberOfPositions || (
                    <Placeholder xs={6} animation="glow" />
                  )}
                </p>

                <p className="font-semibold mb-4">Data di creazione</p>
                <p className="mb-4">
                  {jobOffer?.createdAt ? (
                    format(new Date(jobOffer?.createdAt), "dd/MM/yyyy")
                  ) : (
                    <Placeholder xs={6} animation="glow" />
                  )}
                </p>

                <p className="font-semibold mb-4">Data di scadenza</p>
                <p className="mb-4">
                  {jobOffer?.expiryDate ? (
                    format(new Date(jobOffer?.expiryDate), "dd/MM/yyyy")
                  ) : (
                    <Placeholder xs={6} animation="glow" />
                  )}
                </p>
              </div>

              <div className="mt-8">
                <h3 className="mb-3 font-semibold tracking-tigher text-2xl">
                  Candidati
                </h3>

                <div className="flex items-center">
                  <a
                    className="flex items-center p-3 rounded-2xl transition-colors bg-purple-500 hover:bg-purple-600 text-white"
                    href={`tel:${agency?.phoneNumber}`}
                  >
                    <Telephone className="mr-1" />
                    {agency?.phoneNumber || <Placeholder xs={6} />}
                  </a>
                  <a
                    className="ml-3 flex items-center p-3 rounded-2xl transition-colors bg-[#F89A05] hover:bg-[#e68f05] text-white"
                    href={`mailto:${agency?.email}`}
                  >
                    <Envelope className="mr-1" />
                    {agency?.email || <Placeholder xs={6} />}
                  </a>
                </div>
              </div>
            </div>
          </div>
          <Outlet />
        </div>
      </Container>
    </RequireAgencyLogin>
  );
};

export default ViewJobOffer;
