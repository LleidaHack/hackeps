import { useEdition } from "src/hooks/useEdition";
import Modal from "react-bootstrap/Modal";
import { useRef, useState } from "react";
import Button from "src/components/buttons/Button";
import hackLogo from "src/assets/img/home10/logo-taronja.webp";
import "./MainTitle.css";
import { useNavigate } from "react-router-dom";
import { checkToken } from "src/services/AuthenticationService";
import { ROUTES } from "src/config/routes";

// Centre of the dragon's open mouth, as a fraction of the logo artwork.
const DRAGON_MOUTH = { x: 72, y: 54 };
// Layers cut from logo-taronja.webp (positions in % of the logo): the dark
// inside of the mouth, the lower jaw that hinges open from its top, and the
// fangs, which hang from the lips and stay in front. Fetched on first click.
const DRAGON_PARTS = {
  mouth: { load: () => import("src/assets/img/home10/dragon-mouth.webp"), left: 58.752, top: 40.707, width: 27.383 },
  jaw: { load: () => import("src/assets/img/home10/dragon-jaw.webp"), left: 58.752, top: 40.543, width: 27.383 },
  fangs: { load: () => import("src/assets/img/home10/dragon-fangs.webp"), left: 58.232, top: 40.461, width: 27.903 },
};
const JAW_OPEN = 1.23;
// The flame canvas overhangs the logo so the fire can spread past it.
const FIRE_CANVAS = { left: 30, width: 160, height: 160 };

