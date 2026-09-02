import React, { useEffect } from "react";
import Calendar from "src/components/hackeps/Calendar/Calendar.js";
import DatesHorari from "src/components/hackeps/Dates/DatesHorari.js";

const DatesContent = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full bg-[#94cbf5]">
      <section
        id="dates"
        className="relative w-full overflow-hidden bg-[#94cbf5] pb-[80px] pt-[72px]"
      >
        <h1 className="m-0 mb-[64px] text-center font-space-mono text-[64px] font-bold leading-normal tracking-[-1.28px] text-[#2e2e2e]">
          DATES
        </h1>
        <Calendar />
        <div className="mx-auto mt-[80px] w-[952px] max-w-[90vw] text-center font-space-mono text-[24px] leading-normal tracking-[-0.48px] text-[#2e2e2e]">
          <p className="m-0 mb-0">
            Lleidahack et dona la benvinguda a la HackEPS 2025, la primera
            hackató de les terres de Lleida!
          </p>
          <p className="m-0 mb-0">
            La novena edició de la HackEPS tindrà lloc a l&apos;edifici de
            l&apos;
            <span className="font-bold">Escola Politècnica</span>{" "}
            <span className="font-bold">
              Superior de la Universitat de Lleida
            </span>{" "}
            els dies
            <span className="font-bold"> 22 i 23 de novembre de 2025</span>.
            Aquest és un esdeveniment que no voldràs perdre&apos;t!
          </p>
          <p className="m-0">
            Així que, si ets un apassionat de la tecnologia, amant dels reptes i
            defensor del treball en equip, la HackEPS 2025 és el teu lloc.
            Uneix-te a nosaltres per a una experiència inoblidable per a
            desenvolupar-te com a futur programador!
          </p>
        </div>
      </section>
      <DatesHorari />
    </div>
  );
};

export default DatesContent;
