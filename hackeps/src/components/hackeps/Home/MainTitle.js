import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";
import Button from "src/components/buttons/Button";
import hackLogo from "src/assets/img/home10/logo-taronja.png";
import "./MainTitle.css";
import { useNavigate } from "react-router-dom";
import { checkToken } from "src/services/AuthenticationService";
import { ROUTES } from "src/config/routes";

const MainTitle = ({ buttonText = "Apunta't!", refresh = false }) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [hackDay, setHackDay] = useState(false);
  const handleClose = () => setShow(false);

  async function handleShow() {
    if (hackDay) {
      window.location.href = "https://live.lleidahack.dev";
      return;
    }

    if (refresh) {
      window.location.reload();
      return;
    }
    if (localStorage.getItem("registeredOnEvent") === "true") {
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
    const today = new Date();
    const eventDays = [
      // Aqui es fiquen les dates dels dies de la Hack.
      new Date("2025-11-22"),
      new Date("2025-11-23"),
    ];

    if (
      eventDays.some(
        (eventDay) =>
          today.getFullYear() === eventDay.getFullYear() &&
          today.getMonth() === eventDay.getMonth() &&
          today.getDate() === eventDay.getDate(),
      )
    ) {
      setTextButton("Live Page..");
      setHackDay(true);
    }
  }, []);

  return (
    <>
      <div className="flex w-full flex-col items-center justify-center gap-[29px] z-50">
        <div className="flex h-[608px] w-[577px] max-h-[50vh] max-w-[90vw] justify-center">
          <img
            src={hackLogo}
            alt="HackEPS 10ª Edició"
            className="h-full w-full object-contain"
            width={577}
            height={608}
          />
        </div>

        <div className="relative z-50">
          <button
            id="hero-cta-button"
            onClick={handleShow}
            className="rounded-[4px] bg-[#ff7430] px-4 py-2 font-space-mono text-[32px] leading-normal tracking-[-0.64px] text-[#2e2e2e]"
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
