import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Placeholder from "react-bootstrap/Placeholder";
import RequireStudentLogin from "./RequireStudentLogin";
import {
  Check,
  EmojiFrown,
  Envelope,
  Telephone,
  X
} from "react-bootstrap-icons";
import { format } from "date-fns";
import JobApplicationCard from "./JobApplicationCard";
import JobApplicationModal from "./JobApplicationModal";

const selectStudent = state => state.student;

const StudentProfile = () => {
  const { student } = useSelector(selectStudent);

  const [currentJobApplication, setCurrentJobApplication] = useState(null);

  console.log({ student });

  return (
    <RequireStudentLogin>
      <JobApplicationModal
        show={currentJobApplication}
        setShow={setCurrentJobApplication}
        readOnly
      />
      <Container bg="dark" variant="dark" className="mt-12 mb-4">
        <div>
          <h1 className="text-5xl font-semibold  mb-2 tracking-tighter">
            {student ? `Ciao, ${student.firstName}!` : "Il tuo profilo"}{" "}
          </h1>

          <div className="flex justify-center flex-col md:flex-row mt-8">
            {student ? (
              <img
                src={student?.pictureUrl?.replace("=s96-c", "=s1024-c")}
                loading="lazy"
                alt="Profile pic"
                className="w-44 rounded-full aspect-square shadow-lg"
              />
            ) : (
              <Placeholder as={"img"} animation="glow" />
            )}
            <div className="md:ml-12">
              {/* Nome e cognome */}
              <h1 className="mt-2 font-semibold tracking-tighter text-2xl">
                {student?.firstName || <Placeholder xs={7} />}{" "}
                {student?.lastName || <Placeholder xs={6} />}
              </h1>

              {/* Indirizzo di studio */}
              <p className="text-gray-700">
                {student?.fieldOfStudy ? (
                  <span>
                    Studente di{" "}
                    {student.fieldOfStudy === "it"
                      ? "informatica"
                      : student.fieldOfStudy === "electronics"
                      ? "elettronica"
                      : "chimica"}
                  </span>
                ) : (
                  <Placeholder xs={7} />
                )}
              </p>

              {/* Contatti */}
              <div className="flex items-center mt-3">
                <Envelope />{" "}
                <span className="ml-1">
                  {student?.email ? (
                    <a href={`mailto:${student.email}`}>{student.email}</a>
                  ) : (
                    <Placeholder xs={7} />
                  )}
                </span>
              </div>
              <div className="flex items-center mt-1">
                <Telephone />{" "}
                <span className="ml-1">
                  {student?.phoneNumber ? (
                    <a href={`tel:${student.phoneNumber}`}>
                      {student.phoneNumber}
                    </a>
                  ) : (
                    <Placeholder xs={7} />
                  )}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl mt-5 mb-3 font-semibold tracking-tighter">
              I tuoi dati
            </h2>

            <div className="text-gray-700 w-full md:px-5">
              <div className="mb-3 grid grid-cols-2">
                <p>Nome</p>
                <p>{student?.firstName}</p>
              </div>

              <div className="mb-3 grid grid-cols-2">
                <p>Cognome</p>
                <p>{student?.lastName}</p>
              </div>

              <div className="mb-3 grid grid-cols-2">
                <p>Codice fiscale</p>
                <p>{student?.fiscalNumber}</p>
              </div>

              <div className="mb-3 grid grid-cols-2">
                <p>Spostamenti</p>
                <div>
                  <p className="flex items-center">
                    {student?.hasDrivingLicense ? <Check /> : <X />} patente
                  </p>
                  <p className="flex items-center">
                    {student?.canTravel ? <Check /> : <X />} viaggiare in
                    autonomia
                  </p>
                </div>
              </div>

              <div className="mb-3 grid grid-cols-2">
                <p>Data di iscrizione</p>
                <p>
                  {student?.createdAt &&
                    format(new Date(student.createdAt), "dd/MM/yyyy")}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mt-14 text-3xl mb-3 font-semibold tracking-tighter">
              Le tue candidature
            </h2>

            <div className="text-gray-700 w-full md:px-5">
              {!student?.jobApplications.length && (
                <p className="flex items-center">
                  <span className="mr-1">Nessuna candidatura</span>{" "}
                  <EmojiFrown />
                </p>
              )}
              {student?.jobApplications.map(j => (
                <JobApplicationCard
                  key={j._id}
                  jobApplication={j}
                  setCurrentJobApplication={setCurrentJobApplication}
                  clickable
                />
              ))}
            </div>
          </div>
        </div>

        <Outlet />
      </Container>
    </RequireStudentLogin>
  );
};

export default StudentProfile;
