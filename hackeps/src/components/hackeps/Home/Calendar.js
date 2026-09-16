import cloud1 from "src/assets/img/home10/cloud-5.svg";
import cloud2 from "src/assets/img/home10/cloud-2.svg";

const CalendarDates = () => {
  return (
    <section
      id="dates"
      className="relative w-full overflow-hidden bg-[#94cbf5] min-h-[898px]"
    >
      <img
        src={cloud1}
        alt=""
        aria-hidden="true"
        width={359}
        height={160}
        className="pointer-events-none absolute left-[1340px] top-[152px] h-[160px] w-[359px] max-w-none object-contain"
      />
      <img
        src={cloud2}
        alt=""
        aria-hidden="true"
        width={435}
        height={219}
        className="pointer-events-none absolute left-[64px] top-[268px] h-[219px] w-[435px] max-w-none object-contain"
      />
      <div className="absolute left-1/2 top-[295px] w-[952px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 text-center font-space-mono text-[24px] leading-normal tracking-[-0.48px] text-[#2e2e2e]">
        <p className="m-0 mb-0">
          Lleidahack et dona la benvinguda a la HackEPS 2025, la primera hackató
          de les terres de Lleida!
        </p>
        <p className="m-0 mb-0">
          La novena edició de la HackEPS tindrà lloc a l&apos;edifici de l&apos;
          <span className="font-bold">Escola Politècnica</span>{" "}
          <span className="font-bold">
            Superior de la Universitat de Lleida
          </span>{" "}
          els dies
          <span className="font-bold"> 22 i 23 de novembre de 2025</span>.
          Aquest és un esdeveniment que no voldràs perdre&apos;t!
        </p>
        <p className="m-0 mb-0">
          Així que, si ets un apassionat de la tecnologia, amant dels reptes i
          defensor del treball en equip, la HackEPS 2025 és el teu lloc. Uneix-te
          a nosaltres per a una experiència inoblidable per a desenvolupar-te
          com a futur programador!
        </p>
        <p className="m-0">FICAR QUAN ES FA</p>
      </div>
    </section>
  );
};

export default CalendarDates;
