import React from "react";
import seuVella from "src/assets/img/home10/seu-vella.svg";
import firework from "src/assets/img/home10/firework-1.svg";

// All layers share one coordinate system, so zoom cannot separate the hills,
// trees and castle. A 1px overlap hides subpixel seams against the footer.
export default function SeuVellaScene() {
  return (
    <svg
      viewBox="0 0 1200 460"
      className="-mb-px block h-auto w-full"
      role="img"
      aria-label="La Seu Vella de Lleida entre arbres i turons"
      data-testid="seu-vella-scene"
    >
      <image href={firework} x="240" y="220" width="115" height="115" />
      <path fill="#36b39d" d="M0 340 Q420 360 1200 400 V460 H0Z" />
      <g fill="#36b39d" transform="translate(230 274) scale(0.45)">
        <path d="M39 85 L44 196 H62 L57 85Z" />
        <path d="M14 115 C-16 112 -12 73 12 68 C7 37 28 19 46 31 C57 -7 95 14 88 42 C120 38 127 65 113 79 C147 100 121 126 101 119Z" />
      </g>
      <g fill="#78c6bd" transform="translate(410 276) scale(0.6)">
        <path d="M39 85 L34 190 H62 L57 85Z" />
        <path d="M14 115 C-16 112 -12 73 12 68 C7 37 28 19 46 31 C57 -7 95 14 88 42 C120 38 127 65 113 79 C147 100 121 126 101 119Z" />
      </g>
      <image href={seuVella} x="650" y="12" width="400" height="404" />
      <path fill="#78c6bd" d="M0 400 Q560 352 1200 416 V460 H0Z" />
    </svg>
  );
}
