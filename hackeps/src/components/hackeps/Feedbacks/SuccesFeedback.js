import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "src/components/hackeps/Feedbacks/FeedbackStyle.css";

const SuccessFeedback = ({
  title,
  text,
  italics,
  hasButton,
  buttonLink,
  buttonText,
  onButtonClick,
}) => {
  const formattedText = text.split("\n").map((item, index) => (
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
            d="m19 32 9 9 18-19"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h2>{title}</h2>
        <p>{formattedText}</p>
        <p>
          <i>{italics}</i>
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

export default SuccessFeedback;
