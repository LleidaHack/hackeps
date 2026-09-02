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
      className="relative m-0 block h-[406px] w-full overflow-hidden border-0 bg-[#78c6bd] p-0 leading-normal"
    >
      <div className="absolute left-[775px] top-[37px] flex items-start">
        <a
          href="https://www.instagram.com/hackeps_/"
          target="_blank"
          rel="noopener noreferrer"
          className="block h-[47px] w-[47px]"
        >
          <img
            src={iconInstagram}
            alt="Instagram"
            width={47}
            height={47}
            className="h-[47px] w-[47px] max-w-none"
          />
        </a>
        <a
          href="https://www.linkedin.com/company/hackeps/"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-[17px] block h-[47px] w-[48px]"
        >
          <img
            src={iconLinkedin}
            alt="LinkedIn"
            width={48}
            height={47}
            className="h-[47px] w-[48px] max-w-none"
          />
        </a>
        <a
          href="https://twitter.com/hackeps"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-[18px] block h-[47px] w-[47px]"
        >
          <img
            src={iconX}
            alt="X"
            width={47}
            height={47}
            className="h-[47px] w-[47px] max-w-none"
          />
        </a>
      </div>

      <div className="absolute left-1/2 top-[187px] w-[676px] -translate-x-1/2 -translate-y-1/2 text-center font-space-mono text-[24px] font-bold leading-normal text-[#2e2e2e]">
        <a
          className="block underline"
          href={ROUTES.terms}
          target="_blank"
          rel="noopener noreferrer"
        >
          Termes i Condicions
        </a>
        <a
          className="block underline"
          href={ROUTES.privacy}
          target="_blank"
          rel="noopener noreferrer"
        >
          Política de Privadesa de LledaHack
        </a>
        <a
          className="block underline"
          href="https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          Codi de conducta de MLH
        </a>
      </div>

      <div className="absolute left-1/2 top-[257px] w-[672px] -translate-x-1/2 text-center font-space-mono text-[24px] font-bold leading-normal text-[#2e2e2e]">
        <p className="relative m-0">
          Made with{" "}
          <img
            src={iconHeart}
            alt=""
            width={24}
            height={24}
            className="inline-block h-6 w-6 max-w-none align-middle"
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
        </p>
        <p className="m-0">
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
      </div>
    </footer>
  );
};

export default HomeFooter;
