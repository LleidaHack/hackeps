import { useEdition } from "src/hooks/useEdition";
import React from "react";
import { Link } from "react-router-dom";
import marracoMentor from "src/assets/img/home10/marraco-mentor-raw.webp";
import marracoHacker from "src/assets/img/home10/marraco-hacker-raw.webp";
import mountain from "src/assets/img/home10/mountain.svg";
import cloud4 from "src/assets/img/home10/cloud-4.svg";
import cloud3 from "src/assets/img/home10/cloud-3.svg";
import { ROUTES } from "src/config/routes";
import { useSiteTheme } from "src/hooks/useSiteTheme";

const Identify = () => {
  const { year, dates, event } = useEdition();
  const { sky, text } = useSiteTheme();
  return (
    <section
      className="relative w-full overflow-x-hidden px-4 pb-16 pt-10 md:px-8 md:pb-24 md:pt-16"
      style={{ backgroundColor: sky }}
    >
      <img
        loading="lazy"
        decoding="async"
        src={cloud4}
        alt=""
        aria-hidden="true"
        width={457}
        height={209}
        className="ambient-cloud ambient-cloud--1 ambient-cloud--left pointer-events-none absolute right-[-10%] top-[8%] h-auto w-[30%] max-w-[360px] object-contain"
      />

      <h1
        className="relative z-20 m-0 mb-14 text-center font-space-mono text-[32px] font-bold leading-tight tracking-[-0.64px] md:mb-20 md:text-[48px] lg:mb-24 lg:text-[64px] lg:tracking-[-1.28px]"
        style={{ color: text }}
      >
        REGISTRAT
      </h1>

      <div className="relative z-10 mx-auto mt-4 grid max-w-[1200px] grid-cols-1 gap-10 md:mt-6 md:grid-cols-2 md:gap-8">
        <img
        loading="lazy"
        decoding="async"
          src={cloud3}
          alt=""
          aria-hidden="true"
          width={596}
          height={265}
          className="ambient-cloud ambient-cloud--0 ambient-cloud--right pointer-events-none absolute bottom-[-64px] left-1/2 h-auto w-[36%] max-w-[480px] -translate-x-1/2 object-contain"
        />
        <div className="flex flex-col items-center">
          <div className="relative flex w-full max-w-[288px] md:max-w-[480px] items-end justify-center">
            <img
        loading="lazy"
        decoding="async"
              src={mountain}
              alt=""
              aria-hidden="true"
              width={407}
              height={498}
              className="pointer-events-none absolute bottom-0 left-1/2 h-auto w-[78%] max-w-[376px] -translate-x-1/2 object-contain"
            />
            <Link
              to={ROUTES.contactMentor}
              className="relative z-10 block w-full no-underline"
            >
              <img
        loading="lazy"
        decoding="async"
                src={marracoMentor}
                alt="MENTOR"
                width={526}
                height={523}
                className="h-auto w-full origin-center object-contain transition-transform duration-300 ease-out hover:rotate-[6deg] hover:scale-105"
              />
            </Link>
          </div>
          <p
            className="mt-2 mb-0 text-center font-space-mono text-[28px] font-bold leading-none tracking-[-0.56px] md:text-[40px] lg:text-[48px]"
            style={{ color: text }}
          >
            MENTOR
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative flex w-full max-w-[288px] md:max-w-[480px] items-end justify-center">
            <img
        loading="lazy"
        decoding="async"
              src={mountain}
              alt=""
              aria-hidden="true"
              width={407}
              height={498}
              className="pointer-events-none absolute bottom-0 left-1/2 h-auto w-[78%] max-w-[376px] -translate-x-1/2 object-contain"
            />
            <Link
              to={ROUTES.hackerForm}
              className="relative z-10 block w-full no-underline"
            >
              <img
        loading="lazy"
        decoding="async"
                src={marracoHacker}
                alt="HACKER"
                width={541}
                height={538}
                className="h-auto w-full origin-center object-contain transition-transform duration-300 ease-out hover:rotate-[6deg] hover:scale-105"
              />
            </Link>
          </div>
          <p
            className="mt-2 mb-0 text-center font-space-mono text-[28px] font-bold leading-none tracking-[-0.56px] md:text-[40px] lg:text-[48px]"
            style={{ color: text }}
          >
            HACKER
          </p>
        </div>
      </div>
      <div
        className="relative z-10 mx-auto mt-16 max-w-[900px] text-center font-space-mono text-base leading-relaxed md:mt-28 md:text-lg"
        style={{ color: text }}
      >
        <p>
          LleidaHack et dona la benvinguda a la HackEPS {year}, la primera hackató
          de les terres de Lleida!
        </p>
        <p>
          Aquesta edició tindrà lloc a <strong>{event?.location || "una ubicació pendent de confirmar"}</strong>{" "}
          els dies <strong>{dates}</strong>. Aquest és un
          esdeveniment que no voldràs perdre’t!
        </p>
        <p className="mb-0">
          Així que, si ets un apassionat de la tecnologia, amant dels reptes i
          defensor del treball en equip, la HackEPS {year} és el teu lloc.
          Uneix-te a nosaltres per a una experiència inoblidable per a
          desenvolupar-te com a futur programador!
        </p>
      </div>
    </section>
  );
};

export default Identify;
