import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Placeholder from "react-bootstrap/Placeholder";
import axios from "axios";
import {
  EmojiFrown,
  Envelope,
  Link45deg,
  Telephone
} from "react-bootstrap-icons";
import { format } from "date-fns";
import RequireStudentLogin from "./RequireStudentLogin";
import JobApplicationCard from "./JobApplicationCard";
import JobApplicationModal from "./JobApplicationModal";
import TextEditor from "../textEditor";
import EditButton from "../EditButton";
import { setStudent } from "../../slices/studentAuthSlice";
import { setMessage } from "../../slices/alertSlice";

const selectStudent = state => state.student;

const StudentProfile = () => {
  const { student } = useSelector(selectStudent);
  const dispatch = useDispatch();

  const [currentJobApplication, setCurrentJobApplication] = useState(null);

  const [curriculum, setCurriculum] = useState(null);
  const [curriculumText, setCurriculumText] = useState(null);
  const [disabled, setDisabled] = useState(false);

  // Set curriculum on load
  useEffect(() => {
    if (!student) return;
    setCurriculum(
      student.curriculum || "Scrivi o incolla il tuo curriculum..."
    );
  }, [student]);

  /** @param {"hasDrivingLicense"|"canTravel"} field */
  async function editCheckbox(field) {
    if (!student) {
      return dispatch(
        setMessage({
          title: "Errore",
          text: "Studente non caricato"
        })
      );
    }

    console.log("setto", field, "a", !student[field]);
    await editStudent(field, !student[field]);
  }

  /** @param {"curriculum"|"hasDrivingLicense"|"canTravel"} field */
  async function editStudent(field, val) {
    if (field === "curriculum") {
      if (
        typeof curriculumText !== "string" ||
        curriculumText.length < 50 ||
        curriculumText.length > 5000
      ) {
        return dispatch(
          setMessage({
            title: "Errore nell'aggiornamento",
            text: "Il curriculum deve essere lungo da 50 a 1000 caratteri"
          })
        );
      }
    }

    setDisabled(true);
    try {
      const { data } = await axios.put("/api/student", { [field]: val });

      // Update student in state
      dispatch(setStudent(data));

      console.log(data);
      dispatch(
        setMessage({
          title: "Successo",
          color: "green",
          text: "Modifica avvenutua con successo!"
        })
      );
      setCurriculumText(null);
    } catch (err) {
      console.log(err);
      dispatch(
        setMessage({
          title: "Errore nell'aggiornamento",
          text: err?.response?.data?.err || "Errore sconosciuto"
        })
      );
    }
    setDisabled(false);
  }

  async function deleteJobApplication(_id) {
    await axios.delete("/api/student/jobapplication/" + _id);

    // Update student by re-fetching it
    const student = (await axios.get("/api/student")).data;
    dispatch(setStudent(student));
  }

  return (
    <RequireStudentLogin>
      <JobApplicationModal
        student={student}
        show={currentJobApplication}
        setShow={setCurrentJobApplication}
        deleteFn={currentJobApplication ? deleteJobApplication : null}
        readOnly
      />
      <Container bg="dark" variant="dark" className="mt-12 mb-4">
        <div>
          <h1 className="text-5xl font-semibold  mb-2 tracking-tighter">
            {student ? `Ciao, ${student.firstName}!` : "Il tuo profilo"}{" "}
          </h1>

          <div className="flex justify-center flex-col md:flex-row mt-8">
            {student ? (
              <img
                src={student?.pictureUrl?.replace("=s96-c", "=s1024-c")}
                loading="lazy"
                alt="Profile pic"
                className="w-44 rounded-full aspect-square shadow-lg"
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

          <div>
            <h2 className="text-3xl mt-5 mb-3 font-semibold tracking-tighter">
              I tuoi dati
            </h2>

            <div className="text-gray-700 w-full md:px-5">
              <div className="mb-3 grid grid-cols-2">
                <p>Nome</p>
                <p>{student?.firstName}</p>
              </div>

              <div className="mb-3 grid grid-cols-2">
                <p>Cognome</p>
                <p>{student?.lastName}</p>
              </div>

              <div className="mb-3 grid grid-cols-2">
                <p>Codice fiscale</p>
                <p>{student?.fiscalNumber}</p>
              </div>

              <div className="mb-3 grid grid-cols-2">
                <p>Spostamenti</p>
                <div>
                  <p className="flex items-center">
                    <input
                      disabled={disabled}
                      className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                      type="checkbox"
                      id="patente"
                      checked={student?.hasDrivingLicense}
                      onChange={() => editCheckbox("hasDrivingLicense")}
                    />
                    <label
                      className="form-check-label inline-block text-gray-800"
                      htmlFor="patente"
                    >
                      patente
                    </label>
                  </p>
                  <p className="flex items-center">
                    <input
                      disabled={disabled}
                      className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                      type="checkbox"
                      id="viaggiare"
                      checked={student?.canTravel}
                      onChange={() => editCheckbox("canTravel")}
                    />
                    <label
                      className="form-check-label inline-block text-gray-800"
                      htmlFor="viaggiare"
                    >
                      viaggiare in autonomia
                    </label>
                  </p>
                </div>
              </div>

              <div className="mb-3 grid grid-cols-2">
                <p>Data di iscrizione</p>
                <p>
                  {student?.createdAt &&
                    format(new Date(student.createdAt), "dd/MM/yyyy")}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl mt-10 mb-3 font-semibold tracking-tighter">
              Il tuo curriculum
            </h2>

            {typeof curriculum === "string" ? (
              <>
                <TextEditor
                  readOnly={disabled}
                  content={curriculum}
                  setContent={setCurriculum}
                  setText={setCurriculumText}
                />

                <EditButton
                  disabled={disabled || !curriculumText}
                  purple
                  showText
                  className="mt-3"
                  onClick={() => editStudent("curriculum", curriculum)}
                  text="Modifica curriculum"
                />
              </>
            ) : (
              <Placeholder xs={12} animation="glow" />
            )}
          </div>

          <div>
            <h2 className="mt-10 text-3xl mb-3 font-semibold tracking-tighter">
              Le tue candidature
            </h2>

            <div className="text-gray-700 w-full md:px-5">
              {!student?.jobApplications.length && (
                <div className="flex items-center">
                  <span className="mr-1">Nessuna candidatura</span>{" "}
                  <EmojiFrown />
                  <span className="ml-2 flex items-center">
                    Puoi candidarti da qualche parte sfogliando le{" "}
                    <Link
                      className="ml-1 flex items-center underline decoration-dotted"
                      to="/student"
                    >
                      <Link45deg /> offerte di lavoro
                    </Link>
                    .
                  </span>
                </div>
              )}
              <div className="flex flex-col-reverse">
                {student?.jobApplications.map(j => (
                  <JobApplicationCard
                    key={j._id}
                    jobApplication={j}
                    setCurrentJobApplication={setCurrentJobApplication}
                    clickable
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <Outlet />
      </Container>
    </RequireStudentLogin>
  );
};

export default StudentProfile;
