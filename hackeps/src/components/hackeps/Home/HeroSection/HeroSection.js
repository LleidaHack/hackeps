import React, { useEffect, useState } from "react";
import MainTitle from "src/components/hackeps/Home/MainTitle.js";
import HomeCountdown from "src/components/hackeps/Home/HomeCountdown.js";
import banderilles from "src/assets/img/home10/banderilles.png";
import cloud1 from "src/assets/img/home10/cloud-1.png";
import cloud2 from "src/assets/img/home10/cloud-2.png";
import cloud3 from "src/assets/img/home10/cloud-3.png";
import cloudWave from "src/assets/img/home10/cloud-wave.png";

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
      <div className="relative min-h-[1037px] w-full" style={{ backgroundColor: sky }}>
        <img
          src={banderilles}
          alt=""
          aria-hidden="true"
          width={1728}
          height={236}
          className="pointer-events-none absolute left-0 top-0 z-20 h-[236px] w-[1728px] max-w-none object-contain object-top"
        />

        <img
          src={cloud1}
          alt=""
          aria-hidden="true"
          width={425}
          height={214}
          className="pointer-events-none absolute left-[1221px] top-[259px] z-[5] h-[214px] w-[425px] max-w-none object-contain"
        />
        <img
          src={cloud2}
          alt=""
          aria-hidden="true"
          width={435}
          height={219}
          className="pointer-events-none absolute left-[78px] top-[684px] z-[5] h-[219px] w-[435px] max-w-none object-contain"
        />
        <img
          src={cloud3}
          alt=""
          aria-hidden="true"
          width={368}
          height={163}
          className="pointer-events-none absolute left-[1126px] top-[813px] z-[5] h-[163px] w-[368px] max-w-none object-contain"
        />

        <div className="absolute left-1/2 top-[259px] z-10 w-[577px] max-w-[90vw] -translate-x-1/2">
          <MainTitle buttonText="Apuntat!" />
        </div>
      </div>

      <div className="relative z-10 -mt-[80px] w-full" style={{ backgroundColor: sky }}>
        <img
          src={cloudWave}
          alt=""
          aria-hidden="true"
          width={1728}
          height={321}
          className="relative z-10 block h-[321px] w-full object-contain object-bottom"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
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
