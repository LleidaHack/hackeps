import React from "react";
import "src/components/hackeps/LoadSection/LoadSection.css";

const LoadSection = () => {
  return (
    <div className="valerre bg-[#2e2e2e] text-white">
      <div className="loader">
        <svg className="circular-loader" viewBox="25 25 50 50">
          <circle
            className="loader-path"
            cx="50"
            cy="50"
            r="20"
            fill="none"
            stroke="#ff7430"
            strokeWidth="2"
          />
        </svg>
      </div>
      <h2 className="ellipsis-dots text-center text-white">Carregant</h2>
    </div>
  );
};

export default LoadSection;
