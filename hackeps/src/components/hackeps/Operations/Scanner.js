import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { BrowserQRCodeReader } from "@zxing/browser";
import { getHackeps } from "src/services/EventService";
import { operationRequest } from "./api";
import "./Operations.css";
import DarkPage from "src/components/hackeps/Layout/DarkPage";

export default function Scanner() {
  const [eventId, setEventId] = useState(null),
    [data, setData] = useState(null),
    [form, setForm] = useState({
      kind: "meal",
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
    const load = () =>
      operationRequest(`/operations/${eventId}/scanner`)
        .then((d) => {
          if (active) setData(d);
        })
        .catch((e) => {
          if (active) {
            setMessage(e.message);
            setFailed(true);
          }
        });
    void load();
    const timer = setInterval(load, 5000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [eventId]);
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
    if (busyRef.current) return;
    if (
      form.kind === "redeem" &&
      !window.confirm(
        "Confirmar el lliurament del premi i descomptar les LleidaCoins?",
      )
    )
      return;
    busyRef.current = true;
    setBusy(true);
    setMessage("");
    setFailed(false);
    try {
      let result;
      if (form.kind === "badge") {
        result = await operationRequest(
          `/event/${eventId}/vouchers/${encodeURIComponent(form.badge)}/assign/${encodeURIComponent(form.code)}`,
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
        `Registrat: ${result.participant || result.hacker_name || "participant"}${result.balance != null ? ` · Saldo: ${result.balance} LleidaCoins` : ""}`,
      );
      pending.current = null;
      setForm((f) => ({ ...f, code: "", badge: "" }));
      navigator.vibrate?.(100);
      setData(await operationRequest(`/operations/${eventId}/scanner`));
    } catch (err) {
      setFailed(true);
      setMessage(err.message);
      if (err.code > 0) pending.current = null;
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }
  return (
    <DarkPage>
      <main className="event-ops">
        <p className="ops-eyebrow">HACKEPS · EQUIP D’ORGANITZACIÓ</p>
        <h1>Organització · Escàner</h1>
        <Link className="ops-link" to="/perfil">
          El meu perfil
        </Link>
        {data && ["superadmin", "admin"].includes(data.access_role) && (
          <a
            className="ops-link"
            href={process.env.REACT_APP_ADMIN_URL || "http://localhost:5175"}
          >
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
                  ["checkin", "Entrada"],
                  ["badge", "Vincular acreditació"],
                  ["redeem", "Bescanviar premi"],
                  ["award", "Atorgar punts"],
                ]
                  .filter(
                    ([v]) => v !== "award" || data.access_role === "superadmin",
                  )
                  .map(([v, t]) => (
                    <option value={v} key={v}>
                      {t}
                    </option>
                  ))}
              </select>
            </label>
            {["meal", "activity", "redeem"].includes(form.kind) && (
              <label>
                {form.kind === "meal"
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
                    form.kind === "meal"
                      ? "meals"
                      : form.kind === "activity"
                        ? "activities"
                        : "prizes"
                  ].map((v) => (
                    <option value={v.id} key={v.id}>
                      {v.title || v.name}
                      {v.cost ? ` · ${v.cost} punts · ${v.stock} unitats` : ""}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {form.kind === "meal" && form.target && (
              <h2>
                Ronda {round.round} · {round.open ? "Oberta" : "Tancada"}
              </h2>
            )}
            {camera && <video ref={video} muted playsInline />}
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
              {form.kind === "badge"
                ? "Tiquet del participant"
                : "Codi del participant o acreditació"}
              <input
                required
                value={form.code}
                onChange={(e) => change("code", e.target.value)}
                autoComplete="off"
              />
            </label>
            {form.kind === "badge" && (
              <label>
                Acreditació física lliure
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
            <button disabled={busy || (form.kind === "meal" && !round.open)}>
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
