import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { WRAP, SectionLabel } from "./ui";
import { POSTER_GROUPS, type Poster, type PosterGroup } from "./posterData";

/* layout knobs */
const OFF = 12; // offset per layer in a collapsed stack (px)
const GAP = 16; // gap between posters in an open group (px)
const GROUP_GAP = 40; // gap between groups (px)
const LAYERS = 4; // how many layers a stack shows
const END = Number.MAX_SAFE_INTEGER; // "last poster", resolved on render

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));
const wrap = (n: number, m: number) => ((n % m) + m) % m;
const pad = (n: number) => String(n).padStart(2, "0");

// start loading the full-size poster before it's clicked
const preload = (src?: string) => {
  if (src) new Image().src = src;
};

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

/* one poster's face: image, or a themed placeholder */
function PosterFace({
  poster,
  color,
  dim,
  load,
}: {
  poster: Poster;
  color: string;
  dim: number;
  load: boolean;
}) {
  const src = load ? (poster.thumb ?? poster.image) : undefined;
  return (
    <span
      className="relative block h-full w-full overflow-hidden rounded-xl border border-white/15 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]"
      style={{
        background: src
          ? "#0b1b3d"
          : `linear-gradient(160deg, ${color}, #0b1b3d 78%)`,
      }}
    >
      {src ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <span className="absolute inset-0 grid place-items-center px-3 text-center font-mono text-[11px] uppercase tracking-widest text-white/70">
          {poster.title}
        </span>
      )}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-black"
        style={{ opacity: dim, transition: "opacity 700ms" }}
      />
    </span>
  );
}

/* full-size viewer */
/* click the poster to toggle between "fit to screen" and actual size */
function ZoomImage({ src, alt }: { src: string; alt: string }) {
  const [zoom, setZoom] = useState(false);
  return (
    <div
      className={`max-h-[calc(100vh-8rem)] max-w-[96vw] rounded-2xl border border-white/10 shadow-[0_0_80px_-20px_rgba(77,156,255,0.5)] ${
        zoom ? "overflow-auto" : "overflow-hidden"
      }`}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        onClick={() => setZoom((z) => !z)}
        className={
          zoom
            ? "max-h-none max-w-none cursor-zoom-out"
            : "max-h-[calc(100vh-8rem)] w-auto max-w-full cursor-zoom-in object-contain"
        }
      />
    </div>
  );
}

