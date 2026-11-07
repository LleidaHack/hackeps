import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useContinuousQr from "./useContinuousQr";
import { needsTwoCodes, needsMentor, readyToScan } from "./scanFlow";
import { clearSession } from "src/modules/session";
import { getHackeps } from "src/services/EventService";
import { operationRequest } from "./api";
import "./Operations.css";
import { dietaryWarning } from "./dietary";

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
    [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [dietaryAlert, setDietaryAlert] = useState(null);
  const pending = useRef(null),
    busyRef = useRef(false);
  const flow = useRef(null);
  const camera = useContinuousQr(!!data, (code) => {
    const current = flow.current;
    if (
      !current ||
      busyRef.current ||
      current.blocked ||
      !readyToScan(current.form, current.data)
    )
      return;
    const next = { ...current.form };
    if (needsTwoCodes(next.kind) && !next.code) {
      next.code = code;
      flow.current.form = next;
      setForm(next);
      setMessage("Entrada llegida. Ara passa l’acreditació física.");
      navigator.vibrate?.(60);
      return;
    }
    if (needsTwoCodes(next.kind) || needsMentor(next.kind)) next.badge = code;
    else next.code = code;
    setForm(next);
    void current.submit(null, next);
  });
  const device = useRef(
    sessionStorage.getItem("scanner-device") || `phone-${crypto.randomUUID()}`,
  );
  useEffect(() => {
    sessionStorage.setItem("scanner-device", device.current);
    let active = true;
    getHackeps()
      .then((e) => {
        if (active && e?.id) setEventId(e.id);
        else if (active) setMessage("No hi ha cap esdeveniment actiu");
      })
      .catch(() => {
        if (active) {
          setMessage("No es pot carregar l’esdeveniment. Recarrega la pàgina.");
          setFailed(true);
        }
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
            setData(null);
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
  const round = data?.meal_rounds?.[form.target] || { round: 1, open: true };
  function change(key, value) {
    if (busyRef.current || paused || dietaryAlert) return;
    pending.current = null;
    setForm((f) => ({
      ...f,
      [key]: value,
      ...(["kind", "target"].includes(key) ? { code: "", badge: "" } : {}),
    }));
  }
  async function submit(e, scannedForm) {
    e?.preventDefault();
    const operationForm = scannedForm || form;
    if (
      busyRef.current ||
      dietaryAlert ||
      (!pending.current && !readyToScan(operationForm, data))
    )
      return;
    if (
      needsTwoCodes(operationForm.kind) &&
      (!operationForm.code.trim() || !operationForm.badge.trim())
    )
      return;
    if (
      needsMentor(operationForm.kind)
        ? !operationForm.badge.trim()
        : !operationForm.code.trim()
    )
      return;
    if (
      ["redeem", "replace_badge", "mentor_replace_badge"].includes(
        operationForm.kind,
      ) &&
      !window.confirm(
        ["replace_badge", "mentor_replace_badge"].includes(operationForm.kind)
          ? "Invalidar l’acreditació anterior i vincular la nova?"
          : "Confirmar el lliurament del premi i descomptar les LleidaCoins?",
      )
    )
      return;
    busyRef.current = true;
    setBusy(true);
    setPaused(false);
    setMessage("");
    setFailed(false);
    let succeeded = false;
    try {
      let result;
      if (
        ["mentor_badge", "mentor_replace_badge"].includes(operationForm.kind)
      ) {
        result = await operationRequest(
          `/operations/${eventId}/mentors/${operationForm.target}/badge`,
          "PUT",
          {
            code: operationForm.badge.trim(),
            replace: operationForm.kind === "mentor_replace_badge",
          },
        );
      } else if (["badge", "replace_badge"].includes(operationForm.kind)) {
        result = await operationRequest(
          `/event/${eventId}/vouchers/${encodeURIComponent(operationForm.badge.trim())}/${operationForm.kind === "replace_badge" ? "replace" : "assign"}/${encodeURIComponent(operationForm.code.trim())}`,
          "PUT",
        );
      } else {
        if (!pending.current)
          pending.current = {
            operation_id: crypto.randomUUID(),
            kind: operationForm.kind,
            code: operationForm.code.trim(),
            target: operationForm.target,
            round: operationForm.kind === "meal" ? round.round : 1,
            amount:
              operationForm.kind === "award" ? Number(operationForm.amount) : 0,
            reason: operationForm.reason,
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
        flow.current.blocked = true;
        setDietaryAlert({
          participant:
            result.participant || result.hacker_name || "Participant",
          restriction,
        });
      }
      pending.current = null;
      setForm((f) => ({ ...f, code: "", badge: "" }));
      navigator.vibrate?.(restriction ? [200, 100, 200] : 100);
      succeeded = true;
    } catch (err) {
      flow.current.blocked = true;
      setPaused(true);
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
  flow.current = { form, data, submit, blocked: paused || !!dietaryAlert };
  const scanHint = !readyToScan(form, data)
    ? "Selecciona l’operació i el destí per començar"
    : needsTwoCodes(form.kind)
      ? form.code
        ? "2 · Passa l’acreditació física"
        : "1 · Passa el QR de l’entrada"
      : needsMentor(form.kind)
        ? "Passa l’acreditació del mentor"
        : "Passa el QR de l’acreditació";
  return (
    <div className="scanner-app">
      <main className="event-ops">
        <p className="ops-eyebrow">HACKEPS · EQUIP D’ORGANITZACIÓ</p>
        <h1>Escàner QR</h1>
        <button
          type="button"
          className="scanner-signout"
          onClick={() => {
            clearSession();
            navigate("/login", { replace: true });
          }}
        >
          Sortir
        </button>
        {ADMIN_URL &&
          data &&
          ["superadmin", "admin"].includes(data.access_role) && (
            <a className="ops-link" href={ADMIN_URL}>
              Panel de gestió
            </a>
          )}
        <p>
          Selecciona l’operació i passa els QR. Es registren automàticament.
        </p>
        {message && (
          <div
            role={failed ? "alert" : "status"}
            className={`ops-result ${failed ? "ops-error" : ""}`}
          >
            {message}
          </div>
        )}
        {dietaryAlert && (
          <section
            className="ops-result ops-dietary-alert"
            role="alert"
            aria-label="Restriccions alimentàries"
          >
            <h2>Atenció: restriccions alimentàries</h2>
            <strong>{dietaryAlert.participant}</strong>
            <p>{dietaryAlert.restriction}</p>
            <p>
              Dirigeix aquesta persona a la cua d’intoleràncies i dietes
              especials. L’operació ja s’ha registrat.
            </p>
            <button
              type="button"
              autoFocus
              onClick={() => setDietaryAlert(null)}
            >
              Entès · continuar
            </button>
          </section>
        )}
        {data && (
          <form onSubmit={submit}>
            <fieldset disabled={busy || !!dietaryAlert || paused}>
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
                        (!["replace_badge", "mentor_replace_badge"].includes(
                          v,
                        ) ||
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
                        {v.cost
                          ? ` · ${v.cost} punts · ${v.stock} unitats`
                          : ""}
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
              <section className="scanner-camera" aria-label="Càmera QR">
                <video ref={camera.video} muted playsInline autoPlay />
                <p className="scanner-hint" role="status">
                  {busy
                    ? "Registrant…"
                    : dietaryAlert
                      ? "Confirma l’avís alimentari"
                      : paused
                        ? "Lectura en pausa"
                        : scanHint}
                </p>
              </section>
              {camera.error && <p role="alert">{camera.error}</p>}
              <button type="button" onClick={camera.retry}>
                Reiniciar càmera
              </button>
              {needsTwoCodes(form.kind) && form.code && (
                <button
                  type="button"
                  onClick={() => {
                    setForm((f) => ({ ...f, code: "", badge: "" }));
                    setMessage("");
                  }}
                >
                  Canviar participant
                </button>
              )}
              <details className="scanner-manual">
                <summary>Introduir codis manualment</summary>
                {!needsMentor(form.kind) && (
                  <label>
                    {needsTwoCodes(form.kind)
                      ? "QR de l’entrada del participant"
                      : "QR de l’acreditació física"}
                    <input
                      value={form.code}
                      onChange={(e) => change("code", e.target.value)}
                      autoComplete="off"
                    />
                  </label>
                )}
                {(needsTwoCodes(form.kind) || needsMentor(form.kind)) && (
                  <label>
                    QR de l’acreditació física lliure
                    <input
                      value={form.badge}
                      onChange={(e) => change("badge", e.target.value)}
                      autoComplete="off"
                    />
                  </label>
                )}
                <button disabled={busy || !readyToScan(form, data)}>
                  Registrar codi manual
                </button>
              </details>
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
            </fieldset>
            {paused && (
              <button
                type="button"
                onClick={() => {
                  if (pending.current) void submit(null, form);
                  else {
                    setPaused(false);
                    setFailed(false);
                    setMessage("");
                    setForm((f) => ({ ...f, code: "", badge: "" }));
                  }
                }}
              >
                {pending.current
                  ? "Reintentar la mateixa operació"
                  : "Entès · continuar escanejant"}
              </button>
            )}
          </form>
        )}
      </main>
    </div>
  );
}
