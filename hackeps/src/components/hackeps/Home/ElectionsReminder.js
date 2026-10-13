import React from "react";
import marracoVota from "src/assets/img/home10/marraco-vota.webp";
import { useSiteTheme } from "src/hooks/useSiteTheme";

// Shown until election day is over (Madrid time); then it disappears on its own.
const HIDE_AFTER = new Date("2026-11-30T00:00:00+01:00").getTime();
const POSTAL_VOTE_URL =
  "https://www.correos.es/es/es/particulares/voto-por-correo";

const ElectionsReminder = () => {
  const { text } = useSiteTheme();
  if (Date.now() >= HIDE_AFTER) return null;
  return (
    <section
      aria-labelledby="elections-reminder-title"
      className="relative z-20 w-full px-4 py-6 md:px-8"
    >
      <div className="mx-auto flex max-w-[960px] flex-col items-center gap-4 rounded-2xl border-4 border-[#2e2e2e] bg-white px-5 py-5 shadow-[6px_6px_0_#2e2e2e] sm:flex-row sm:gap-6 sm:px-7">
        <img
          src={marracoVota}
          alt=""
          aria-hidden="true"
          width={462}
          height={480}
          className="h-auto w-36 shrink-0 sm:w-44"
        />
        <div className="text-center sm:text-left" style={{ color: text }}>
          <h2
            id="elections-reminder-title"
            className="m-0 font-space-mono text-[20px] font-bold leading-tight md:text-[24px]"
          >
            El 29 de novembre també es vota!
          </h2>
          <p className="mb-0 mt-2 text-[15px] leading-snug md:text-[16px]">
            La HackEPS coincideix amb les eleccions generals, però la hackató
            acaba a les 15:00, així que tindràs temps d&apos;anar a votar
            abans que tanquin els col·legis. Si ho prefereixes, també pots
            demanar el vot per correu.
          </p>
          <a
            href={POSTAL_VOTE_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block font-space-mono text-[15px] font-bold text-[#FF7430] underline underline-offset-4"
          >
            Com votar per correu →
          </a>
        </div>
      </div>
    </section>
  );
};

export default ElectionsReminder;
