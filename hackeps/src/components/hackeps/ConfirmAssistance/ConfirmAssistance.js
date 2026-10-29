import React, { useRef, useState } from "react";
import { confirmAssistance } from "src/services/EventService";
import SuccessFeedback from "../Feedbacks/SuccesFeedback";
import TitleGeneralized from "../TitleGeneralized/TitleGeneralized";
import FailFeedback from "../Feedbacks/FailFeedback";

const ConfirmAssistance = ({ confirm, token }) => {
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const pending = useRef(false);
  const accepts = confirm === "true" || confirm === true;
  const submit = async () => {
    if (!accepts || !token || pending.current || result?.success) return;
    pending.current = true;
    setSending(true);
    try {
      setResult(await confirmAssistance(token));
    } catch {
      setResult({ errMssg: "No s'ha pogut connectar. Torna-ho a provar." });
    } finally {
      pending.current = false;
      setSending(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#2e2e2e] text-white">
      {!accepts ? (
        <div className="mt-60">
          <TitleGeneralized>
            {"Encara estàs a temps de pensar-ho"}
          </TitleGeneralized>
          <br />
          <p className="text-center">T'esperem l'any que ve!</p>
          <p className="text-center">
            Si canvies d'opinió encara pots confirmar l'assistencia des de
            l'email.
          </p>
        </div>
      ) : (
        <>
          {!result ? (
            <section className="mt-60 text-center">
              <h1>Confirma la teva assistència a la HackEPS</h1>
              <p>Prem el botó per confirmar que hi assistiràs.</p>
              <button
                type="button"
                onClick={submit}
                disabled={sending || !token}
                className="bg-orange-500 text-black p-4 rounded mt-4"
              >
                {sending ? "Confirmant…" : "Confirmar assistència"}
              </button>
            </section>
          ) : !sending ? (
            result && result.success ? (
              <SuccessFeedback
                title="Assistencia confirmada"
                text="Ha confirmat la seva assistencia a la HackEps."
                hasButton={true}
                buttonText="Torna a l'inici"
                buttonLink="/"
              />
            ) : (
              <FailFeedback
                title="Ha hagut un error"
                text="El error és amb el missatge:"
                italic={result?.errMssg || "No hi ha hagut codi, contactans!"}
                hasButton={true}
                buttonText="Torna a l'inici"
                buttonLink="/"
              />
            )
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  );
};

export default ConfirmAssistance;
