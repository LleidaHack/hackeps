import "./Firework.css";

const Firework = ({ src, width, height, className = "", style, phase = 0 }) => (
  <img
    src={src}
    alt=""
    aria-hidden="true"
    width={width}
    height={height}
    style={{ animationDelay: `${-phase * 3}s`, ...style }}
    className={`ambient-firework pointer-events-none absolute max-w-none object-contain ${className}`}
  />
);

export default Firework;
