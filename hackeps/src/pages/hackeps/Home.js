import React, { useEffect, useState } from "react";
import Header from "src/components/hackeps/Header/Header.js";
import CalendarDates from "src/components/hackeps/Home/Calendar.js";
import Sponsors from "src/components/hackeps/Home/Sponsors.js";
import HeroSection from "src/components/hackeps/Home/HeroSection/HeroSection.js";
import Identify from "src/components/hackeps/Home/Identify.js";
import Newsletter from "src/components/hackeps/Home/Newsletter.js";
import Activities from "src/components/hackeps/Home/Activities.js";
import Records from "src/components/hackeps/Home/Records.js";
import HomeFooter from "src/components/hackeps/Home/HomeFooter.js";
import { getHackeps } from "src/services/EventService";
import Animation from "src/pages/hackeps/Animation.js";
import { getEventIsHackerRegistered } from "src/services/EventService";

const Home = () => {
  const [startDate, setStartDate] = useState(undefined);
  const [endDate, setEndDate] = useState(undefined);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const minimalTime = 2 * 60 * 60 * 1000;
    if (process.env.REACT_APP_DEBUG === "true") {
      console.log(process.env.REACT_APP_HERO_ANIMATED);
    }
    if (process.env.REACT_APP_HERO_ANIMATED === "1") {
      const lastAnimation = localStorage.getItem("lastAnimation");
      const now = Date.now();
      if (!lastAnimation || now - Number(lastAnimation) >= minimalTime) {
        setShowAnimation(true);
        localStorage.setItem("lastAnimation", now);
      }
    }
  }, []);

  useEffect(() => {
    async function getDates() {
      const response = await getHackeps();
      const start = new Date(response.start_date);
      start.setMonth(start.getMonth());
      const end = new Date(response.end_date);
      localStorage.setItem("event", JSON.stringify(response));
      end.setMonth(end.getMonth());
      setStartDate(start);
      setEndDate(end);
      if (localStorage.getItem("userID") !== null) {
        const isRegistered = await getEventIsHackerRegistered(
          response.id,
          localStorage.getItem("userID"),
        );
        if (isRegistered) {
          localStorage.setItem("registeredOnEvent", "true");
        }
      }
    }
    getDates();
  }, []);

  const timerActive = true;

  if (!showAnimation) {
    return (
      <div className="bg-skyDay">
        <Header />
        <HeroSection
          initialDate={startDate}
          finalDate={endDate}
          activeTimer={timerActive}
        />
        <Identify />
        <CalendarDates startDate={startDate} endDate={endDate} />
        <Newsletter />
        <Activities />
        <Records />
        <Sponsors />
        <HomeFooter />
      </div>
    );
  }

  return (
    <div>
      <Animation
        initialDate={startDate}
        finalDate={endDate}
        activeTimer={timerActive}
      />
    </div>
  );
};

export default Home;
