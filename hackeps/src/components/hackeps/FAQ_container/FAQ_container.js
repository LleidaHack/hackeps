import React, { useEffect } from "react";
import FAQCard from "src/components/hackeps/FAQ_card/FAQ_card";

const FAQContainer = ({ faqs }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="px-[10%] py-10">
      <h1 className="mb-8 mt-0 text-center font-space-mono text-[48px] font-bold leading-none tracking-[-0.96px] text-white">
        FAQs
      </h1>
      <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-3">
        {faqs.map((faq, index) => (
          <FAQCard key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
};

export default FAQContainer;
