import { useEdition } from "src/hooks/useEdition";
import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";
import Button from "src/components/buttons/Button";
import hackLogo from "src/assets/img/home10/logo-taronja.webp";
import "./MainTitle.css";
import { useNavigate } from "react-router-dom";
import { checkToken } from "src/services/AuthenticationService";
import { ROUTES } from "src/config/routes";

const MainTitle = ({ buttonText = "Apunta't!", refresh = false }) => {
  const navigate = useNavigate();
  const { event } = useEdition();
  const [show, setShow] = useState(false);
  const [hackDay, setHackDay] = useState(false);
  const handleClose = () => setShow(false);

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
  const [textButton, setTextButton] = useState(buttonText);

  useEffect(() => {
    setTextButton(buttonText);
  }, [buttonText]);

  const handleSignUp = () => navigate(ROUTES.hackerForm);
  const handleSignIn = () => {
    navigate(ROUTES.login, { state: { nextScreen: ROUTES.inscription } });
  };

  useEffect(() => {
    const now = Date.now();
    const live = Boolean(event && now >= Date.parse(event.start_date) && now <= Date.parse(event.end_date));
    setHackDay(live);
    setTextButton(live ? "Web en directe" : event?.is_open ? buttonText : "Inscripcions tancades");
  }, [event, buttonText]);

  return (
    <>
      <div className="z-50 flex w-full flex-col items-center justify-center gap-4 md:gap-7">
        <div className="flex w-full max-w-[577px] justify-center px-2">
          <img
            fetchPriority="high"
            decoding="async"
            src={hackLogo}
            alt="HackEPS 10ª Edició"
            className="h-auto w-[70%] max-w-[280px] object-contain sm:w-[75%] sm:max-w-[360px] md:w-full md:max-w-[520px]"
            width={577}
            height={608}
          />
        </div>

        <div className="relative z-50">
          <button
            id="hero-cta-button"
            onClick={handleShow}
            disabled={!event || (!event.is_open && !hackDay)}
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
