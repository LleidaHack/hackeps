import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "src/components/hackeps/Feedbacks/FeedbackStyle.css";

//El onButtonClick es per a que des de on es truca al component, indicar-li si al clicar el boto, es necesita que s'executi alguna funcio en concret.
//La funció ha d'estar al lloc on es crida a la component. (Exemple al component de Contacte.js)
//si hasButton es false, no fa falta indicar-hhi el buttonLink i el buttonText

const FailFeedback = ({
  title,
  text,
  hasButton,
  buttonLink,
  buttonText,
  italic,
  onButtonClick,
}) => {
  const formattedText = text.split("\n").map((item, index) => (
    <React.Fragment key={index}>
      {item}
      <br />
    </React.Fragment>
  ));

  const italicFormated = italic.split("\n").map((item, index) => (
    <React.Fragment key={index}>
      {item}
      <br />
    </React.Fragment>
  ));

  useEffect(() => {
    // Coloca el scroll en la parte superior cuando el componente se monta
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="valerr feedback-success">
      <div className="iconBox">
        <svg
          className="feedback-success-icon"
          viewBox="0 0 64 64"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            d="m22 22 20 20M42 22 22 42"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
        <h2>{title}</h2>
        <p>{formattedText}</p>
        <p>
          <i>{italicFormated}</i>
        </p>
      </div>
      {hasButton ? (
        <div className="text-center">
          <Link
            className="feedback-success-action"
            to={buttonLink}
            onClick={onButtonClick}
          >
            {buttonText}
          </Link>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default FailFeedback;
