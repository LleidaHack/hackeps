import { Route, Routes, useLocation } from "react-router-dom";
import React, { lazy, useEffect } from "react";
import Home from "src/pages/hackeps/Home";
import RequireAuth from "src/modules/RequireAuth";
import { refreshToken } from "src/services/AuthenticationService";
import { ROUTES } from "src/config/routes";

const Contacte = lazy(() => import("src/pages/hackeps/Contacte"));
const Error404 = lazy(() => import("src/pages/hackeps/Error404"));
const FAQPage = lazy(() => import("src/pages/hackeps/FAQ"));
const DatesPage = lazy(() => import("src/pages/hackeps/Dates"));
const Profile = lazy(() => import("src/pages/hackeps/Profile.js"));
const HackerForm = lazy(() => import("src/pages/hackeps/HackerSignup"));
const Terms = lazy(() => import("src/pages/hackeps/Terms"));
const Privacy = lazy(() => import("src/pages/hackeps/Privacy"));
const Inscripcio = lazy(() => import("src/pages/hackeps/Inscripcio"));
const Sponsors = lazy(() => import("src/pages/hackeps/Sponsors"));
const Verify = lazy(() => import("src/pages/hackeps/Verify"));
const Login = lazy(() => import("src/pages/hackeps/Login"));
const Entrances = lazy(() => import("src/pages/hackeps/UsersEntrance.js"));
const ResetPassword = lazy(() => import("src/pages/hackeps/ResetPassword"));
const PasswordForget = lazy(() => import("src/pages/hackeps/ForgetPassword"));
const LoginVerify = lazy(() => import("src/pages/hackeps/LoginVerify"));
const ConfirmAssistancePage = lazy(() => import("src/pages/hackeps/Confirm"));
const Hacking = lazy(() => import("src/pages/hackeps/Hacking"));
const ContacteMentor = lazy(() => import("src/pages/hackeps/ContacteMentor"));

export default function MainRoutes() {
  const { pathname } = useLocation();
  useEffect(() => {
    const intervalId = setInterval(refreshToken, 1000 * 60 * 12);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div key={[ROUTES.profile, `${ROUTES.profile}/esdeveniments`, `${ROUTES.profile}/equip`, `${ROUTES.profile}/dades`].includes(pathname) ? ROUTES.profile : pathname} className="route-page">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path={ROUTES.dates} element={<DatesPage />} />
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
        >
          <Route index />
          <Route path="esdeveniments" />
          <Route path="equip" />
          <Route path="dades" />
        </Route>
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
    </div>
  );
}
