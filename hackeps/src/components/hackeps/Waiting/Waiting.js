import React, { useState, useEffect } from "react";
import seuVellaSolo from "src/assets/img/seuvella-solo.png";
import olaInterior from "src/assets/img/ola-interior.png";
import olaExterior from "src/assets/img/ola-exterior.png";
import mlhLogo from "src/assets/img/majorleaguelogo.svg";
import { Link } from "react-router-dom";

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
        <div className="p-4 md:p-8">
          <img
            src={mlhLogo}
            className="w-20 md:w-28 relative z-50"
            alt="MLH Official Season"
          />
        </div>

        {/* Ola Interior (background wave) */}
        <img
          src={olaInterior}
          className="absolute top-[65%] md:top-[55%] lg:top-[50%] left-0 w-full h-auto z-10"
          alt=""
        />

        {/* Seu Vella Castle (middle) */}
        <img
          src={seuVellaSolo}
          className="absolute bottom-[10%] md:bottom-[30%] lg:bottom-[5%] right-[5%] md:right-[10%] w-[55%] md:w-[35%] lg:w-[25%] h-auto z-20"
          alt="La Seu Vella de Lleida"
        />

        {/* Ola Exterior (foreground wave) */}
        <img
          src={olaExterior}
          className="absolute top-[85%] md:top-[65%] lg:top-[75%] left-0 w-full h-auto z-30"
          alt=""
        />
      </div>

      {/* Bottom Section: Turquoise text area */}
      <div className="bg-[#78C6BD] w-full flex flex-col items-center justify-center relative z-40 px-4 pt-4 md:pt-6 pb-6 md:pb-10 flex-shrink-0 md:mt-[-10vh]">

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

        <div className="flex gap-6 mb-4 md:mb-6 mt-12">
          <a href="https://www.instagram.com/lleidahack/" target="_blank" rel="noreferrer" className="text-gray-800 hover:text-black transition-colors">
            <i className="bi bi-instagram text-3xl md:text-4xl"></i>
          </a>
          <a href="https://www.linkedin.com/company/lleidahack/posts/?feedView=all" target="_blank" rel="noreferrer" className="text-gray-800 hover:text-black transition-colors">
            <i className="bi bi-linkedin text-3xl md:text-4xl"></i>
          </a>
          <a href="https://x.com/lleidahack?lang=ca" target="_blank" rel="noreferrer" className="text-gray-800 hover:text-black transition-colors">
            {/* Custom X logo since bi-twitter-x might not be in v1.10.5 */}
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-twitter-x w-7 h-7 md:w-9 md:h-9" viewBox="0 0 16 16">
              <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.873 11.633Z" />
            </svg>
          </a>
        </div>

        <div className="flex flex-col md:flex-col items-center gap-2 md:gap-4 text-[10px] md:text-xs font-bold text-gray-800 underline decoration-1 underline-offset-4 mb-4 text-center">
          <a href="/terms" className="text-black" target="_blank">Termes i Condicions</a>
          <a href="/privacy" className="text-black" target="_blank">Politica de Privadesa de LleidaHack</a>
          <a href="https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md" className="text-black hover:font-bold" target="_blank">Codi de conducta de MLH</a>
        </div>

        <div className="text-[10px] md:text-xs text-gray-800 font-bold flex flex-col md:flex-row items-center gap-1 md:gap-4">
          <p>
            Made with <span className="text-black">❤</span> by <a href="https://www.lleidahack.dev/" target="_blank" rel="noreferrer" className="underline underline-offset-2text-black text-black">LleidaHack</a>
          </p>
          <p>
            Powered By <a href="https://clouding.io/" target="_blank" rel="noreferrer" className="underline underline-offset-2 text-black">Clouding.io</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Waiting;
