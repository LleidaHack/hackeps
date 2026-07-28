import React, { useState, useEffect } from "react";
import seuVellaSolo512 from "src/assets/img/seuvella-solo-512.webp";
import seuVellaSolo1024 from "src/assets/img/seuvella-solo-1024.webp";
import olaInterior1280 from "src/assets/img/ola-interior-1280.webp";
import olaInterior2048 from "src/assets/img/ola-interior-2048.webp";
import olaExterior1280 from "src/assets/img/ola-exterior-1280.webp";
import olaExterior2048 from "src/assets/img/ola-exterior-2048.webp";
import mlhLogo from "src/assets/img/majorleaguelogo.svg";

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
          {/* Inline SVGs instead of the bootstrap-icons font: no extra CSS + webfont request */}
          <a href="https://www.instagram.com/lleidahack/" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-gray-800 hover:text-black transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="w-7 h-7 md:w-9 md:h-9" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.919c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.919.598-.282.11-.705.24-1.486.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
            </svg>
          </a>
          <a href="https://www.linkedin.com/company/lleidahack/posts/?feedView=all" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-gray-800 hover:text-black transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="w-7 h-7 md:w-9 md:h-9" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
            </svg>
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
