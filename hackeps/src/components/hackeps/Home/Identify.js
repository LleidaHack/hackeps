import React from "react";
import { Link } from "react-router-dom";
import marracoMentor from "src/assets/img/home10/marraco-mentor-raw.png";
import marracoHacker from "src/assets/img/home10/marraco-hacker-raw.png";
import mountain from "src/assets/img/home10/mountain.png";
import cloud4 from "src/assets/img/home10/cloud-4.png";
import cloud3 from "src/assets/img/home10/cloud-3.png";
import { ROUTES } from "src/config/routes";
import { useSiteTheme } from "src/hooks/useSiteTheme";

const Identify = () => {
  const { sky, text } = useSiteTheme();
  return (
    <section
      className="relative min-h-[1180px] w-full overflow-x-hidden"
      style={{ backgroundColor: sky }}
    >
      <img
        src={cloud4}
        alt=""
        aria-hidden="true"
        width={457}
        height={209}
        className="pointer-events-none absolute left-[1228px] top-[176px] h-[209px] w-[457px] max-w-none object-contain"
      />
      <img
        src={cloud3}
        alt=""
        aria-hidden="true"
        width={596}
        height={265}
        className="pointer-events-none absolute left-[566px] top-[908px] h-[265px] w-[596px] max-w-none object-contain"
      />

      <h1
        className="absolute left-1/2 top-[156px] m-0 -translate-x-1/2 whitespace-nowrap text-center font-space-mono text-[64px] font-bold leading-normal tracking-[-1.28px]"
        style={{ color: text }}
      >
        IDENTIFICAT
      </h1>

      <img
        src={mountain}
        alt=""
        aria-hidden="true"
        width={407}
        height={498}
        className="pointer-events-none absolute left-[247px] top-[422px] h-[498px] w-[407px] max-w-none object-cover"
      />
      <img
        src={mountain}
        alt=""
        aria-hidden="true"
        width={407}
        height={498}
        className="pointer-events-none absolute left-[1074px] top-[422px] h-[498px] w-[407px] max-w-none object-cover"
      />

      <Link
        to={ROUTES.contactMentor}
        className="absolute left-[225px] top-[448px] block h-[523px] w-[526px] no-underline"
      >
        <img
          src={marracoMentor}
          alt="MENTOR"
          width={526}
          height={523}
          className="h-[523px] w-[526px] max-w-none origin-center object-contain transition-transform duration-300 ease-out hover:scale-105 hover:rotate-[6deg]"
        />
      </Link>
      <p className="absolute left-[188px] top-[980px] m-0 flex h-[80px] w-[600px] items-center justify-center text-center font-space-mono text-[48px] font-bold leading-normal tracking-[-0.96px]" style={{ color: text }}>
        MENTOR
      </p>

      <Link
        to={ROUTES.inscription}
        className="absolute left-[1028px] top-[430px] block h-[538px] w-[541px] no-underline"
      >
        <img
          src={marracoHacker}
          alt="HACKER"
          width={541}
          height={538}
          className="h-[538px] w-[541px] max-w-none origin-center object-contain transition-transform duration-300 ease-out hover:scale-105 hover:rotate-[6deg]"
        />
      </Link>
      <p className="absolute left-[999px] top-[980px] m-0 flex h-[80px] w-[600px] items-center justify-center text-center font-space-mono text-[48px] font-bold leading-normal tracking-[-0.96px]" style={{ color: text }}>
        HACKER
      </p>
    </section>
  );
};

export default Identify;
