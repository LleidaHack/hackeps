import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const CONFETTI_COLORS = ["#e94447", "#ffe245", "#42b69f", "#3b5da8", "#ee7438"];
const DOT_SIZE = 72;
// When the iris starts opening onto the page.
const IRIS = 1.35;

// Covers the viewport except for a circular hole of radius r at (x, y).
function irisPath(width, height, x, y, r) {
  return `path(evenodd, "M0 0H${width}V${height}H0Z M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z")`;
}

/**
 * Home intro: an orange dot swallows the screen, then an iris opens onto the
 * real page while its elements animate in. Every page element is tweened
 * *from* an offset state, so the last frame is the page itself.
 */
const HomeIntro = ({ onFinish }) => {
  const overlay = useRef(null);
  const timeline = useRef(null);
  const finish = useRef(onFinish);
  finish.current = onFinish;

  useGSAP(
    () => {
      // Rendered as the first child of the page, whose ref is not attached yet.
      const page = overlay.current.parentElement;
      const all = (selector) => gsap.utils.toArray(page.querySelectorAll(selector));
      const part = (name) => all(`[data-intro="${name}"]`);
      const width = window.innerWidth;
      const height = window.innerHeight;
      window.scrollTo(0, 0);

      // The iris opens from the logo, which is where the orange dot sits.
      const logo = part("logo")[0];
      const box = logo?.getBoundingClientRect();
      const x = box?.width ? box.left + box.width / 2 : width / 2;
      const y = box?.height ? Math.min(box.top + box.height / 2, height / 2) : height / 2;
      const reach = Math.hypot(Math.max(x, width - x), Math.max(y, height - y));

      const q = gsap.utils.selector(overlay);
      const [dark, orange, dot, confettiLayer] = [".intro-dark", ".intro-orange", ".intro-dot", ".intro-confetti"].map(
        (selector) => q(selector)[0],
      );
      const hole = { r: 0 };
      const drawHole = () => {
        orange.style.clipPath = irisPath(width, height, x, y, hole.r);
      };
      drawHole();

      const tl = gsap.timeline({ onComplete: () => finish.current() });
      timeline.current = tl;

      // 1. The orange dot pops, beats once and floods the screen.
      gsap.set(dot, { left: x - DOT_SIZE / 2, top: y - DOT_SIZE / 2, scale: 0 });
      tl.to(dot, { scale: 1, duration: 0.35, ease: "back.out(2.5)" }, 0.1)
        .to(dot, { scale: 1.25, duration: 0.14, ease: "power2.out", yoyo: true, repeat: 1 }, 0.5)
        .to(dot, { scale: (reach * 2.1) / DOT_SIZE, duration: 0.5, ease: "power3.in" }, 0.8)
        .set([dark, dot], { autoAlpha: 0 }, IRIS - 0.05)
        .set(orange, { autoAlpha: 1 }, IRIS - 0.05);

      // 2. The iris reveals the page; from here on it can be clicked.
      tl.to(hole, { r: reach, duration: 0.85, ease: "power3.inOut", onUpdate: drawHole }, IRIS)
        .set(overlay.current, { pointerEvents: "none" }, IRIS)
        .set(orange, { autoAlpha: 0 }, IRIS + 0.85);

      // 3. Page elements settle into their real place.
      tl.from(part("header"), { yPercent: -100, duration: 0.6, ease: "power3.out" }, IRIS + 0.35)
        .from(
          part("bunting"),
          { yPercent: -110, rotation: -2.5, transformOrigin: "50% 0%", duration: 0.9, ease: "back.out(1.6)" },
          IRIS + 0.1,
        )
        .from(part("logo"), { scale: 0.15, rotation: -14, opacity: 0, duration: 1, ease: "back.out(1.8)" }, IRIS + 0.15)
        .from(part("cta"), { scale: 0, opacity: 0, duration: 0.6, ease: "back.out(2)" }, IRIS + 0.9)
        .from(part("wave"), { yPercent: 35, opacity: 0, duration: 0.8, ease: "power3.out" }, IRIS + 1.1);

      // Clouds glide in from their side. Their CSS drift uses `translate`,
      // which GSAP would fold into a transform it cannot hand back, so they
      // move with the margin on the side they are anchored to.
      part("cloud").forEach((cloud, i) => {
        const { left, width: w } = cloud.getBoundingClientRect();
        const margin = left + w / 2 < width / 2 ? "marginLeft" : "marginRight";
        tl.from(cloud, { [margin]: -width * 0.3, opacity: 0, duration: 1.2, ease: "power3.out" }, IRIS + i * 0.07);
      });

      // 4. Festa: fireworks burst behind the logo, capgrossos parade, confetti.
      // GSAP owns their transforms, so it also does the centring.
      const fireworks = all('[data-intro-extra="firework"]');
      const heads = all('[data-intro-extra="head"]');
      gsap.set(fireworks, { xPercent: -50, yPercent: -50 });
      gsap.set(heads, { xPercent: -50, yPercent: 130 });

      fireworks.forEach((firework, i) => {
        const at = IRIS + 0.2 + i * 0.3;
        tl.fromTo(
          firework,
          { clipPath: "circle(0% at 50% 50%)", scale: 0.55, rotation: -12, opacity: 1 },
          { clipPath: "circle(75% at 50% 50%)", scale: 1, rotation: 0, opacity: 1, duration: 0.55, ease: "expo.out" },
          at,
        ).to(firework, { opacity: 0, scale: 1.08, duration: 0.45, ease: "power1.in" }, at + 0.6);
      });

      const headsOut = IRIS + 3.2;
      heads.forEach((head, i) => {
        const at = IRIS + 0.8 + i * 0.08;
        tl.fromTo(
          head,
          { yPercent: 130, rotation: i % 2 ? 10 : -10 },
          { yPercent: 0, rotation: 0, duration: 0.7, ease: "back.out(1.5)" },
          at,
        )
          .to(head, { y: -12, rotation: i % 2 ? -5 : 5, duration: 0.3, yoyo: true, repeat: 3, ease: "sine.inOut" }, at + 0.7)
          .to(head, { yPercent: 140, duration: 0.5, ease: "back.in(1.4)" }, headsOut + i * 0.05);
      });

      const unit = Math.min(width, height) / 100;
      for (let i = 0; i < 70; i++) {
        const piece = document.createElement("span");
        const size = (0.8 + Math.random()) * unit;
        Object.assign(piece.style, {
          position: "absolute",
          top: `${-3 * unit}px`,
          left: `${Math.random() * width}px`,
          width: `${size}px`,
          height: `${size * (0.45 + Math.random() * 0.4)}px`,
          borderRadius: "2px",
          background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        });
        confettiLayer.appendChild(piece);
        tl.fromTo(
          piece,
          { y: 0, x: 0, rotation: Math.random() * 360 },
          {
            y: height + 6 * unit,
            x: (Math.random() - 0.5) * 16 * unit,
            rotation: `+=${(Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 540)}`,
            duration: 2.2 + Math.random() * 0.8,
            ease: "power1.in",
          },
          IRIS + 0.1 + Math.random() * 1.1,
        );
      }
    },
    { scope: overlay },
  );

  // Skipping jumps to the last frame, which is the page at rest.
  const skip = () => timeline.current?.progress(1);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") timeline.current?.progress(1);
    };
    window.addEventListener("keydown", onKeyDown);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, []);

  return (
    <div ref={overlay} data-testid="home-intro" className="fixed inset-0 z-[100]">
      <div aria-hidden="true" className="intro-confetti pointer-events-none absolute inset-0 overflow-hidden" />
      <div aria-hidden="true" className="intro-dark absolute inset-0 bg-[#2e2e2e]" />
      {/* Inline, not utility classes: Bootstrap's .invisible/.opacity-0 are !important. */}
      <div
        aria-hidden="true"
        className="intro-orange absolute inset-0 bg-[#ff7430]"
        style={{ visibility: "hidden", opacity: 0 }}
      />
      <div
        aria-hidden="true"
        className="intro-dot absolute rounded-full bg-[#ff7430]"
        style={{ width: DOT_SIZE, height: DOT_SIZE }}
      />
      <button
        type="button"
        onClick={skip}
        className="pointer-events-auto absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-6 rounded-[4px] border border-white/50 bg-black/40 px-4 py-2 font-space-mono text-sm text-white backdrop-blur-sm transition-colors hover:bg-black/60 md:text-base"
      >
        Salta la intro
      </button>
    </div>
  );
};

export default HomeIntro;
