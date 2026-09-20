import React from "react";
import seuVella from "src/assets/img/home10/seu-vella.svg";
import firework from "src/assets/img/home10/firework-1.svg";

// All layers share one coordinate system, so zoom cannot separate the hills,
// trees and castle. A 1px overlap hides subpixel seams against the footer.
export default function SeuVellaScene() {
  return (
    <svg
      viewBox="0 0 1200 280"
      className="-mb-px block h-auto w-full"
      role="img"
      aria-label="La Seu Vella de Lleida entre arbres i turons"
      data-testid="seu-vella-scene"
    >
      <image href={firework} x="240" y="40" width="115" height="115" />
      <path fill="#36b39d" d="M0 160 Q420 180 1200 220 V280 H0Z" />
      <g fill="#36b39d" transform="translate(230 94) scale(0.45)">
        <path d="M39 85 L44 196 H62 L57 85Z" />
        <path d="M14 115 C-16 112 -12 73 12 68 C7 37 28 19 46 31 C57 -7 95 14 88 42 C120 38 127 65 113 79 C147 100 121 126 101 119Z" />
      </g>
      <g fill="#78c6bd" transform="translate(410 96) scale(0.6)">
        <path d="M39 85 L34 190 H62 L57 85Z" />
        <path d="M14 115 C-16 112 -12 73 12 68 C7 37 28 19 46 31 C57 -7 95 14 88 42 C120 38 127 65 113 79 C147 100 121 126 101 119Z" />
      </g>
      <image href={seuVella} x="690" y="12" width="225" height="227" />
      <path fill="#78c6bd" d="M0 220 Q560 172 1200 236 V280 H0Z" />
    </svg>
  );
}