const MainTitle = ({ buttonText = "Apunta't!", refresh = false }) => {
  const navigate = useNavigate();
  const { event, loading } = useEdition();
  const [show, setShow] = useState(false);
  const now = Date.now();
  const hackDay = Boolean(event && now >= Date.parse(event.start_date) && now <= Date.parse(event.end_date));
  const textButton = loading ? "Carregant inscripcions…"
    : !event ? "Inscripcions no disponibles"
    : hackDay ? "Web en directe"
    : event.is_open ? buttonText : "Inscripcions tancades";
  const handleClose = () => setShow(false);
  const logoArt = useRef(null);
  const dragonLayer = useRef(null);
  const fireCanvas = useRef(null);
  const dragon = useRef(null);

  const loadDragon = () => {
    dragon.current ??= Promise.all(
      Object.entries(DRAGON_PARTS).map(async ([name, { load, ...box }]) => {
        const img = new Image();
        img.src = (await load()).default;
        img.alt = "";
        Object.assign(img.style, {
          position: "absolute",
          left: `${box.left}%`,
          top: `${box.top}%`,
          width: `${box.width}%`,
          maxWidth: "none",
          visibility: "hidden",
        });
        await img.decode?.().catch(() => {});
        dragonLayer.current?.appendChild(img);
        return [name, img];
      }),
    ).then(Object.fromEntries);
    return dragon.current;
  };

  // Easter egg: clicking the logo makes the dragon open its mouth and breathe
  // fire. GSAP, the flame and the jaw are fetched on the first click only.
  const breatheFire = async () => {
    const [{ gsap } = {}, fire, parts] = await Promise.all([
      import("gsap").catch(() => ({})),
      import("src/components/hackeps/Home/dragonFire").catch(() => null),
      loadDragon().catch(() => null),
    ]);
    if (!gsap || !fireCanvas.current) return;
    const { offsetWidth: size, offsetHeight: height } = logoArt.current;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const inhale = reduced ? 0 : 0.14;
    if (!reduced) {
      gsap
        .timeline()
        .to(logoArt.current, { scale: 0.95, rotation: -3, duration: inhale, ease: "power2.in" })
        .to(logoArt.current, { scale: 1, rotation: 0, duration: 0.8, ease: "elastic.out(1.1, 0.35)" });
    }

    if (parts) {
      const layers = [parts.mouth, parts.jaw, parts.fangs];
      gsap.killTweensOf(layers);
      const open = reduced ? 1 + (JAW_OPEN - 1) / 2 : JAW_OPEN;
      gsap
        .timeline({ delay: inhale })
        .set(layers, { visibility: "visible" })
        .fromTo(parts.jaw, { scaleY: 1 }, { scaleY: open, transformOrigin: "50% 0%", duration: 0.14, ease: "back.out(2)" })
        .to(parts.jaw, {
          scaleY: 1 + (open - 1) * 0.75,
          duration: 0.09,
          yoyo: true,
          repeat: reduced ? 0 : 5,
          ease: "sine.inOut",
        })
        .to(parts.jaw, { scaleY: 1, duration: 0.2, ease: "power2.in" })
        .set(layers, { visibility: "hidden" });
    }

    // The jaw drops first; the fire follows once the mouth is open.
    fire?.breatheFire(fireCanvas.current, {
      mouthX: size * ((FIRE_CANVAS.left + DRAGON_MOUTH.x) / 100),
      mouthY: height * (DRAGON_MOUTH.y / 100),
      size,
      delay: inhale + (parts ? 0.12 : 0),
      duration: reduced ? 0.3 : 0.62,
      reduced,
    });
  };

  async function handleShow() {
    if (hackDay) {
      window.location.href = "https://live.hackeps.dev";
      return;
    }

    if (refresh) {
      window.location.reload();
      return;
    }
    if (!event?.id) return;
    if (localStorage.getItem("registeredOnEvent") === String(event.id)) {
      navigate(ROUTES.profile);
      return;
    }

    if (localStorage.getItem("userToken") === null) {
      setShow(true);
    } else if (
      await checkToken().then((key) => {
        return !key["success"];
      })
    ) {
      if (!hackDay) {
        navigate(ROUTES.login, { state: { nextScreen: ROUTES.inscription } });
      } else {
        navigate(ROUTES.hacking);
      }
    } else {
      if (!hackDay) {
        navigate(ROUTES.inscription);
      } else {
        navigate(ROUTES.hacking);
      }
    }
  }
  const handleSignUp = () => navigate(ROUTES.hackerForm);
  const handleSignIn = () => {
    navigate(ROUTES.login, { state: { nextScreen: ROUTES.inscription } });
  };

  return (
    <>
      <div className="z-50 flex w-full flex-col items-center justify-center gap-4 md:gap-7">
        <div className="flex w-full max-w-[577px] justify-center px-2">
          <button
            type="button"
            data-intro="logo"
            onClick={breatheFire}
            aria-label="HackEPS 10ª Edició: fes que el drac escupi foc"
            className="relative block w-[70%] max-w-[280px] cursor-pointer border-0 bg-transparent p-0 sm:w-[75%] sm:max-w-[360px] md:w-full md:max-w-[520px]"
          >
            <span ref={logoArt} className="relative block">
              <img
                fetchPriority="high"
                decoding="async"
                src={hackLogo}
                alt=""
                className="block h-auto w-full object-contain"
                width={577}
                height={608}
              />
              <span
                ref={dragonLayer}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
              />
            </span>
            <canvas
              ref={fireCanvas}
              aria-hidden="true"
              className="pointer-events-none absolute top-0 z-[60]"
              style={{
                left: `-${FIRE_CANVAS.left}%`,
                width: `${FIRE_CANVAS.width}%`,
                height: `${FIRE_CANVAS.height}%`,
              }}
            />
          </button>
        </div>

        <div className="relative z-50" data-intro="cta">
          <button
            id="hero-cta-button"
            onClick={handleShow}
            aria-busy={loading}
            disabled={loading || !event || (!event.is_open && !hackDay)}
            className="rounded-[4px] bg-[#ff7430] px-4 py-2 font-space-mono text-[22px] leading-normal tracking-[-0.44px] text-[#2e2e2e] md:text-[32px] md:tracking-[-0.64px]"
          >
            {textButton}
          </button>
        </div>
      </div>

      {/* Login modal — preserved from original */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="no-border">
          <Modal.Title>Inici de sessió</Modal.Title>
        </Modal.Header>
        <Modal.Body className="no-border">
          Has d&apos;iniciar sessió per apuntar-te!
        </Modal.Body>
        <Modal.Footer className="no-border justify-content-center">
          <Button orange onClick={handleSignIn}>
            Tinc compte
          </Button>
          <Button orange onClick={handleSignUp}>
            Crear compte
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MainTitle;
