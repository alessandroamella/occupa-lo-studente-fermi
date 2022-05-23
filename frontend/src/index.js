import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";

import ReactGA from "react-ga4";

import "./index.css";
// import "bootstrap/dist/css/bootstrap.min.css";
import "material-icons/iconfont/material-icons.css";

import App from "./App";

import reportWebVitals from "./reportWebVitals";

import store from "./app/store";

import HomepageBase from "./components/homepage/HomepageBase";
import Homepage from "./components/homepage/Homepage";

import StudentBase from "./components/student/StudentBase";
import StudentHome from "./components/student/StudentHome";
import StudentLogin from "./components/student/StudentLogin";
import StudentSignup from "./components/student/StudentSignup";
import SecretaryBase from "./components/secretary/SecretaryBase";
import SecretaryHomepage from "./components/secretary/SecretaryHomepage";
import AgencyBase from "./components/agency/AgencyBase";
import AgencyHome from "./components/agency/AgencyHome";
import AgencySignup from "./components/agency/AgencySignup";
import AgencyLogin from "./components/agency/AgencyLogin";
import AgencyDashboard from "./components/agency/AgencyDashboard";
import StudentProfile from "./components/student/StudentProfile";
import EditJobOffer from "./components/agency/EditJobOffer";
import Base from "./components/Base";
import ViewAgencyJobOffer from "./components/student/ViewAgencyJobOffer";

ReactGA.initialize("G-LT3ETY1REP");
ReactGA.send("pageview");

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Base />}>
            <Route path="/" element={<App />}>
              <Route path="" element={<HomepageBase />}>
                <Route path="" element={<Homepage />} />
                {/* eventually other routes not related to student or agency */}
              </Route>
              <Route path="secretary" element={<SecretaryBase />}>
                <Route path="" element={<SecretaryHomepage />} />
              </Route>
              <Route path="student" element={<StudentBase />}>
                <Route path="" element={<StudentHome />} />
                <Route path="signup" element={<StudentSignup />} />
                <Route path="login" element={<StudentLogin />} />
                <Route path="profile" element={<StudentProfile />} />
                <Route path="agency/:id" element={<ViewAgencyJobOffer />} />
              </Route>
              <Route path="agency" element={<AgencyBase />}>
                <Route path="" element={<AgencyHome />} />
                <Route path="signup" element={<AgencySignup />} />
                <Route path="login" element={<AgencyLogin />} />
                <Route path="dashboard" element={<AgencyDashboard />} />
                <Route path="joboffer" element={<EditJobOffer />}></Route>
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
