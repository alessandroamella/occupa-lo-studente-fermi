import React from "react";
import { Envelope, GeoAlt, Telephone } from "react-bootstrap-icons";

const Footer = () => {
  return (
    <footer className="bg-gray-100 max-w-full p-8 md:px-24 md:py-12 w-full flex flex-col items-center">
      <div className="flex justify-center items-center w-full">
        <img
          loading="lazy"
          alt=""
          src="/img/fermi_trimmed_black.png"
          className="d-inline-block w-14"
        />
        <p className="ml-3 text-2xl md:text-3xl uppercase font-semibold tracking-tight">
          Occupa lo studente
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 w-full">
        <div className="mb-4 md:mb-0">
          <h3 className="mb-1 tracking-tigher font-semibold text-lg">
            Segreteria
          </h3>
          <div className="flex items-center">
            <Telephone />{" "}
            <a
              rel="noopener noreferrer"
              href="tel:+059211092"
              className="ml-1 mr-3"
            >
              059211092
            </a>
          </div>
          <div className="flex items-center">
            <Envelope />{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="mailto:motf080005@istruzione.it"
              className="ml-1"
            >
              motf080005@istruzione.it
            </a>
          </div>
        </div>

        <div className="mb-4 md:mb-0">
          <h3 className="tracking-tigher font-semibold text-lg">
            Vienici a trovare
          </h3>
          <div className="flex items-center">
            <GeoAlt />{" "}
            <a
              className="ml-1"
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.google.com/maps/search/?api=1&query=I.T.I.S. E. Fermi Modena"
            >
              Via G. Luosi, 23, 41124 Modena MO
            </a>
          </div>
        </div>

        <div>
          <h3 className="tracking-tigher font-semibold text-lg">
            Supporto tecnico
          </h3>
          <div className="flex items-center">
            <Envelope />{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="mailto:alessandro.amella@live.it"
              className="ml-1"
            >
              alessandro.amella@live.it
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
