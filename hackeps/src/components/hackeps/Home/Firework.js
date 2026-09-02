import { useEffect, useState } from "react";

const Firework = ({ src, width, height, className = "", style }) => {
  const [lit, setLit] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLit(true);
      return undefined;
    }

    let timeoutId;
    const hideThenWait = () => {
      setLit(false);
      timeoutId = setTimeout(show, 700 + Math.random() * 2800);
    };
    const show = () => {
      setLit(true);
      timeoutId = setTimeout(hideThenWait, 500 + Math.random() * 1100);
    };
    timeoutId = setTimeout(show, Math.random() * 1800);
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
      className={`pointer-events-none absolute max-w-none object-cover transition-[opacity,transform] duration-700 ease-out ${
        lit ? "scale-110 opacity-100" : "scale-75 opacity-0"
      } ${className}`}
    />
  );
};

export default Firework;
