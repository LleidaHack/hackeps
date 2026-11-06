import { useEffect, useState } from "react";
import { operationRequest } from "../Operations/api";

const statuses = { pending: "Pendent d’aprovació", approved: "Aprovat", rejected: "Rebutjat", corrected: "Corregit per organització", superseded: "Substituït per organització" };
export default function NicknameRequest({ onApproved }) {
  const [data, setData] = useState(null), [nickname, setNickname] = useState("");
  const [error, setError] = useState(""), [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    const load = () => operationRequest("/nicknames/me").then(value => {
      if (active) { setData(value); onApproved?.(value.nickname); }
    }).catch(() => { if (active) setError("No s’han pogut carregar les sol·licituds."); });
    load(); const timer = setInterval(load, 10000);
    return () => { active = false; clearInterval(timer); };
  }, [onApproved]);
  const pending = data?.requests?.some(item => item.status === "pending");
  return <form className="profile-editor" onSubmit={async event => {
    event.preventDefault(); setBusy(true); setError("");
    try {
      await operationRequest("/nicknames/me", "POST", { nickname });
      setData(await operationRequest("/nicknames/me")); setNickname("");
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }}>
    <fieldset disabled={busy || pending || !data}>
      <legend>Nom d’usuari</legend>
      <p>Nom actual: <strong>{data?.nickname || "…"}</strong></p>
      <label>Nou nom<input value={nickname} onChange={e => setNickname(e.target.value)} required minLength={2} maxLength={40} /></label>
      <small>Es mostrarà quan l’organització l’aprovi.</small>
      <button type="submit">Sol·licita el canvi</button>
    </fieldset>
    {data?.requests?.slice(0, 3).map(item => <p key={item.id} role="status">{item.proposed} · {statuses[item.status]}</p>)}
    {error && <p role="alert">{error}</p>}
  </form>;
}
