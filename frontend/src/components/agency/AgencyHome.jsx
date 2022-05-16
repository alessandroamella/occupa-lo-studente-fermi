import React, { useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const selectAgency = state => state.agency;

const AgencyHome = () => {
  const navigate = useNavigate();
  const { isLoggingIn, agency } = useSelector(selectAgency);

  useEffect(() => {
    if (!isLoggingIn && agency) {
      navigate("dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agency, isLoggingIn]);

  return (
    <section className="text-center px-4">
      <div className="my-8 md:my-0 h-min-fit md:h-[75vh] grid grid-cols-1 md:grid-cols-2 items-center">
        <div className="mb-6 md:mb-0">
          <h1 className="text-6xl mx-auto font-bold uppercase mb-1 tracking-tighter">
            La tua <span className="text-purple-600">azienda</span>
          </h1>
          <p className="mx-auto w-fit md:w-3/4">
            Accendi alla dashboard facendo il login, oppure registra la tua
            azienda su Occupa lo Studente
            <br />
            <small className="text-gray-700">
              Un progetto di Alessandro Amella e Yaroslav Pavlik.
            </small>
          </p>

          <div className="mt-6 flex justify-center">
            <Link
              to="login"
              className="mr-1 bg-blue-400 p-3 rounded hover:bg-blue-500 active:bg-blue-600 transition-colors text-white uppercase font-medium"
            >
              Login
            </Link>
            <Link
              to="signup"
              className="ml-1 bg-purple-500 p-3 rounded hover:bg-purple-600 active:bg-purple-700 transition-colors text-white uppercase font-medium"
            >
              Registrazione
            </Link>
          </div>
        </div>

        <div className="hidden md:block">
          <img
            loading="lazy"
            src="/img/interview.svg"
            alt="Logo"
            className="max-w-xs mx-auto"
          />
        </div>
      </div>

      <Outlet />
    </section>
  );
};

export default AgencyHome;
