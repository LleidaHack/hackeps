import React, { useRef, useState } from "react";
import { cancelAssistance, confirmAssistance } from "src/services/EventService";
import SuccessFeedback from "../Feedbacks/SuccesFeedback";
import FailFeedback from "../Feedbacks/FailFeedback";

const ConfirmAssistance = ({ confirm, token }) => {
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const pending = useRef(false);
  const accepts = confirm === "true" || confirm === true;
  const cancels = confirm === "false" || confirm === false;
  const valid = (accepts || cancels) && !!token;
  const submit = async () => {
    if (!valid || pending.current || result?.success) return;
    pending.current = true;
    setSending(true);
    try {
      setResult(
        await (cancels ? cancelAssistance(token) : confirmAssistance(token)),
      );
    } catch {
      setResult({ errMssg: "No s'ha pogut connectar. Torna-ho a provar." });
    } finally {
      pending.current = false;
      setSending(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#2e2e2e] text-white">
      {!valid ? (
        <FailFeedback
          title="Enllaç no vàlid"
          italic=""
          text="Obre l’enllaç complet del correu. Si continua sense funcionar, contacta amb l’organització."
          hasButton={true}
          buttonText="Torna a l'inici"
          buttonLink="/"
        />
      ) : result?.success ? (
        <SuccessFeedback
          title={cancels ? "Plaça cancel·lada" : "Assistencia confirmada"}
          text={
            cancels
              ? "Has alliberat la teva plaça perquè una altra persona es pugui apuntar. Gràcies per avisar-nos!"
              : "Has confirmat la teva assistència a la HackEPS."
          }
          hasButton={true}
          buttonText="Torna a l'inici"
          buttonLink="/"
        />
      ) : (
        <section className="mt-60 px-6 text-center">
          <h1>
            {cancels
              ? "Vols alliberar la teva plaça?"
              : "Confirma la teva assistència a la HackEPS"}
          </h1>
          <p>
            {cancels
              ? "Si no pots venir, confirma la cancel·lació. Deixaràs de tenir la plaça reservada."
              : "Prem el botó per confirmar que hi assistiràs."}
          </p>
          {cancels && (
            <p>Si vindràs, tanca aquesta pàgina sense prémer el botó.</p>
          )}
          {result && !sending && (
            <p role="alert" className="mt-4">
              No s'ha pogut completar l'acció. Torna-ho a provar; si l'enllaç ha
              caducat, demana'n un de nou a l'organització.
            </p>
          )}
          <button
            type="button"
            onClick={submit}
            disabled={sending}
            className="bg-orange-500 text-black p-4 rounded mt-4 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            {sending
              ? cancels
                ? "Cancel·lant…"
                : "Confirmant…"
              : cancels
                ? "Alliberar la meva plaça"
                : "Confirmar assistència"}
          </button>
        </section>
      )}
    </div>
  );
};

export default ConfirmAssistance;