function PosterLightbox({
  group,
  index,
  onClose,
  onGo,
}: {
  group: PosterGroup;
  index: number;
  onClose: () => void;
  onGo: (d: number) => void;
}) {
  const n = group.posters.length;
  const p = group.posters[index];
  const full = p.image ?? p.thumb;
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      opener?.focus();
    };
  }, []);

  // preload the neighbours so next/previous feels instant
  useEffect(() => {
    [index - 1, index + 1].forEach((j) => {
      const q = group.posters[wrap(j, n)];
      if (q?.image) new Image().src = q.image;
    });
  }, [index, group, n]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    e.stopPropagation(); // the section's arrow-key handler must not also react
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowRight") onGo(1);
    if (e.key === "ArrowLeft") onGo(-1);
    if (e.key === "Tab") {
      const els = panelRef.current?.querySelectorAll<HTMLElement>("button");
      if (!els?.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3 backdrop-blur-sm sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={onKeyDown}
    >
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${group.label} poster ${index + 1} of ${n}`}
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        className="relative flex max-h-full max-w-[96vw] flex-col items-center gap-4"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md hover:bg-white/10"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        {full ? (
          <motion.div
            key={full}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
          >
            <ZoomImage src={full} alt={p.title} />
          </motion.div>
        ) : (
          <div
            className="grid aspect-[3/4] max-h-[calc(100vh-8rem)] w-[min(80vw,420px)] place-items-center rounded-2xl border border-white/10 font-mono text-sm uppercase tracking-widest text-white/70"
            style={{
              background: `linear-gradient(160deg, ${group.color}, #0b1b3d 78%)`,
            }}
          >
            {p.title}
          </div>
        )}

        <div className="flex w-full items-center justify-between gap-4 px-1">
          <div className="min-w-0">
            <p
              className="font-mono text-[10px] uppercase tracking-[0.2em]"
              style={{ color: group.color }}
            >
              {group.label} · {group.title}
            </p>
            <p className="mt-0.5 truncate text-sm text-white">{p.title}</p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden font-mono text-[10px] uppercase tracking-widest text-white/40 sm:inline">
              Click to zoom
            </span>
            <span className="font-mono text-xs text-white/50">
              <span className="text-white">{pad(index + 1)}</span> / {pad(n)}
            </span>
            {[
              { d: -1, Icon: ChevronLeft, label: "Previous poster" },
              { d: 1, Icon: ChevronRight, label: "Next poster" },
            ].map(({ d, Icon, label }) => (
              <button
                key={label}
                type="button"
                onClick={() => onGo(d)}
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white hover:bg-white/10"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function EPosters() {
  const groups = POSTER_GROUPS;
  const G = groups.length;
  const reduce = useReducedMotion();
  const move = `${reduce ? 0 : 700}ms cubic-bezier(0.22, 1, 0.36, 1)`;

  const boxRef = useRef<HTMLDivElement>(null);
  const [vw, setVw] = useState(1100);
  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setVw(el.clientWidth));
    ro.observe(el);
    setVw(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // view: which group is open (null = all stacks) and the slide inside it.
  // While nothing is open, `slide` is the stack the track is scrolled to.
  const [view, setView] = useState<{ active: number | null; slide: number }>({
    active: null,
    slide: 0,
  });
  const [lb, setLb] = useState<{ g: number; i: number } | null>(null);
  const dragged = useRef(false);

  /* geometry: four stacks fit side by side when there is room */
  const W = clamp(
    Math.floor((vw - (G - 1) * GROUP_GAP) / G) - (LAYERS - 1) * OFF,
    130,
    240,
  );
  const H = Math.round((W * 4) / 3);
  const TOP = (LAYERS - 1) * OFF; // room above the front poster for the stack
  const stackW = W + (LAYERS - 1) * OFF;
  const openW = (n: number) => n * W + (n - 1) * GAP;
  const widthOf = (k: number) =>
    k === view.active ? openW(groups[k].posters.length) : stackW;
  const leftOf = (k: number) => {
    let x = 0;
    for (let j = 0; j < k; j++) x += widthOf(j) + GROUP_GAP;
    return x;
  };
  const total = leftOf(G - 1) + widthOf(G - 1);
  const maxOffset = Math.max(0, total - vw);

  // last slide worth stopping on (after it the viewport is at the end of the track)
  const lastSlide = (k: number) =>
    clamp(
      Math.ceil((maxOffset - leftOf(k)) / (W + GAP)),
      0,
      groups[k].posters.length - 1,
    );
  const lastBrowse = (() => {
    for (let k = 0; k < G; k++) if (leftOf(k) >= maxOffset) return k;
    return G - 1;
  })();

  const cur =
    view.active === null
      ? Math.min(view.slide, lastBrowse)
      : Math.min(view.slide, lastSlide(view.active));
  const focus =
    view.active === null ? leftOf(cur) : leftOf(view.active) + cur * (W + GAP);
  const offset = clamp(focus, 0, maxOffset);

  const atStart = (view.active ?? 0) === 0 && cur === 0;
  const atEnd =
    view.active === null
      ? cur >= lastBrowse
      : view.active === G - 1 && cur >= lastSlide(G - 1);

  /* actions */
  const open = (k: number, slide = 0) => setView({ active: k, slide });
  const collapse = () =>
    setView((v) => ({ active: null, slide: v.active ?? 0 }));

  const step = (d: number) => {
    if (view.active === null) {
      setView({ active: null, slide: clamp(cur + d, 0, lastBrowse) });
      return;
    }
    const a = view.active;
    const next = cur + d;
    if (next > lastSlide(a)) {
      if (a < G - 1) setView({ active: a + 1, slide: 0 }); // continue into the next theme
      return;
    }
    if (next < 0) {
      if (a > 0) setView({ active: a - 1, slide: END }); // back into the previous theme
      return;
    }
    setView({ active: a, slide: next });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "Escape") collapse();
  };

  return (
    <section
      id="eposters"
      className="scroll-mt-20 border-t border-white/10 py-24"
    >
      <div className={WRAP}>
        <motion.div
          {...reveal}
          className="flex flex-wrap items-end justify-between gap-6"
        >
          <div>
            <SectionLabel num="04" name="E-POSTERS" />
            <h2 className="mt-4 text-4xl font-condensed font-bold sm:text-7xl">
              Research on
              <span className="block text-white/60">display.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-white/60">
            Browse the e-posters by theme. Tap a stack to open it, then swipe or
            use the arrows to move through the posters.
          </p>
        </motion.div>

        <motion.div {...reveal} onKeyDown={onKeyDown}>
          {/* controls */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
            <div
              role="group"
              aria-label="Poster themes"
              className="flex flex-wrap gap-2"
            >
              {groups.map((g, k) => {
                const on = view.active === k;
                return (
                  <button
                    key={g.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => (on ? collapse() : open(k))}
                    className={`flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                      on
                        ? "border-white/60 bg-white/10 text-white"
                        : "border-white/10 text-white/50 hover:text-white"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: g.color }}
                    />
                    {g.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <span
                className="font-mono text-xs text-white/50"
                aria-live="polite"
              >
                {view.active === null ? (
                  "Select a theme"
                ) : (
                  <>
                    <span className="text-white">
                      {groups[view.active].label}
                    </span>{" "}
                    · {pad(cur + 1)} / {pad(groups[view.active].posters.length)}
                  </>
                )}
              </span>
              {view.active !== null && (
                <button
                  type="button"
                  onClick={collapse}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70 transition-colors hover:text-white"
                >
                  Collapse
                </button>
              )}
              {[
                { d: -1, Icon: ChevronLeft, label: "Previous", off: atStart },
                { d: 1, Icon: ChevronRight, label: "Next", off: atEnd },
              ].map(({ d, Icon, label, off }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => step(d)}
                  disabled={off}
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-opacity hover:bg-white/10 disabled:opacity-30"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>

          {/* track */}
          <div ref={boxRef} className="mt-10 overflow-hidden pb-4">
            <motion.div
              onPanStart={() => {
                dragged.current = false;
              }}
              onPan={(_, info: PanInfo) => {
                if (Math.abs(info.offset.x) > 6) dragged.current = true;
              }}
              onPanEnd={(_, info: PanInfo) => {
                if (info.offset.x < -50) step(1);
                else if (info.offset.x > 50) step(-1);
                window.setTimeout(() => {
                  dragged.current = false;
                }, 50);
              }}
              style={{ touchAction: "pan-y" }}
              className="select-none"
            >
              <div
                className="flex w-max items-start"
                style={{
                  columnGap: GROUP_GAP,
                  transform: `translate3d(${-offset}px, 0, 0)`,
                  transition: `transform ${move}`,
                }}
              >
                {groups.map((g, k) => {
                  const isOpen = view.active === k;
                  const n = g.posters.length;
                  return (
                    <div
                      key={g.id}
                      role="group"
                      aria-label={`${g.label}: ${g.title}`}
                      className="shrink-0"
                      style={{
                        width: widthOf(k),
                        transition: `width ${move}`,
                      }}
                    >
                      <div className="relative" style={{ height: H + TOP }}>
                        {g.posters.map((p, i) => {
                          const layer = Math.min(i, LAYERS - 1);
                          const shown = isOpen || i < LAYERS;
                          const x = isOpen ? i * (W + GAP) : layer * OFF;
                          const y = isOpen ? TOP : (LAYERS - 1 - layer) * OFF;
                          return (
                            <button
                              key={p.title + i}
                              type="button"
                              tabIndex={isOpen || i === 0 ? 0 : -1}
                              aria-hidden={!shown}
                              aria-label={
                                isOpen
                                  ? `View ${p.title}, ${pad(i + 1)} of ${pad(n)}`
                                  : `Open ${g.label} posters`
                              }
                              onClick={() => {
                                if (dragged.current) return;
                                if (isOpen) setLb({ g: k, i });
                                else open(k);
                              }}
                              onPointerEnter={() => {
                                if (isOpen) preload(p.image);
                              }}
                              className={`absolute left-0 top-0 block rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-[#4d9cff] ${
                                shown ? "" : "pointer-events-none"
                              } ${isOpen ? "cursor-zoom-in" : "cursor-pointer"}`}
                              style={{
                                width: W,
                                height: H,
                                transform: `translate3d(${x}px, ${y}px, 0)`,
                                opacity: shown ? 1 : 0,
                                zIndex: isOpen ? 1 : Math.max(LAYERS - i, 0),
                                transition: `transform ${move}, opacity 400ms`,
                              }}
                            >
                              <PosterFace
                                poster={p}
                                color={g.color}
                                dim={isOpen ? 0 : Math.min(layer * 0.18, 0.6)}
                                load={shown}
                              />
                            </button>
                          );
                        })}
                      </div>

                      <div className="mt-4">
                        <p
                          className="font-mono text-[10px] uppercase tracking-[0.2em]"
                          style={{ color: g.color }}
                        >
                          {g.label} · {pad(n)} posters
                        </p>
                        <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-white">
                          {g.title}
                        </h3>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {createPortal(
        <AnimatePresence>
          {lb && (
            <PosterLightbox
              key="poster-lightbox"
              group={groups[lb.g]}
              index={lb.i}
              onClose={() => setLb(null)}
              onGo={(d) =>
                setLb((s) =>
                  s
                    ? {
                        g: s.g,
                        i: wrap(s.i + d, groups[s.g].posters.length),
                      }
                    : s,
                )
              }
            />
          )}
        </AnimatePresence>,
        document.body,
      )}
    </section>
  );
}
