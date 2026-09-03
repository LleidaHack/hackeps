import { useState } from "react";

const FAQCard = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={`flex w-full items-center justify-between border-0 bg-[#ff7430] px-6 py-4 text-left font-space-mono text-[22px] font-bold leading-snug tracking-[-0.44px] text-[#2e2e2e] ${
          open ? "rounded-t-[12px]" : "rounded-[12px]"
        }`}
      >
        <span>{question}</span>
        <span
          aria-hidden="true"
          className={`ml-4 inline-block shrink-0 text-[20px] leading-none transition-transform duration-300 ease-in-out ${
            open ? "rotate-180" : "rotate-0"
          }`}
        >
          ▼
        </span>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="rounded-b-[12px] bg-white px-6 py-5 font-space-mono text-[16px] leading-relaxed tracking-[-0.32px] text-[#2e2e2e]">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQCard;
