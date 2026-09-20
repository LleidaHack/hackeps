import React, { useEffect, useRef, useState } from "react";
import { GALLERY_ITEMS } from "./galleryItems";
import Firework from "src/components/hackeps/Home/Firework.js";
import firework1 from "src/assets/img/home10/firework-1.svg";
import firework3 from "src/assets/img/home10/firework-3.svg";
import cloud2 from "src/assets/img/home10/cloud-2.svg";

export function shufflePhotos(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const Records = () => {
  // Drag-to-scroll with the mouse. Touch and wheel keep working natively.
  const scrollerRef = useRef(null);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0 });
  const [dragging, setDragging] = useState(false);
  const [items] = useState(() => shufflePhotos(GALLERY_ITEMS));
  const [interacting, setInteracting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(Boolean(media?.matches));
    update();
    media?.addEventListener?.("change", update);
    return () => media?.removeEventListener?.("change", update);
  }, []);
  useEffect(() => {
    if (interacting || reducedMotion || dragging) return;
    const timer = setInterval(() => {
      const el = scrollerRef.current;
      if (!el || document.hidden) return;
      const step = el.children[1]?.offsetLeft - el.children[0]?.offsetLeft;
      if (!step) return;
      const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      el.scrollTo({
        left: end ? 0 : el.scrollLeft + step,
        behavior: end ? "auto" : "smooth",
      });
    }, 4500);
    return () => clearInterval(timer);
  }, [interacting, reducedMotion, dragging]);

  const startDrag = (e) => {
    const el = scrollerRef.current;
    if (!el || e.button !== 0) return;
    drag.current = { active: true, startX: e.pageX, scrollLeft: el.scrollLeft };
    setDragging(true);
  };
  const moveDrag = (e) => {
    const el = scrollerRef.current;
    if (!el || !drag.current.active) return;
    e.preventDefault();
    el.scrollLeft = drag.current.scrollLeft - (e.pageX - drag.current.startX);
  };
  const endDrag = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    setDragging(false);
  };

  return (
    <section
      aria-label="Records de la HackEPS"
      className="relative w-full overflow-hidden bg-transparent pb-16 pt-6 md:pb-[180px] md:pt-6"
    >
      <Firework
        phase={0}
        src={firework1}
        width={299}
        height={296}
        className="left-[2%] top-[20%] z-0 hidden h-[160px] w-[160px] origin-center rotate-[24.04deg] md:block md:h-[220px] md:w-[220px] lg:h-[296px] lg:w-[299px]"
      />
      <Firework
        phase={1}
        src={firework3}
        width={194}
        height={178}
        className="right-[4%] bottom-[10%] z-0 h-[90px] w-[100px] md:h-[120px] md:w-[130px] lg:h-[178px] lg:w-[194px]"
      />
      <img
        src={cloud2}
        alt=""
        aria-hidden="true"
        width={435}
        height={219}
        className="ambient-cloud ambient-cloud--2 ambient-cloud--left pointer-events-none absolute right-[-8%] bottom-[8%] z-0 h-auto w-[28%] max-w-[320px] object-contain opacity-80"
      />

      <div
        className="relative z-10"
        onMouseEnter={() => setInteracting(true)}
        onMouseLeave={() => {
          setInteracting(false);
          endDrag();
        }}
        onFocus={() => setInteracting(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setInteracting(false);
        }}
        onTouchStart={() => setInteracting(true)}
        onTouchEnd={() => setInteracting(false)}
      >
        <svg
          className="pointer-events-none absolute left-0 top-[96px] md:top-[108px] h-[36px] w-full"
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
          ref={scrollerRef}
          tabIndex={0}
          role="region"
          aria-label="Fotografies d’edicions anteriors"
          onMouseDown={startDrag}
          onMouseMove={moveDrag}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          className={`flex gap-8 overflow-x-auto px-4 pb-8 pt-8 sm:gap-12 md:gap-24 md:px-12 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
            dragging
              ? "cursor-grabbing select-none"
              : "snap-x snap-mandatory cursor-grab"
          }`}
        >
          {items.map((item) => (
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
                draggable={false}
                className="block h-auto w-full"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Records;
