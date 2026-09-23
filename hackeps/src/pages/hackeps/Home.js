import React, { lazy, Suspense, useCallback, useEffect, useState } from "react";
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
import { getHackeps, getEventSponsors } from "src/services/EventService";
import { getEventIsHackerRegistered } from "src/services/EventService";
import { useSiteTheme } from "src/hooks/useSiteTheme";

// If the intro cannot be downloaded, drop the intro rather than the page.
const SkipIntro = ({ onFinish }) => {
  useEffect(() => onFinish(), [onFinish]);
  return null;
};

// GSAP is only downloaded when the intro actually plays.
const HomeIntro = lazy(() =>
  import("src/components/hackeps/Home/HomeIntro.js").catch(() => ({
    default: SkipIntro,
  })),
);

const INTRO_INTERVAL_MS = 2 * 60 * 60 * 1000;

// At most once every two hours, and never when the visitor asks for less
// motion or less data. Pure, so it can seed state before the first paint.
function shouldPlayIntro() {
  if (process.env.REACT_APP_HERO_ANIMATED !== "1") return false;
  // `/?intro` replays it on demand, e.g. to review it.
  if (new URLSearchParams(window.location.search).has("intro")) return true;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }
  if (navigator.connection?.saveData) return false;
  const lastAnimation = Number(localStorage.getItem("lastAnimation"));
  return !lastAnimation || Date.now() - lastAnimation >= INTRO_INTERVAL_MS;
}

const Home = () => {
  const { sky, gradient } = useSiteTheme();
  const [startDate, setStartDate] = useState(undefined);
  const [endDate, setEndDate] = useState(undefined);
  const [eventUnavailable, setEventUnavailable] = useState(false);
  const [showAnimation, setShowAnimation] = useState(shouldPlayIntro);
  const hideIntro = useCallback(() => setShowAnimation(false), []);

  useEffect(() => {
    if (showAnimation) localStorage.setItem("lastAnimation", Date.now());
  }, [showAnimation]);

  useEffect(() => {
    async function getDates() {
      try {
        const response = await getHackeps();
        if (!response || !response.start_date || !response.end_date) {
          setEventUnavailable(true);
          return;
        }
        // Start loading logos even while the optional intro animation is shown.
        if (response.id) void getEventSponsors(response.id).catch(() => {});
        const start = new Date(response.start_date);
        const end = new Date(response.end_date);
        setStartDate(start);
        setEndDate(end);
        if (localStorage.getItem("userID") !== null) {
          const isRegistered = await getEventIsHackerRegistered(
            response.id,
            localStorage.getItem("userID"),
          );
          localStorage.setItem("registeredOnEvent", isRegistered === true ? String(response.id) : "");
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

  return (
    <div
      className="w-full overflow-x-clip"
      style={{ backgroundColor: sky }}
    >
      {showAnimation && (
        // The fallback is the intro's first frame, so the page never flashes.
        <Suspense fallback={<div className="fixed inset-0 z-[100] bg-[#2e2e2e]" />}>
          <HomeIntro onFinish={hideIntro} />
        </Suspense>
      )}
      <HomeHeader />
      <HomeFrame fluid>
        <HeroSection
          initialDate={startDate}
          finalDate={endDate}
          activeTimer={timerActive}
          intro={showAnimation}
        />
        {eventUnavailable && (
          <p role="status" className="m-0 p-4 text-center text-[#2e2e2e]">
            No hem pogut carregar la informació actualitzada de
            l’esdeveniment. Torna-ho a provar més tard.
          </p>
        )}
        <Identify />
        {/* <Newsletter /> */}
        <div className="w-full" style={{ background: gradient }}>
          <Activities />
          <Records />
          <Sponsors />
        </div>
      </HomeFrame>
      <SeuVellaFooter />
    </div>
  );
};

export default Home;
