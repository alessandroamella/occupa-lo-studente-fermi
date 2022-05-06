import { Outlet, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import HomepageCarousel from "./HomepageCarousel";
import HomepageTest from "./HomepageTest";

function Homepage() {
  return (
    // <HomepageTest />
    <div>
      {/* <HomepageCarousel /> */}
      <div className="w-full h-screen flex flex-col justify-center items-center text-white">
        {/* <h1 className="text-9xl mb-20 font-medium text-center">
            Occupa lo studente
          </h1> */}
        <div className="flex flex-col md:flex-row justify-center md:justify-around w-full h-full">
          <div className="w-full h-full bg-[#F89A05] flex flex-col justify-center items-center">
            <img src="/img/student.svg" alt="Studenti" className="w-1/2" />
            <p className="text-3xl uppercase font-semibold mt-3">Studenti</p>
            <p className="px-4 mb-4 sm:px-8 md:px-16 lg:px-24 text-center">
              Sei uno studente del Fermi alla ricerca di un lavoro? Sfoglia le
              posizioni disponibili accedendo all'area studente.
            </p>
            <button className="bg-white p-3 rounded hover:bg-gray-200 active:bg-gray-300 transition-colors text-[#F89A05] uppercase font-medium">
              Area studenti
            </button>
          </div>
          <div className="w-full h-full bg-blue-400 flex flex-col justify-center items-center">
            <img src="/img/agency.svg" alt="Aziende" className="w-1/2" />
            <p className="text-3xl uppercase font-semibold mt-3">Aziende</p>
            <p className="px-4 mb-8 sm:px-8 md:px-16 lg:px-24 text-center">
              Sei un'azienda alla ricerca di studenti del Fermi da assumere?
              Registrati, pubblica le tue offerte di lavoro e visualizza gli
              studenti nell'area aziende.
            </p>
            <button className="bg-white p-3 rounded hover:bg-gray-200 active:bg-gray-300 transition-colors text-blue-400 uppercase font-medium">
              Area aziende
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 max-w-full">
        <Container className="py-8">
          <div className="w-full">
            <p>
              Sono la <span className="font-semibold">homepage</span>
            </p>
            <div className="mt-4">
              <Button as={Link} to="/student" variant="outline-success">
                Studente
              </Button>{" "}
              <Button as={Link} to="/agency" variant="outline-info">
                Azienda
              </Button>
            </div>
          </div>
          <Outlet />
        </Container>
      </div>
    </div>
  );
}

export default Homepage;
