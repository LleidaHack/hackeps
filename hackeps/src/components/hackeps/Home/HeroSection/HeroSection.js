import React, { useEffect, useState } from "react";
import CountdownTimer from "src/components/hackeps/Home/Timer.js";
import MainTitle from "src/components/hackeps/Home/MainTitle.js";
import banderilles from "src/assets/img/home10/banderilles.png";
import mlhBadge from "src/assets/img/home10/mlh.png";
import cloud1 from "src/assets/img/home10/cloud-1.png";
import cloud2 from "src/assets/img/home10/cloud-2.png";
import cloud3 from "src/assets/img/home10/cloud-3.png";
import cloudWave from "src/assets/img/home10/cloud-wave.png";
import "./HeroSection.css";

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
    <div className="overflow-hidden relative z-10">
      <div className="hero-sky flex flex-col items-center justify-center bg-skyDay">
        <img
          src={banderilles}
          alt=""
          aria-hidden="true"
          className="hero-bunting pointer-events-none"
          width={1728}
          height={236}
        />

        <a
          href="https://mlh.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="mlh-badge"
          aria-label="Major League Hacking"
        >
          <img src={mlhBadge} alt="MLH" width={187} height={356} />
        </a>

        <div aria-hidden="true" className="hero-clouds">
          <img
            src={cloud1}
            alt=""
            className="hero-cloud hero-cloud-1"
            width={425}
            height={214}
          />
          <img
            src={cloud2}
            alt=""
            className="hero-cloud hero-cloud-2"
            width={435}
            height={219}
          />
          <img
            src={cloud3}
            alt=""
            className="hero-cloud hero-cloud-3"
            width={368}
            height={163}
          />
        </div>

        <div className="hero-logo-container mt-20 md:mt-24 mb-6 px-4">
          <MainTitle />
        </div>

        <div className="hero-sea">
          <img
            src={cloudWave}
            alt=""
            aria-hidden="true"
            className="wave-svg w-full"
            width={1728}
            height={321}
          />
        </div>
      </div>

      <div className="hero-countdown bg-white">
        <CountdownTimer
          startTime={startDate}
          endTime={endDate}
          timerActive={timerActive}
        />
      </div>
    </div>
  );
};

export default HeroSection;
