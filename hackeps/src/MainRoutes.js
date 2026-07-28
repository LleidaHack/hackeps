import { Route, Routes } from "react-router-dom";
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
import Verify from "src/pages/hackeps/Verify";
import Login from "src/pages/hackeps/Login";
import Entrances from "src/pages/hackeps/UsersEntrance.js";
import RequireAuth from "src/modules/RequireAuth";
import ResetPassword from "src/pages/hackeps/ResetPassword";
import PasswordForget from "src/pages/hackeps/ForgetPassword";
import LoginVerify from "src/pages/hackeps/LoginVerify";
import ConfirmAssistancePage from "src/pages/hackeps/Confirm";
import Hacking from "src/pages/hackeps/Hacking";
import ContacteMentor from "src/pages/hackeps/ContacteMentor";
import { refreshToken } from "src/services/AuthenticationService";
import { ROUTES } from "src/config/routes";

export default function MainRoutes() {
  useEffect(() => {
    const intervalId = setInterval(refreshToken, 1000 * 60 * 12);
    return () => clearInterval(intervalId);
  }, []);

  return (
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
  );
}
