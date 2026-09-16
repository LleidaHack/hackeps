import { useEdition } from "src/hooks/useEdition";
import React from "react";

const WEEKDAYS = ["Dl", "Dt", "Dc", "Dj", "Dv", "Ds", "Dg"];
const DatesCalendar = () => {
  const { event, loading } = useEdition();
  if (!event) return <p role="status" className="text-center">{loading ? "Carregant les dates…" : "Dates pendents de confirmar"}</p>;
  const start = new Date(event.start_date);
  const end = new Date(event.end_date);
  const YEAR = start.getFullYear();
  const MONTH = start.getMonth();
  const firstDay = (new Date(YEAR, MONTH, 1).getDay() + 6) % 7;
  const DAYS = Array.from({ length: 42 }, (_, index) => new Date(YEAR, MONTH, index - firstDay + 1));
  const stamp = date => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  return (
    <div className="relative mx-auto w-full max-w-[1036px] rounded-[20px] bg-[#ff782e] px-3 pb-4 pt-4 sm:px-6 sm:pb-6 sm:pt-5 md:w-[85%] md:rounded-[30px] md:px-8 md:pb-8 md:pt-6 lg:w-[60%]">
      <p className="mb-3 mt-0 text-center font-space-mono text-[20px] font-bold leading-none text-black sm:mb-4 sm:mt-1 md:text-[28px]">
        {start.toLocaleDateString("ca", { month: "long", year: "numeric" })}
      </p>
      <div className="overflow-hidden rounded-[4px] bg-white">
        <div className="grid grid-cols-7 border-b border-[#d9d9d9]">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="py-1.5 text-center font-sans text-[10px] font-semibold text-[#4a4a4a] sm:py-2 sm:text-[13px]"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {DAYS.map((date, index) => {
            const day = date.getDate();
            const isNextMonth = date.getMonth() !== MONTH;
            const isHighlight = stamp(date) >= stamp(start) && stamp(date) <= stamp(end);
            return (
              <div
                key={`${day}-${index}`}
                aria-label={isHighlight ? `${date.toLocaleDateString("ca")}, HackEPS` : undefined}
                className={`flex h-10 items-center justify-center border-b border-r border-[#ececec] font-sans text-[14px] sm:h-14 sm:text-[18px] md:h-[72px] md:text-[22px] ${
                  isHighlight ? "bg-[#e6f2ff] font-semibold text-[#3b82c4]" : "text-[#2e2e2e]"
                } ${isNextMonth ? "text-[#b0b0b0]" : ""} ${
                  index % 7 === 6 ? "border-r-0" : ""
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DatesCalendar;
