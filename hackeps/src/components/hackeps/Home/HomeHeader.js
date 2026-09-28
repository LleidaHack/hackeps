import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isToken } from "src/modules/session";
import { ROUTES } from "src/config/routes";
import isotip from "src/assets/img/home10/isotip.svg";
import mlhBadge from "src/assets/img/home10/mlh.webp";

// Everything else lives on the home page, so the header only carries the
// logo, the MLH badge, the contact page and the way into the account.
const HomeHeader = () => {
  const hasSession = isToken(localStorage.getItem("userToken"));
  // Once the page scrolls, the bar turns translucent over the content.
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      data-testid="headerHackeps"
      data-intro="header"
      className="sticky top-0 z-50 w-full overflow-visible"
    >
      <nav
        id="main-nav"
        aria-label="Principal"
        data-scrolled={scrolled}
        className={`relative flex h-14 w-full items-center justify-between gap-2 px-3 transition-[background-color,box-shadow] duration-300 md:h-16 md:px-5 lg:px-8 ${
          scrolled ? "bg-[#ff7430]/70 shadow-[0_2px_12px_rgba(0,0,0,0.12)] backdrop-blur-md" : "bg-[#ff7430]"
        }`}
      >
        <div className="relative flex h-full shrink-0 items-center self-stretch">
          <Link
            to="/"
            className="flex items-center"
            aria-label="HackEPS, inici"
            onClick={(event) => {
              if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
              window.scrollTo({
                top: 0,
                left: 0,
                behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
              });
            }}
          >
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
            className="z-[60] ml-2 block w-[40px] self-start md:w-[48px] lg:ml-3 lg:w-[72px] xl:w-[110px]"
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

        <div className="flex items-center gap-5 sm:gap-8 md:gap-12">
          <Link
            to={ROUTES.contact}
            className="font-space-mono text-[14px] font-bold uppercase leading-normal tracking-[0.04em] text-[#2e2e2e] no-underline underline-offset-4 hover:underline sm:text-[16px] md:text-[18px]"
          >
            Contacte
          </Link>
          <Link
            to={hasSession ? ROUTES.profile : ROUTES.login}
            state={hasSession ? undefined : { nextScreen: ROUTES.profile }}
            className="rounded-[4px] border-2 border-[#2e2e2e] px-3 py-1.5 font-space-mono text-[14px] font-bold uppercase leading-normal tracking-[0.04em] text-[#2e2e2e] no-underline transition-colors hover:bg-[#2e2e2e] hover:text-[#ff7430] sm:px-4 sm:text-[16px] md:px-5 md:text-[18px]"
          >
            {hasSession ? "Perfil" : "Login"}
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default HomeHeader;
