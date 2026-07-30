import React, { useState, useEffect } from "react";
import seuVellaSolo512 from "src/assets/img/seuvella-solo-512.webp";
import seuVellaSolo1024 from "src/assets/img/seuvella-solo-1024.webp";
import olaInterior1280 from "src/assets/img/ola-interior-1280.webp";
import olaInterior2048 from "src/assets/img/ola-interior-2048.webp";
import olaExterior1280 from "src/assets/img/ola-exterior-1280.webp";
import olaExterior2048 from "src/assets/img/ola-exterior-2048.webp";
import mlhLogo from "src/assets/img/majorleaguelogo.svg";
import LaunchFooter from "src/components/hackeps/LaunchFooter/LaunchFooter";

const Waiting = () => {
  const targetDate = new Date(new Date().getFullYear(), 10, 28); // November 28th

  const calculateTimeLeft = () => {
    const difference = targetDate - new Date();
    let timeLeft = {
      mesos: 0,
      dies: 0,
      hores: 0,
    };

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);

      timeLeft = {
        mesos: Math.floor(days / 30),
        dies: days % 30,
        hores: hours,
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-space-mono bg-[#78C6BD] overflow-hidden">

      {/* Top Section: Blue sky */}
      <div className="bg-[#304B91] w-full h-[60vh] md:h-[66vh] relative flex-shrink-0">

        {/* MLH Logo */}
        <div className="absolute top-0 left-0 p-0 mx-10 z-50">
          <img
            src={mlhLogo}
            className="w-20 md:w-28"
            alt="MLH Official Season"
            width="215"
            height="356"
            loading="eager"
            decoding="async"
          />
        </div>

        {/* Ola Interior (background wave) */}
        <img
          src={olaInterior1280}
          srcSet={`${olaInterior1280} 1280w, ${olaInterior2048} 2048w`}
          sizes="100vw"
          width="2048"
          height="784"
          className="absolute top-[65%] md:top-[55%] lg:top-[50%] left-0 w-full h-auto z-10"
          alt=""
          loading="eager"
          decoding="async"
        />

        {/* Seu Vella Castle (middle) */}
        <img
          src={seuVellaSolo512}
          srcSet={`${seuVellaSolo512} 512w, ${seuVellaSolo1024} 1024w`}
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 35vw, 55vw"
          width="1024"
          height="1036"
          className="absolute bottom-[10%] md:bottom-[30%] lg:bottom-[5%] right-[5%] md:right-[10%] w-[55%] md:w-[35%] lg:w-[25%] h-auto z-20"
          alt="La Seu Vella de Lleida"
          fetchpriority="high"
          loading="eager"
          decoding="async"
        />

        {/* Ola Exterior (foreground wave) */}
        <img
          src={olaExterior1280}
          srcSet={`${olaExterior1280} 1280w, ${olaExterior2048} 2048w`}
          sizes="100vw"
          width="2048"
          height="594"
          className="absolute top-[85%] md:top-[65%] lg:top-[75%] left-0 w-full h-auto z-30"
          alt=""
          loading="eager"
          decoding="async"
        />
      </div>

      {/* Bottom Section: Turquoise text area */}
      <div className="bg-[#78C6BD] w-full flex flex-col items-center justify-center relative z-40 px-4 pt-4 md:pt-6 flex-shrink-0 md:mt-[-10vh]">

        <p className="text-lg md:text-2xl lg:text-3xl text-gray-800 mb-2 md:mb-4 text-center whitespace-pre-wrap">
          Preparant la celebració...
        </p>

        <div className="text-3xl md:text-5xl lg:text-6xl text-gray-800 flex flex-wrap justify-center items-baseline gap-x-2 gap-y-2 mb-4 md:mb-6">
          <span className="font-bold">{timeLeft.mesos}</span>
          <span className="text-lg md:text-2xl lg:text-3xl mr-2 md:mr-6">mesos</span>

          <span className="font-bold">{timeLeft.dies}</span>
          <span className="text-lg md:text-2xl lg:text-3xl mr-2 md:mr-6">dies</span>

          <span className="font-bold">{timeLeft.hores}</span>
          <span className="text-lg md:text-2xl lg:text-3xl">hores</span>
        </div>
      </div>

      <LaunchFooter />
    </div>
  );
};

export default Waiting;
