import React from "react";
import { ROUTES } from "src/config/routes";
import iconInstagram from "src/assets/img/home10/icon-instagram.svg";
import iconLinkedin from "src/assets/img/home10/icon-linkedin.svg";
import iconX from "src/assets/img/home10/icon-x.svg";
import iconHeart from "src/assets/img/home10/icon-heart.svg";

const HomeFooter = () => {
  return (
    <footer
      data-testid="footerHackeps"
      className="relative m-0 flex w-full flex-col items-center gap-3 border-0 bg-[#78c6bd] px-6 py-6 font-space-mono text-[#2e2e2e]"
    >
      <div className="flex items-center justify-center gap-3">
        <a
          href="https://www.instagram.com/hackeps_/"
          target="_blank"
          rel="noopener noreferrer"
          className="block h-7 w-7"
        >
          <img
            src={iconInstagram}
            alt="Instagram"
            width={28}
            height={28}
            className="h-7 w-7 max-w-none"
          />
        </a>
        <a
          href="https://www.linkedin.com/company/hackeps/"
          target="_blank"
          rel="noopener noreferrer"
          className="block h-7 w-7"
        >
          <img
            src={iconLinkedin}
            alt="LinkedIn"
            width={28}
            height={28}
            className="h-7 w-7 max-w-none"
          />
        </a>
        <a
          href="https://twitter.com/hackeps"
          target="_blank"
          rel="noopener noreferrer"
          className="block h-7 w-7"
        >
          <img
            src={iconX}
            alt="X"
            width={28}
            height={28}
            className="h-7 w-7 max-w-none"
          />
        </a>
      </div>

      <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-center text-[13px] font-bold leading-snug">
        <a
          className="underline"
          href={ROUTES.terms}
          target="_blank"
          rel="noopener noreferrer"
        >
          Termes i Condicions
        </a>
        <a
          className="underline"
          href={ROUTES.privacy}
          target="_blank"
          rel="noopener noreferrer"
        >
          Política de Privadesa de LleidaHack
        </a>
        <a
          className="underline"
          href="https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          Codi de conducta de MLH
        </a>
      </nav>

      <p className="m-0 text-center text-[13px] font-bold leading-snug">
        Made with{" "}
        <img
          src={iconHeart}
          alt=""
          width={14}
          height={14}
          className="inline-block h-3.5 w-3.5 max-w-none align-middle"
        />{" "}
        by{" "}
        <a
          className="underline"
          href="https://lleidahack.github.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          LleidaHack
        </a>
        {" · "}
        Powered By{" "}
        <a
          className="underline"
          href="https://clouding.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Clouding.io
        </a>
      </p>
    </footer>
  );
};

export default HomeFooter;
