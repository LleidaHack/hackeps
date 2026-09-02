import React from "react";

const Newsletter = () => {
  return (
    <section className="relative h-[556px] w-full overflow-hidden bg-white">
      <h2 className="absolute left-1/2 top-[49px] m-0 -translate-x-1/2 whitespace-nowrap text-center font-space-mono text-[64px] font-bold leading-normal tracking-[-1.28px] text-[#2e2e2e]">
        VOLS ENTERARTE DE TOT?
      </h2>
      <p className="absolute left-1/2 top-[287px] m-0 w-[1152px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 text-center font-space-mono text-[24px] leading-normal tracking-[-0.48px] text-[#2e2e2e]">
        Lorena Ipsum sobre que fa el life Lorena Ipsum sobre que fa el
        lifeLorena Ipsum sobre que fa el lifeLorena Ipsum sobre que fa el
        lifeLorena Ipsum sobre que fa el lifeLorena Ipsum sobre que fa el
        lifeLorena Ipsum sobre que fa el lifeLorena Ipsum sobre que fa el life
      </p>
      <a
        href="https://live.lleidahack.dev"
        className="absolute left-1/2 top-[432px] flex -translate-x-1/2 flex-col items-center justify-center rounded-[4px] bg-[#ff7430] px-4 py-2 no-underline"
      >
        <span className="font-space-mono text-[32px] leading-normal tracking-[-0.64px] text-[#2e2e2e]">
          Web Live
        </span>
      </a>
    </section>
  );
};

export default Newsletter;
