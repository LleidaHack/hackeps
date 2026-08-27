import React from "react";
import seuVella from "src/assets/img/home10/seu-vella.png";
import arbre from "src/assets/img/home10/arbre.png";
import Footer from "src/components/hackeps/Footer/Footer.js";

const HomeFooter = () => {
  return (
    <div className="relative bg-nightNavyDeep overflow-hidden">
      <div className="relative w-full pointer-events-none" aria-hidden="true">
        <img
          src={seuVella}
          alt=""
          width={1728}
          height={1224}
          className="w-full h-auto object-cover object-bottom max-h-[420px] md:max-h-[560px]"
        />
        <img
          src={arbre}
          alt=""
          width={365}
          height={451}
          className="absolute bottom-[8%] left-[8%] w-[28%] max-w-[280px] h-auto object-contain hidden sm:block"
        />
      </div>
      <div className="relative z-10 [&_footer]:bg-transparent">
        <Footer />
      </div>
    </div>
  );
};

export default HomeFooter;
