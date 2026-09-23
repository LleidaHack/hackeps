import React from "react";
import firework1 from "src/assets/img/home10/firework-1.svg";
import firework2 from "src/assets/img/home10/firework-2.svg";
import firework3 from "src/assets/img/home10/firework-3.svg";
import cabeza1 from "src/assets/img/home10/cabeza1.svg";
import cabeza2 from "src/assets/img/home10/cabeza2.svg";
import cabeza3 from "src/assets/img/home10/cabeza3.svg";
import cabeza4 from "src/assets/img/home10/cabeza4.svg";
import cabeza5 from "src/assets/img/home10/cabeza5.svg";
import cabeza6 from "src/assets/img/home10/cabeza6.svg";

// Position (% of the hero sky) and artwork of the decorations that only
// exist during the intro.
const FIREWORKS = [
  { src: firework1, x: 24, y: 34 },
  { src: firework2, x: 76, y: 30 },
  { src: firework3, x: 82, y: 64 },
  { src: firework2, x: 18, y: 66 },
  { src: firework1, x: 62, y: 18 },
  { src: firework3, x: 38, y: 74 },
];
const HEADS = [
  { src: cabeza1, x: 4 },
  { src: cabeza6, x: 96 },
  { src: cabeza2, x: 13 },
  { src: cabeza4, x: 87 },
  { src: cabeza5, x: 22 },
  { src: cabeza3, x: 78 },
];

// Rendered inside the hero while the intro runs; HomeIntro animates them.
const HeroIntroExtras = () => (
  <>
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[6] overflow-hidden"
    >
      {FIREWORKS.map(({ src, x, y }, i) => (
        <img
          key={i}
          data-intro-extra="firework"
          src={src}
          alt=""
          className="absolute w-[clamp(120px,22vw,380px)]"
          style={{ left: `${x}%`, top: `${y}%` }}
        />
      ))}
    </div>
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
    >
      {HEADS.map(({ src, x }, i) => (
        <img
          key={i}
          data-intro-extra="head"
          src={src}
          alt=""
          className="absolute bottom-[4%] w-[clamp(72px,11vw,210px)]"
          style={{ left: `${x}%` }}
        />
      ))}
    </div>
  </>
);

export default HeroIntroExtras;
