import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, me, resendVerification } from "src/services/AuthenticationService";
import { hasSessionCredentials } from "src/modules/session";
import "./Verification.css";

export default function LoginUnverified({ email, credentials, nextScreen = "/perfil" }) {
  const navigate = useNavigate();
  const [cooldown, setCooldown] = useState(30);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const credentialsRef = useRef(credentials);
  credentialsRef.current = credentials;

  useEffect(() => {
    const timer = setInterval(() => setCooldown(value => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let disposed = false;
    let pending = false;
    let lastCheck = 0;
    async function check(force = false) {
      if (!credentialsRef.current || pending || document.hidden || Date.now() - lastCheck < (force === true ? 3000 : 120000)) return;
      pending = true;
      lastCheck = Date.now();
      try {
        // Reuse the session created by the verification tab instead of rotating it.
        if (localStorage.getItem("userToken")) {
          const account = await me();
          if (account?.email?.toLowerCase() === email?.toLowerCase()) {
            if (!disposed) navigate(nextScreen, { replace: true });
            return;
          }
        }
        const result = await login(credentialsRef.current);
        if (!disposed && hasSessionCredentials(result)) {
          navigate(nextScreen, { replace: true });
        }
      } catch {
        if (!disposed) setMessage("No hi ha connexió. Tornarem a comprovar la verificació automàticament.");
      } finally { pending = false; }
    }
    const timer = setInterval(check, 120000);
    const onVerification = event => { if (event.key === "hackeps-email-verified") check(true); };
    window.addEventListener("storage", onVerification);
    window.addEventListener("focus", check);
    return () => {
      disposed = true;
      clearInterval(timer);
      window.removeEventListener("storage", onVerification);
      window.removeEventListener("focus", check);
    };
  }, [navigate, nextScreen, email]);

  async function resend() {
    if (sending || cooldown || !email) return;
    setSending(true);
    try {
      const result = await resendVerification(email);
      setMessage(result?.success ? "T'hem enviat un altre correu. Revisa també la carpeta de correu brossa." : "No hem pogut reenviar el correu. Torna-ho a provar d'aquí a uns instants.");
      setCooldown(30);
    } catch { setMessage("No hem pogut reenviar el correu. Torna-ho a provar.");
    } finally { setSending(false); }
  }

  return <section className="verification-panel">
    <span className="verification-icon" aria-hidden="true">✉</span>
    <h1>Revisa el teu correu</h1>
    <p>El teu compte està creat. Obre l'enllaç de verificació que t'hem enviat{email ? <> a <strong>{email}</strong></> : " al correu"}.</p>
    {credentials ? <p className="verification-status" role="status">Esperant la verificació…<br />En verificar el correu, entraràs automàticament al teu perfil.</p> : <p>Un cop verificat el correu, ja podràs iniciar sessió.</p>}
    <p className="verification-hint">No el trobes? Revisa la carpeta de correu brossa.</p>
    {email && <button className="verification-button" onClick={resend} disabled={sending || cooldown > 0}>{sending ? "Enviant…" : cooldown ? `Reenvia el correu (${cooldown} s)` : "Reenvia el correu"}</button>}
    <p role="status">{message}</p>
    <Link to="/login">Torna a iniciar sessió</Link>
  </section>;
}
