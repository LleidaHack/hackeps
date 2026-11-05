import { useCallback, useEffect, useState } from "react";
import { operationRequest } from "./api";
import "./Operations.css";

export default function Wallet({ eventId, team }) {
  const [wallet, setWallet] = useState(null);
  const [live, setLive] = useState(null);
  const [error, setError] = useState("");
  const [choice, setChoice] = useState("");
  const [mlh, setMlh] = useState(false);
  const [notice, setNotice] = useState("");
  const load = useCallback(async () => {
    try {
      const [w, l] = await Promise.all([
        operationRequest(`/operations/${eventId}/wallet`),
        operationRequest(
          `/operations/${eventId}/public`,
          "GET",
          undefined,
          false,
        ),
      ]);
      setWallet(w);
      setLive(l);
      setError("");
    } catch (e) {
      setError(e.message);
    }
  }, [eventId]);
  useEffect(() => {
    if (!eventId) return;
    void load();
    const timer = setInterval(load, 10000);
    return () => clearInterval(timer);
  }, [eventId, load]);
  if (!eventId) return null;
  return (
    <section className="ops-wallet">
      <h2>Les meves LleidaCoins</h2>
      {error && <p role="alert">{error}</p>}
      {wallet && (
        <>
          <strong className="ops-wallet-balance">{wallet.balance} LC</strong>
          <button onClick={load}>Actualitzar</button>
          <details>
            <summary>Historial de moviments</summary>
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Motiu</th>
                  <th>Punts</th>
                </tr>
              </thead>
              <tbody>
                {wallet.movements.map((m) => (
                  <tr key={m.id}>
                    <td>{new Date(m.created_at).toLocaleString()}</td>
                    <td>{m.reason}</td>
                    <td>
                      {m.amount > 0 ? "+" : ""}
                      {m.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!wallet.movements.length && <p>Encara no tens moviments.</p>}
          </details>
        </>
      )}
      {live && (
        <>
          <h3>Premis disponibles</h3>
          {live.prizes.map((p) => (
            <p key={p.id}>
              {p.title} · {p.cost} LC ·{" "}
              {p.stock > 0 ? `${p.stock} disponibles` : "Esgotat"}
            </p>
          ))}
          <p>Demana el bescanvi a organització amb la teva acreditació.</p>
          {team &&
            String(team.leader_id) === localStorage.getItem("userID") &&
            live.phase === "hacking" && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    await operationRequest(
                      `/operations/${eventId}/teams/${team.id}/enroll`,
                      "POST",
                      { challenge: choice, mlh },
                    );
                    setNotice("Selecció de presentacions desada");
                  } catch (e) {
                    setError(e.message);
                  }
                }}
              >
                <h3>Presentacions del meu equip</h3>
                <select
                  required
                  value={choice}
                  onChange={(e) => setChoice(e.target.value)}
                >
                  <option value="">Tria el repte…</option>
                  {live.challenges.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
                <label>
                  <input
                    type="checkbox"
                    checked={mlh}
                    onChange={(e) => setMlh(e.target.checked)}
                  />{" "}
                  També volem presentar a MLH
                </label>
                <button>Desar selecció</button>
                <p role="status">{notice}</p>
              </form>
            )}
          {live.phase === "judging" && team && (
            <>
              <h3>Els nostres torns</h3>
              {live.presentations
                .filter((p) => p.group_id === team.id)
                .map((p) => (
                  <p key={p.id}>
                    {live.rooms.find((r) => r.id === p.room)?.title || p.room} ·{" "}
                    {p.state} ·{" "}
                    {p.scheduled_at
                      ? new Date(p.scheduled_at).toLocaleTimeString()
                      : "Pendent"}
                  </p>
                ))}
            </>
          )}
        </>
      )}
    </section>
  );
}
