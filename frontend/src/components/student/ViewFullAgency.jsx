import React from "react";
import Container from "react-bootstrap/Container";
import { GeoAlt } from "react-bootstrap-icons";
import Placeholder from "react-bootstrap/Placeholder";
import { format } from "date-fns";
import RequireStudentLogin from "./RequireStudentLogin";
import TextEditor from "../textEditor";

const ViewFullAgency = ({ agency }) => {
  return (
    <RequireStudentLogin>
      <Container bg="dark" variant="dark" className="mb-4">
        <div className="rounded-xl overflow-hidden border w-full">
          <img
            src={agency?.bannerUrl || "/img/default_banner.jpg"}
            alt="Agency banner"
            className="w-full max-h-56 object-cover"
            loading="lazy"
          />

          <div className="p-3 md:p-6">
            <div className="w-full flex items-center ">
              {agency?.logoUrl && (
                <img
                  src={agency.logoUrl}
                  alt="Logo"
                  className="md:max-w-sm max-w-xs w-full object-cover -mt-36 bg-[rgba(255,255,255,1)] p-4 rounded-lg border shadow"
                  loading="lazy"
                />
              )}
            </div>

            <div className="w-full">
              <div className="mt-5 flex flex-col md:flex-row items-center">
                <h1 className="text-5xl font-semibold tracking-tighter md:ml-3 mb-3 md:mb-0">
                  {agency.agencyName || <Placeholder xs={6} />}
                </h1>
              </div>
            </div>

            <div className="md:p-5">
              <div className="mb-5">
                {agency?.agencyDescription ? (
                  <TextEditor content={agency.agencyDescription} readOnly />
                ) : (
                  <Placeholder className="w-96 h-96" />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 items-start">
                <div className="flex flex-col justify-center items-center w-full">
                  <h3 className="flex mb-3 font-semibold text-3xl">
                    Posizione
                  </h3>
                  {agency?.agencyAddress ? (
                    <iframe
                      title="Agency position"
                      width="500"
                      height="430"
                      className="max-w-full mr-3 border-8 border-orange-400 shadow-lg"
                      src={
                        "https://maps.google.com/maps?t=&z=13&ie=UTF8&iwloc=&output=embed&q=" +
                        encodeURIComponent(agency?.agencyAddress)
                      }
                    ></iframe>
                  ) : (
                    <Placeholder className="w-96 h-96" />
                  )}
                  <div className="mt-3 flex justify-center items-center w-full">
                    <p className="flex items-center text-gray-700 italic mr-3">
                      <GeoAlt />{" "}
                      <span className="ml-1">{agency?.agencyAddress}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center w-full markdown">
                  <h3 className="flex mb-3 font-semibold text-3xl mt-5 md:mt-0">
                    Dati
                  </h3>

                  <div className="text-gray-700 w-full md:px-5">
                    <div className="mb-3 grid grid-cols-2">
                      <p>Sito web</p>
                      <a
                        href={agency.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {agency.websiteUrl}
                      </a>
                    </div>

                    <div className="mb-3 grid grid-cols-2">
                      <p>Email</p>
                      <a href={`mailto:${agency?.email}`}>{agency.email}</a>
                    </div>

                    <div className="mb-3 grid grid-cols-2">
                      <p>Partita IVA</p>
                      <p>{agency.vatCode}</p>
                    </div>

                    <div className="mb-3 grid grid-cols-2">
                      <p>Numero di telefono</p>
                      <a href={`tel:${agency?.phoneNumber}`}>
                        {agency.phoneNumber}
                      </a>
                    </div>

                    <div className="mb-3 grid grid-cols-2">
                      <p>Data aggiunta</p>
                      <p>{format(new Date(agency.createdAt), "dd/MM/yyyy")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </RequireStudentLogin>
  );
};

export default ViewFullAgency;
