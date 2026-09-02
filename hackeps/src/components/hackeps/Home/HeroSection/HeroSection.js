import React, { useEffect, useState } from "react";
import MainTitle from "src/components/hackeps/Home/MainTitle.js";
import HomeCountdown from "src/components/hackeps/Home/HomeCountdown.js";
import banderilles from "src/assets/img/home10/banderilles.png";
import mlhBadge from "src/assets/img/home10/mlh.png";
import cloud1 from "src/assets/img/home10/cloud-1.png";
import cloud2 from "src/assets/img/home10/cloud-2.png";
import cloud3 from "src/assets/img/home10/cloud-3.png";
import cloudWave from "src/assets/img/home10/cloud-wave.png";

const HeroSection = ({ initialDate, finalDate, activeTimer }) => {
  const [startDate, setStartDate] = useState(initialDate);
  const [endDate, setEndDate] = useState(finalDate);
  const [timerActive, setTimerActive] = useState(activeTimer);

  useEffect(() => {
    setStartDate(initialDate);
    setEndDate(finalDate);
    setTimerActive(activeTimer);
  }, [initialDate, finalDate, activeTimer]);

  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative w-full bg-[#94cbf5] min-h-[1037px]">
        <img
          src={banderilles}
          alt=""
          aria-hidden="true"
          width={1728}
          height={236}
          className="pointer-events-none absolute left-[-6px] top-[23px] z-20 h-[236px] w-[1728px] max-w-none object-cover"
        />

        <a
          href="https://mlh.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute left-[132px] top-[-23px] z-30 block h-[356px] w-[187px]"
          aria-label="Major League Hacking"
        >
          <img
            src={mlhBadge}
            alt="MLH"
            width={187}
            height={356}
            className="h-[356px] w-[187px] max-w-none object-cover"
          />
        </a>

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

      <img
        src={cloudWave}
        alt=""
        aria-hidden="true"
        width={1728}
        height={321}
        className="relative z-10 -mt-[80px] block h-[321px] w-full object-cover object-bottom"
      />

      <div className="relative z-20 flex h-[206px] w-full items-center justify-center bg-white px-4">
        <HomeCountdown
          startTime={startDate}
          endTime={endDate}
          timerActive={timerActive}
        />
      </div>
    </div>
  );
};

export default HeroSection;
