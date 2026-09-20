import React, { useEffect, useState } from "react";
import MainTitle from "src/components/hackeps/Home/MainTitle.js";
import HomeCountdown from "src/components/hackeps/Home/HomeCountdown.js";
import banderilles from "src/assets/img/home10/banderilles.svg";
import cloud1 from "src/assets/img/home10/cloud-1.svg";
import cloud2 from "src/assets/img/home10/cloud-2.svg";
import cloud3 from "src/assets/img/home10/cloud-3.svg";
import cloudWave from "src/assets/img/home10/cloud-wave.webp";

import { useSiteTheme } from "src/hooks/useSiteTheme";

const HeroSection = ({ initialDate, finalDate, activeTimer }) => {
  const { sky } = useSiteTheme();
  const [startDate, setStartDate] = useState(initialDate);
  const [endDate, setEndDate] = useState(finalDate);
  const [timerActive, setTimerActive] = useState(activeTimer);

  useEffect(() => {
    setStartDate(initialDate);
    setEndDate(finalDate);
    setTimerActive(activeTimer);
  }, [initialDate, finalDate, activeTimer]);

  return (
    <div className="relative w-full overflow-hidden" style={{ backgroundColor: sky }}>
      <div className="relative w-full pb-14 pt-0 md:pb-12" style={{ backgroundColor: sky }}>
        <img
          src={banderilles}
          alt=""
          aria-hidden="true"
          width={1728}
          height={236}
          className="pointer-events-none relative z-20 mx-auto block h-auto w-full max-w-[1728px] object-contain object-top"
        />

        <img
          src={cloud1}
          alt=""
          aria-hidden="true"
          width={425}
          height={214}
          className="ambient-cloud ambient-cloud--1 ambient-cloud--left pointer-events-none absolute right-[4%] top-[22%] z-[5] h-auto w-[28%] max-w-[320px] object-contain"
        />
        <img
          src={cloud2}
          alt=""
          aria-hidden="true"
          width={435}
          height={219}
          className="ambient-cloud ambient-cloud--2 ambient-cloud--right pointer-events-none absolute bottom-[14%] left-[6%] z-[5] h-auto w-[30%] max-w-[340px] object-contain"
        />
        <img
          src={cloud3}
          alt=""
          aria-hidden="true"
          width={368}
          height={163}
          className="ambient-cloud ambient-cloud--0 ambient-cloud--left pointer-events-none absolute bottom-[4%] right-[4%] z-[5] h-auto w-[24%] max-w-[280px] object-contain"
        />

        <div className="relative z-10 mx-auto mt-2 w-full max-w-[577px] px-4 md:mt-[-40px]">
          <MainTitle buttonText="Apuntat!" />
        </div>
      </div>

      <div className="relative z-10 mt-0 w-full md:-mt-10" style={{ backgroundColor: sky }}>
        <img
          src={cloudWave}
          alt=""
          aria-hidden="true"
          width={1728}
          height={321}
          className="relative z-10 block h-auto w-full max-w-none"
        />
        {/* Match the white artwork bounds, excluding the transparent PNG margins. */}
        <div className="absolute inset-x-0 top-[5.92%] bottom-[10.75%] z-20 flex items-center justify-center px-3">
          <HomeCountdown
            startTime={startDate}
            endTime={endDate}
            timerActive={timerActive}
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
