import React from "react";
import Container from "react-bootstrap/Container";

const MainNavbar = () => {
  return (
    // <header class="sticky top-0 z-50 w-full py-6 bg-gray-800">
    <header className="bg-[#f7f7f7] w-full py-6 text-gray-800">
      <Container className="flex justify-center text-center items-center">
        <img
          loading="lazy"
          alt=""
          src="/img/fermi_trimmed_black.png"
          className="d-inline-block w-14"
        />
        <span className="ml-3 hidden md:inline text-2xl md:text-3xl uppercase font-semibold tracking-tight	">
          Occupa lo studente
        </span>
      </Container>
    </header>
  );
};

export default MainNavbar;
