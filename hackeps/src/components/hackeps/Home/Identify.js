import React from "react";
import { Link } from "react-router-dom";
import TitleGeneralized from "src/components/hackeps/TitleGeneralized/TitleGeneralized";
import marracoMentor from "src/assets/img/home10/marraco-mentor.png";
import marracoHacker from "src/assets/img/home10/marraco-hacker.png";
import { ROUTES } from "src/config/routes";

const Identify = () => {
  return (
    <section className="relative bg-skyDay px-4 md:px-16 py-16 md:py-24 overflow-hidden">
      <TitleGeneralized
        padTop="0"
        textNone
        className="text-headingInk font-space-mono font-bold uppercase tracking-tight text-3xl md:text-5xl lg:text-[56px]"
      >
        IDENTIFICAT
      </TitleGeneralized>

      <div className="mt-10 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-8 max-w-6xl mx-auto items-end">
        <Link
          to={ROUTES.contactMentor}
          className="no-underline text-headingInk flex flex-col items-center group"
        >
          <img
            src={marracoMentor}
            alt="Marraco mentor"
            width={752}
            height={747}
            className="w-[78%] max-w-[380px] md:max-w-[520px] h-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <span className="mt-4 font-space-mono font-bold text-3xl md:text-5xl uppercase tracking-wide">
            MENTOR
          </span>
        </Link>

        <Link
          to={ROUTES.inscription}
          className="no-underline text-headingInk flex flex-col items-center group"
        >
          <img
            src={marracoHacker}
            alt="Marraco hacker"
            width={773}
            height={768}
            className="w-[78%] max-w-[380px] md:max-w-[520px] h-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <span className="mt-4 font-space-mono font-bold text-3xl md:text-5xl uppercase tracking-wide">
            HACKER
          </span>
        </Link>
      </div>
    </section>
  );
};

export default Identify;
