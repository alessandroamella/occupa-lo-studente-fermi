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
              Una piattaforma per connettere studenti dell'ITIS Fermi e aziende.
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
          {/* <svg
            className="absolute z-40 top-0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
          >
            <path
              fill="#9333ea"
              fill-opacity="1"
              d="M0,224L80,186.7C160,149,320,75,480,85.3C640,96,800,192,960,213.3C1120,235,1280,181,1360,154.7L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
            ></path>
          </svg> */}
          <svg
            className="absolute top-5 z-30"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
          >
            <path
              fill="#fff"
              fill-opacity="1"
              d="M0,96L80,117.3C160,139,320,181,480,186.7C640,192,800,160,960,154.7C1120,149,1280,171,1360,181.3L1440,192L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
            ></path>
          </svg>
          {/* <svg
            className="absolute z-30"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
          >
            <path
              fill="#fff"
              fill-opacity="1"
              d="M0,192L60,186.7C120,181,240,171,360,186.7C480,203,600,245,720,240C840,235,960,181,1080,165.3C1200,149,1320,171,1380,181.3L1440,192L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
            ></path>
          </svg> */}
        </div>
      </div>

      {/* <HomepageCarousel /> */}
      <section className="z-50 w-full h-[110vh] flex flex-col justify-center items-center text-white">
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

      <section className="h-screen grid grid-cols-1 md:grid-cols-2 justify-center items-center">
        <div className="flex justify-center">
          <iframe
            width="600"
            title="ITIS Fermi su Google Maps"
            className="border-8 border-orange-400"
            height="450"
            loading="lazy"
            allowfullscreen
            src="https://www.google.com/maps/embed/v1/streetview?location=44.64349024228466%2C10.91493  &heading=180&key=AIzaSyAUkmkBUkJjxHWHnCVLHw4GOTW9HcCLx-8"
            // src="https://www.google.com/maps/embed/v1/streetview?location=44.6432%2C10.9153&heading=180&key=AIzaSyAUkmkBUkJjxHWHnCVLHw4GOTW9HcCLx-8"
          ></iframe>
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
