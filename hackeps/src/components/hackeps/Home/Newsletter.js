import React from "react";
import { Link } from "react-router-dom";
import TitleGeneralized from "src/components/hackeps/TitleGeneralized/TitleGeneralized";
import Button from "src/components/buttons/Button";
import { ROUTES } from "src/config/routes";

const Newsletter = () => {
  return (
    <section className="bg-white px-4 md:px-16 py-16 md:py-24 text-center">
      <TitleGeneralized
        padTop="0"
        textNone
        className="text-headingInk font-space-mono font-bold uppercase tracking-tight text-2xl md:text-4xl lg:text-5xl"
      >
        VOLS ENTERAR-TE DE TOT?
      </TitleGeneralized>
      <p className="mt-8 mx-auto max-w-3xl text-headingInk text-base md:text-lg leading-relaxed">
        Segueix les novetats de la HackEPS: inscripcions, horaris, reptes i tot
        el que passa durant l&apos;esdeveniment. Si ja tens compte, el perfil és
        el millor lloc per estar al dia.
      </p>
      <div className="mt-10 flex justify-center">
        <Link to={ROUTES.contact} className="no-underline">
          <Button
            primaryLanding
            lg
            className="font-space-mono border-none text-[#2e2e2e] px-6 py-2"
          >
            Dons i tant!
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default Newsletter;
