import React, { useEffect, useRef, useState } from "react";
import { fetchPlus } from "src/modules/fetchModule";
import "./ChallengeChoice.css";

export default function ChallengeChoice({ team }) {
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const dirty = useRef(false);
  const endpoint = `/operations/${team.event_id}/teams/${team.id}/challenge-vote`;
  useEffect(() => {
    let active = true;
    dirty.current = false;
    setData(null);
    setSelected("");
    setError("");
    async function refresh() {
      const result = await fetchPlus({ Url: endpoint, hasUserauth: true });
      if (!active) return;
      if (result?.errCode) {
        setError("No s’ha pogut consultar l’elecció del repte.");
        return;
      }
      setData(result);
      if (!dirty.current) setSelected(result.choice || "");
    }
    void refresh();
    const timer = setInterval(refresh, 10000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [endpoint]);
  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const result = await fetchPlus({
      Url: endpoint,
      Method: "PUT",
      hasUserauth: true,
      Body: { challenge: selected, version: data.version },
    });
    if (result?.errCode) {
      setError(
        result.errCode === 409
          ? "L’elecció ha canviat o s’ha tancat. Revisa les dades actualitzades abans de tornar-ho a provar."
          : "No s’ha pogut desar el repte. Comprova que encara estigui disponible.",
      );
      const latest = await fetchPlus({ Url: endpoint, hasUserauth: true });
      if (latest && !latest.errCode) {
        setData(latest);
        setSelected(latest.choice || "");
        dirty.current = false;
      }
    } else {
      setData(result);
      setSelected(result.choice);
      dirty.current = false;
    }
    setBusy(false);
  }
  if (!data?.open || !data.published) return null;
  return (
    <section
      className="team-challenge-choice"
      aria-labelledby={`challenge-choice-${team.id}`}
    >
      <h3 id={`challenge-choice-${team.id}`}>Repte de l’equip</h3>
      {!data.published ? (
        <p>Els reptes encara no s’han publicat.</p>
      ) : (
        <>
          {data.choice && (
            <p>
              <strong>Elecció actual:</strong>{" "}
              {data.challenges.find((c) => c.id === data.choice)?.title ||
                "Repte no disponible"}
            </p>
          )}
          <form onSubmit={save}>
            <label htmlFor={`challenge-select-${team.id}`}>
              Quin repte fareu?
            </label>
            <select
              id={`challenge-select-${team.id}`}
              disabled={!data.open || busy}
              value={selected}
              onChange={(e) => {
                setSelected(e.target.value);
                dirty.current = true;
              }}
              required
            >
              <option value="">Selecciona un repte</option>
              {data.challenges.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            {data.challenges.find((c) => c.id === selected)?.description && (
              <p className="team-challenge-description">
                {data.challenges.find((c) => c.id === selected).description}
              </p>
            )}
            {data.open && (
              <button
                type="submit"
                disabled={busy || !selected || selected === data.choice}
              >
                {busy ? "Desant…" : "Desar elecció de l’equip"}
              </button>
            )}
          </form>
        </>
      )}
      {error && <p role="alert">{error}</p>}
    </section>
  );
}
