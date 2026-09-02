import React, { useEffect } from "react";
import DatesCalendar from "src/components/hackeps/Dates/DatesCalendar.js";
import DatesHorari from "src/components/hackeps/Dates/DatesHorari.js";
import cloud2 from "src/assets/img/home10/cloud-2.png";
import cloud5 from "src/assets/img/home10/cloud-5.png";
import { useSiteTheme } from "src/hooks/useSiteTheme";

const DatesContent = () => {
  const { sky, text } = useSiteTheme();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full" style={{ backgroundColor: sky }}>
      <section
        id="dates"
        className="relative w-full overflow-hidden pb-[80px] pt-[72px]"
        style={{ backgroundColor: sky }}
      >
        <img
          src={cloud5}
          alt=""
          aria-hidden="true"
          width={380}
          height={170}
          className="pointer-events-none absolute right-[-30px] top-[40px] h-[170px] w-[380px] max-w-none object-contain"
        />
        <img
          src={cloud2}
          alt=""
          aria-hidden="true"
          width={420}
          height={210}
          className="pointer-events-none absolute bottom-[-20px] left-[-40px] h-[210px] w-[420px] max-w-none object-contain"
        />

        <h1
          className="relative z-10 m-0 mb-[64px] text-center font-space-mono text-[64px] font-bold leading-normal tracking-[-1.28px]"
          style={{ color: text }}
        >
          DATES
        </h1>
        <div className="relative z-10">
          <DatesCalendar />
        </div>
        <div
          className="relative z-10 mx-auto mt-[80px] w-[952px] max-w-[90vw] text-center font-space-mono text-[24px] leading-normal tracking-[-0.48px]"
          style={{ color: text }}
        >
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
