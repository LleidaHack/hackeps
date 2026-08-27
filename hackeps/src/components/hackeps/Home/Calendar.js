import TitleGeneralized from "../TitleGeneralized/TitleGeneralized";

const CalendarDates = () => {
  return (
    <section
      className="bg-skyDay px-4 md:px-16 py-16 md:py-24 flex flex-col items-center"
      id="dates"
    >
      <TitleGeneralized
        padTop="0"
        textNone
        className="text-headingInk font-space-mono font-bold uppercase tracking-tight text-2xl md:text-4xl sr-only"
      >
        Dates
      </TitleGeneralized>
      <div className="max-w-3xl text-headingInk text-base md:text-lg leading-relaxed text-center space-y-4">
        <p>
          Lleidahack et dona la benvinguda a la HackEPS, la hackató de les
          terres de Lleida!
        </p>
        <p>
          La desena edició de la HackEPS tindrà lloc a l&apos;edifici de
          l&apos;Escola Politècnica Superior de la Universitat de Lleida. Aquest
          és un esdeveniment que no voldràs perdre&apos;t!
        </p>
        <p>
          Així que, si ets un apassionat de la tecnologia, amant dels reptes i
          defensor del treball en equip, la HackEPS és el teu lloc. Uneix-te a
          nosaltres per a una experiència inoblidable per a desenvolupar-te com
          a futur programador!
        </p>
      </div>
    </section>
  );
};

export default CalendarDates;
