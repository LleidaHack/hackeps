import React from "react";
import fumActivitats from "src/assets/img/home10/fum-activitats.png";
import cloud5 from "src/assets/img/home10/cloud-5.png";

const ACTIVITIES = [
  { top: 1231.37, left: 386.42, rotate: 9.28 },
  { top: 627.36, left: 375.05, rotate: -14.69 },
  { top: 983.36, left: 542.75, rotate: 7.85 },
  { top: 735.36, left: 799.98, rotate: 4.23 },
  { top: 1134.8, left: 1013.25, rotate: -16.29 },
  { top: 874.01, left: 1259.19, rotate: 3.03 },
];

const Activities = () => {
  return (
    <section className="relative min-h-[1806px] w-full overflow-hidden bg-gradient-to-b from-[#94cbf5] from-[38.942%] to-[#65a9dd]">
      <h2 className="absolute left-1/2 top-[90px] m-0 -translate-x-1/2 whitespace-nowrap text-center font-space-mono text-[64px] font-bold leading-normal tracking-[-1.28px] text-[#2e2e2e]">
        QUÈ PODRAS FER A LA HACKEPS?
      </h2>
      <p className="absolute left-1/2 top-[259px] m-0 w-[1152px] max-w-[90vw] -translate-x-1/2 text-center font-space-mono text-[24px] leading-normal tracking-[-0.48px] text-[#2e2e2e]">
        A part de programar durant la HackEPS es fan varies activitats a les
        quals podeu participar per guanyar premis
      </p>
      <img
        src={cloud5}
        alt=""
        aria-hidden="true"
        width={433}
        height={193}
        className="pointer-events-none absolute left-[1223px] top-[385px] h-[193px] w-[433px] max-w-none object-contain"
      />
      <div className="absolute left-[-173px] top-[314px] h-[1503px] w-[1901px]">
        <img
          src={fumActivitats}
          alt=""
          width={1901}
          height={1503}
          className="h-[1503px] w-[1901px] max-w-none object-contain"
        />
      </div>
      {ACTIVITIES.map((activity, index) => (
        <div
          key={index}
          className="absolute -translate-x-full -translate-y-1/2 whitespace-nowrap text-right font-space-mono text-[32px] font-bold leading-normal tracking-[-0.64px] text-[#2e2e2e]"
          style={{
            top: `${activity.top}px`,
            left: `${activity.left}px`,
            transform: `translate(-100%, -50%) rotate(${activity.rotate}deg)`,
          }}
        >
          Activitat 1
        </div>
      ))}
    </section>
  );
};

export default Activities;
