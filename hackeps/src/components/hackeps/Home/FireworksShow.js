import React, { useRef } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import firework1 from "src/assets/img/home10/firework-1.svg";
import firework2 from "src/assets/img/home10/firework-2.svg";
import firework3 from "src/assets/img/home10/firework-3.svg";

gsap.registerPlugin(useGSAP);

// Each burst is launched by a rocket in its own colour.
const ARTWORK = [
  { src: firework1, color: "#42b69f" },
  { src: firework2, color: "#ffe245" },
  { src: firework3, color: "#e94447" },
];
const BURSTS = 22;
const FINALE = 5;

/** Fills the viewport with fireworks for a few seconds, then calls onDone. */
const FireworksShow = ({ onDone }) => {
  const layer = useRef(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const unit = Math.min(width, height) / 100;
      const tl = gsap.timeline({ onComplete: onDone });

      const launch = (at, size, x, y, art) => {
        const burst = document.createElement("img");
        burst.src = art.src;
        burst.alt = "";
        Object.assign(burst.style, {
          position: "absolute",
          left: `${x}px`,
          top: `${y}px`,
          width: `${size}px`,
          maxWidth: "none",
        });
        layer.current.appendChild(burst);
        gsap.set(burst, { xPercent: -50, yPercent: -50, opacity: 0 });

        let burstAt = at;
        if (!reduced) {
          const rocket = document.createElement("span");
          Object.assign(rocket.style, {
            position: "absolute",
            left: `${x}px`,
            top: `${height}px`,
            width: `${0.6 * unit}px`,
            height: `${4 * unit}px`,
            borderRadius: "999px",
            background: `linear-gradient(to top, transparent, ${art.color})`,
          });
          layer.current.appendChild(rocket);
          tl.fromTo(
            rocket,
            { xPercent: -50, y: 0, opacity: 1 },
            { xPercent: -50, y: y - height, opacity: 1, duration: 0.55, ease: "power2.out" },
            at,
          ).set(rocket, { opacity: 0 }, at + 0.55);
          burstAt = at + 0.55;
        }

        const spin = (Math.random() - 0.5) * 40;
        tl.fromTo(
          burst,
          { clipPath: "circle(0% at 50% 50%)", scale: reduced ? 1 : 0.5, rotation: spin - 12, opacity: 1 },
          { clipPath: "circle(75% at 50% 50%)", scale: 1, rotation: spin, opacity: 1, duration: 0.6, ease: "expo.out" },
          burstAt,
        ).to(
          burst,
          { opacity: 0, scale: reduced ? 1 : 1.1, y: reduced ? 0 : 3 * unit, duration: 0.7, ease: "power1.in" },
          burstAt + 0.55,
        );
      };

      const bursts = reduced ? 8 : BURSTS;
      for (let i = 0; i < bursts; i++) {
        launch(
          (i / bursts) * 3.4 + Math.random() * 0.2,
          (22 + Math.random() * 24) * unit,
          width * (0.08 + Math.random() * 0.84),
          height * (0.12 + Math.random() * 0.55),
          ARTWORK[i % ARTWORK.length],
        );
      }
      // Finale: a row of big bursts at once.
      for (let i = 0; i < FINALE; i++) {
        launch(
          3.7 + i * 0.05,
          44 * unit,
          width * ((i + 0.5) / FINALE),
          height * (i % 2 ? 0.3 : 0.4),
          ARTWORK[i % ARTWORK.length],
        );
      }
    },
    { scope: layer },
  );

  return createPortal(
    <div
      ref={layer}
      aria-hidden="true"
      data-testid="fireworks-show"
      className="pointer-events-none fixed inset-0 z-[90] overflow-hidden"
    />,
    document.body,
  );
};

export default FireworksShow;
