import React from "react";

const WEEKDAYS = ["Dl", "Dt", "Dc", "Dj", "Dv", "Ds", "Dg"];
const YEAR = 2026;
const MONTH = 10;
const FIRST_DAY = (new Date(YEAR, MONTH, 1).getDay() + 6) % 7;
const DAYS = Array.from({ length: 42 }, (_, index) => new Date(YEAR, MONTH, index - FIRST_DAY + 1));

const DatesCalendar = () => {
  return (
    <div className="relative mx-auto w-full max-w-[1036px] rounded-[20px] bg-[#ff782e] px-3 pb-4 pt-4 sm:px-6 sm:pb-6 sm:pt-5 md:w-[85%] md:rounded-[30px] md:px-8 md:pb-8 md:pt-6 lg:w-[60%]">
      <p className="mb-3 mt-0 text-center font-space-mono text-[20px] font-bold leading-none text-black sm:mb-4 sm:mt-1 md:text-[28px]">
        Novembre 2026
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
            const isHighlight = !isNextMonth && [28, 29].includes(day);
            return (
              <div
                key={`${day}-${index}`}
                aria-label={isHighlight ? `${day} de novembre de 2026, HackEPS` : undefined}
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
