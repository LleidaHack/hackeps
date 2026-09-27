import React from "react";
import DatesCalendar from "src/components/hackeps/Dates/DatesCalendar.js";
import DatesHorari from "src/components/hackeps/Dates/DatesHorari.js";
import cloud2 from "src/assets/img/home10/cloud-2.svg";
import cloud5 from "src/assets/img/home10/cloud-5.svg";
import { useSiteTheme } from "src/hooks/useSiteTheme";

// Home section: calendar plus the programme. The welcome text lives in the
// "Registra't" section just above it.
const DatesContent = () => {
  const { sky, text } = useSiteTheme();

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
          className="ambient-cloud ambient-cloud--2 ambient-cloud--left pointer-events-none absolute right-[-12%] top-[24px] h-auto w-[42%] max-w-[280px] object-contain md:right-[-30px] md:top-[40px] md:w-[380px] md:max-w-none lg:h-[170px]"
        />
        <img
          src={cloud2}
          alt=""
          aria-hidden="true"
          width={420}
          height={210}
          className="ambient-cloud ambient-cloud--2 ambient-cloud--right pointer-events-none absolute bottom-[-12px] left-[-14%] h-auto w-[48%] max-w-[300px] object-contain md:bottom-[-20px] md:left-[-40px] md:w-[420px] md:max-w-none lg:h-[210px]"
        />

        <h2
          className="relative z-10 m-0 text-center font-space-mono text-[32px] font-bold leading-tight tracking-[-0.64px] md:text-[48px] lg:text-[64px] lg:tracking-[-1.28px]"
          style={{ color: text }}
        >
          DATES
        </h2>
        <div className="relative z-10 mt-6 md:mt-8 lg:mt-10">
          <DatesCalendar />
        </div>
      </section>
      <DatesHorari />
    </div>
  );
};

export default DatesContent;
