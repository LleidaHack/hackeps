import React, { useEffect } from "react";
import DatesCalendar from "src/components/hackeps/Dates/DatesCalendar.js";
import DatesHorari from "src/components/hackeps/Dates/DatesHorari.js";
import cloud2 from "src/assets/img/home10/cloud-2.svg";
import cloud5 from "src/assets/img/home10/cloud-5.svg";
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
        className="relative w-full overflow-hidden px-4 pb-12 pt-10 md:px-8 md:pb-16 md:pt-16 lg:px-12 lg:pb-[80px] lg:pt-[72px]"
        style={{ backgroundColor: sky }}
      >
        <img
          src={cloud5}
          alt=""
          aria-hidden="true"
          width={380}
          height={170}
          className="pointer-events-none absolute right-[-12%] top-[24px] h-auto w-[42%] max-w-[280px] object-contain md:right-[-30px] md:top-[40px] md:w-[380px] md:max-w-none lg:h-[170px]"
        />
        <img
          src={cloud2}
          alt=""
          aria-hidden="true"
          width={420}
          height={210}
          className="pointer-events-none absolute bottom-[-12px] left-[-14%] h-auto w-[48%] max-w-[300px] object-contain md:bottom-[-20px] md:left-[-40px] md:w-[420px] md:max-w-none lg:h-[210px]"
        />

        <h1
          className="relative z-10 m-0 text-center font-space-mono text-[32px] font-bold leading-tight tracking-[-0.64px] md:text-[48px] lg:text-[64px] lg:tracking-[-1.28px]"
          style={{ color: text }}
        >
          DATES
        </h1>
        <div className="relative z-10 mt-6 md:mt-8 lg:mt-10">
          <DatesCalendar />
        </div>
        <div
          className="relative z-10 mx-auto mt-10 w-full max-w-[952px] px-1 text-center font-space-mono text-[16px] leading-relaxed tracking-[-0.32px] md:mt-14 md:text-[20px] md:leading-normal lg:mt-[80px] lg:text-[24px] lg:tracking-[-0.48px]"
          style={{ color: text }}
        >
          <p className="m-0 mb-4 md:mb-0">
            Lleidahack et dona la benvinguda a la HackEPS 2026, la primera
            hackató de les terres de Lleida!
          </p>
          <p className="m-0 mb-4 md:mb-0">
            La desena edició de la HackEPS tindrà lloc a l&apos;edifici de
            l&apos;
            <span className="font-bold">Escola Politècnica</span>{" "}
            <span className="font-bold">
              Superior de la Universitat de Lleida
            </span>{" "}
            els dies
            <span className="font-bold"> 28 i 29 de novembre de 2026</span>.
            Aquest és un esdeveniment que no voldràs perdre&apos;t!
          </p>
          <p className="m-0">
            Així que, si ets un apassionat de la tecnologia, amant dels reptes i
            defensor del treball en equip, la HackEPS 2026 és el teu lloc.
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
