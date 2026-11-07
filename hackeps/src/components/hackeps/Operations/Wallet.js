import { useCallback, useEffect, useState } from "react";
import { operationRequest } from "./api";
import "./Operations.css";

export default function Wallet({ eventId, team }) {
  const [wallet, setWallet] = useState(null);
  const [live, setLive] = useState(null);
  const [error, setError] = useState("");
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
      <h2>Els meus LleidaCoins</h2>
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
