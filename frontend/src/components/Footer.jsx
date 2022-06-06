import React from "react";
import {
  Briefcase,
  Envelope,
  GeoAlt,
  PcDisplay,
  Person,
  Telephone
} from "react-bootstrap-icons";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 max-w-full p-8 md:px-24 md:py-10 w-full flex flex-col items-center">
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
          <h3 className="tracking-tigher font-semibold text-lg">
            Mappa del sito
          </h3>
          <Link to="/student" className="flex items-center my-1">
            <Person />
            <span className="ml-1">Studenti</span>
          </Link>
          <Link to="/agency" className="flex items-center mb-1">
            <Briefcase />
            <span className="ml-1">Aziende</span>
          </Link>
          <Link to="/secretary" className="flex items-center">
            <PcDisplay />
            <span className="ml-1">Segreteria</span>
          </Link>
        </div>
        <div className="mb-4 md:mb-0">
          <h3 className="tracking-tigher font-semibold text-lg">Contatti</h3>
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
          <h3 className="mt-3 md:mt-5 tracking-tigher font-semibold text-lg">
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
        <div className="mb-4 md:mb-0">
          <h3 className="tracking-tigher font-semibold text-lg">
            Un sito di Alessandro Amella
          </h3>
          {/* <p className="text-xl font-semibold">Un sito di Alessandro Amella</p> */}
          <p className="font-light">In collaborazione con Yaroslav Pavlik</p>
          <p className="font-light">Seguito dalla prof. Marassi Lorena</p>
          <p className="font-light">Ideato dalla prof. Prandini Annamaria</p>
          <h3 className="mt-3 tracking-tigher font-semibold text-lg">
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
      <a
        href="https://www.fermi-mo.edu.it/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 w-full flex-justify-center text-gray-600 hover:text-black transition-colors font-light text-center"
      >
        &copy; 2022 Un progetto dell'ITIS Fermi di Modena
      </a>
    </footer>
  );
};

export default Footer;
