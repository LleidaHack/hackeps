import React from "react";
import TitleGeneralized from "src/components/hackeps/TitleGeneralized/TitleGeneralized";
import fumActivitats from "src/assets/img/home10/fum-activitats.png";

const ACTIVITIES = [
  { label: "Activitat 1", top: "18%", left: "8%" },
  { label: "Activitat 2", top: "38%", left: "22%" },
  { label: "Activitat 3", top: "22%", left: "42%" },
  { label: "Activitat 4", top: "48%", left: "58%" },
  { label: "Activitat 5", top: "62%", left: "12%" },
  { label: "Activitat 6", top: "55%", left: "72%" },
];

const Activities = () => {
  return (
    <section className="relative bg-skyDay px-4 md:px-16 pt-16 md:pt-24 pb-8 overflow-hidden">
      <TitleGeneralized
        padTop="0"
        textNone
        className="text-headingInk font-space-mono font-bold uppercase tracking-tight text-2xl md:text-4xl lg:text-5xl"
      >
        QUÈ PODRÀS FER A LA HACKEPS?
      </TitleGeneralized>
      <p className="mt-6 mx-auto max-w-3xl text-center text-headingInk text-base md:text-lg">
        A part de programar durant la HackEPS es fan diverses activitats a les
        quals podeu participar per guanyar premis.
      </p>

      <div className="relative mt-8 md:mt-4 max-w-6xl mx-auto">
        <img
          src={fumActivitats}
          alt="Núvol d'activitats de la HackEPS"
          width={1901}
          height={1503}
          className="w-full h-auto object-contain"
        />
        <ul className="absolute inset-0 list-none m-0 p-0 hidden md:block">
          {ACTIVITIES.map((activity) => (
            <li
              key={activity.label + activity.left}
              className="absolute font-space-mono font-bold text-headingInk text-lg lg:text-2xl whitespace-nowrap"
              style={{ top: activity.top, left: activity.left }}
            >
              {activity.label}
            </li>
          ))}
        </ul>
        <ul className="md:hidden list-none m-0 mt-4 p-0 grid grid-cols-2 gap-3 text-center font-space-mono font-bold text-headingInk">
          {ACTIVITIES.map((activity) => (
            <li key={activity.label}>{activity.label}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Activities;
