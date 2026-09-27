import React, { lazy, Suspense, useRef, useState } from "react";
import seuVella from "src/assets/img/home10/seu-vella.svg";
import "./SeuVellaScene.css";
import firework from "src/assets/img/home10/firework-1.svg";

// The waiting page shows this scene too: keep GSAP out of its bundle. A
// failed download just ends the show.
const FireworksShow = lazy(() =>
  import("src/components/hackeps/Home/FireworksShow").catch(() => ({
    default: ({ onDone }) => {
      setTimeout(onDone);
      return null;
    },
  })),
);

const CLICKS_FOR_SHOW = 5;
// Clicks further apart than this start the count again.
const CLICK_WINDOW_MS = 3000;

const TREE_TOP =
  "M14 115 C-16 112 -12 73 12 68 C7 37 28 19 46 31 C57 -7 95 14 88 42 C120 38 127 65 113 79 C147 100 121 126 101 119Z";

// All layers share one coordinate system, so zoom cannot separate the hills,
// trees and castle. A 1px overlap hides subpixel seams against the footer.
export default function SeuVellaScene() {
  const clicks = useRef({ count: 0, last: 0 });
  const [fireworks, setFireworks] = useState(false);
  const [drops, setDrops] = useState([0, 0]);
  const apples = (tree) => [
    { x: 27, y: 77 }, { x: 68, y: 49 }, { x: 95, y: 96 },
  ].map(({ x, y }, index) => (
    <g key={index} transform={`translate(${x} ${y})`} aria-hidden="true">
      <g key={drops[tree]}
        className={drops[tree] > 0 && index === (drops[tree] - 1) % 3 ? "tree-apple tree-apple--falling" : "tree-apple"}
        style={{ "--apple-fall": `${175 - y}px` }}>
        <path d="M0 -5 Q-9 -11 -10 -1 Q-9 11 -2 10 Q0 8 2 10 Q9 11 10 -1 Q9 -11 0 -5Z" fill="#db4935" />
        <path d="M0 -5 Q-1 -10 2 -13" fill="none" stroke="#684633" strokeWidth="2" />
        <path d="M1 -8 Q4 -16 10 -11 Q7 -5 1 -8Z" fill="#23755b" />
      </g>
    </g>
  ));

  // Easter egg: every click sways the tree; five in a row set off fireworks.
  const shakeTree = (event, tree) => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    setDrops(values => values.map((value, index) => index === tree ? value + 1 : value));
    const now = Date.now();
    const state = clicks.current;
    state.count = now - state.last > CLICK_WINDOW_MS ? 1 : state.count + 1;
    state.last = now;
    event.currentTarget.firstChild.animate?.(
      ["0deg", "-7deg", "5deg", "-3deg", "0deg"].map((angle) => ({
        transform: `rotate(${angle})`,
      })),
      { duration: 500, easing: "ease-in-out" },
    );
    if (state.count >= CLICKS_FOR_SHOW) {
      state.count = 0;
      setFireworks(true);
    }
  };

  return (
    <>
      <svg
        viewBox="0 0 1200 460"
        className="-mb-px block h-auto w-full"
        role="group"
        aria-label="La Seu Vella de Lleida entre arbres i turons"
        data-testid="seu-vella-scene"
      >
        <image href={firework} x="240" y="220" width="115" height="115" />
        <path fill="#36b39d" d="M0 340 Q420 360 1200 400 V460 H0Z" />
        <g
          fill="#36b39d"
          transform="translate(230 274) scale(0.45)"
          className="cursor-pointer"
          onClick={(event) => shakeTree(event, 0)}
          role="button"
          tabIndex={0}
          aria-label="Sacseja l’arbre i fes caure una poma"
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              shakeTree(event, 0);
            }
          }}
          data-testid="seu-vella-tree"
        >
          <g className="origin-bottom [transform-box:fill-box]">
            <path d="M39 85 L44 196 H62 L57 85Z" />
            <path d={TREE_TOP} />
            {apples(0)}
          </g>
        </g>
        <g
          fill="#78c6bd"
          transform="translate(410 276) scale(0.6)"
          className="cursor-pointer"
          onClick={(event) => shakeTree(event, 1)}
          role="button"
          tabIndex={0}
          aria-label="Sacseja l’arbre i fes caure una poma"
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              shakeTree(event, 1);
            }
          }}
          data-testid="seu-vella-tree"
        >
          <g className="origin-bottom [transform-box:fill-box]">
            <path d="M39 85 L34 190 H62 L57 85Z" />
            <path d={TREE_TOP} />
            {apples(1)}
          </g>
        </g>
        <image href={seuVella} x="650" y="12" width="400" height="404" />
        <path fill="#78c6bd" d="M0 400 Q560 352 1200 416 V460 H0Z" />
      </svg>
      {fireworks && (
        <Suspense fallback={null}>
          <FireworksShow onDone={() => setFireworks(false)} />
        </Suspense>
      )}
    </>
  );
}
