import React, { useEffect, useState } from "react";
import { HashLink as Link } from "react-router-hash-link";
import hackIcon from "src/icons/hackIconBig.png";
import { me, checkToken } from "src/services/AuthenticationService";
import ProfilePic from "../ProfilePic/ProfilePic";
import { ROUTES } from "src/config/routes";

/* ----------------------------------------------------------------
   NAV_LINKS — Easily editable navigation configuration.
   Each entry: { label, to, isHashLink }
   - isHashLink: true  → scrolls to an anchor on the home page
   - isHashLink: false → navigates to a separate route
   ---------------------------------------------------------------- */
const NAV_LINKS = [
  { label: "Home", to: "/", isHashLink: false },
  { label: "Dates i Horaris", to: ROUTES.dates, isHashLink: false },
  { label: "Sponsors", to: "/#sponsors", isHashLink: true },
  { label: "FAQ", to: ROUTES.faq, isHashLink: false },
  { label: "Contacte", to: ROUTES.contact, isHashLink: false },
];

const Header = () => {
  const [icon, setUserIcon] = useState("");
  const [validToken, setValidToken] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Prevent setting validToken in localStorage on every render — only set on mount
  useEffect(() => {
    localStorage.setItem("validToken", false);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (localStorage.getItem("userToken")) {
        const verification = await checkToken();

        if (verification.success) {
          setValidToken(true);
          localStorage.setItem("validToken", true);

          try {
            if (!localStorage.getItem("imageProfile")) {
              const info = await me();
              if (info.nickname) {
                if (
                  info.image !== null ||
                  info.image !== undefined ||
                  info.image !== "" ||
                  info.image !== "string"
                ) {
                  setUserIcon(info.image);
                  localStorage.setItem("imageProfile", info.image);
                }
              }
            } else {
              setUserIcon(localStorage.getItem("imageProfile"));
            }
          } catch (error) {
            /* Silently handle — user simply sees default avatar */
          }
        }
      }
    };

    fetchData();
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
    // Toggle body scroll when menu is open
    if (!mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.overflowX = "hidden";
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = "auto";
    document.body.style.overflowX = "hidden";
  };

  return (
    <div data-testid="headerHackeps">
      <nav
        id="main-nav"
        className="sticky top-0 z-50"
        style={{ background: "rgba(242, 140, 40, 0.92)", backdropFilter: "blur(8px)" }}
      >
        <div className="w-full mx-auto px-4 h-16 flex items-center justify-between">
          {/* ── Logo ── */}
          <Link to="/" className="flex-shrink-0" aria-label="Home">
            <img src={hackIcon} alt="HackEPS logo" className="h-12 w-12" />
          </Link>

          {/* ── Desktop nav links ── */}
          <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className="text-white font-bold text-lg no-underline hover:text-yellow-200 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* ── Desktop profile / user icon ── */}
          <div className="hidden md:flex items-center">
            <Link
              to={ROUTES.profile}
              className="no-underline"
              aria-label="Profile"
            >
              <ProfilePic size="small" icon={icon} validToken={validToken} />
            </Link>
          </div>

          {/* ── Mobile hamburger button ── */}
          <button
            id="mobile-menu-toggle"
            className="md:hidden text-white text-3xl bg-transparent border-none cursor-pointer p-1"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            <i className={`fa-solid ${mobileMenuOpen ? "fa-xmark" : "fa-bars"}`} />
          </button>
        </div>

        {/* ── Mobile dropdown menu ── */}
        {mobileMenuOpen && (
          <div
            className="md:hidden absolute top-16 inset-x-0 bg-white shadow-lg appear-animation z-50"
            style={{ maxHeight: "calc(100vh - 4rem)", overflowY: "auto" }}
          >
            <ul className="flex flex-col list-none m-0 p-4 gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="block py-3 px-4 text-lg font-semibold text-gray-800 no-underline rounded-lg hover:bg-orange-50 transition-colors duration-200"
                    onClick={closeMobileMenu}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {/* Profile link at bottom of mobile menu */}
              <li className="pt-2 border-t border-gray-200 mt-2">
                <Link
                  to={ROUTES.profile}
                  className="flex items-center gap-3 py-3 px-4 text-lg font-semibold text-gray-800 no-underline rounded-lg hover:bg-orange-50 transition-colors"
                  onClick={closeMobileMenu}
                >
                  <ProfilePic size="small" icon={icon} validToken={validToken} />
                  <span>Perfil</span>
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>

      {/* ── Development environment banner ── */}
      {String(process.env.REACT_APP_MAIN) === "0" && (
        <nav className="py-2 shadow-md sticky top-16 z-[100] secondaryHackeps text-2xl">
          <div className="ml-0 mr-0 max-w-full break-words">
            Aquesta pàgina és de proves. La pàgina de la HackEPS 2026 és{" "}
            <a
              className="primaryHackeps"
              href="https://www.lleidahack.dev/hackeps"
            >
              https://www.lleidahack.dev/hackeps
            </a>
          </div>
        </nav>
      )}
    </div>
  );
};

export default Header;
