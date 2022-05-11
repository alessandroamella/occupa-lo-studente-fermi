import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";
import { useDispatch, useSelector } from "react-redux";
import { GeoAlt } from "react-bootstrap-icons";
import Placeholder from "react-bootstrap/Placeholder";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import RequireAgencyLogin from "./RequireAgencyLogin";
import EditButton from "../EditButton";
import { setMessage } from "../../slices/alertSlice";
import axios from "axios";

const mdParser = new MarkdownIt({
  linkify: true,
  typographer: true
});

// Finish!

const selectAgency = state => state.agency;

const AgencyDashboard = () => {
  const { agency } = useSelector(selectAgency);
  const dispatch = useDispatch();

  function handleEditorChange({ text }) {
    setAgencyDescription(text);

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
  const [agencyDescription, setAgencyDescription] = useState(null);
  const [descriptionEnabled, setDescriptionEnabled] = useState(true);

  async function editField(body) {
    try {
      const { data } = await axios.put("/api/agency", body);
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

  async function editDescription() {
    setDescriptionEnabled(false);
    const data = await editField({ agencyDescription });

    setDescriptionEnabled(true);
    if (!data) return;

    dispatch(
      setMessage({
        color: "green",
        text: "Descrizione modificata con successo!"
      })
    );
    setAgencyDescription(null);
  }

  useEffect(() => {
    if (agency) {
      setDescriptionEnabled(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!agency]);

  return (
    <RequireAgencyLogin>
      <Container bg="dark" variant="dark" className="mt-8 mb-4">
        <div>
          <p>
            Sono la <span className="font-semibold">agency dashboard!!</span>
          </p>
        </div>

        <div className="rounded-xl overflow-hidden border w-full">
          <div className="relative">
            <div className="absolute left-0 right-0 translate-y-1/2 bg-purple-500  text-white w-fit mx-auto py-4 px-8 flex justify-center items-center mb-16">
              <h1 className="text-5xl text-center mx-auto font-semibold uppercase tracking-tighter">
                {agency?.agencyName || <Placeholder xs={6} />}
              </h1>
            </div>
            <img
              src={agency?.bannerUrl || "/img/default_banner.jpg"}
              alt="Agency banner"
              className="w-full max-h-40 object-cover"
              loading="lazy"
            />
          </div>

          <div className="p-3 md:p-6">
            <div className="w-full mb-10">
              <div>
                <h3 className="flex items-center mb-3 font-semibold text-3xl">
                  Descrizione
                </h3>
                {agency?.agencyDescription ? (
                  <>
                    <MdEditor
                      style={{ height: "500px" }}
                      renderHTML={text => mdParser.render(text)}
                      onChange={handleEditorChange}
                      defaultValue={agency.agencyDescription}
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
                          !agencyDescription ||
                          agencyDescription.trim().length < 16 ||
                          agencyDescription.trim().length > 4000
                        }
                        onClick={editDescription}
                      />
                    </div>
                  </>
                ) : (
                  <Placeholder className="w-96 h-96" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 items-start">
              <div className="flex flex-col justify-center items-center w-full">
                <h3 className="flex mb-3 font-semibold text-3xl">Posizione</h3>
                {agency?.agencyAddress ? (
                  <iframe
                    title="Agency position"
                    width="500"
                    height="400"
                    className="max-w-full mr-3 border-8 border-orange-400 shadow-lg"
                    src={
                      "https://maps.google.com/maps?t=&z=13&ie=UTF8&iwloc=&output=embed&q=" +
                      encodeURIComponent(agency?.agencyAddress)
                    }
                  ></iframe>
                ) : (
                  <Placeholder className="w-96 h-96" />
                )}
                <div className="mt-3 flex items-center">
                  <p className="flex items-center text-gray-700 italic mr-3">
                    <GeoAlt />{" "}
                    <span className="ml-1">{agency?.agencyAddress}</span>
                  </p>
                  <EditButton />
                </div>
              </div>

              <div className="flex flex-col justify-center items-center w-full">
                <h3 className="flex mb-3 font-semibold text-3xl">Dati</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Quidem molestiae, optio dolor nam dolores unde odio recusandae
                  nostrum! Delectus obcaecati quis porro sunt suscipit deserunt
                  aliquam natus ducimus! Laborum, eius?
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          La tua azienda:{" "}
          <pre>
            <code>{JSON.stringify(agency, null, 4)}</code>
          </pre>
        </div>
        <Outlet />
      </Container>
    </RequireAgencyLogin>
  );
};

export default AgencyDashboard;
