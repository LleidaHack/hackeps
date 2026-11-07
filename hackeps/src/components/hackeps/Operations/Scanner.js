import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BrowserQRCodeReader } from "@zxing/browser";
import { getHackeps } from "src/services/EventService";
import { operationRequest } from "./api";
import "./Operations.css";
import { dietaryWarning } from "./dietary";
import DarkPage from "src/components/hackeps/Layout/DarkPage";

const ADMIN_URL = process.env.REACT_APP_ADMIN_URL;
// Retrying after these may hit an operation the server already committed, so
// the retry must reuse the same operation_id (the server replays the result).
const isAmbiguousFailure = (code) =>
  !(code > 0) || code >= 500 || code === 408 || code === 429;

export default function Scanner() {
  const navigate = useNavigate();
  const [eventId, setEventId] = useState(null),
    [data, setData] = useState(null),
    [form, setForm] = useState({
      kind: "badge",
      code: "",
      target: "",
      amount: 10,
      reason: "",
      badge: "",
    });
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [failed, setFailed] = useState(false),
    [camera, setCamera] = useState(false);
  const [dietaryAlert, setDietaryAlert] = useState(null);
  const scanField = useRef("code");
  const video = useRef(null),
    controls = useRef(null),
    pending = useRef(null),
    busyRef = useRef(false);
  const device = useRef(
    sessionStorage.getItem("scanner-device") || `phone-${crypto.randomUUID()}`,
  );
  useEffect(() => {
    sessionStorage.setItem("scanner-device", device.current);
    let active = true;
    getHackeps().then((e) => {
      if (active && e?.id) setEventId(e.id);
      else if (active) setMessage("No hi ha cap esdeveniment actiu");
    });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (!eventId) return;
    let active = true;
    let timer = null;
    const load = () => {
      // Do not poll from background tabs.
      if (document.hidden) return;
      operationRequest(`/operations/${eventId}/scanner`)
        .then((d) => {
          if (active) setData(d);
        })
        .catch((e) => {
          if (!active) return;
          setMessage(e.message);
          setFailed(true);
          // Not staff or session expired: stop polling instead of retrying forever.
          if (e.code === 401 || e.code === 403) {
            clearInterval(timer);
            if (e.code === 401) navigate("/login");
          }
        });
    };
    load();
    timer = setInterval(load, 5000);
    document.addEventListener("visibilitychange", load);
    return () => {
      active = false;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", load);
    };
  }, [eventId, navigate]);
  useEffect(() => {
    if (!camera) return;
    let active = true;
    const reader = new BrowserQRCodeReader();
    reader
      .decodeFromConstraints(
        { video: { facingMode: "environment" } },
        video.current,
        (result) => {
          if (result && active && !busyRef.current) {
            pending.current = null;
            setForm((f) => ({ ...f, [scanField.current]: result.getText() }));
            setCamera(false);
          }
        },
      )
      .then((c) => {
        if (active) controls.current = c;
        else c.stop();
      })
      .catch(() => {
        if (!active) return;
        setMessage(
          "No es pot obrir la càmera. Permet-ne l’accés o introdueix el codi.",
        );
        setFailed(true);
        setCamera(false);
      });
    return () => {
      active = false;
      controls.current?.stop();
      controls.current = null;
    };
  }, [camera]);
  const round = data?.meal_rounds?.[form.target] || { round: 1, open: true };
  function change(key, value) {
    pending.current = null;
    setForm((f) => ({ ...f, [key]: value }));
  }
  async function submit(e) {
    e.preventDefault();
    if (busyRef.current || dietaryAlert) return;
    if (
      ["redeem", "replace_badge", "mentor_replace_badge"].includes(form.kind) &&
      !window.confirm(
        ["replace_badge", "mentor_replace_badge"].includes(form.kind)
          ? "Invalidar l’acreditació anterior i vincular la nova?"
          : "Confirmar el lliurament del premi i descomptar les LleidaCoins?",
      )
    )
      return;
    busyRef.current = true;
    setBusy(true);
    setMessage("");
    setFailed(false);
    let succeeded = false;
    try {
      let result;
      if (["mentor_badge", "mentor_replace_badge"].includes(form.kind)) {
        result = await operationRequest(
          `/operations/${eventId}/mentors/${form.target}/badge`,
          "PUT",
          {
            code: form.badge.trim(),
            replace: form.kind === "mentor_replace_badge",
          },
        );
      } else if (["badge", "replace_badge"].includes(form.kind)) {
        result = await operationRequest(
          `/event/${eventId}/vouchers/${encodeURIComponent(form.badge.trim())}/${form.kind === "replace_badge" ? "replace" : "assign"}/${encodeURIComponent(form.code.trim())}`,
          "PUT",
        );
      } else {
        if (!pending.current)
          pending.current = {
            operation_id: crypto.randomUUID(),
            kind: form.kind,
            code: form.code.trim(),
            target: form.target,
            round: form.kind === "meal" ? round.round : 1,
            amount: form.kind === "award" ? Number(form.amount) : 0,
            reason: form.reason,
            device: device.current,
          };
        result = await operationRequest(
          `/operations/${eventId}/scan`,
          "POST",
          pending.current,
        );
      }
      setMessage(
        result.team
          ? `${result.team} · Presentant${result.next_team ? ` · Següent: ${result.next_team}` : ""}`
          : `Registrat: ${result.participant || result.hacker_name || "participant"}${result.balance != null ? ` · Saldo: ${result.balance} LleidaCoins` : ""}`,
      );
      const restriction = dietaryWarning(result.food_restrictions);
      if (restriction) {
        setDietaryAlert({ participant: result.participant || result.hacker_name || "Participant", restriction });
      }
      pending.current = null;
      setForm((f) => ({ ...f, code: "", badge: "" }));
      navigator.vibrate?.(restriction ? [200, 100, 200] : 100);
      succeeded = true;
    } catch (err) {
      setFailed(true);
      setMessage(err.message);
      // Keep the operation_id for ambiguous failures so a retry is replayed,
      // not executed twice (e.g. a prize redeemed after a 502 from the proxy).
      if (!isAmbiguousFailure(err.code)) pending.current = null;
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
    // Refresh counters separately: a failed refresh must not turn a confirmed
    // operation into an error and prompt the operator to scan again.
    if (succeeded)
      operationRequest(`/operations/${eventId}/scanner`)
        .then(setData)
        .catch(() => {});
  }
  return (
    <DarkPage>
      <main className="event-ops">
        <p className="ops-eyebrow">HACKEPS · EQUIP D’ORGANITZACIÓ</p>
        <h1>Organització · Escàner</h1>
        <Link className="ops-link" to="/perfil">
          El meu perfil
        </Link>
        {ADMIN_URL &&
          data &&
          ["superadmin", "admin"].includes(data.access_role) && (
            <a className="ops-link" href={ADMIN_URL}>
              Panel de gestió
            </a>
          )}
        <p>Selecciona l’operació abans de llegir l’acreditació.</p>
        {message && (
          <div
            role={failed ? "alert" : "status"}
            className={`ops-result ${failed ? "ops-error" : ""}`}
          >
            {message}
          </div>
        )}
        {dietaryAlert && (
          <section className="ops-result ops-dietary-alert" role="alert" aria-label="Restriccions alimentàries">
            <h2>Atenció: restriccions alimentàries</h2>
            <strong>{dietaryAlert.participant}</strong>
            <p>{dietaryAlert.restriction}</p>
            <p>Dirigeix aquesta persona a la cua d’intoleràncies i dietes especials. L’operació ja s’ha registrat.</p>
            <button type="button" autoFocus onClick={() => setDietaryAlert(null)}>Entès · continuar</button>
          </section>
        )}
        {data && (
          <form onSubmit={submit}>
            <label>
              Operació
              <select
                value={form.kind}
                onChange={(e) => {
                  change("kind", e.target.value);
                  change("target", "");
                }}
              >
                {[
                  ["meal", "Àpat"],
                  ["activity", "Activitat"],
                  ["judging_start", "Presentació · entrada a la sala"],
                  ["badge", "Check-in · entrada i acreditació"],
                  ["replace_badge", "Substituir acreditació perduda"],
                  ["mentor_badge", "Mentor · vincular acreditació"],
                  ["mentor_replace_badge", "Mentor · substituir acreditació"],
                  ["redeem", "Bescanviar premi"],
                  ["award", "Atorgar punts"],
                ]
                  .filter(
                    ([v]) =>
                      (v !== "award" || data.access_role === "superadmin") &&
                      (!["replace_badge", "mentor_replace_badge"].includes(v) ||
                        ["superadmin", "admin"].includes(data.access_role)),
                  )
                  .map(([v, t]) => (
                    <option value={v} key={v}>
                      {t}
                    </option>
                  ))}
              </select>
            </label>
            {["meal", "activity", "redeem", "judging_start"].includes(
              form.kind,
            ) && (
              <label>
                {form.kind === "judging_start"
                  ? "Sala de presentació"
                  : form.kind === "meal"
                    ? "Àpat"
                    : form.kind === "activity"
                      ? "Activitat"
                      : "Premi"}
                <select
                  required
                  value={form.target}
                  onChange={(e) => change("target", e.target.value)}
                >
                  <option value="">Selecciona…</option>
                  {data[
                    form.kind === "judging_start"
                      ? "rooms"
                      : form.kind === "meal"
                        ? "meals"
                        : form.kind === "activity"
                          ? "activities"
                          : "prizes"
                  ]?.map((v) => (
                    <option value={v.id} key={v.id}>
                      {v.title || v.name}
                      {v.cost ? ` · ${v.cost} punts · ${v.stock} unitats` : ""}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {form.kind === "judging_start" && !data.rooms?.length && (
              <p>
                Les sales es mostraran quan comenci el judging i els reptes
                estiguin publicats.
              </p>
            )}
            {form.kind === "meal" && form.target && (
              <h2>
                Ronda {round.round} · {round.open ? "Oberta" : "Tancada"}
              </h2>
            )}
            {["mentor_badge", "mentor_replace_badge"].includes(form.kind) && (
              <label>
                Mentor
                <select
                  required
                  value={form.target}
                  onChange={(e) => change("target", e.target.value)}
                >
                  <option value="">Selecciona el mentor…</option>
                  {data.mentors?.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                      {m.has_badge ? " · Acreditació vinculada" : ""}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {camera && <video ref={video} muted playsInline />}
            {!["mentor_badge", "mentor_replace_badge"].includes(form.kind) && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    scanField.current = "code";
                    setCamera(!camera);
                  }}
                >
                  {camera ? "Tancar càmera" : "Llegir QR amb la càmera"}
                </button>
                <label>
                  {["badge", "replace_badge"].includes(form.kind)
                    ? "1. QR de l’entrada del participant"
                    : "QR de l’acreditació física"}
                  <input
                    required
                    value={form.code}
                    onChange={(e) => change("code", e.target.value)}
                    autoComplete="off"
                  />
                </label>
              </>
            )}
            {[
              "badge",
              "replace_badge",
              "mentor_badge",
              "mentor_replace_badge",
            ].includes(form.kind) && (
              <label>
                QR de l’acreditació física lliure
                <button
                  type="button"
                  onClick={() => {
                    scanField.current = "badge";
                    setCamera(true);
                  }}
                >
                  Llegir QR de l’acreditació
                </button>
                <input
                  required
                  placeholder="Codi de l’acreditació"
                  value={form.badge}
                  onChange={(e) => change("badge", e.target.value)}
                />
              </label>
            )}
            {form.kind === "award" && (
              <>
                <label>
                  Punts
                  <input
                    type="number"
                    required
                    min="1"
                    value={form.amount}
                    onChange={(e) => change("amount", e.target.value)}
                  />
                </label>
                <label>
                  Motiu
                  <input
                    required
                    minLength="3"
                    value={form.reason}
                    onChange={(e) => change("reason", e.target.value)}
                  />
                </label>
              </>
            )}
            <button disabled={busy || !!dietaryAlert || (form.kind === "meal" && !round.open)}>
              {busy
                ? "Registrant…"
                : pending.current
                  ? "Reintentar la mateixa operació"
                  : "Registrar"}
            </button>
            <p>
              Una lectura no entrega res fins que el servidor confirma
              l’operació.
            </p>
          </form>
        )}
      </main>
    </DarkPage>
  );
}
