import React, { useState } from "react";
import { HashLink as Link } from "react-router-hash-link";
import { ROUTES } from "src/config/routes";
import isotip from "src/assets/img/home10/isotip.svg";
import iconProfile from "src/assets/img/home10/icon-profile.svg";
import mlhBadge from "src/assets/img/home10/mlh.png";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Dates i Horaris", to: ROUTES.dates },
  { label: "Sponsors", to: "/#sponsors" },
  { label: "FAQ", to: ROUTES.faq },
  { label: "Contacte", to: ROUTES.contact },
];

const HomeHeader = ({ showMlh = true }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      data-testid="headerHackeps"
      className="sticky top-0 z-50 w-full overflow-visible"
    >
      {showMlh && (
        <a
          href="https://mlh.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute left-[7.6%] top-0 z-[60] block h-[285px] w-[150px]"
          aria-label="Major League Hacking"
        >
          <img
            src={mlhBadge}
            alt="MLH"
            width={150}
            height={285}
            className="h-[285px] w-[150px] max-w-none object-contain object-top"
          />
        </a>
      )}

      <nav id="main-nav" className="relative h-[80px] w-full bg-[#ff7430]">
        <Link
          to="/"
          className="absolute left-[28px] top-[18px] block h-[48px] w-[75px]"
          aria-label="Home"
        >
          <img
            src={isotip}
            alt="HackEPS"
            width={75}
            height={48}
            className="h-[48px] w-[75px] max-w-none"
          />
        </Link>

        <ul className="absolute inset-y-0 left-[19.85%] right-[19.85%] hidden list-none items-center justify-between m-0 p-0 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                to={link.to}
                className="font-space-mono text-[24px] leading-normal tracking-[-0.48px] text-[#2e2e2e] no-underline whitespace-nowrap"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="absolute right-16 top-1/2 z-10 -translate-y-1/2 border-0 bg-transparent text-[32px] text-[#2e2e2e] md:hidden"
          aria-label="Menú"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "×" : "☰"}
        </button>

        <Link
          to={ROUTES.profile}
          className="absolute right-[2.31%] top-[38.75%] block h-[22px] w-[18px]"
          aria-label="Perfil"
        >
          <img
            src={iconProfile}
            alt=""
            width={18}
            height={22}
            className="h-[22px] w-[18px] max-w-none"
          />
        </Link>
      </nav>

      {open && (
        <ul className="m-0 list-none bg-[#ff7430] p-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <li key={link.label} className="py-2">
              <Link
                to={link.to}
                className="font-space-mono text-[20px] text-[#2e2e2e] no-underline"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HomeHeader;
