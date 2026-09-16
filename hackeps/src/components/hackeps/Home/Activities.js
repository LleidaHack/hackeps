import React from "react";
import correfocs from "src/assets/correfocs.webp";
import dimoniBig from "src/assets/img/home10/fum-activitats.webp";
import cloud5 from "src/assets/img/home10/cloud-5.svg";

const ACTIVITIES = [
  { label: "Activitat 1", top: "20.8%", left: "28.8%", rotate: -14.69 },
  { label: "Activitat 1", top: "28.0%", left: "51.2%", rotate: 4.23 },
  { label: "Activitat 1", top: "37.3%", left: "75.4%", rotate: 3.03 },
  { label: "Activitat 1", top: "44.6%", left: "37.6%", rotate: 7.85 },
  { label: "Activitat 1", top: "54.7%", left: "62.4%", rotate: -16.29 },
  { label: "Activitat 1", top: "61.0%", left: "29.5%", rotate: 9.28 },
];

const Activities = () => {
  return (
    <section className="relative w-full overflow-hidden bg-transparent px-0 pb-12 pt-10 md:px-8 md:pb-20 md:pt-16">
      <h2 className="relative z-20 m-0 mb-4 px-4 text-center md:px-0 font-space-mono text-[26px] font-bold leading-tight tracking-[-0.52px] text-[#2e2e2e] md:mb-6 md:text-[48px] lg:text-[64px] lg:tracking-[-1.28px]">
        QUÈ PODRAS FER A LA HACKEPS?
      </h2>
      <p className="relative z-20 mx-auto mb-8 max-w-[900px] px-4 text-center md:px-0 font-space-mono text-[16px] leading-relaxed tracking-[-0.32px] text-[#2e2e2e] md:mb-10 md:text-[22px]">
        A part de programar durant la HackEPS es fan varies activitats a les
        quals podeu participar per guanyar premis
      </p>
      <img
        src={cloud5}
        alt=""
        aria-hidden="true"
        width={433}
        height={193}
        className="ambient-cloud ambient-cloud--2 ambient-cloud--right pointer-events-none absolute right-[-8%] top-[18%] h-auto w-[28%] max-w-[320px] object-contain"
      />
      <div className="relative z-10 ml-0 w-full max-w-none md:-ml-8 md:w-[85%] lg:w-[78%]">
        <picture>
          <source media="(prefers-reduced-motion: reduce)" srcSet={dimoniBig} />
          <img
            src={correfocs}
            alt=""
            aria-hidden="true"
            width={1347}
            height={1230}
            loading="lazy"
            decoding="async"
            className="h-auto w-full max-w-none object-contain object-left"
          />
        </picture>
        {ACTIVITIES.map((activity, index) => (
          <div
            key={`${activity.label}-${index}`}
            className="absolute z-20 flex items-center justify-center rounded-[8px] bg-white/90 px-2 py-1 font-space-mono text-[11px] font-bold leading-none tracking-[-0.2px] text-[#2e2e2e] shadow-sm sm:px-3 sm:py-1.5 sm:text-[16px] md:text-[20px]"
            style={{
              top: activity.top,
              left: activity.left,
              transform: `translate(-50%, -50%) rotate(${activity.rotate}deg)`,
            }}
          >
            {activity.label}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Activities;
