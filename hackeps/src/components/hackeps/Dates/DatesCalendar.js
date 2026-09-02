import React from "react";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const DAYS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23, 24, 25, 26, 27, 28, 29, 30, 1, 2, 3, 4, 5,
];
const HIGHLIGHT = 29;

const DatesCalendar = () => {
  return (
    <div className="relative mx-auto w-[60%] rounded-[30px] bg-[#ff782e] px-8 pb-8 pt-6">
      <p className="mb-4 mt-1 text-center font-space-mono text-[28px] font-bold leading-none text-black">
        Septembre
      </p>
      <div className="overflow-hidden rounded-[4px] bg-white">
        <div className="grid grid-cols-7 border-b border-[#d9d9d9]">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="py-2 text-center font-sans text-[13px] font-semibold text-[#4a4a4a]"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {DAYS.map((day, index) => {
            const isNextMonth = index >= 30;
            const isHighlight = !isNextMonth && day === HIGHLIGHT;
            return (
              <div
                key={`${day}-${index}`}
                className={`flex h-[72px] items-center justify-center border-b border-r border-[#ececec] font-sans text-[22px] ${
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
