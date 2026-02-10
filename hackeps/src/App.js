import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useEffect } from "react";
import Contacte from "src/pages/hackeps/Contacte";
import Error404 from "src/pages/hackeps/Error404";
import FAQPage from "src/pages/hackeps/FAQ";
import Home from "src/pages/hackeps/Home";
import Profile from "src/pages/hackeps/Profile.js";
import HackerForm from "src/pages/hackeps/HackerSignup";
import Terms from "src/pages/hackeps/Terms";
import Privacy from "src/pages/hackeps/Privacy";
import Inscripcio from "src/pages/hackeps/Inscripcio";
import Sponsors from "src/pages/hackeps/Sponsors";
import Verify from "./pages/hackeps/Verify";
import Login from "src/pages/hackeps/Login";
import Entrances from "src/pages/hackeps/UsersEntrance.js";
import RequireAuth from "src/modules/RequireAuth";
import ResetPassword from "./pages/hackeps/ResetPassword";
import PasswordForget from "./pages/hackeps/ForgetPassword";
import { refreshToken } from "./services/AuthenticationService";
import LoginVerify from "./pages/hackeps/LoginVerify";
import "src/styles/styles.css";
import ConfirmAssistancePage from "./pages/hackeps/Confirm";
import Hacking from "./pages/hackeps/Hacking";
import WaitingPage from "./pages/hackeps/WaitingPage";
import ContacteMentor from "./pages/hackeps/ContacteMentor";
import { ROUTES } from "src/config/routes";

export default function App() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(refreshToken, 1000 * 60 * 12);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="App overflow-x-hidden">
      <Router>
        {process.env.REACT_APP_LAUNCH_PENDING === "1" ? (
          <Routes>
            <Route path="*" element={<WaitingPage />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path={ROUTES.faq} element={<FAQPage />} />
            <Route path={ROUTES.contact} element={<Contacte />} />
            <Route path={ROUTES.contactMentor} element={<ContacteMentor />} />
            <Route path="/home" element={<Home />} />
            <Route
              path={ROUTES.profile}
              element={
                <RequireAuth originalRoute={ROUTES.profile}>
                  <Profile />
                </RequireAuth>
              }
            />
            <Route
              path={`${ROUTES.profile}/:hacker_id`}
              element={
                <RequireAuth originalRoute={ROUTES.profile}>
                  <Profile />
                </RequireAuth>
              }
            />
            <Route path={ROUTES.login} element={<Login />} />
            <Route path={ROUTES.validateEmail} element={<Verify />} />
            <Route path={ROUTES.confirmPassword} element={<ResetPassword />} />
            <Route path={ROUTES.hackerForm} element={<HackerForm />} />
            <Route path={ROUTES.entrance} element={<Entrances />} />
            <Route path={ROUTES.terms} element={<Terms />} />
            <Route path={ROUTES.privacy} element={<Privacy />} />
            <Route path={ROUTES.sponsors} element={<Sponsors defaultId={0} />} />
            <Route path={`${ROUTES.sponsors}/:ids`} element={<Sponsors />} />
            <Route
              path={ROUTES.inscription}
              element={
                <RequireAuth originalRoute={ROUTES.inscription}>
                  <Inscripcio />
                </RequireAuth>
              }
            />
            <Route path={ROUTES.forgotPassword} element={<PasswordForget />} />
            <Route path={ROUTES.userVerification} element={<LoginVerify />} />
            <Route path={ROUTES.assistance} element={<ConfirmAssistancePage />} />
            <Route path={ROUTES.hacking} element={<Hacking />} />
            <Route path="*" element={<Error404 />} />
          </Routes>
        )}
      </Router>
    </div>
  );
}
