import React from "react";
import { Link } from "react-router-dom";
import marracoMentor from "src/assets/img/home10/marraco-mentor-raw.png";
import marracoHacker from "src/assets/img/home10/marraco-hacker-raw.png";
import mountain from "src/assets/img/home10/mountain.png";
import cloud4 from "src/assets/img/home10/cloud-4.png";
import cloud3 from "src/assets/img/home10/cloud-3.png";
import { ROUTES } from "src/config/routes";

const Identify = () => {
  return (
    <section className="relative overflow-hidden bg-[#94cbf5] w-full min-h-[1447px]">
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

      <h1 className="absolute left-1/2 top-[156px] m-0 -translate-x-1/2 whitespace-nowrap text-center font-space-mono text-[64px] font-bold leading-normal tracking-[-1.28px] text-[#2e2e2e]">
        IDENTIFICAT
      </h1>

      <img
        src={mountain}
        alt=""
        aria-hidden="true"
        width={582}
        height={712}
        className="pointer-events-none absolute left-[159px] top-[315px] h-[712px] w-[582px] max-w-none object-cover"
      />
      <img
        src={mountain}
        alt=""
        aria-hidden="true"
        width={582}
        height={712}
        className="pointer-events-none absolute left-[987px] top-[315px] h-[712px] w-[582px] max-w-none object-cover"
      />

      <Link
        to={ROUTES.contactMentor}
        className="absolute left-[112px] top-[336px] block h-[747px] w-[752px] no-underline"
      >
        <img
          src={marracoMentor}
          alt="MENTOR"
          width={752}
          height={747}
          className="h-[747px] w-[752px] max-w-none object-contain"
        />
      </Link>
      <p className="absolute left-[141px] top-[1045px] m-0 flex h-[128px] w-[600px] items-center justify-center text-center font-space-mono text-[48px] font-bold leading-normal tracking-[-0.96px] text-[#2e2e2e]">
        MENTOR
      </p>

      <Link
        to={ROUTES.inscription}
        className="absolute left-[912px] top-[315px] block h-[768px] w-[773px] no-underline"
      >
        <img
          src={marracoHacker}
          alt="HACKER"
          width={773}
          height={768}
          className="h-[768px] w-[773px] max-w-none object-contain"
        />
      </Link>
      <p className="absolute left-[959px] top-[1027px] m-0 flex h-[128px] w-[600px] items-center justify-center text-center font-space-mono text-[48px] font-bold leading-normal tracking-[-0.96px] text-[#2e2e2e]">
        HACKER
      </p>
    </section>
  );
};

export default Identify;
