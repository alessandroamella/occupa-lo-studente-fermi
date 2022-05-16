import React, { useEffect, useState } from "react";
import { Outlet, useSearchParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import { useDispatch, useSelector } from "react-redux";
import {
  Check,
  Clock,
  Dot,
  Envelope,
  GeoAlt,
  PlusCircleDotted,
  Telephone,
  X
} from "react-bootstrap-icons";
import Dropdown from "react-bootstrap/Dropdown";
import Placeholder from "react-bootstrap/Placeholder";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import Form from "react-bootstrap/Form";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import axios from "axios";
import "react-markdown-editor-lite/lib/index.css";
import RequireAgencyLogin from "./RequireAgencyLogin";
import EditButton from "../EditButton";
import { setMessage } from "../../slices/alertSlice";
// import JobOfferCard from "./JobOfferCard";
import { addMonths, format } from "date-fns";
import ReactMarkdown from "react-markdown";

const mdParser = new MarkdownIt({
  linkify: true,
  typographer: true
});

// Finish!

const selectAgency = state => state.agency;

const ViewJobOffer = () => {
  const { agency } = useSelector(selectAgency);
  const dispatch = useDispatch();

  function handleEditorChange({ text }) {
    setDescription(text);

    const l = text.trim().length;
    if (l < 16) {
      return dispatch(
        setMessage({
          color: "red",
          text: "La descrizione deve essere lunga almeno 16 caratteri"
        })
      );
    } else if (l > 4000) {
      return dispatch(
        setMessage({
          color: "red",
          text: `Hai raggiunto la lunghezza massima di 4000 caratteri (${l})`
        })
      );
    }
  }
  const [description, setDescription] = useState(null);
  const [descriptionEnabled, setDescriptionEnabled] = useState(true);

  const [jobOffer, setJobOffer] = useState(null);

  const [title, setTitle] = useState(null);
  const [editTitle, setEditTitle] = useState(false);
  const [titleInputDisabled, setTitleInputDisabled] = useState(false);

  async function editField(body) {
    try {
      const { data } = await axios.put("/api/joboffer/" + jobOffer?._id, body);
      return data;
    } catch (err) {
      dispatch(
        setMessage({
          color: "error",
          title: "Errore nella modifica",
          text: err?.response?.data?.err || "Errore sconosciuto"
        })
      );
      return null;
    }
  }

  async function execEditTitle() {
    setTitleInputDisabled(true);

    let data;
    try {
      data = await editField({ title });
    } catch (err) {
      console.log(err);
    }

    setTitleInputDisabled(false);
    setEditTitle(false);
    if (!data) return;

    // console.log("setAgency", data);
    // dispatch(setAgency(data));

    dispatch(
      setMessage({
        color: "green",
        text: "Titolo offerta di lavoro modificata con successo!"
      })
    );
    setTitle(title);
    // setDescription(null);
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

    // console.log("setAgency", data);
    // dispatch(setAgency(data));

    dispatch(
      setMessage({
        color: "green",
        text: "Descrizione modificata con successo!"
      })
    );
    setDescription(null);
  }

  //   async function submitForm(e) {
  //     e.preventDefault();

  //     setDisabled(true);

  //     const obj = {
  //       email,
  //       websiteUrl,
  //       phoneNumber,
  //       logoUrl,
  //       bannerUrl
  //     };
  //     if (hasChangedPassword) {
  //       obj.password = password;
  //     }

  //     let data;
  //     try {
  //       data = await editField(obj);
  //     } catch (err) {
  //       console.log(err);
  //     }

  //     setDisabled(false);
  //     setPassword("");
  //     if (!data) return;

  //     console.log("setAgency", data);
  //     dispatch(setAgency(data));

  //     dispatch(
  //       setMessage({
  //         color: "green",
  //         text:
  //           "Dati modificati con successo!" +
  //           (hasChangedPassword ? " (anche la password)" : "")
  //       })
  //     );
  //     setHasChangedPassword(false);
  //   }

  const [websiteUrl, setWebsiteUrl] = useState("https://miaazienda.it");
  const [fieldOfStudy, setFieldOfStudy] = useState("it");
  const [mustHaveDiploma, setMustHaveDiploma] = useState(false);
  const [numberOfPositions, setNumberOfPositions] = useState(1);
  const [expiryDate, setExpiryDate] = useState(addMonths(new Date(), 3));

  const [disabled, setDisabled] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const isEditing = searchParams.get("id");

  useEffect(() => {
    if (!searchParams.get("id")) {
      // DEBUG
      return alert("ID jobOffer non specificato");
    }
    if (!agency) return;
    const _id = searchParams.get("id");
    const j = agency.jobOffers.find(j => j._id === _id);
    if (!j) {
      // DEBUG
      return alert("JobOffer non trovata");
    }
    console.log("JobOffer trovata:", j);
    setJobOffer(j);

    setTitle(j.title);

    setWebsiteUrl(agency.websiteUrl || "");
    setFieldOfStudy(j.fieldOfStudy);
    setMustHaveDiploma(j.mustHaveDiploma);
    setNumberOfPositions(j.numberOfPositions);
    setExpiryDate(j.expiryDate);

    setDisabled(false);

    // setDescriptionEnabled(true);
    // setTitle(JSON.stringify(agency?.jobOffers));
    // setAddress(agency?.agencyAddress);
    // setEmail(agency?.email);
    // setWebsiteUrl(agency?.websiteUrl);
    // setPhoneNumber(agency?.phoneNumber);
    // setLogoUrl(agency?.logoUrl);
    // setBannerUrl(agency?.bannerUrl);
    // setDisabled(false);

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
                className="max-h-28 rounded-full shadow-xl mr-6"
              />
              <div className="w-full overflow-hidden">
                <h3 className="text-3xl tracking-tighter font-semibold">
                  {agency?.agencyName || (
                    <Placeholder animation="glow" xs={8} />
                  )}
                </h3>

                <div className="flex flex-col mb-2 w-full overflow-hidden whitespace-nowrap text-ellipsis">
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
          <Outlet />
        </div>

        <div className="rounded-xl overflow-hidden border w-full">
          <div className="p-3 md:p-6">
            <div className="md:px-3 w-full mb-5">
              <div className="mt-3 mb-5 flex flex-col md:flex-row items-center">
                {editTitle ? (
                  <>
                    <input
                      type="text"
                      placeholder="Programmatore Node.js"
                      onChange={e => setTitle(e.target.value)}
                      autoComplete="joboffer-title"
                      disabled={titleInputDisabled}
                      value={title}
                      required
                      className="text-3xl md:text-5xl font-semibold tracking-tighter mr-3 md:w-1/2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      autoFocus
                      onKeyDown={e => {
                        if (e.key === "Escape") setEditTitle(false);
                        else if (e.key === "Enter") execEditTitle();
                      }}
                    />
                    <EditButton purple showText onClick={execEditTitle} />
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>

              {jobOffer?.description ? (
                <>
                  <MdEditor
                    style={{ height: "500px" }}
                    renderHTML={text => mdParser.render(text)}
                    onChange={handleEditorChange}
                    defaultValue={jobOffer?.description}
                    allowPasteImage={false}
                    imageAccept={false}
                    readOnly={!descriptionEnabled}
                  />
                  <div className="mt-5 w-full flex justify-center">
                    <EditButton
                      purple
                      showText
                      disabled={
                        !descriptionEnabled ||
                        !description ||
                        description.trim().length < 16 ||
                        description.trim().length > 4000
                      }
                      onClick={execEditDescription}
                    />
                  </div>
                </>
              ) : (
                <Placeholder xs={12} animation="glow" />
              )}

              <div className="px-5 md:px-20 lg:px-36 mt-10 grid grid-cols-2">
                <p className="mb-3 font-semibold">Sito web</p>

                <input
                  className="mb-3 transition-colors hover:border-gray-300 focus:border-gray-700 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  disabled={disabled}
                  pattern="https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)"
                  value={websiteUrl}
                  onChange={e => setWebsiteUrl(e.target.value)}
                />
                {/* <a
                  href={agency?.websiteUrl || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="mb-4 font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {agency?.websiteUrl || (
                    <Placeholder xs={6} animation="glow" />
                  )}
                </a> */}

                <p className="font-semibold mb-3">Indirizzo di studio</p>

                <Dropdown className="mb-3" disabled={disabled}>
                  <Dropdown.Toggle variant="outline-dark" id="dropdown-basic">
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
            </div>
          </div>
          <Outlet />
        </div>
      </Container>
    </RequireAgencyLogin>
  );
};

export default ViewJobOffer;
