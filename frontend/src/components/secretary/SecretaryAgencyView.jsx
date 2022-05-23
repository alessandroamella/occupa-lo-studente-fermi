import React from "react";
import JobOfferCard from "../agency/JobOfferCard";
import TextEditor from "../textEditor";

const SecretaryAgencyView = ({ agency, children }) => {
  return (
    <>
      <p className="font-medium text-lg">Nome azienda</p>
      <p className="mb-2">{agency.agencyName}</p>

      {agency.logoUrl && (
        <>
          <p className="font-medium text-lg">Logo</p>
          <img
            loading="lazy"
            className="max-w-full max-h-48 mb-2"
            alt="Agency logo"
            src={agency.logoUrl}
          />
        </>
      )}

      <p className="font-medium text-lg">Descrizione</p>
      <div className="mb-2">
        {<TextEditor content={agency.agencyDescription} readOnly />}
      </div>

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

      {agency.approvalStatus !== "waiting" && (
        <div>
          {/* jobOffers.length */}
          <p className="font-medium text-lg">Offerte di lavoro</p>
          {agency.jobOffers.length === 0 ? (
            <p>Nessun'offerta di lavoro</p>
          ) : (
            agency.jobOffers.map(j => <JobOfferCard key={j._id} jobOffer={j} />)
          )}
        </div>
      )}

      {children}
    </>
  );
};

export default SecretaryAgencyView;
