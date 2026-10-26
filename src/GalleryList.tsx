import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
  type PanInfo,
} from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

export type GalleryItem = { title: string; text: string; image?: string };

const GRADIENTS = [
  "linear-gradient(160deg,#1d4ed8 0%,#0b1b3d 60%,#050816 100%)",
  "linear-gradient(160deg,#0e7490 0%,#0b2a3d 60%,#050816 100%)",
  "linear-gradient(160deg,#6d28d9 0%,#1a1040 60%,#050816 100%)",
  "linear-gradient(160deg,#0f766e 0%,#082a2a 60%,#050816 100%)",
];

// layout knobs
const STEP_X = 60; // sideways gap between cards (% of card width)
const STEP_Y = 10; // upward climb per card (% of card height)
const STEP_Z = -100; // depth per card (px)
const TILT = 0; // rotateY in degrees
const VISIBLE = 4; // how many cards ahead stay visible

const wrap = (n: number, m: number) => ((n % m) + m) % m;
const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

// continuous position of card i relative to the front:
// -1..0 = leaving to the left, 0 = front, 0..n-1 = stack behind it
const relOf = (i: number, progress: number, n: number) =>
  wrap(i - progress + 1, n) - 1;

type CardProps = {
  item: GalleryItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
  isActive: boolean;
  hidden: boolean;
  onSelect: () => void;
};

function Card({
  item,
  index,
  total,
  progress,
  isActive,
  hidden,
  onSelect,
}: CardProps) {
  const rel = (p: number) => relOf(index, p, total);

  const x = useTransform(progress, (p) => {
    const r = rel(p);
    return `${r < 0 ? r * 90 : r * STEP_X}%`;
  });
  const y = useTransform(progress, (p) => {
    const r = rel(p);
    return `${r < 0 ? -r * 4 : -r * STEP_Y}%`;
  });
  const z = useTransform(progress, (p) => {
    const r = rel(p);
    return r < 0 ? -r * 80 : r * STEP_Z;
  });
  const opacity = useTransform(progress, (p) => {
    const r = rel(p);
    if (r < 0) return 1 + r; // fade out while leaving left
    const edge = clamp(VISIBLE + 1 - r, 0, 1); // fade past the visible range
    const seam = clamp(total - 1 - r, 0, 1); // fade in at the back of the stack
    return edge * seam; // cards are fully solid in between
  });

  // darkness grows with depth (replaces the old see-through fade)
  const dim = useTransform(progress, (p) =>
    clamp(Math.max(rel(p), 0) * 0.16, 0, 0.75),
  );

  const zIndex = useTransform(progress, (p) => {
    const r = rel(p);
    return r < 0 ? total + 1 : Math.round(total - r);
  });

  return (
    <motion.li
      onClick={onSelect}
      aria-hidden={hidden}
      className={`absolute bottom-0 left-0 aspect-3/4 lg:aspect-4/3 w-[58%] sm:w-[45%] lg:w-[45%] ${
        hidden ? "pointer-events-none" : ""
      } ${isActive ? "" : "cursor-pointer"}`}
      style={{
        x,
        y,
        z,
        rotateY: TILT,
        opacity,
        zIndex,
        willChange: "transform, opacity",
      }}
    >
      {/* index label above the card */}
      <span className="absolute -top-6 left-0 font-mono text-[10px] tracking-widest text-white/50">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div
        className="relative h-full w-full overflow-hidden rounded-2xl border border-white/15 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
        style={{
          background: item.image
            ? undefined
            : GRADIENTS[index % GRADIENTS.length],
        }}
      >
        {item.image && (
          <img
            src={item.image}
            alt=""
            draggable={false}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* readability gradient behind the text */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,.88), rgba(0,0,0,.25) 55%, transparent)",
          }}
        />

        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <h3 className="text-base font-bold leading-tight text-white sm:text-lg">
            {item.title}
          </h3>
          <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-white/70 sm:text-sm">
            {item.text}
          </p>
          <a
            href="#schedule"
            draggable={false}
            tabIndex={isActive ? 0 : -1}
            className={`mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#4d9cff] ${
              isActive ? "" : "pointer-events-none"
            }`}
          >
            Explore <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
      <motion.div
        aria-hidden="true"
        style={{ opacity: dim }}
        className="pointer-events-none absolute inset-0 bg-black"
      />
    </motion.li>
  );
}

type Props = {
  items: GalleryItem[];
  autoPlay?: number; // ms between slides; 0 or omitted = off
};

