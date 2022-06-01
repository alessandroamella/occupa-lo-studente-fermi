import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useSearchParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import { useDispatch, useSelector } from "react-redux";
import Dropdown from "react-bootstrap/Dropdown";
import Placeholder from "react-bootstrap/Placeholder";
import Form from "react-bootstrap/Form";
import { Link45deg, Trash } from "react-bootstrap-icons";
import axios from "axios";
import RequireAgencyLogin from "./RequireAgencyLogin";
import EditButton from "../EditButton";
import { setMessage } from "../../slices/alertSlice";
import { setAgency } from "../../slices/agencyAuthSlice";
import BackButton from "../BackButton";
import TextEditor from "../textEditor";

const selectAgency = state => state.agency;

const ViewJobOffer = () => {
  const { agency } = useSelector(selectAgency);
  const dispatch = useDispatch();

  const [description, setDescription] = useState(null);
  const [, setDescriptionText] = useState(null);
  const [descriptionEnabled, setDescriptionEnabled] = useState(true);

  const [jobOffer, setJobOffer] = useState(null);

  const [title, setTitle] = useState("Titolo offerta di lavoro");
  const [editTitle, setEditTitle] = useState(false);
  const [titleInputDisabled, setTitleInputDisabled] = useState(false);

  const navigate = useNavigate();

  async function editField(body) {
    setDisabled(true);

    try {
      const { data } = isEditing
        ? await axios.put(
            "/api/joboffer/" + jobOffer?._id,
            body || {
              fieldOfStudy,
              mustHaveDiploma,
              numberOfPositions
            }
          )
        : await axios.post("/api/joboffer", {
            title,
            description,
            fieldOfStudy,
            mustHaveDiploma,
            numberOfPositions
          });

      // Update agency by re-fetching it
      const agency = (await axios.get("/api/agency")).data;
      dispatch(setAgency(agency));

      if (!isEditing) {
        navigate("/agency/dashboard?view=joboffers");
      }

      dispatch(
        setMessage({
          title: "Successo",
          text:
            (isEditing ? "Modifica" : "Creazione offerta di lavoro") +
            " avvenuta con successo!",
          color: "green"
        })
      );
      setDisabled(false);
      return data;
    } catch (err) {
      console.log(err?.response?.data || err);
      dispatch(
        setMessage({
          color: "error",
          title: "Errore",
          text: err?.response?.data?.err || "Errore sconosciuto"
        })
      );
      setDisabled(false);
    }
  }

  async function execEditTitle() {
    let data;
    try {
      data = await editField({ title });
    } catch (err) {
      console.log(err);
    }

    setTitleInputDisabled(false);
    setEditTitle(false);
    if (!data) return;

    dispatch(
      setMessage({
        color: "green",
        text: "Titolo modificato con successo!"
      })
    );
    setTitle(title);
  }

  async function execEditDescription() {
    setDescriptionEnabled(false);

    let data;
    try {
      data = await editField({ description });
    } catch (err) {
      console.log(err);
    }

    setDescriptionEnabled(true);
    if (!data) return;

    setDescription(null);

    dispatch(
      setMessage({
        color: "green",
        text: "Descrizione modificata con successo!"
      })
    );
  }

  async function deleteJobOffer() {
    if (!jobOffer || !isEditing) return;

    if (!window.confirm("Vuoi eliminare quest'offerta di lavoro?")) return;

    setDisabled(true);

    try {
      await axios.delete("/api/joboffer/" + jobOffer._id);
      navigate("/agency/dashboard?view=joboffers");

      // Update agency by re-fetching it
      const agency = (await axios.get("/api/agency")).data;
      dispatch(setAgency(agency));
      dispatch(
        setMessage({
          color: "green",
          text: "Offerta di lavoro eliminata con successo"
        })
      );
    } catch (err) {
      dispatch(
        setMessage({
          title: "Errore nell'eliminazione",
          text: err?.response?.data?.err || "Errore sconosciuto"
        })
      );
      setDisabled(false);
    }
  }

  const [fieldOfStudy, setFieldOfStudy] = useState("it");
  const [mustHaveDiploma, setMustHaveDiploma] = useState(false);
  const [numberOfPositions, setNumberOfPositions] = useState(1);
  // const [expiryDate, setExpiryDate] = useState(addMonths(new Date(), 3));

  const [disabled, setDisabled] = useState(true);

  const [searchParams] = useSearchParams();

  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    // Still loading
    if (!agency) return;
    const _id = searchParams.get("id");
    const j = agency.jobOffers.find(j => j._id === _id);
    if (!j) {
      // Creating new job offer, not editing one
      setIsEditing(false);
      setEditTitle(true);
      setDisabled(false);
      return;
    }
    console.log("JobOffer trovata:", j);
    setJobOffer(j);

    setTitle(j.title);

    setFieldOfStudy(j.fieldOfStudy);
    setMustHaveDiploma(j.mustHaveDiploma);
    setNumberOfPositions(j.numberOfPositions);
    // setExpiryDate(j.expiryDate);

    setDisabled(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!agency]);

  const jobApplications = agency?.jobApplications.filter(
    j => j.forJobOffer === jobOffer?._id
  );

  return (
    <RequireAgencyLogin>
      <Container bg="dark" variant="dark" className="mt-8 mb-4">
        <div className="mb-3">
          <BackButton />
        </div>
        <div className="rounded-xl overflow-hidden border w-full">
          <div className="p-3 md:p-6">
            <div className="md:px-3 w-full mb-5">
              <div className="mt-3 mb-5">
                {isEditing && (
                  <div className="mb-8 grid grid-cols-1 md:grid-cols-2">
                    <div>
                      <p className="text-gray-700 font-semibold">Candidature</p>

                      <Link
                        to={`/agency/dashboard?view=jobapplications${
                          jobApplications?.length
                            ? `&jobapplication=${jobApplications[0]?._id}`
                            : ""
                        }`}
                        className="flex items-center decoration-dotted underline"
                      >
                        <Link45deg /> Hai ricevuto
                        <strong className="px-1">
                          {jobApplications?.length}
                        </strong>
                        candidatur
                        {jobApplications?.length === 1 ? "a " : "e "}
                        per questa offerta di lavoro
                      </Link>
                    </div>

                    <div>
                      <p className="text-gray-700 font-semibold">
                        Visualizzazioni
                      </p>

                      <p>
                        Questa offerta di lavoro è stata vista
                        <strong className="px-1">
                          {jobOffer?.views || "0"}
                        </strong>
                        volt
                        {jobOffer?.views?.length === 1 ? "a " : "e "}
                      </p>
                    </div>
                  </div>
                )}
                <p className="text-gray-700 font-semibold">Titolo</p>
                {editTitle ? (
                  <div className="flex flex-col md:flex-row items-center">
                    <input
                      type="text"
                      placeholder="Programmatore Node.js"
                      onChange={e => setTitle(e.target.value)}
                      autoComplete="joboffer-title"
                      disabled={titleInputDisabled || disabled}
                      value={title}
                      required
                      className="text-3xl md:text-5xl font-semibold tracking-tighter mr-3 md:w-1/2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      autoFocus
                      onKeyDown={e => {
                        if (!isEditing) return;
                        else if (e.key === "Escape") setEditTitle(false);
                        else if (e.key === "Enter") execEditTitle();
                      }}
                    />
                    {isEditing && (
                      <EditButton purple showText onClick={execEditTitle} />
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row items-center">
                    <h1
                      onClick={() => setEditTitle(true)}
                      className="cursor-pointer text-5xl font-semibold tracking-tighter"
                    >
                      {title || <Placeholder xs={6} />}
                    </h1>
                    <EditButton
                      className="ml-3"
                      onClick={() => setEditTitle(true)}
                    />
                  </div>
                )}
              </div>

              <p className="text-gray-700 mt-3 mb-2 font-semibold">
                Descrizione
              </p>
              {jobOffer?.description || !isEditing ? (
                <>
                  <TextEditor
                    content={
                      jobOffer?.description ||
                      "La descrizione di quest'offerta di lavoro che stai creando.\n\nProva ad essere il più esaustivo possibile!"
                    }
                    setContent={setDescription}
                    setText={setDescriptionText}
                    readOnly={!descriptionEnabled || disabled}
                  />

                  {isEditing && (
                    <div className="mt-5 w-full flex justify-center">
                      <EditButton
                        purple
                        showText
                        disabled={
                          disabled ||
                          !descriptionEnabled ||
                          !description ||
                          description.trim().length < 16 ||
                          description.trim().length > 4000
                        }
                        onClick={execEditDescription}
                        text="Modifica descrizione"
                      />
                    </div>
                  )}
                </>
              ) : (
                <Placeholder xs={12} animation="glow" />
              )}

              <p className="text-gray-700 text-center mt-8 mb-3 font-semibold">
                Altri dati
              </p>

              <div className="px-5 md:px-20 lg:px-36 grid grid-cols-2">
                <p className="font-semibold mb-3">Indirizzo di studio</p>
                <Dropdown className="mb-3">
                  <Dropdown.Toggle
                    disabled={disabled}
                    variant="outline-dark"
                    id="dropdown-basic"
                  >
                    {fieldOfStudy === "it"
                      ? "Informatica"
                      : fieldOfStudy === "electronics"
                      ? "Elettronica"
                      : fieldOfStudy === "chemistry"
                      ? "Chimica"
                      : "Tutti"}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setFieldOfStudy("any")}>
                      Tutti
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setFieldOfStudy("it")}>
                      Informatica
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => setFieldOfStudy("electronics")}
                    >
                      Elettronica
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setFieldOfStudy("chemistry")}>
                      Chimica
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <p className="font-semibold mb-4">Diploma richiesto</p>
                <Form.Check
                  type="checkbox"
                  checked={mustHaveDiploma}
                  onChange={() => setMustHaveDiploma(!mustHaveDiploma)}
                  disabled={disabled}
                />
                <p className="mb-3 font-semibold">Posizioni disponibili</p>
                <input
                  className="mb-3 transition-colors hover:border-gray-300 focus:border-gray-700 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="number"
                  min={1}
                  max={10}
                  disabled={disabled}
                  value={numberOfPositions}
                  onChange={e => setNumberOfPositions(e.target.value)}
                />
                {/* <p className="font-semibold mb-4">Data di scadenza</p>
                <p className="mb-4">
                  {jobOffer?.expiryDate ? (
                    format(new Date(jobOffer?.expiryDate), "dd/MM/yyyy")
                  ) : (
                    <Placeholder xs={6} animation="glow" />
                  )}
                </p> */}
              </div>
              {isEditing && (
                <EditButton
                  disabled={disabled}
                  purple
                  showText
                  className="mx-auto"
                  onClick={() => editField()}
                  text="Modifica altri dati"
                />
              )}
            </div>
            {isEditing ? (
              <div className="flex justify-center mt-10">
                <button
                  disabled={disabled}
                  className="flex bg-red-500 hover:bg-red-600 active:bg-red-600 text-white p-2 items-center transition-all rounded-md border"
                  onClick={deleteJobOffer}
                >
                  <Trash />
                  <span className="ml-2">Elimina</span>
                </button>
              </div>
            ) : (
              <div className="flex justify-center">
                <button
                  disabled={disabled}
                  className="font-semibold tracking-tight text-xl flex justify-center bg-purple-500 text-white m-3 mb-5 p-5 items-center hover:bg-purple-600 transition-all hover:scale-105 cursor-pointer rounded-md border focus:outline-none"
                  onClick={editField}
                >
                  <span className="ml-2">Crea offerta di lavoro</span>
                </button>
              </div>
            )}
          </div>
          <Outlet />
        </div>
      </Container>
    </RequireAgencyLogin>
  );
};

export default ViewJobOffer;
