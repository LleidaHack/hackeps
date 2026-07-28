import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { Suspense, lazy, useEffect } from "react";
import WaitingPage from "src/pages/hackeps/WaitingPage";
import "src/styles/styles.css";
import { ROUTES } from "src/config/routes";

// Evaluated at build time (webpack inlines process.env), so the branch that is
// not used gets dropped from the bundle entirely.
const LAUNCH_PENDING = process.env.REACT_APP_LAUNCH_PENDING === "1";

// Everything except the waiting page lives in separate chunks: while the launch
// is pending the browser only downloads the (tiny) waiting page code.
const MainRoutes = lazy(() => import("src/MainRoutes"));
const Terms = lazy(() => import("src/pages/hackeps/Terms"));
const Privacy = lazy(() => import("src/pages/hackeps/Privacy"));

export default function App() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="App overflow-x-hidden">
      <Router>
        {LAUNCH_PENDING ? (
          <Routes>
            <Route path="/" element={<WaitingPage />} />
            <Route
              path={ROUTES.terms}
              element={
                <Suspense fallback={null}>
                  <Terms />
                </Suspense>
              }
            />
            <Route
              path={ROUTES.privacy}
              element={
                <Suspense fallback={null}>
                  <Privacy />
                </Suspense>
              }
            />
          </Routes>
        ) : (
          <Suspense fallback={null}>
            <MainRoutes />
          </Suspense>
        )}
      </Router>
    </div>
  );
}
