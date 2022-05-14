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
import RequireAgencyLogin from "../agency/RequireAgencyLogin";
import EditButton from "../EditButton";
import { setMessage } from "../../slices/alertSlice";
import { setAgency } from "../../slices/agencyAuthSlice";
// import JobOfferCard from "./JobOfferCard";
import { format } from "date-fns";
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

  //   function handleEditorChange({ text }) {
  //     setAgencyDescription(text);

  //     const l = text.trim().length;
  //     if (l < 16) {
  //       return dispatch(
  //         setMessage({
  //           color: "red",
  //           text: "La descrizione deve essere lunga almeno 16 caratteri"
  //         })
  //       );
  //     } else if (l > 4000) {
  //       return dispatch(
  //         setMessage({
  //           color: "red",
  //           text: `Hai raggiunto la lunghezza massima di 4000 caratteri (${l})`
  //         })
  //       );
  //     }
  //   const [agencyDescription, setAgencyDescription] = useState(null);
  //   const [descriptionEnabled, setDescriptionEnabled] = useState(true);

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
    // setAgencyDescription(null);
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

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!searchParams.get("id")) {
      // DEBUG
      return alert("ID jobOffer non specificato");
    }
    if (agency) {
      const _id = searchParams.get("id");
      const j = agency.jobOffers.find(j => j._id === _id);
      if (!j) {
        // DEBUG
        return alert("JobOffer non trovata");
      }
      setJobOffer(j);

      setTitle(j.title);
      // setDescriptionEnabled(true);
      // setTitle(JSON.stringify(agency?.jobOffers));
      // setAddress(agency?.agencyAddress);
      // setEmail(agency?.email);
      // setWebsiteUrl(agency?.websiteUrl);
      // setPhoneNumber(agency?.phoneNumber);
      // setLogoUrl(agency?.logoUrl);
      // setBannerUrl(agency?.bannerUrl);
      // setDisabled(false);
    }
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
                <p className="mb-2 w-full overflow-hidden whitespace-nowrap text-ellipsis">
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
                </p>

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

                {console.log(jobOffer)}

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
