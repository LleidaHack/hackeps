import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { verify } from "src/services/AuthenticationService";
import DarkPage from "src/components/hackeps/Layout/DarkPage";
import "src/components/hackeps/LoginUnverified/Verification.css";

// Share an in-flight request across StrictMode's effect replay.
const requests = new Map();
export default function Verify() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState("pending");
  useEffect(() => {
    let active = true;
    if (!token) { setStatus("error"); return; }
    if (!requests.has(token)) requests.set(token, verify(token));
    requests.get(token).then(result => {
      if (result?.success === true) {
        try { localStorage.setItem("hackeps-email-verified", String(Date.now())); } catch { /* Polling remains available when storage is blocked. */ }
      }
      if (active) setStatus(result?.success === true ? "success" : "error");
    }).catch(() => { if (active) setStatus("error"); });
    return () => { active = false; };
  }, [token]);
  return <DarkPage><section className="verification-panel">
    <span className="verification-icon" aria-hidden="true">{status === "success" ? "✓" : "✉"}</span>
    <h1>{status === "pending" ? "Verificant el correu…" : status === "success" ? "Correu verificat!" : "No hem pogut verificar el correu"}</h1>
    <p role="status">{status === "success" ? "Torna a la pestanya on has creat el compte: la sessió s'iniciarà automàticament. Si l'has tancada, pots iniciar sessió aquí." : status === "error" ? "L'enllaç no és vàlid o ha caducat. Torna a iniciar sessió per demanar un altre correu." : "Un moment, estem comprovant l'enllaç."}</p>
    {status !== "pending" && <Link to="/login">Inicia sessió</Link>}
  </section></DarkPage>;
}
