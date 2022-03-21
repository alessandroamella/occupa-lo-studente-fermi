import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
// import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";

import reportWebVitals from "./reportWebVitals";

import MainBase from "./components/MainBase";
import MainHomepage from "./components/MainHomepage";

import StudentBase from "./components/student/StudentBase";
import StudentHome from "./components/student/StudentHome";
import StudentSignup from "./components/student/StudentSignup";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="" element={<MainBase />}>
            <Route path="" element={<MainHomepage />} />
            {/* eventually other routes not related to student or agency */}
          </Route>
          <Route path="student" element={<StudentBase />}>
            <Route path="" element={<StudentHome />} />
            <Route path="signup" element={<StudentSignup />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
