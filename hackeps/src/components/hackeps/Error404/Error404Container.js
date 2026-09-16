import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "src/config/routes";

const Error404 = () => {
  return (
    <div className="flex min-h-[780px] flex-col items-center justify-center px-8 py-24 text-center text-white">
      <h1 className="m-0 font-space-mono text-[96px] sm:text-[160px] font-normal leading-none tracking-[-3.2px]">
        404
      </h1>
      <p className="mt-6 mb-12 max-w-[720px] font-space-mono text-[24px] leading-normal tracking-[-0.48px]">
        La pàgina que estàs buscant no es troba als nostres servidors. :(
      </p>
      <Link
        to={ROUTES.home}
        className="inline-flex min-h-[56px] w-full max-w-[420px] items-center justify-center bg-[#ff7430] px-10 font-space-mono text-[22px] font-bold text-[#2e2e2e] no-underline hover:bg-[#ff8a52]"
      >
        Torna a l’inici
      </Link>
    </div>
  );
};

export default Error404;
