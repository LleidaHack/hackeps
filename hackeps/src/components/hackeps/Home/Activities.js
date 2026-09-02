import React from "react";
import dimoniBig from "src/assets/img/home10/fum-activitats.png";
import cloud5 from "src/assets/img/home10/cloud-5.png";

const ACTIVITIES = [
  { label: "Activitat 1", top: 533, left: 263, rotate: -14.69 },
  { label: "Activitat 1", top: 609, left: 560, rotate: 4.23 },
  { label: "Activitat 1", top: 706, left: 882, rotate: 3.03 },
  { label: "Activitat 1", top: 783, left: 380, rotate: 7.85 },
  { label: "Activitat 1", top: 889, left: 709, rotate: -16.29 },
  { label: "Activitat 1", top: 956, left: 271, rotate: 9.28 },
];

const Activities = () => {
  return (
    <section className="relative min-h-[1480px] w-full overflow-hidden bg-transparent">
      <h2 className="absolute left-1/2 top-[90px] z-20 m-0 -translate-x-1/2 whitespace-nowrap text-center font-space-mono text-[64px] font-bold leading-normal tracking-[-1.28px] text-[#2e2e2e]">
        QUÈ PODRAS FER A LA HACKEPS?
      </h2>
      <p className="absolute left-1/2 top-[259px] z-20 m-0 w-[1152px] max-w-[90vw] -translate-x-1/2 text-center font-space-mono text-[24px] leading-normal tracking-[-0.48px] text-[#2e2e2e]">
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
      <div className="absolute left-[-121px] top-[314px] z-10 h-[1052px] w-[1331px]">
        <img
          src={dimoniBig}
          alt=""
          width={1331}
          height={1052}
          className="h-[1052px] w-[1331px] max-w-none object-contain object-left"
        />
      </div>
      {ACTIVITIES.map((activity, index) => (
        <div
          key={`${activity.label}-${index}`}
          className="absolute z-20 flex items-center justify-center rounded-[8px] bg-white/90 px-3 py-1.5 font-space-mono text-[20px] font-bold leading-none tracking-[-0.4px] text-[#2e2e2e] shadow-sm"
          style={{
            top: `${activity.top}px`,
            left: `${activity.left}px`,
            transform: `translate(-50%, -50%) rotate(${activity.rotate}deg)`,
          }}
        >
          {activity.label}
        </div>
      ))}
    </section>
  );
};

export default Activities;
