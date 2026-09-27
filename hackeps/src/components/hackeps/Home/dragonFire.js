// Canvas flame for the dragon easter egg. Soft particles are drawn with
// additive blending, so where they pile up the core burns white-yellow; each
// one cools to orange and red, then turns into smoke that rises. A few sparks
// fly further and fall.

// Colour of a flame particle over its life (0 = just out of the mouth).
const RAMP = [
  [0, [255, 248, 220]],
  [0.12, [255, 212, 90]],
  [0.35, [255, 136, 28]],
  [0.6, [222, 58, 18]],
  [0.8, [110, 28, 16]],
  [1, [40, 18, 16]],
];
const STEPS = 48;
const SMOKE_FROM = 0.62;

function rampColor(t) {
  for (let i = 1; i < RAMP.length; i++) {
    const [t1, c1] = RAMP[i];
    const [t0, c0] = RAMP[i - 1];
    if (t <= t1) {
      const k = (t - t0) / (t1 - t0);
      return c0.map((v, j) => Math.round(v + (c1[j] - v) * k));
    }
  }
  return RAMP[RAMP.length - 1][1];
}

// A soft disc in one colour; drawImage with it is far cheaper than building a
// gradient per particle per frame.
function sprite([r, g, b], core = 0.3) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, `rgba(${r},${g},${b},1)`);
  gradient.addColorStop(core, `rgba(${r},${g},${b},0.55)`);
  gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  return canvas;
}

let sprites;
function palette() {
  sprites ??= {
    flame: Array.from({ length: STEPS }, (_, i) => sprite(rampColor(i / (STEPS - 1)))),
    smoke: sprite([78, 70, 70], 0.2),
    spark: sprite([255, 236, 170], 0.15),
  };
  return sprites;
}

const engines = new WeakMap();

/**
 * Breathes fire from (mouthX, mouthY), in CSS pixels of `canvas`, downwards.
 * `size` scales everything (the logo width works well). Calling it again while
 * the flame is still burning just keeps it going.
 */
export function breatheFire(canvas, { mouthX, mouthY, size, delay = 0, duration = 0.62, reduced = false }) {
  const ctx = canvas.getContext?.("2d");
  if (!ctx) return;
  const now = performance.now();
  const running = engines.get(canvas);
  const settings = {
    mouthX,
    mouthY,
    size,
    reduced,
    emitFrom: now + delay * 1000,
    emitTo: now + (delay + duration) * 1000,
  };
  if (running) {
    Object.assign(running, settings);
    return;
  }

  const { flame, smoke, spark } = palette();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const engine = { ...settings, particles: [], last: now, owed: 0 };
  engines.set(canvas, engine);

  const spawn = () => {
    const { mouthX: x, mouthY: y, size: s, reduced: calm } = engine;
    const isSpark = !calm && Math.random() < 0.05;
    const angle = Math.PI / 2 + (Math.random() - 0.5) * (isSpark ? 1.1 : 0.5);
    const speed = s * (calm ? 0.8 : 2.4); // px/s out of the mouth
    const v = speed * (isSpark ? 1.2 + Math.random() * 0.6 : 0.65 + Math.random() * 0.5);
    engine.particles.push({
      spark: isSpark,
      x: x + (Math.random() - 0.5) * s * 0.06,
      y: y + Math.random() * s * 0.015,
      vx: Math.cos(angle) * v,
      vy: Math.sin(angle) * v,
      age: 0,
      ttl: isSpark ? 0.7 + Math.random() * 0.5 : 0.4 + Math.random() * 0.3,
      r0: s * (0.012 + Math.random() * 0.01),
      grow: s * (0.045 + Math.random() * 0.05),
      phase: Math.random() * Math.PI * 2,
    });
  };

  const frame = (time) => {
    const { particles, size: s } = engine;
    const dt = Math.min(0.05, (time - engine.last) / 1000);
    engine.last = time;
    const emitting = time >= engine.emitFrom && time < engine.emitTo;
    if (emitting) {
      engine.owed += (engine.reduced ? 220 : 900) * dt; // particles per second
      for (; engine.owed >= 1; engine.owed--) spawn();
    }

    const drag = Math.pow(0.1, dt);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.age += dt;
      if (p.age >= p.ttl) {
        particles.splice(i, 1);
        continue;
      }
      if (p.spark) {
        p.vy += s * 1.4 * dt; // sparks fall
      } else {
        p.vx = p.vx * drag + (Math.random() - 0.5) * s * 7 * dt; // turbulence
        p.vy = p.vy * drag - s * 2.2 * dt; // hot gas rises
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }

    ctx.clearRect(0, 0, width, height);

    // Smoke first, normally blended, so the flames glow over it.
    ctx.globalCompositeOperation = "source-over";
    for (const p of particles) {
      const k = p.age / p.ttl;
      if (p.spark || k < SMOKE_FROM) continue;
      const fade = (k - SMOKE_FROM) / (1 - SMOKE_FROM);
      const r = (p.r0 + p.grow * k) * 1.8;
      ctx.globalAlpha = 0.16 * Math.sin(Math.PI * fade);
      ctx.drawImage(smoke, p.x - r, p.y - r, r * 2, r * 2);
    }

    ctx.globalCompositeOperation = "lighter";
    if (emitting) {
      // The light inside the mouth.
      const r = s * (0.06 + 0.012 * Math.sin(time * 0.05));
      ctx.globalAlpha = 0.8;
      ctx.drawImage(flame[4], engine.mouthX - r, engine.mouthY - r, r * 2, r * 2);
    }
    for (const p of particles) {
      const k = p.age / p.ttl;
      if (p.spark) {
        const r = s * 0.012;
        ctx.globalAlpha = (1 - k) * (0.6 + 0.4 * Math.sin(time * 0.08 + p.phase));
        ctx.drawImage(spark, p.x - r, p.y - r, r * 2, r * 2);
        continue;
      }
      if (k > 0.85) continue;
      const flicker = 1 + 0.12 * Math.sin(time * 0.03 + p.phase);
      const r = (p.r0 + p.grow * k) * flicker;
      ctx.globalAlpha = Math.min(1, k * 12) * (1 - k / 0.85) * 0.5;
      ctx.drawImage(flame[Math.min(STEPS - 1, Math.floor(k * STEPS))], p.x - r, p.y - r, r * 2, r * 2);
    }
    ctx.globalAlpha = 1;

    if (particles.length || time < engine.emitTo) {
      requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, width, height);
      engines.delete(canvas);
    }
  };
  requestAnimationFrame(frame);
}
