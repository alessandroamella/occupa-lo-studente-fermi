import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
// import HomepageCarousel from "./HomepageCarousel";
// import HomepageTest from "./HomepageTest";
import { Envelope, Telephone } from "react-bootstrap-icons";

function getWindowSize() {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

function Homepage() {
  const studentAreaRef = useRef(null);
  const agencyAreaRef = useRef(null);
  const [windowSize] = useState(getWindowSize());
  const navigate = useNavigate();

  function scroll(element) {
    // const offset = -50;
    const offset = windowSize.width >= 768 ? -50 : 50;
    const position = element.getBoundingClientRect().top;
    const offsetPosition = position + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }

  return (
    <div>
      <section className="text-center px-4">
        <div className="my-8 md:my-0 h-min-fit md:h-[75vh] grid grid-cols-1 md:grid-cols-2 items-center">
          <div className="mb-6 md:mb-0">
            <h1 className="text-6xl mx-auto font-bold uppercase mb-4 tracking-tighter">
              Occupa lo <span className="text-purple-600">studente</span>
            </h1>
            <p className="mx-auto w-fit">
              Una piattaforma per connettere studenti dell'ITIS Fermi e aziende.
              <br />
              <small className="text-gray-700">
                Un progetto di Alessandro Amella e Yaroslav Pavlik.
              </small>
            </p>

            <div className="mt-6 flex justify-center">
              <button
                onClick={() => scroll(studentAreaRef.current)}
                className="mr-1 bg-[#F89A05] p-3 rounded hover:bg-[#e68f05] active:bg-[#c87d04] transition-colors text-white uppercase font-medium"
              >
                Trova lavoro
              </button>
              <button
                onClick={() => scroll(agencyAreaRef.current)}
                className="ml-1 bg-blue-400 p-3 rounded hover:bg-blue-500 active:bg-blue-600 transition-colors text-white uppercase font-medium"
              >
                Registra la tua azienda
              </button>
            </div>
          </div>

          <div className="hidden md:block">
            {/* <img
            src="/img/fermi_trimmed_color.png"
            alt="Logo"
            className="max-w-xs mx-auto"
          /> */}
            <img
              loading="lazy"
              src="/img/employer.svg"
              alt="Logo"
              className="max-w-xs mx-auto"
            />
          </div>
        </div>
      </section>

      <div className="relative w-full">
        <div className="absolute bottom-8 md:bottom-16 z-40 right-0 left-0 h-10">
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
              fillOpacity={1}
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
      <section className="z-40 w-full md:h-[110vh] flex flex-col justify-center items-center text-white">
        {/* <h1 className="text-9xl mb-20 font-medium text-center">
            Occupa lo studente
          </h1> */}
        <div className="flex flex-col md:flex-row justify-center md:justify-around w-full h-full">
          <div
            ref={studentAreaRef}
            className="pb-6 md:pb-0 w-full pt-10 md:pt-20 h-full bg-[#F89A05] flex flex-col justify-center items-center"
          >
            <img
              loading="lazy"
              src="/img/student.svg"
              alt="Studenti"
              className="w-1/2"
            />
            <p className="text-3xl uppercase font-semibold mt-3">Studenti</p>
            <p className="px-4 mb-4 sm:px-8 md:px-16 text-center">
              Sei uno studente del Fermi alla ricerca di un lavoro? Sfoglia le
              posizioni disponibili accedendo all'area studente.
            </p>
            <button
              onClick={() => navigate("/student")}
              className="bg-white p-3 rounded hover:bg-gray-200 active:bg-gray-300 transition-colors text-[#F89A05] uppercase font-medium"
            >
              Area studenti
            </button>
          </div>
          <div
            ref={agencyAreaRef}
            className="pb-6 md:pb-0 w-full pt-10 md:pt-24 h-full bg-blue-400 flex flex-col justify-center items-center"
          >
            <img
              loading="lazy"
              src="/img/agency.svg"
              alt="Aziende"
              className="w-1/2"
            />
            <p className="text-3xl uppercase font-semibold mt-3">Aziende</p>
            <p className="px-4 mb-8 sm:px-8 md:px-16 text-center">
              Sei un'azienda alla ricerca di studenti del Fermi da assumere?
              Registrati, pubblica le tue offerte di lavoro e visualizza gli
              studenti nell'area aziende.
            </p>
            <button
              onClick={() => navigate("/agency")}
              className="bg-white p-3 rounded hover:bg-gray-200 active:bg-gray-300 transition-colors text-blue-400 uppercase font-medium"
            >
              Area aziende
            </button>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-8 min-h-screen justify-center items-center py-12 md:pb-20 md:py-16">
        <div className="bg-purple-500 text-white w-fit mx-auto py-4 px-8 flex justify-center items-center mb-16">
          <h1 className="text-5xl text-center mx-auto font-semibold uppercase tracking-tighter">
            Il progetto
          </h1>
        </div>
        <div className="px-4 mb-12 md:mb-16 grid grid-cols-1 md:grid-cols-2">
          <div className="flex justify-center">
            <img
              src="/img/project.svg"
              loading="lazy"
              alt="Project"
              className="max-w-xs mx-auto"
            />
          </div>
          <div className="mt-8 md:pt-0">
            <h2 className="text-3xl font-semibold uppercase tracking-tighter">
              Come funziona
            </h2>
            <p className="mt-2">
              <strong>Occupa lo studente</strong> è una piattaforma che collega
              studenti e aziende.
            </p>
            <p className="mt-2">
              Le aziende possono iscriversi e pubblicare le proprie offerte di
              lavoro agli studenti, i quali potranno visualizzarle ed
              eventualmente candidarsi (esternamente).
            </p>
            <p className="mt-2">
              L'iscrizione è <strong>gratuita</strong> sia per gli studenti che
              per le aziende.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="px-4 mt-6 md:pt-0">
            <h2 className="mb-2 text-3xl font-semibold uppercase tracking-tighter">
              ITIS <span className="text-purple-600">Fermi</span> di Modena
            </h2>
            <p>
              Istituto tecnico tecnologico con specializzazione in informatica
              (telecomunicazioni), elettronica e chimica.
            </p>
            <p className="mt-2">
              Attorno alla metà di gennaio, l'attività didattica di laboratorio
              di sistemi e telecomunicazioni delle classi quinte si trasforma
              puntando alla preparazione dell'esame di maturità.
            </p>
            <p className="mt-2"></p>Gli studenti hanno già buoni strumenti
            tecnologici acquisiti nel percorso scolastico ormai quasi al termine
            e, spesso, sono motivati e pronti nell'offrire le loro competenze
            professionali ad interlocutori esterni all'istituto che li caricano
            di responsabilità ma anche di opportunità per crescere sviluppando
            progetti di spessore.
            <p className="mt-2">
              Questa attività è chiamata{" "}
              <a href="https://ssh.edu.it/" target="_blank" rel="noreferrer">
                "Students Software House" o SSH
              </a>
              , e questo sito è il progetto di Alessandro Amella e Yaroslav
              Pavlik della 5ªF (A.S. 2021-2022).
            </p>
            <div className="w-full border-b h-2 my-8"></div>
            <h3 className="mb-1 text-xl font-semibold uppercase tracking-tighter">
              Contatti
            </h3>
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <Telephone />{" "}
                <a
                  rel="noopener noreferrer"
                  href="tel:+059211092"
                  className="ml-1 mr-3"
                >
                  059211092
                </a>
                <Envelope />{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="mailto:motf080005@istruzione.it"
                  className="mx-1"
                >
                  motf080005@istruzione.it
                </a>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <iframe
              width="600"
              title="ITIS Fermi su Google Maps"
              className="border-8 border-orange-400 shadow-lg"
              height="450"
              loading="lazy"
              allowFullScreen
              src="https://www.google.com/maps/embed/v1/streetview?location=44.64349024228466%2C10.91493  &heading=180&key=AIzaSyAUkmkBUkJjxHWHnCVLHw4GOTW9HcCLx-8"
              // src="https://www.google.com/maps/embed/v1/streetview?location=44.6432%2C10.9153&heading=180&key=AIzaSyAUkmkBUkJjxHWHnCVLHw4GOTW9HcCLx-8"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Homepage;
