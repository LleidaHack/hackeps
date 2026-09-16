import React, { useState } from "react";
import "./HomeHeader.css";
import { HashLink as Link } from "react-router-hash-link";
import { isToken } from "src/modules/session";
import { ROUTES } from "src/config/routes";
import isotip from "src/assets/img/home10/isotip.svg";
import iconProfile from "src/assets/img/home10/icon-profile.svg";
import mlhBadge from "src/assets/img/home10/mlh.webp";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Dates i Horaris", to: ROUTES.dates },
  { label: "Sponsors", to: "/#sponsors" },
  { label: "FAQ", to: ROUTES.faq },
  { label: "Contacte", to: ROUTES.contact },
];

const HomeHeader = () => {
  const [open, setOpen] = useState(false);
  const hasSession = isToken(localStorage.getItem("userToken"));

  return (
    <div
      data-testid="headerHackeps"
      className="sticky top-0 z-50 w-full overflow-visible"
    >
      <nav
        id="main-nav"
        className="relative flex h-14 w-full items-center justify-between gap-2 bg-[#ff7430] px-3 md:h-16 md:px-5 lg:px-8"
      >
        <div className="relative flex h-full shrink-0 items-center self-stretch">
          <Link to="/" className="flex items-center" aria-label="Home">
            <img
              src={isotip}
              alt="HackEPS"
              width={75}
              height={48}
              className="h-8 w-auto md:h-10"
            />
          </Link>
          <a
            href="https://mlh.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="z-[60] ml-2 hidden w-[48px] self-start md:block lg:ml-3 lg:w-[72px] xl:w-[110px]"
            aria-label="Major League Hacking"
          >
            <img
              src={mlhBadge}
              alt="MLH"
              width={150}
              height={285}
              className="relative top-0 block h-auto w-full max-w-none object-contain object-top"
              // Compensate for the asset's 46 transparent top pixels (712 px tall).
              style={{ transform: "translateY(-6.460674%)" }}
            />
          </a>
        </div>

        <ul className="m-0 hidden min-w-0 list-none items-center justify-center gap-10 p-0 lg:flex lg:flex-1 xl:gap-16">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                to={link.to}
                className="whitespace-nowrap font-space-mono text-[16px] leading-normal tracking-[-0.32px] text-[#2e2e2e] no-underline xl:text-[22px] xl:tracking-[-0.44px]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-0">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center border-0 bg-transparent p-0 leading-none text-[#2e2e2e] lg:hidden"
            aria-label={open ? "Tancar menú" : "Obrir menú"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="m6 6 12 12M6 18 18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
          <Link
            to={hasSession ? ROUTES.profile : ROUTES.login}
            state={hasSession ? undefined : { nextScreen: ROUTES.profile }}
            className="flex h-11 w-11 items-center justify-center p-0"
            aria-label="Perfil"
          >
            <img
              src={iconProfile}
              alt=""
              width={18}
              height={22}
              className="h-5 w-4 md:h-[22px] md:w-[18px]"
            />
          </Link>
        </div>
      </nav>

      <div
        id="mobile-navigation"
        className={`mobile-navigation lg:hidden ${open ? "mobile-navigation--open" : ""}`}
        aria-hidden={!open}
      >
        <div className="min-h-0 overflow-hidden">
        <ul className="m-0 list-none bg-[#ff7430] px-4 py-2">
          {NAV_LINKS.map((link) => (
            <li key={link.label} className="border-t border-black/10 py-3">
              <Link
                to={link.to}
                className="block font-space-mono text-[18px] text-[#2e2e2e] no-underline"
                tabIndex={open ? undefined : -1}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        </div>
      </div>
    </div>
  );
};

export default HomeHeader;