export default function GalleryList({ items, autoPlay = 0 }: Props) {
  const n = items.length;
  const reduce = useReducedMotion();

  const listRef = useRef<HTMLUListElement>(null);

  // progress is a continuous, unwrapped index. It's the single source of truth
  // for every card's position, so dragging and snapping share one motion path.
  const progress = useMotionValue(0);
  const target = useRef(0); // the integer slide we're heading to
  const controls = useRef<ReturnType<typeof animate> | null>(null);
  const [active, setActive] = useState(0);

  const snapTo = (next: number, velocity = 0) => {
    target.current = next;
    setActive(wrap(next, n));
    controls.current?.stop();
    controls.current = animate(
      progress,
      next,
      reduce
        ? { duration: 0 }
        : {
            type: "spring",
            stiffness: 170,
            damping: 26,
            mass: 1,
            velocity,
          },
    );
  };

  const goBy = (delta: number) => snapTo(target.current + delta);

  const goToIndex = (i: number) => {
    let d = wrap(i - active, n);
    if (d > n / 2) d -= n; // take the shorter way round
    if (d !== 0) goBy(d);
  };

  // optional autoplay, paused while hovered, focused or dragging
  const paused = useRef(false);
  useEffect(() => {
    if (!autoPlay || reduce || n < 2) return;
    const id = window.setInterval(() => {
      if (!paused.current) goBy(1);
    }, autoPlay);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, reduce, n]);

  useEffect(() => () => controls.current?.stop(), []);

  // drag-follow
  const startProgress = useRef(0);
  const stepPx = useRef(200);
  const dragged = useRef(false); // blocks the click that follows a drag

  const onPanStart = () => {
    controls.current?.stop();
    dragged.current = false;
    paused.current = true;
    startProgress.current = progress.get();
    const card = listRef.current?.querySelector("li");
    stepPx.current = Math.max(
      80,
      ((card as HTMLElement | null)?.offsetWidth ?? 240) * (STEP_X / 100),
    );
  };

  const onPan = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 6) dragged.current = true;
    progress.set(startProgress.current - info.offset.x / stepPx.current);
  };

  const onPanEnd = (_: unknown, info: PanInfo) => {
    const current = progress.get();

    // where the flick would carry it, limited to one extra slide of momentum
    const projected = current - (info.velocity.x * 0.18) / stepPx.current;
    const base = Math.round(current);
    const next = clamp(Math.round(projected), base - 1, base + 1);

    snapTo(next, -info.velocity.x / stepPx.current);
    paused.current = false;
    window.setTimeout(() => {
      dragged.current = false;
    }, 50);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    if (e.key === "ArrowRight") goBy(1);
    if (e.key === "ArrowLeft") goBy(-1);
  };

  return (
    <div className="-mt-20 md:mt-12">
      <div className="overflow-hidden">
        <motion.ul
          ref={listRef}
          role="group"
          aria-roledescription="carousel"
          aria-label="Conference highlights"
          tabIndex={0}
          onPanStart={onPanStart}
          onPan={onPan}
          onPanEnd={onPanEnd}
          onKeyDown={onKeyDown}
          onMouseEnter={() => {
            paused.current = true;
          }}
          onMouseLeave={() => {
            paused.current = false;
          }}
          onFocus={() => {
            paused.current = true;
          }}
          onBlur={() => {
            paused.current = false;
          }}
          className="relative h-115 w-full cursor-grab select-none rounded-2xl outline-none active:cursor-grabbing focus-visible:ring-1 focus-visible:ring-white/30 sm:h-130 lg:h-140 mt-24"
          style={{
            perspective: 1400,
            perspectiveOrigin: "92% 8%", // vanishing point, top right
            touchAction: "pan-y",
            WebkitUserSelect: "none",
            userSelect: "none",
            WebkitTouchCallout: "none",
          }}
        >
          {items.map((item, i) => {
            const rel = wrap(i - active + 1, n) - 1;
            return (
              <Card
                key={item.title}
                item={item}
                index={i}
                total={n}
                progress={progress}
                isActive={rel === 0}
                hidden={rel < 0 || rel > VISIBLE}
                onSelect={() => {
                  if (dragged.current) return; // a swipe isn't a card click
                  if (rel !== 0) goToIndex(i);
                }}
              />
            );
          })}
        </motion.ul>
      </div>

      {/* controls */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 font-mono text-xs text-white/50">
          <span className="text-white">
            {String(active + 1).padStart(2, "0")}
          </span>
          <div className="h-px w-32 bg-white/15">
            <div
              className="h-full bg-[#4d9cff] transition-[width] duration-500"
              style={{ width: `${((active + 1) / n) * 100}%` }}
            />
          </div>
          <span>{String(n).padStart(2, "0")}</span>
        </div>

        <div className="flex gap-2">
          {[
            { dir: -1, Icon: ChevronLeft, label: "Previous" },
            { dir: 1, Icon: ChevronRight, label: "Next" },
          ].map(({ dir, Icon, label }) => (
            <button
              key={label}
              type="button"
              onClick={() => goBy(dir)}
              aria-label={label}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white hover:bg-white/10"
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
