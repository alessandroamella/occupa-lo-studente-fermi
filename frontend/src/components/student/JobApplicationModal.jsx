import React, { useState } from "react";
import {
  Check,
  Envelope,
  Link45deg,
  SendFill,
  Telephone,
  Trash,
  X
} from "react-bootstrap-icons";
import Modal from "react-bootstrap/Modal";
import Placeholder from "react-bootstrap/Placeholder";
import Spinner from "react-bootstrap/Spinner";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import TextEditor from "../textEditor";
import { setMessage as setMessageAction } from "../../slices/alertSlice";

const JobApplicationModal = ({
  student,
  readOnly,
  deleteFn,
  show,
  setShow,
  sendCurriculumFn
}) => {
  const [disabled, setDisabled] = useState(false);
  const [message, setMessage] = useState(
    "Inserisci un messaggio per l'azienda..."
  );

  const [isDeleting, setIsDeleting] = useState(false);

  const dispatch = useDispatch();

  async function sendCurriculum() {
    if (!window.confirm("Vuoi inviare questa candidatura?")) return;

    setDisabled(true);
    const data = await sendCurriculumFn(message);

    setDisabled(false);
    setShow(null);

    if (!data) return;

    setMessage("Inserisci un messaggio per l'azienda...");
  }

  async function execDelete() {
    if (!show?._id) {
      dispatch(
        setMessageAction({
          title: "Errore nell'eliminazione",
          text: "Candidatura non caricata"
        })
      );
      return setShow(null);
    }
    if (!window.confirm("Vuoi eliminare questa candidatura?")) return;
    try {
      setIsDeleting(true);
      setDisabled(true);
      await deleteFn(show._id);

      setIsDeleting(false);
      setDisabled(false);
      setShow(null);
    } catch (err) {
      console.log(err);
      setIsDeleting(false);
      setDisabled(false);

      dispatch(
        setMessageAction({
          title: "Errore nell'eliminazione",
          text: err?.response?.data?.err || "Errore sconosciuto"
        })
      );
      return setShow(null);
    }
    return dispatch(
      setMessageAction({
        color: "green",
        text: "Candidatura eliminata con successo"
      })
    );
  }

  return (
    <Modal size="lg" show={show} onHide={() => setShow(null)}>
      <Modal.Header closeButton>
        <Modal.Title>
          {readOnly ? (
            <span>Candidatura per {show?.agencyName}</span>
          ) : (
            <span>Invia candidatura</span>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="my-5">
          <div className="flex justify-center flex-col md:flex-row items-center">
            <img
              src={((readOnly && student) || show)?.pictureUrl?.replace(
                "=s96-c",
                "=s1024-c"
              )}
              loading="lazy"
              alt="Profile pic"
              className="w-44 rounded-full aspect-square shadow-lg"
            />
            <div className="md:ml-12">
              {/* Nome e cognome */}
              <h1 className="mt-2 font-semibold tracking-tighter text-2xl">
                {(readOnly ? show : student)?.firstName || (
                  <Placeholder xs={7} />
                )}{" "}
                {(readOnly ? show : student)?.lastName || (
                  <Placeholder xs={6} />
                )}
              </h1>

              {/* Indirizzo di studio */}
              <p className="text-gray-700">
                {(readOnly ? show : student)?.fieldOfStudy ? (
                  <span>
                    Studente di{" "}
                    {(readOnly ? show : student).fieldOfStudy === "it"
                      ? "informatica"
                      : (readOnly ? show : student).fieldOfStudy ===
                        "electronics"
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
                  {(readOnly ? show : student)?.email ? (
                    <a href={`mailto:${(readOnly ? show : student).email}`}>
                      {(readOnly ? show : student).email}
                    </a>
                  ) : (
                    <Placeholder xs={7} />
                  )}
                </span>
              </div>
              <div className="flex items-center mt-1">
                <Telephone />{" "}
                <span className="ml-1">
                  {(readOnly ? show : student)?.phoneNumber ? (
                    <a href={`tel:${(readOnly ? show : student).phoneNumber}`}>
                      {(readOnly ? show : student).phoneNumber}
                    </a>
                  ) : (
                    <Placeholder xs={7} />
                  )}
                </span>
              </div>
            </div>
          </div>

          {readOnly && show?.agencyName && (
            <>
              <h2 className="text-3xl mt-5 mb-3 font-semibold tracking-tighter">
                Candidatura
              </h2>

              <div className="text-gray-700 w-full md:px-5">
                <div className="mb-3 grid grid-cols-2">
                  <p>Azienda</p>
                  <Link
                    to={
                      student
                        ? `/student/agency/${show.forAgency}?showagency=true`
                        : "/agency"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center underline decoration-dotted"
                  >
                    <Link45deg />
                    {show.agencyName}
                  </Link>
                </div>

                {show.forJobOffer && (
                  <div className="mb-3 grid grid-cols-2">
                    <p>Offerta di lavoro</p>
                    <Link
                      to={
                        student
                          ? `/student/agency/${show.forAgency}?showagency=true&joboffer=${show.forJobOffer}`
                          : `/agency/joboffer?id=${show.forJobOffer}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center underline decoration-dotted"
                    >
                      <Link45deg />
                      {show.jobOfferTitle}
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}

          <h2 className="text-3xl mt-5 mb-3 font-semibold tracking-tighter">
            Dati studente
          </h2>

          <div className="text-gray-700 w-full md:px-5">
            <div className="mb-3 grid grid-cols-2">
              <p>Nome</p>
              <p>{(readOnly ? show : student)?.firstName}</p>
            </div>

            <div className="mb-3 grid grid-cols-2">
              <p>Cognome</p>
              <p>{(readOnly ? show : student)?.lastName}</p>
            </div>

            <div className="mb-3 grid grid-cols-2">
              <p>Codice fiscale</p>
              <p>{(readOnly ? show : student)?.fiscalNumber}</p>
            </div>

            <div className="mb-3 grid grid-cols-2">
              <p>Spostamenti</p>
              <div>
                <p className="flex items-center">
                  {(readOnly ? show : student)?.hasDrivingLicense ? (
                    <Check />
                  ) : (
                    <X />
                  )}{" "}
                  patente
                </p>
                <p className="flex items-center">
                  {(readOnly ? show : student)?.canTravel ? <Check /> : <X />}{" "}
                  viaggiare in autonomia
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-3xl mt-5 mb-3 font-semibold tracking-tighter">
            Curriculum
          </h2>

          <div className="text-gray-700 w-full md:px-5">
            {(readOnly ? show : student)?.curriculum ? (
              <TextEditor
                readOnly
                content={(readOnly ? show : student).curriculum}
              />
            ) : (
              <h2 className="text-red-600 font-medium">
                {readOnly ? (
                  <span>Non hai inviato alcun curriculum</span>
                ) : (
                  <span>
                    Non hai un curriculum salvato, creane uno nella pagina del{" "}
                    <Link
                      to="/student/profile"
                      className="flex items-center hover:text-red-700 decoration-dotted underline"
                    >
                      <Link45deg /> tuo profilo
                    </Link>
                  </span>
                )}
              </h2>
            )}
          </div>

          <h2 className="text-3xl mt-5 mb-3 font-semibold tracking-tighter">
            Informazioni aggiuntive
          </h2>

          <div className="text-gray-700 w-full md:px-5">
            {/* DEBUG se no message stampa tipo non hai aggiunto un msg */}
            {readOnly && !show?.message ? (
              <h2 className="text-red-600 font-medium">
                Non hai inviato alcun messaggio aggiuntivo
              </h2>
            ) : (
              <TextEditor
                content={readOnly ? show?.message : message}
                setContent={!readOnly && setMessage}
                readOnly={readOnly || disabled}
              />
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        {deleteFn && (
          <button
            disabled={disabled}
            onClick={execDelete}
            className="flex hover:text-white p-2 mr-2 border-none items-center hover:bg-red-500 transition-colors cursor-pointer rounded-md border focus:outline-none"
          >
            {isDeleting ? (
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Caricamento...</span>
              </Spinner>
            ) : (
              <>
                <Trash />
                <span>Elimina</span>
              </>
            )}
          </button>
        )}
        <button
          className="text-gray-700 mr-2 transition-colors hover:text-black"
          disabled={disabled}
          onClick={() => setShow(null)}
        >
          Chiudi
        </button>
        {!readOnly && (
          <button
            disabled={disabled}
            onClick={sendCurriculum}
            className="flex bg-purple-500 text-white p-2 border-none items-center hover:bg-purple-600 transition-colors cursor-pointer rounded-md border focus:outline-none disabled:cursor-not-allowed disabled:bg-purple-400"
          >
            <SendFill />
            <span className="ml-1">Invia candidatura</span>
          </button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default JobApplicationModal;
