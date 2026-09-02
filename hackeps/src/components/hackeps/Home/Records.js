import React from "react";
import firework1 from "src/assets/img/home10/firework-1.png";
import firework3 from "src/assets/img/home10/firework-3.png";
import cloud2 from "src/assets/img/home10/cloud-2.png";

/*
  Afegeix aquí les fotos del carrusel.
  `image` pot ser un import (p.ex. import hackeps8 from "src/assets/img/gallery/hackeps-8.jpg")
  o null mentre no tinguis l'arxiu: es veurà el recuadre buit.
*/
const GALLERY_ITEMS = [
  {
    id: "hackeps-8",
    title: "HACKEPS 8",
    color: "#0b3d2e",
    image: null,
  },
  {
    id: "hackeps-1",
    title: "HACKEPS 1",
    color: "#e67e22",
    image: null,
  },
  {
    id: "hackeps-6",
    title: "HACKEPS 6",
    color: "#a92323",
    image: null,
  },
  {
    id: "hackeps-7",
    title: "HACKEPS 7",
    color: "#f39c12",
    image: null,
  },
  {
    id: "hackeps-5",
    title: "HACKEPS 5",
    color: "#1d6aa3",
    image: null,
  },
  {
    id: "hackeps-4",
    title: "HACKEPS 4",
    color: "#78c6bd",
    image: null,
  },
];

const PolaroidCard = ({ title, color, image }) => (
  <article className="relative w-[260px] shrink-0 pt-4">
    <span
      aria-hidden="true"
      className="absolute left-1/2 top-0 z-20 h-[18px] w-[28px] -translate-x-1/2 -translate-y-1/2 rounded-[3px]"
      style={{ backgroundColor: color }}
    />
    <div className="flex h-[420px] flex-col rounded-[28px] bg-white px-5 pb-5 pt-7 shadow-[0_8px_20px_rgba(46,46,46,0.12)]">
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-[16px] bg-[#d7e9f7]">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>
      <p
        className="mb-0 mt-4 text-center font-space-mono text-[22px] font-bold leading-none tracking-[-0.44px]"
        style={{ color }}
      >
        {title}
      </p>
    </div>
  </article>
);

const Records = () => {
  return (
    <section className="relative w-full overflow-hidden bg-transparent pb-[220px] pt-[24px]">
      <img
        src={firework1}
        alt=""
        aria-hidden="true"
        width={299}
        height={296}
        className="pointer-events-none absolute left-[36px] top-[277px] z-0 h-[296px] w-[299px] max-w-none origin-center rotate-[24.04deg] object-cover"
      />
      <img
        src={firework3}
        alt=""
        aria-hidden="true"
        width={194}
        height={178}
        className="pointer-events-none absolute left-[984px] top-[756px] z-0 h-[178px] w-[194px] max-w-none object-cover"
      />
      <img
        src={cloud2}
        alt=""
        aria-hidden="true"
        width={435}
        height={219}
        className="pointer-events-none absolute left-[1156px] top-[669px] z-0 h-[219px] w-[435px] max-w-none object-contain opacity-80"
      />

      <div className="relative z-10">
        <svg
          className="pointer-events-none absolute left-0 top-[18px] h-[36px] w-full"
          viewBox="0 0 1728 36"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 10 Q 216 28 432 10 T 864 10 T 1296 10 T 1728 10"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>

        <div className="flex snap-x snap-mandatory gap-24 overflow-x-auto px-[64px] pb-8 pt-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {GALLERY_ITEMS.map((item) => (
            <div key={item.id} className="snap-start">
              <PolaroidCard
                title={item.title}
                color={item.color}
                image={item.image}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Records;
