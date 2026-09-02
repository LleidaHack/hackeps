import React from "react";
import galleryStrip from "src/assets/img/home10/gallery-strip.png";
import firework1 from "src/assets/img/home10/firework-1.png";
import firework3 from "src/assets/img/home10/firework-3.png";
import cloud2 from "src/assets/img/home10/cloud-2.png";
import iconArrow from "src/assets/img/home10/icon-arrow.svg";

const Records = () => {
  return (
    <section className="relative min-h-[1090px] w-full overflow-hidden bg-gradient-to-b from-[#94cbf5] to-[#2c465e]">
      <img
        src={firework1}
        alt=""
        aria-hidden="true"
        width={299}
        height={296}
        className="pointer-events-none absolute left-[36px] top-[277px] h-[296px] w-[299px] max-w-none origin-center rotate-[24.04deg] object-cover"
      />
      <img
        src={firework3}
        alt=""
        aria-hidden="true"
        width={194}
        height={178}
        className="pointer-events-none absolute left-[984px] top-[756px] h-[178px] w-[194px] max-w-none object-cover"
      />
      <img
        src={cloud2}
        alt=""
        aria-hidden="true"
        width={435}
        height={219}
        className="pointer-events-none absolute left-[1156px] top-[669px] h-[219px] w-[435px] max-w-none object-contain opacity-80"
      />
      <div className="absolute left-[80px] top-[calc(152px-26px)] flex items-center gap-2">
        <img
          src={iconArrow}
          alt=""
          width={24}
          height={24}
          className="h-6 w-6 max-w-none"
        />
        <p className="m-0 w-[370px] font-space-mono text-[24px] leading-normal tracking-[-0.48px] text-[#2e2e2e]">
          Arrossega cap a la dreta
        </p>
      </div>
      <div className="absolute left-[-26px] top-[49px] h-[887px] w-[1751px] overflow-x-auto overflow-y-hidden">
        <img
          src={galleryStrip}
          alt="Edicions anteriors de la HackEPS"
          width={1751}
          height={887}
          className="h-[887px] w-auto max-w-none object-contain object-left"
        />
      </div>
    </section>
  );
};

export default Records;
