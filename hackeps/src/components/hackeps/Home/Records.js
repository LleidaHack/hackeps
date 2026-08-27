import React from "react";
import galleryStrip from "src/assets/img/home10/gallery-strip.png";

const Records = () => {
  return (
    <section className="bg-skyDay pb-8 md:pb-16 overflow-hidden">
      <p className="px-4 md:px-16 mb-4 font-space-mono text-headingInk text-sm md:text-base">
        Arrossega cap a la dreta
      </p>
      <div className="overflow-x-auto overflow-y-hidden pb-4">
        <img
          src={galleryStrip}
          alt="Edicions anteriors de la HackEPS"
          width={1751}
          height={887}
          className="h-[220px] sm:h-[320px] md:h-[420px] lg:h-[520px] w-auto max-w-none object-contain object-left"
        />
      </div>
    </section>
  );
};

export default Records;
