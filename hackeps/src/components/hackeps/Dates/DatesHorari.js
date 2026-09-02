const SATURDAY = [
  { time: "09:00", title: "Acreditacions i benvinguda" },
  { time: "10:00", title: "Cerimònia d'obertura" },
  { time: "11:00", title: "Inici de l'hacking" },
  { time: "14:00", title: "Dinar" },
  { time: "18:00", title: "Mentoring i activitats" },
  { time: "21:00", title: "Sopar" },
];

const SUNDAY = [
  { time: "08:00", title: "Esmorzar" },
  { time: "11:00", title: "Fi de l'hacking i lliurament" },
  { time: "12:00", title: "Presentacions" },
  { time: "16:00", title: "Premis i cloenda" },
];

const DayColumn = ({ heading, items }) => (
  <div className="w-[640px]">
    <h3 className="m-0 mb-10 text-center font-space-mono text-[40px] font-bold leading-none tracking-[-0.8px] text-[#2e2e2e]">
      {heading}
    </h3>
    <ol className="m-0 list-none p-0">
      {items.map((item) => (
        <li key={`${item.time}-${item.title}`} className="mb-8 flex items-baseline gap-8">
          <time className="w-[120px] shrink-0 font-space-mono text-[32px] font-bold leading-none tracking-[-0.64px] text-[#ff7430]">
            {item.time}
          </time>
          <span className="font-space-mono text-[28px] leading-normal tracking-[-0.56px] text-[#2e2e2e]">
            {item.title}
          </span>
        </li>
      ))}
    </ol>
  </div>
);

const DatesHorari = () => {
  return (
    <section
      id="horari"
      className="relative w-full overflow-hidden bg-[#94cbf5] px-[96px] pb-[160px] pt-[40px]"
    >
      <h2 className="m-0 mb-[72px] text-center font-space-mono text-[64px] font-bold leading-normal tracking-[-1.28px] text-[#2e2e2e]">
        HORARI
      </h2>
      <div className="flex justify-center gap-[96px]">
        <DayColumn heading="Dissabte 22" items={SATURDAY} />
        <DayColumn heading="Diumenge 23" items={SUNDAY} />
      </div>
    </section>
  );
};

export default DatesHorari;
