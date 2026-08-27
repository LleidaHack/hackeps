import React from "react";

const SIZES = {
  gold: { box: "w-56 h-36 md:w-72 md:h-40", img: "max-h-24 md:max-h-28" },
  silver: { box: "w-48 h-32 md:w-56 md:h-36", img: "max-h-20 md:max-h-24" },
  bronze: { box: "w-40 h-28 md:w-48 md:h-32", img: "max-h-16 md:max-h-20" },
};

const LogoSponsors = ({ image, name, size = "silver", small = false }) => {
  const tier = small ? "bronze" : size;
  const { box, img } = SIZES[tier] || SIZES.silver;

  return (
    <div
      className={`relative ${box} bg-white rounded-lg items-center justify-center content-center flex px-4`}
    >
      <img
        src={image}
        alt={name}
        width={180}
        height={96}
        className={`w-full ${img} object-contain`}
      />
    </div>
  );
};

export default LogoSponsors;
