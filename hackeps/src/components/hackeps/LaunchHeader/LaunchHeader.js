import React from "react";
import { Link } from "react-router-dom";
import hackIcon from "src/icons/hackIconBig.png";

const LaunchHeader = () => {
  return (
    <header
      data-testid="launchHeaderHackeps"
      className="w-full bg-[#304B91] px-4 py-4 md:px-8 flex items-center justify-between font-space-mono"
    >
      <Link
        to="/"
        className="flex items-center gap-2 no-underline text-white hover:text-white/80 transition-colors"
      >
        <img src={hackIcon} alt="HackEPS" className="w-8 h-8 md:w-9 md:h-9" width="800" height="800" loading="eager" decoding="async" />
        <span className="font-bold text-sm md:text-base">HackEPS</span>
      </Link>

      <Link
        to="/"
        className="text-xs md:text-sm font-bold text-white no-underline hover:underline underline-offset-4"
      >
        ← Tornar a l'inici
      </Link>
    </header>
  );
};

export default LaunchHeader;
