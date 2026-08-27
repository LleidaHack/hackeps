import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";
import Button from "src/components/buttons/Button";
import hackLogo from "src/icons/banner_home_icon.png";
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
      <div className="justify-center items-center flex flex-col gap-6 w-full z-50">
        {/* Logo */}
        <div className="w-full flex justify-center">
          <img
            src={hackLogo}
            alt="HackEPS 10ª Edició"
            className="hero-logo-img"
          />
        </div>

        {/* CTA Button */}
        <div className="relative z-50" style={{ zIndex: 5000 }}>
          <button
            id="hero-cta-button"
            onClick={handleShow}
            className="hero-cta-btn"
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
          <Button primary onClick={handleSignIn}>
            Tinc compte
          </Button>
          <Button primary onClick={handleSignUp}>
            Crear compte
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MainTitle;
