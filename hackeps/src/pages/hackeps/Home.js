import React, { lazy, Suspense, useEffect, useState } from "react";
import HomeFrame from "src/components/hackeps/Home/HomeFrame.js";
import HomeHeader from "src/components/hackeps/Home/HomeHeader.js";
import Sponsors, {
  SeuVellaFooter,
} from "src/components/hackeps/Home/Sponsors.js";
import HeroSection from "src/components/hackeps/Home/HeroSection/HeroSection.js";
import Identify from "src/components/hackeps/Home/Identify.js";
import Newsletter from "src/components/hackeps/Home/Newsletter.js";
import Activities from "src/components/hackeps/Home/Activities.js";
import Records from "src/components/hackeps/Home/Records.js";
import { getHackeps } from "src/services/EventService";
import { getEventIsHackerRegistered } from "src/services/EventService";
import { useSiteTheme } from "src/hooks/useSiteTheme";

const Animation = lazy(() => import("src/pages/hackeps/Animation.js"));

const Home = () => {
  const { sky, gradient } = useSiteTheme();
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
      try {
        const response = await getHackeps();
        if (!response || !response.start_date || !response.end_date) {
          return;
        }
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
      } catch (error) {
        if (process.env.REACT_APP_DEBUG === "true") {
          console.log(error);
        }
      }
    }
    getDates();
  }, []);

  const timerActive = true;

  if (!showAnimation) {
    return (
      <div className="w-full overflow-x-hidden" style={{ backgroundColor: sky }}>
        <HomeHeader />
        <HomeFrame>
          <HeroSection
            initialDate={startDate}
            finalDate={endDate}
            activeTimer={timerActive}
          />
          <Identify />
          <Newsletter />
          <div className="w-full" style={{ background: gradient }}>
            <Activities />
            <Records />
            <Sponsors />
          </div>
        </HomeFrame>
        <SeuVellaFooter />
      </div>
    );
  }

  return (
    <div>
      <Suspense fallback={null}>
        <Animation
          initialDate={startDate}
          finalDate={endDate}
          activeTimer={timerActive}
        />
      </Suspense>
    </div>
  );
};

export default Home;
