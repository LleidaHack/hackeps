import { useEffect, useState } from "react";
import "./HomeCountdown.css";

const HomeCountdown = (props) => {
  const [nowDay, setNowDay] = useState(() => Date.now());
  const active = Boolean(props.timerActive);
  const startTime = props.startTime;
  const endTime = props.endTime;
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const countdown = start >= nowDay ? start : end;

  function getRemainingTimeUntilMsTimestamp(target, now) {
    const timeDifference = target - now;
    if (timeDifference < 0) {
      return { seconds: 0, minutes: 0, hours: 0, days: 0, months: 0 };
    }
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const mesos = Math.floor(days / 30);
    return {
      seconds: seconds % 60,
      minutes: minutes % 60,
      hours: hours % 24,
      days: days % 30,
      months: mesos,
    };
  }

  const remainingTime = getRemainingTimeUntilMsTimestamp(countdown, nowDay);

  useEffect(() => {
    const intervalId = setInterval(() => setNowDay(Date.now()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  if (!active || !Number.isFinite(start) || !Number.isFinite(end)) {
    return null;
  }

  return (
    <p className="home-countdown m-0 font-space-mono text-[#2e2e2e]">
      <span className="home-countdown-unit">
        <span className="home-countdown-value">{remainingTime.months}</span>
        <span>mes{remainingTime.months !== 1 ? "os" : ""}</span>
      </span>
      <span className="home-countdown-unit">
        <span className="home-countdown-value">{remainingTime.days}</span>
        <span>di{remainingTime.days === 1 ? "a" : "es"}</span>
      </span>
      <span className="home-countdown-unit">
        <span className="home-countdown-value">{remainingTime.hours}</span>
        <span>hor{remainingTime.hours === 1 ? "a" : "es"}</span>
      </span>
    </p>
  );
};

export default HomeCountdown;
