import { useEffect, useRef } from "react";

const CELL = 80; // must match the grid's bg-size
const DENSITY = 0.1; // streaks per grid cell (raise for more)
const SPEED: [number, number] = [35, 90]; // px per second
const LENGTH: [number, number] = [110, 240]; // tail length in px
const ALPHA: [number, number] = [0.18, 0.4]; // streak brightness
const SHOW_GLYPHS = true; // tiny character at the head of each streak
const CHARS = Array.from("01ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄ");

type Drop = {
  x: number;
  y: number;
  speed: number;
  len: number;
  alpha: number;
  ch: string;
  swap: number;
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = () => CHARS[Math.floor(Math.random() * CHARS.length)];

export default function GridRain() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let w = 0;
    let h = 0;
    let cols = 0;
    let drops: Drop[] = [];
    let raf = 0;
    let last = performance.now();
    let visible = true;

    const make = (initial: boolean): Drop => {
      const len = rand(LENGTH[0], LENGTH[1]);
      return {
        x: Math.floor(Math.random() * cols) * CELL, // sits exactly on a grid line
        y: initial ? rand(-len, h) : -len - rand(0, 300),
        speed: rand(SPEED[0], SPEED[1]),
        len,
        alpha: rand(ALPHA[0], ALPHA[1]),
        ch: pick(),
        swap: rand(0.08, 0.25),
      };
    };

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w; // setting size resets the context, so style it after
      canvas.height = h;
      ctx.font = "11px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.textAlign = "center";
      cols = Math.ceil(w / CELL) + 1;
      const count = Math.max(
        4,
        Math.round(((w * h) / (CELL * CELL)) * DENSITY),
      );
      drops = Array.from({ length: count }, () => make(true));
    };

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      if (!visible) return;

      ctx.clearRect(0, 0, w, h);

      for (const d of drops) {
        d.y += d.speed * dt;
        if (d.y - d.len > h) Object.assign(d, make(false));
        if (d.y < 0 || d.y - d.len > h) continue;

        const end = SHOW_GLYPHS ? d.y - 11 : d.y;
        const g = ctx.createLinearGradient(0, d.y - d.len, 0, end);
        g.addColorStop(0, "rgba(120,185,255,0)");
        g.addColorStop(1, `rgba(120,185,255,${d.alpha})`);
        ctx.fillStyle = g;
        ctx.fillRect(d.x, d.y - d.len, 1, end - (d.y - d.len));

        if (SHOW_GLYPHS) {
          d.swap -= dt;
          if (d.swap <= 0) {
            d.ch = pick();
            d.swap = rand(0.08, 0.25);
          }
          ctx.fillStyle = `rgba(170,215,255,${Math.min(d.alpha * 1.6, 0.7)})`;
          ctx.fillText(d.ch, d.x + 0.5, d.y);
        }
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(canvas);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 h-full w-screen -translate-x-1/2"
    />
  );
}
