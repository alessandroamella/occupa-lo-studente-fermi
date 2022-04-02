import React from "react";

const SecretaryAgencyView = ({ agency, children }) => {
  return (
    <>
      <p className="font-medium text-lg">Nome azienda</p>
      <p className="mb-2">{agency.agencyName}</p>

      {agency.logoUrl && (
        <>
          <p className="font-medium text-lg">Logo</p>
          <img
            className="max-w-full max-h-48 mb-2"
            alt="Agency logo"
            src={agency.logoUrl}
          />
        </>
      )}

      <p className="font-medium text-lg">Descrizione</p>
      <p className="mb-2">{agency.agencyDescription}</p>

      <p className="font-medium text-lg">Indirizzo</p>
      <p className="mb-2">{agency.agencyAddress}</p>

      <p className="font-medium text-lg">Sito web</p>
      <p className="mb-2">
        <a href={agency.websiteUrl} target="_blank" rel="noreferrer">
          {agency.websiteUrl}
        </a>
      </p>

      <p className="font-medium text-lg">Responsabile</p>
      <p className="mb-2">
        <span className="font-light">Nome: </span>
        {agency.responsibleFirstName}
        <br />
        <span className="font-light">Cognome: </span>
        {agency.responsibleLastName}
        <br />
        <span className="font-light">Codice fiscale: </span>
        {agency.responsibleFiscalNumber}
      </p>

      <p className="font-medium text-lg">Contatti</p>
      <p className="mb-2">
        <span className="font-light">Email: </span>
        <a href={`mailto:${agency.email}`}>{agency.email}</a>
        <br />
        <span className="font-light">Numero di telefono: </span>
        <a href={`tel:${agency.phoneNumber}`}>{agency.phoneNumber}</a>
      </p>

      <p className="font-medium text-lg">Partita IVA</p>
      <p className="mb-2">{agency.vatCode}</p>

      {children}
    </>
  );
};

export default SecretaryAgencyView;
