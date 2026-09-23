import React, { lazy, Suspense, useRef, useState } from "react";
import seuVella from "src/assets/img/home10/seu-vella.svg";
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

  // Easter egg: every click sways the tree; five in a row set off fireworks.
  const shakeTree = (event) => {
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
        role="img"
        aria-label="La Seu Vella de Lleida entre arbres i turons"
        data-testid="seu-vella-scene"
      >
        <image href={firework} x="240" y="220" width="115" height="115" />
        <path fill="#36b39d" d="M0 340 Q420 360 1200 400 V460 H0Z" />
        <g
          fill="#36b39d"
          transform="translate(230 274) scale(0.45)"
          className="cursor-pointer"
          onClick={shakeTree}
          data-testid="seu-vella-tree"
        >
          <g className="origin-bottom [transform-box:fill-box]">
            <path d="M39 85 L44 196 H62 L57 85Z" />
            <path d={TREE_TOP} />
          </g>
        </g>
        <g
          fill="#78c6bd"
          transform="translate(410 276) scale(0.6)"
          className="cursor-pointer"
          onClick={shakeTree}
          data-testid="seu-vella-tree"
        >
          <g className="origin-bottom [transform-box:fill-box]">
            <path d="M39 85 L34 190 H62 L57 85Z" />
            <path d={TREE_TOP} />
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
