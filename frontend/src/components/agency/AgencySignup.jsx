import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import { setAgency } from "../../slices/agencyAuthSlice";
import { useDispatch } from "react-redux";
import { setMessage } from "../../slices/alertSlice";
import BackButton from "../BackButton";
import TextEditor from "../textEditor";
import signupText from "./signupText";

const InputDescription = ({ label }) => (
  <label className="block text-gray-700 text-sm font-bold mb-1">{label}</label>
);

const Input = ({ label, showImg, value, ...rest }) => (
  <div className="mb-4 md:mx-2">
    <InputDescription label={label} />
    <div className="flex items-center">
      {showImg && value && (
        <img
          className="w-12 max-h-12 object-contain mr-1"
          src={value}
          alt="Input img"
        />
      )}
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-300 focus:bg-gray-50 transition-colors"
        value={value}
        {...rest}
      />
    </div>
  </div>
);

const AgencySignup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [captcha, setCaptcha] = useState(null);
  const [responsibleFirstName, setResponsibleFirstName] = useState(""); // "string",
  const [responsibleLastName, setResponsibleLastName] = useState(""); // "string",
  const [responsibleFiscalNumber, setResponsibleFiscalNumber] = useState(""); // "string",
  const [email, setEmail] = useState(""); // "user@example.com",
  const [password, setPassword] = useState(""); // "stringst",
  const [websiteUrl, setWebsiteUrl] = useState(""); // "string",
  const [phoneNumber, setPhoneNumber] = useState(""); // "string",
  const [agencyName, setAgencyName] = useState(""); // "string",
  const [agencyDescription, setAgencyDescription] = useState(signupText); // "stringstringstri",
  const [agencyDescriptionText, setAgencyDescriptionText] = useState(""); // "stringstringstri",
  const [agencyAddress, setAgencyAddress] = useState(""); // "string",
  const [vatCode, setVatCode] = useState(""); // "string",
  const [logoUrl, setLogoUrl] = useState(""); // "string"
  const [bannerUrl, setBannerUrl] = useState(""); // "string"

  // const [value, setValue] = React.useState({ firstName, lastName, email });
  const [disabled, setDisabled] = React.useState(true);

  // Ensure form is loaded
  useEffect(() => setDisabled(false), []);

  async function submitForm(event) {
    event.preventDefault();

    if (!window.confirm("Vuoi inviare quest'offerta di lavoro?")) return;

    const l = agencyDescriptionText.length;
    if (l < 16 || l > 3000) {
      return dispatch(
        setMessage({
          title: "Errore nella registrazione",
          text: `La descrizione deve essere lunga da 16 a 3000 caratteri (attuali: ${l})`
        })
      );
    }

    const formData = {
      responsibleFirstName,
      responsibleLastName,
      responsibleFiscalNumber,
      email,
      password,
      websiteUrl,
      phoneNumber,
      agencyName,
      agencyDescription,
      agencyAddress,
      vatCode,
      logoUrl: logoUrl || undefined,
      bannerUrl: bannerUrl || undefined,
      captcha
    };

    setDisabled(true);

    let agency;

    try {
      const res = await axios.post("/api/agency", formData);
      agency = res.data;
    } catch (err) {
      console.log(err?.response?.data || err);
      dispatch(
        setMessage({
          title: "Errore nella registrazione",
          text: err?.response?.data?.err || "Errore sconosciuto"
        })
      );
      setDisabled(false);
      return false;
    }

    console.log({ agency });
    dispatch(setAgency(agency));
    navigate("/agency/dashboard");
    dispatch(
      setMessage({
        color: "green",
        title: "Buone notizie",
        text: "Registrazione avvenuta con successo! Ora la segreteria deciderà se approvare"
      })
    );
    setDisabled(false);
    return false;
  }

  function captchaChange(value) {
    console.log("Captcha value:", value);
    setCaptcha(value);
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4">
      {/* <div className="hidden md:flex flex-col items-center p-4 text-white bg-purple-500 pt-8 pb-4">
        <h1 className="text-2xl lg:text-3xl xl:text-4xl uppercase">
          Registrazione
        </h1>
        <img
          src="/img/business_woman.svg"
          alt="Business woman"
          className="mt-20"
        />
      </div> */}
      <div className="col-span-4 pt-8 pb-4 px-12">
        <BackButton path="/agency" />

        <div className="my-3">
          <h1 className="text-2xl font-light">Registrazione azienda</h1>

          <p>In questa pagina dovrai inserire i dati della tua azienda.</p>
          <p>
            Tutti i dati inseriti in questa pagina (ad eccezione della password){" "}
            <u>verranno controllati dalla segreteria scolastica</u>, la quale
            deciderà se approvare o rifiutare l'inserimento dell'azienda sulla
            piattaforma Occupa lo studente.
          </p>
          <p>
            Una volta approvata l'azienda, potrai creare{" "}
            <u>offerte di lavoro</u> alle quali gli studenti potranno
            candidarsi.
          </p>
        </div>

        <form onSubmit={submitForm}>
          <div className="grid grid-cols-4 w-full mt-5">
            <h2 className="col-span-4 md:col-span-1 md:mt-5 font-semibold text-xl md:mr-10">
              Dati responsabile
            </h2>
            <div className="col-span-4 md:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <Input
                label="Nome"
                type="text"
                placeholder="Mario"
                onChange={e => setResponsibleFirstName(e.target.value)}
                autoComplete="given-name"
                disabled={disabled}
                value={responsibleFirstName}
                minLength={1}
                maxLength={100}
                required
              />
              <Input
                label="Cognome"
                type="text"
                placeholder="Rossi"
                onChange={e => setResponsibleLastName(e.target.value)}
                autoComplete="family-name"
                disabled={disabled}
                value={responsibleLastName}
                minLength={1}
                maxLength={100}
                required
              />
              <Input
                label="Codice fiscale"
                type="text"
                placeholder="RSSMRA70A01F257E"
                onChange={e => setResponsibleFiscalNumber(e.target.value)}
                autoComplete="fiscal-number"
                pattern="^[a-zA-Z]{6}[0-9]{2}[a-zA-Z][0-9]{2}[a-zA-Z][0-9]{3}[a-zA-Z]$"
                disabled={disabled}
                value={responsibleFiscalNumber}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-4 w-full">
            <div className="col-span-4 md:col-span-1 md:mt-5 md:mr-10">
              <h2 className="font-semibold text-xl">Dati di login</h2>
              <small>Userai email e password per fare il login.</small>
              <br />
              <small>L'indirizzo email è pubblicamente visibile.</small>
            </div>

            <div className="col-span-4 md:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <Input
                label="Email"
                type="email"
                placeholder="mario@rossi.it"
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                disabled={disabled}
                value={email}
                required
              />
              <Input
                label="Password"
                type="password"
                onChange={e => setPassword(e.target.value)}
                disabled={disabled}
                value={password}
                minLength={8}
                maxLength={64}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-4 w-full">
            <div className="col-span-4 md:col-span-1 md:mt-5 md:mr-10">
              <h2 className="font-semibold text-xl">Dati aziendali</h2>
              <small>Saranno visibili pubblicamente.</small>
            </div>
            <div className="col-span-4 md:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <Input
                label="Nome azienda"
                type="text"
                placeholder="Rossi S.p.A."
                onChange={e => setAgencyName(e.target.value)}
                disabled={disabled}
                value={agencyName}
                autoComplete="agency-name"
                minLength={1}
                maxLength={100}
                required
              />
              <Input
                label="Sito web"
                type="text"
                placeholder="https://www.rossi.it"
                onChange={e => setWebsiteUrl(e.target.value)}
                pattern="https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)"
                disabled={disabled}
                value={websiteUrl}
                autoComplete="url"
                required
              />
              <Input
                label="Numero di telefono"
                type="text"
                placeholder="3921234567"
                onChange={e => setPhoneNumber(e.target.value)}
                autoComplete="tel"
                disabled={disabled}
                value={phoneNumber}
                required
              />
              <Input
                label="Indirizzo"
                type="text"
                placeholder="17 Largo G. Garibaldi, 41121 Modena"
                onChange={e => setAgencyAddress(e.target.value)}
                disabled={disabled}
                value={agencyAddress}
                // autoComplete="street-address"
                autoComplete="street-address"
                minLength={3}
                required
              />
              <Input
                label="Partita IVA"
                type="text"
                placeholder="02201090368"
                onChange={e => setVatCode(e.target.value)}
                disabled={disabled}
                value={vatCode}
                autoComplete="off"
                minLength={2}
                maxLength={32}
                required
              />
              <Input
                label="URL logo"
                showImg
                type="text"
                pattern="https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)"
                onChange={e => setLogoUrl(e.target.value)}
                disabled={disabled}
                value={logoUrl}
                placeholder="URL dell'immagine del logo aziendale"
                required
              />
              <Input
                label="URL banner"
                showImg
                type="text"
                pattern="https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)"
                onChange={e => setBannerUrl(e.target.value)}
                disabled={disabled}
                value={bannerUrl}
                placeholder="URL dell'immagine del banner aziendale"
                required
              />
              <div className="w-full col-span-full mb-4 md:mx-2">
                <InputDescription label="Descrizione" />
                <TextEditor
                  content={agencyDescription}
                  setContent={setAgencyDescription}
                  setText={setAgencyDescriptionText}
                />
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col items-center justify-center">
            <ReCAPTCHA
              sitekey="6LcPZrMfAAAAAGfknvhtuFNoBPinIM3snOr-Am5z"
              onChange={captchaChange}
            />

            <button
              type="submit"
              className="mt-3 text-2xl bg-blue-400 p-4 rounded hover:bg-blue-500 active:bg-blue-600 transition-colors text-white uppercase font-medium"
            >
              Invia richiesta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgencySignup;
