import { useEffect, useState } from "react";

const HomeCountdown = (props) => {
  const nowDay = new Date();
  const active = Boolean(props.timerActive);
  const defaultStartTime = new Date(new Date().getFullYear(), 10, 22);
  const defaultEndTime = new Date(new Date().getFullYear(), 10, 23);
  const startTime = props.startTime || defaultStartTime;
  const endTime = props.endTime || defaultEndTime;
  const countdown = startTime >= endTime ? startTime : endTime;

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

  const [remainingTime, setRemainingTime] = useState(
    getRemainingTimeUntilMsTimestamp(countdown, nowDay),
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const target =
        props.startTime && props.startTime >= now
          ? props.startTime
          : props.endTime || countdown;
      setRemainingTime(getRemainingTimeUntilMsTimestamp(target, now));
    }, 1000);
    return () => clearInterval(intervalId);
  }, [props.startTime, props.endTime, countdown]);

  if (!active) {
    return null;
  }

  return (
    <p className="m-0 max-w-full overflow-x-auto whitespace-nowrap text-center font-space-mono tracking-[-2.56px] text-[#2e2e2e]">
      <span className="text-[96px] leading-normal">{remainingTime.months}</span>
      <span className="text-[64px] leading-normal"> </span>
      <span className="text-[48px] leading-normal">
        mes{remainingTime.months !== 1 ? "os" : ""}
      </span>
      <span className="text-[64px] leading-normal"> </span>
      <span className="text-[96px] leading-normal">{remainingTime.days}</span>
      <span className="text-[64px] leading-normal"> </span>
      <span className="text-[48px] leading-normal">
        di{remainingTime.days === 1 ? "a" : "es"}
      </span>
      <span className="text-[64px] leading-normal"> </span>
      <span className="text-[96px] leading-normal">{remainingTime.hours}</span>
      <span className="text-[64px] leading-normal"> </span>
      <span className="text-[48px] leading-normal">
        hor{remainingTime.hours === 1 ? "a" : "es"}
      </span>
    </p>
  );
};

export default HomeCountdown;
