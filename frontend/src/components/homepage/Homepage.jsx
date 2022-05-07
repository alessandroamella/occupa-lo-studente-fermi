import { Outlet, Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import HomepageCarousel from "./HomepageCarousel";
import HomepageTest from "./HomepageTest";

function Homepage() {
  return (
    // <HomepageTest />
    <div>
      <section className="text-center">
        <div className="h-min-fit h-[75vh] grid grid-cols-1 md:grid-cols-2 items-center">
          <div>
            <h1 className="text-5xl mx-auto font-semibold uppercase mb-2 tracking-tighter">
              Occupa lo <span className="text-purple-600">studente</span>
            </h1>
            <p className="mx-auto text-left w-fit">
              Una piattaforma per connettere{" "}
              {/* <span className="text-purple-500">studenti</span> e{" "}
            <span className="text-purple-500">aziende</span>. */}
              studenti dell'ITIS Fermi e aziende.
              <br />
              <small className="text-gray-700 text-left">
                Un progetto di Alessandro Amella e Yaroslav Pavlik.
              </small>
            </p>
          </div>

          <div>
            {/* <img
            src="/img/fermi_trimmed_color.png"
            alt="Logo"
            className="max-w-xs mx-auto"
          /> */}
            <img
              src="/img/employer.svg"
              alt="Logo"
              className="max-w-xs mx-auto"
            />
          </div>
        </div>
      </section>

      <div className="relative w-full">
        <div className="absolute bottom-16 z-50 right-0 left-0 h-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#fff"
              fill-opacity="1"
              d="M0,192L60,186.7C120,181,240,171,360,186.7C480,203,600,245,720,240C840,235,960,181,1080,165.3C1200,149,1320,171,1380,181.3L1440,192L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* <HomepageCarousel /> */}
      <section className="w-full h-[110vh] flex flex-col justify-center items-center text-white">
        {/* <h1 className="text-9xl mb-20 font-medium text-center">
            Occupa lo studente
          </h1> */}
        <div className="flex flex-col md:flex-row justify-center md:justify-around w-full h-full">
          <div className="w-full pt-20 h-full bg-[#F89A05] flex flex-col justify-center items-center">
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
          <div className="w-full pt-24 h-full bg-blue-400 flex flex-col justify-center items-center">
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
      </section>

      <section className="bg-gray-100 max-w-full">
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
      </section>
    </div>
  );
}

export default Homepage;
