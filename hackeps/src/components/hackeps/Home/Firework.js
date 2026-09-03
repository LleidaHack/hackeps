import { useEffect, useState } from "react";

const Firework = ({ src, width, height, className = "", style }) => {
  const [lit, setLit] = useState(false);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) {
      setLit(true);
      return undefined;
    }

    let timeoutId;
    const hideThenWait = () => {
      setLit(false);
      timeoutId = setTimeout(show, 2200 + Math.random() * 4500);
    };
    const show = () => {
      setLit(true);
      timeoutId = setTimeout(hideThenWait, 2800 + Math.random() * 3200);
    };
    timeoutId = setTimeout(show, 400 + Math.random() * 2500);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      width={width}
      height={height}
      style={style}
      className={`pointer-events-none absolute max-w-none object-contain transition-[opacity,transform] duration-[1800ms] ease-in-out ${
        lit ? "scale-105 opacity-90" : "scale-95 opacity-0"
      } ${className}`}
    />
  );
};

export default Firework;
