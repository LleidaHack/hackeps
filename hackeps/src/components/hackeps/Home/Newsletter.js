import React from "react";

const Newsletter = () => {
  return (
    <section className="relative w-full overflow-hidden bg-white px-4 py-12 md:px-8 md:py-16">
      <h2 className="relative m-0 mb-6 text-center font-space-mono text-[28px] font-bold leading-tight tracking-[-0.56px] text-[#2e2e2e] md:mb-8 md:text-[48px] lg:text-[64px] lg:tracking-[-1.28px]">
        VOLS ENTERARTE DE TOT?
      </h2>
      <p className="relative mx-auto mb-8 max-w-[900px] text-center font-space-mono text-[16px] leading-relaxed tracking-[-0.32px] text-[#2e2e2e] md:text-[22px] md:leading-normal md:tracking-[-0.44px]">
        Lorena Ipsum sobre que fa el life Lorena Ipsum sobre que fa el
        lifeLorena Ipsum sobre que fa el lifeLorena Ipsum sobre que fa el
        lifeLorena Ipsum sobre que fa el lifeLorena Ipsum sobre que fa el
        lifeLorena Ipsum sobre que fa el lifeLorena Ipsum sobre que fa el life
      </p>
      <a
        href="https://live.lleidahack.dev"
        className="relative mx-auto flex w-fit flex-col items-center justify-center rounded-[4px] bg-[#ff7430] px-4 py-2 no-underline"
      >
        <span className="font-space-mono text-[22px] leading-normal tracking-[-0.44px] text-[#2e2e2e] md:text-[32px] md:tracking-[-0.64px]">
          Web Live
        </span>
      </a>
    </section>
  );
};

export default Newsletter;
