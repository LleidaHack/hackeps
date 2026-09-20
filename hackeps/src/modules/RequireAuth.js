import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { checkToken } from "src/services/AuthenticationService";
import { isToken } from "src/modules/session";
import DarkPage from "src/components/hackeps/Layout/DarkPage.js";
import LoadSection from "src/components/hackeps/LoadSection/Loadsection";

export default function RequireAuth({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("userToken");
  const [status, setStatus] = useState({ token: null, authorized: false });
  useEffect(() => {
    let cancelled = false;
    if (isToken(token)) {
      checkToken()
        .then((result) => {
          if (!cancelled)
            setStatus({ token, authorized: result?.success === true });
        })
        .catch(() => {
          if (!cancelled) setStatus({ token, authorized: false });
        });
    }
    return () => {
      cancelled = true;
    };
  }, [token]);
  if (!isToken(token))
    return (
      <Navigate
        to="/login"
        replace
        state={{ nextScreen: location.pathname + location.search }}
      />
    );
  if (status.token !== token)
    return (
      <DarkPage>
        <LoadSection />
      </DarkPage>
    );
  return status.authorized ? (
    children
  ) : (
    <Navigate
      to="/login"
      replace
      state={{ nextScreen: location.pathname + location.search }}
    />
  );
}
