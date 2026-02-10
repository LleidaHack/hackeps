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
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contacte" element={<Contacte />} />
            <Route path="/contacte-mentor" element={<ContacteMentor />} />
            <Route path="/home" element={<Home />} />
            <Route
              path="/perfil"
              element={
                <RequireAuth originalRoute="/perfil">
                  <Profile />
                </RequireAuth>
              }
            />
            <Route
              path="/perfil/:hacker_id"
              element={
                <RequireAuth originalRoute="/perfil">
                  <Profile />
                </RequireAuth>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/validate-email/" element={<Verify />} />
            <Route path="/confirm-password" element={<ResetPassword />} />
            <Route path="/hacker-form" element={<HackerForm />} />
            <Route path="/entrance" element={<Entrances />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/sponsors" element={<Sponsors defaultId={0} />} />
            <Route path="/sponsors/:ids" element={<Sponsors />} />
            <Route
              path="/inscripcio"
              element={
                <RequireAuth originalRoute="/inscripcio">
                  <Inscripcio />
                </RequireAuth>
              }
            />
            <Route path="/forgot-password" element={<PasswordForget />} />
            <Route path="/user-verification" element={<LoginVerify />} />
            <Route path="/assistance" element={<ConfirmAssistancePage />} />
            <Route path="/hacking" element={<Hacking />} />
            <Route path="*" element={<Error404 />} />
          </Routes>
        )}
      </Router>
    </div>
  );
}
