import React from "react";
import { Check, Envelope, Telephone, X } from "react-bootstrap-icons";
import Modal from "react-bootstrap/Modal";
import Placeholder from "react-bootstrap/Placeholder";
import { useSelector } from "react-redux";
import TextEditor from "../textEditor";

const selectStudent = state => state.student;

const JobApplicationModal = ({ show, setShow }) => {
  const { student } = useSelector(selectStudent);

  return (
    <Modal size="lg" show={show}>
      <Modal.Header closeButton>
        <Modal.Title>Il tuo profilo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="my-5">
          <div className="flex justify-center flex-col md:flex-row">
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
          </div>

          <h2 className="text-3xl mt-5 mb-3 font-semibold tracking-tighter">
            Il tuo curriculum
          </h2>

          <div className="text-gray-700 w-full md:px-5">
            {student?.curriculum ? (
              <TextEditor readOnly content={student.curriculum} />
            ) : (
              <h2 className="text-red-500 font-medium">
                Nessun curriculum da inviare
              </h2>
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button onClick={() => setShow(false)}>Chiudi</button>
        <button>Invia</button>
      </Modal.Footer>
    </Modal>
  );
};

export default JobApplicationModal;
