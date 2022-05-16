import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Placeholder from "react-bootstrap/Placeholder";
import RequireStudentLogin from "./RequireStudentLogin";
import { Envelope, Telephone } from "react-bootstrap-icons";

const selectStudent = state => state.student;

const StudentProfile = () => {
  const { student } = useSelector(selectStudent);

  console.log({ student });

  return (
    <RequireStudentLogin>
      <Container bg="dark" variant="dark" className="mt-12 mb-4">
        {/* <div className="px-4 flex justify-center flex-col md:flex-row">
          <img
            src={student.pictureUrl.replace("=s96-c", "=s1024-c")}
            loading="lazy"
            alt="Profile pic"
            className="w-44 rounded-full shadow-lg"
          />
          <div className="md:ml-12">
            <h1 className="text-5xl font-semibold uppercase mb-2 tracking-tighter">
              {student.firstName} {student.lastName}
            </h1>
            <p className="text-gray-700">
              Studente di{" "}
              <span className="font-medium">
                {student.fieldOfStudy === "it"
                  ? "informatica"
                  : student.fieldOfStudy === "electronics"
                  ? "elettronica"
                  : "chimica"}
              </span>
            </p>
          </div>
        </div> */}

        <div>
          <h1 className="text-5xl font-semibold uppercase mb-2 tracking-tighter">
            Il tuo profilo
          </h1>

          <div className="flex flex-col md:flex-row mt-8">
            {student ? (
              <img
                src={student.pictureUrl?.replace("=s96-c", "=s1024-c")}
                loading="lazy"
                alt="Profile pic"
                className="w-44 rounded-full shadow-lg"
              />
            ) : (
              <Placeholder as={"img"} animation="glow" />
            )}
            <div className="md:ml-12">
              {/* Nome e cognome */}
              <h1 className="mt-2 font-semibold tracking-tighter text-2xl">
                {student?.firstName || <Placeholder xs={7} />}{" "}
                {student?.lastName || <Placeholder xs={6} />}
              </h1>

              {/* Indirizzo di studio */}
              <p className="text-gray-700">
                {student?.fieldOfStudy ? (
                  <span>
                    Studente di{" "}
                    {student.fieldOfStudy === "it"
                      ? "informatica"
                      : student.fieldOfStudy === "electronics"
                      ? "elettronica"
                      : "chimica"}
                  </span>
                ) : (
                  <Placeholder xs={7} />
                )}
              </p>

              {/* Contatti */}
              <div className="flex items-center mt-3">
                <Envelope />{" "}
                <span className="ml-1">
                  {student?.email ? (
                    <a href={`mailto:${student.email}`}>{student.email}</a>
                  ) : (
                    <Placeholder xs={7} />
                  )}
                </span>
              </div>
              <div className="flex items-center mt-1">
                <Telephone />{" "}
                <span className="ml-1">
                  {student?.phoneNumber ? (
                    <a href={`tel:${student.phoneNumber}`}>
                      {student.phoneNumber}
                    </a>
                  ) : (
                    <Placeholder xs={7} />
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>{JSON.stringify(student, null, 4)}</div>

        <Outlet />
      </Container>
    </RequireStudentLogin>
  );
};

export default StudentProfile;
