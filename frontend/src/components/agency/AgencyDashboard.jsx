import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";
import { useDispatch, useSelector } from "react-redux";
import { Check, Clock, GeoAlt, X } from "react-bootstrap-icons";
import Placeholder from "react-bootstrap/Placeholder";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import Form from "react-bootstrap/Form";
import "react-markdown-editor-lite/lib/index.css";
import RequireAgencyLogin from "./RequireAgencyLogin";
import EditButton from "../EditButton";
import { setMessage } from "../../slices/alertSlice";
import axios from "axios";
import { setAgency } from "../../slices/agencyAuthSlice";

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

  const [name, setName] = useState(null);
  const [editName, setEditName] = useState(false);
  const [nameInputDisabled, setNameInputDisabled] = useState(false);

  const [address, setAddress] = useState(null);
  const [editAddress, setEditAddress] = useState(false);
  const [addressInputDisabled, setAddressInputDisabled] = useState(false);

  const [email, setEmail] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");

  const [hasChangedPassword, setHasChangedPassword] = useState(false);
  const [disabled, setDisabled] = useState(true);
  // const [email, setEmail] = useState(null);

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

  async function execEditDescription() {
    setDescriptionEnabled(false);

    let data;
    try {
      data = await editField({ agencyDescription });
    } catch (err) {
      console.log(err);
    }

    setDescriptionEnabled(true);
    if (!data) return;

    dispatch(setAgency(data));

    dispatch(
      setMessage({
        color: "green",
        text: "Descrizione modificata con successo!"
      })
    );
    agency.agencyDescription = agencyDescription;
    setAgencyDescription(null);
  }

  async function execEditName() {
    setNameInputDisabled(true);

    let data;
    try {
      data = await editField({ agencyName: name });
    } catch (err) {
      console.log(err);
    }

    setNameInputDisabled(false);
    setEditName(false);
    if (!data) return;

    dispatch(setAgency(data));

    dispatch(
      setMessage({
        color: "green",
        text: "Titolo modificato con successo!"
      })
    );
  }

  async function execEditAddress() {
    setAddressInputDisabled(true);

    let data;
    try {
      data = await editField({ agencyAddress: address });
    } catch (err) {
      console.log(err);
    }

    setAddressInputDisabled(false);
    setEditAddress(false);
    if (!data) return;

    dispatch(setAgency(data));

    dispatch(
      setMessage({
        color: "green",
        text: "Indirizzo modificato con successo!"
      })
    );
  }

  async function submitForm(e) {
    e.preventDefault();

    setDisabled(true);

    const obj = {
      email,
      websiteUrl,
      phoneNumber,
      logoUrl,
      bannerUrl
    };
    if (hasChangedPassword) {
      obj.password = password;
    }

    let data;
    try {
      data = await editField(obj);
    } catch (err) {
      console.log(err);
    }

    setDisabled(false);
    setPassword("");
    if (!data) return;

    dispatch(setAgency(data));

    dispatch(
      setMessage({
        color: "green",
        text:
          "Dati modificati con successo!" +
          (hasChangedPassword ? " (anche la password)" : "")
      })
    );
    setHasChangedPassword(false);
  }

  useEffect(() => {
    if (agency) {
      setDescriptionEnabled(true);
      setName(agency?.agencyName);
      setAddress(agency?.agencyAddress);
      setEmail(agency?.email);
      setWebsiteUrl(agency?.websiteUrl);
      setPhoneNumber(agency?.phoneNumber);
      setLogoUrl(agency?.logoUrl);
      setBannerUrl(agency?.bannerUrl);
      setDisabled(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!agency]);

  return (
    <RequireAgencyLogin>
      <Container bg="dark" variant="dark" className="mt-8 mb-4">
        <div className="rounded-xl overflow-hidden border w-full">
          <img
            src={agency?.bannerUrl || "/img/default_banner.jpg"}
            alt="Agency banner"
            className="w-full max-h-44 object-cover"
            loading="lazy"
          />

          <div className="p-3 md:p-6">
            <div className="w-full flex items-center ">
              {agency?.logoUrl && (
                <img
                  src={agency.logoUrl}
                  alt="Logo"
                  className="max-w-sm w-full object-cover -mt-20 bg-[rgba(255,255,255,1)] p-4 rounded-lg border shadow"
                  loading="lazy"
                />
              )}
            </div>

            <div className="w-full mb-10">
              <div className="mt-5 mb-10 flex flex-col md:flex-row items-center">
                {editName ? (
                  <>
                    <Form.Control
                      type="text"
                      placeholder="Rossi S.p.A."
                      onChange={e => setName(e.target.value)}
                      autoComplete="agency-name"
                      disabled={nameInputDisabled}
                      className="w-full mr-3 md:w-1/2 lg:w-1/3"
                      value={name}
                      required
                    />
                    <EditButton purple showText onClick={execEditName} />
                  </>
                ) : (
                  <>
                    <h1 className="text-5xl font-semibold tracking-tighter">
                      {name || <Placeholder xs={6} />}
                    </h1>
                    <EditButton
                      className="ml-3"
                      onClick={() => setEditName(true)}
                    />
                  </>
                )}
                <div className="text-3xl ml-auto">
                  {agency?.approvalStatus === "approved" ? (
                    <p className="text-green-600 flex items-center">
                      <Check /> <span className="ml-2">Approvata</span>
                    </p>
                  ) : agency?.approvalStatus === "rejected" ? (
                    <p className="text-red-600 flex items-center">
                      <X /> <span className="ml-2">Rifiutata</span>
                    </p>
                  ) : (
                    <p className="text-gray-700 flex items-center">
                      <Clock /> <span className="ml-2">In attesa</span>
                    </p>
                  )}
                </div>
              </div>
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
                        onClick={execEditDescription}
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
                {address ? (
                  <iframe
                    title="Agency position"
                    width="500"
                    height="430"
                    className="max-w-full mr-3 border-8 border-orange-400 shadow-lg"
                    src={
                      "https://maps.google.com/maps?t=&z=13&ie=UTF8&iwloc=&output=embed&q=" +
                      encodeURIComponent(address)
                    }
                  ></iframe>
                ) : (
                  <Placeholder className="w-96 h-96" />
                )}
                <div className="mt-3 flex justify-center items-center w-full">
                  {editAddress ? (
                    <>
                      <Form.Control
                        type="text"
                        placeholder="38 Largo G. Garibaldi, 41121 Modena"
                        onChange={e => setAddress(e.target.value)}
                        disabled={addressInputDisabled}
                        value={address}
                        // autoComplete="street-address"
                        autoComplete="street-address"
                        minLength={3}
                        className="w-full mr-3"
                        required
                      />
                      <EditButton purple showText onClick={execEditAddress} />
                    </>
                  ) : (
                    <>
                      <p className="flex items-center text-gray-700 italic mr-3">
                        <GeoAlt /> <span className="ml-1">{address}</span>
                      </p>
                      <EditButton
                        className="ml-3"
                        onClick={() => setEditAddress(true)}
                      />
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col justify-center items-center w-full">
                <h3 className="flex mb-3 font-semibold text-3xl">Dati</h3>

                <Form
                  onSubmit={submitForm}
                  className="text-gray-700 w-full md:px-5"
                >
                  <div className="mb-3">
                    <p>Email</p>
                    <input
                      className="col-span-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type="email"
                      required
                      disabled={disabled}
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <p>Password</p>
                    <input
                      className="col-span-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type="password"
                      disabled={disabled}
                      value={password}
                      onChange={e => {
                        console.log("ahs");
                        setHasChangedPassword(true);
                        setPassword(e.target.value);
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <p>Numero di telefono</p>
                    <input
                      className="col-span-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type="tel"
                      required
                      disabled={disabled}
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <p>Sito web</p>
                    <input
                      className="col-span-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                      pattern="https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)"
                      required
                      disabled={disabled}
                      value={websiteUrl}
                      onChange={e => setWebsiteUrl(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <p>URL logo</p>
                    <input
                      className="col-span-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                      pattern="https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)"
                      disabled={disabled}
                      value={logoUrl}
                      onChange={e => setLogoUrl(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <p>URL banner</p>
                    <input
                      className="col-span-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                      pattern="https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)"
                      disabled={disabled}
                      value={bannerUrl}
                      onChange={e => setBannerUrl(e.target.value)}
                    />
                  </div>

                  <div className="col-span-3 w-full flex justify-center mt-3">
                    <EditButton
                      type="submit"
                      purple
                      showText
                      disabled={disabled}
                    />
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
        <Outlet />
      </Container>
    </RequireAgencyLogin>
  );
};

export default AgencyDashboard;
