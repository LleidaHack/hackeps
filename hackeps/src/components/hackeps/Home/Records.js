import React, { useRef } from "react";
import { GALLERY_ITEMS } from "./galleryItems";
import Firework from "src/components/hackeps/Home/Firework.js";
import firework1 from "src/assets/img/home10/firework-1.svg";
import firework3 from "src/assets/img/home10/firework-3.svg";
import cloud2 from "src/assets/img/home10/cloud-2.svg";

const Records = () => {
  const track = useRef(null);
  const scroll = (direction) => {
    const element = track.current;
    if (!element) return;
    element.scrollBy({
      left: direction * element.clientWidth * 0.8,
      behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches
        ? "auto"
        : "smooth",
    });
  };
  return (
    <section
      aria-label="Records de la HackEPS"
      className="relative w-full overflow-hidden bg-transparent pb-16 pt-6 md:pb-[180px] md:pt-6"
    >
      <Firework
        src={firework1}
        width={299}
        height={296}
        className="left-[2%] top-[20%] z-0 hidden h-[160px] w-[160px] origin-center rotate-[24.04deg] md:block md:h-[220px] md:w-[220px] lg:h-[296px] lg:w-[299px]"
      />
      <Firework
        src={firework3}
        width={194}
        height={178}
        className="right-[4%] bottom-[10%] z-0 hidden h-[120px] w-[130px] md:block lg:h-[178px] lg:w-[194px]"
      />
      <img
        src={cloud2}
        alt=""
        aria-hidden="true"
        width={435}
        height={219}
        className="pointer-events-none absolute right-[-8%] bottom-[8%] z-0 hidden h-auto w-[28%] max-w-[320px] object-contain opacity-80 lg:block"
      />

      <div className="relative z-10">
        <svg
          className="pointer-events-none absolute left-0 top-[44px] md:top-[56px] h-[36px] w-full"
          viewBox="0 0 1728 36"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 10 Q 216 28 432 10 T 864 10 T 1296 10 T 1728 10"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>

        <div
          id="hackeps-gallery"
          ref={track}
          tabIndex={0}
          role="region"
          aria-label="Fotografies d’edicions anteriors"
          className="flex snap-x snap-mandatory gap-8 overflow-x-auto px-4 pb-8 pt-8 sm:gap-12 md:gap-24 md:px-12 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {GALLERY_ITEMS.map((item) => (
            <article
              key={item.id}
              className="w-[220px] shrink-0 snap-start sm:w-[280px] md:w-[340px]"
            >
              <img
                src={item.image}
                alt={item.alt}
                width={item.width}
                height={item.height}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full"
              />
            </article>
          ))}
        </div>
        <div className="flex justify-center gap-4 px-4">
          <button
            type="button"
            aria-label="Fotografies anteriors"
            aria-controls="hackeps-gallery"
            onClick={() => scroll(-1)}
            className="min-h-[44px] min-w-[44px] rounded bg-[#ff7430] px-4 py-2 text-[#242424] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Fotografies següents"
            aria-controls="hackeps-gallery"
            onClick={() => scroll(1)}
            className="min-h-[44px] min-w-[44px] rounded bg-[#ff7430] px-4 py-2 text-[#242424] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
};

export default Records;
