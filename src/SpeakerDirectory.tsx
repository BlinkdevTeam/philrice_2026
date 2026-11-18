import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  SPEAKER_GROUPS,
  thumbOf,
  type Session,
  type Speaker,
} from "./speakers";

type Entry = { speaker: Speaker; session: string };

const initials = (name: string) => {
  const parts = name
    .replace(/^(?:[A-Z][a-z]{1,4}\.\s*)+/, "") // any leading title: Dr. Ms. Mr. Cong. Engr. ...
    .replace(/,.*$/, "") // ", CESO III" and similar
    .replace(/\s+(?:Jr|Sr)\.?$/i, "")
    .trim()
    .split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
};

const count = (sessions: Session[]) =>
  sessions.reduce((sum, s) => sum + s.speakers.length, 0);

/** Fills its (relative) parent: photo, or initials if there's no image yet. */
function Photo({
  s,
  textSize = "text-2xl",
  color = false,
  small = false,
  portrait = false,
}: {
  s: Speaker;
  textSize?: string;
  color?: boolean;
  small?: boolean;
  portrait?: boolean;
}) {
  const src = small ? thumbOf(s.image) : s.image;
  return src ? (
    <img
      src={src}
      alt={s.name}
      loading="lazy"
      decoding="async"
      draggable={false}
      className={`h-full w-full transition duration-500 ${
        portrait
          ? "object-contain object-bottom md:object-cover md:object-top"
          : "object-cover object-top"
      } ${color ? "" : "grayscale group-hover:scale-105 group-hover:grayscale-0"}`}
    />
  ) : (
    <div
      aria-hidden="true"
      className={`absolute inset-0 flex items-center justify-center font-bold text-white/30 ${textSize}`}
    >
      {initials(s.name)}
    </div>
  );
}
// each ring rotates around the center of the SVG
const HUD =
  "[transform-box:view-box] [transform-origin:50%_50%] motion-reduce:animate-none";

function TechRing() {
  const sweep = useId().replace(/:/g, "");

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMid meet"
      className="pointer-events-none absolute inset-[3%] -z-10 h-[94%] w-[94%] text-[#dcecff] opacity-70 transition-opacity duration-500 group-hover:opacity-100"
    >
      <defs>
        <linearGradient
          id={sweep}
          gradientUnits="userSpaceOnUse"
          x1="100"
          y1="12"
          x2="157"
          y2="33"
        >
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      {/* outer hairline + crosshair marks */}
      <circle
        cx="100"
        cy="100"
        r="97"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="0.6"
      />
      <path
        d="M100 0v10M100 190v10M0 100h10M190 100h10"
        stroke="currentColor"
        strokeOpacity="0.6"
        strokeWidth="1"
      />

      {/* tick marks, slow clockwise */}
      <g className={`${HUD} animate-[hud-spin_60s_linear_infinite]`}>
        <circle
          cx="100"
          cy="100"
          r="91"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.5"
          strokeWidth="4"
          strokeDasharray="0.8 5.553"
        />
      </g>

      {/* segmented arcs, counter-clockwise */}
      <g className={`${HUD} animate-[hud-spin_22s_linear_infinite_reverse]`}>
        <circle
          cx="100"
          cy="100"
          r="82"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.8"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeDasharray="100 20 60 20 37.6 20"
        />
      </g>

      {/* bright accent arc, clockwise */}
      <g className={`${HUD} animate-[hud-spin_9s_linear_infinite]`}>
        <circle
          cx="100"
          cy="100"
          r="73"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeDasharray="60 398.67"
        />
      </g>

      {/* fine dashed ring */}
      <g className={`${HUD} animate-[hud-spin_14s_linear_infinite]`}>
        <circle
          cx="100"
          cy="100"
          r="64"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.45"
          strokeWidth="0.8"
          strokeDasharray="2 5"
        />
      </g>

      {/* radar sweep */}
      <g className={`${HUD} animate-[hud-spin_7s_linear_infinite]`}>
        <path
          d="M100 100 L100 12 A88 88 0 0 1 156.6 32.6 Z"
          fill={`url(#${sweep})`}
        />
      </g>

      {/* orbiting dot */}
      <g className={`${HUD} animate-[hud-spin_11s_linear_infinite_reverse]`}>
        <circle cx="100" cy="9" r="5" fill="currentColor" fillOpacity="0.25" />
        <circle cx="100" cy="9" r="2.6" fill="currentColor" />
      </g>
    </svg>
  );
}

/* large card: Guest of Honor, Keynotes, Opening Program */
function FeaturedCard({
  s,
  label,
  wide,
  onOpen,
}: {
  s: Speaker;
  label: string;
  wide: boolean;
  onOpen: () => void;
}) {
  return (
    <li
      className={`tech-card group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition duration-300 [@media(hover:hover)]:hover:-translate-y-1 hover:border-[#4d9cff]/40 hover:shadow-[0_0_50px_-8px_rgba(77,156,255,0.55)] ${
        wide ? "md:col-span-2" : ""
      }`}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        className={`flex h-full w-full cursor-pointer flex-col text-left outline-none focus-visible:ring-2 focus-visible:ring-[#4d9cff] ${
          wide ? "md:flex-row" : "lg:flex-row"
        }`}
      >
        {/* photo: grayscale only where hover exists */}
        <div
          className={`relative isolate flex h-72 w-full shrink-0 items-center justify-center overflow-hidden bg-gradient-to-b from-[#FCD608] via-[#4788C8] to-[#132049] pt-4 transition-[filter] duration-500 [@media(hover:hover)]:grayscale [@media(hover:hover)]:group-hover:grayscale-0 ${
            wide
              ? "md:h-auto md:min-h-72 md:w-2/5"
              : "lg:h-auto lg:min-h-72 lg:w-2/5"
          }`}
        >
          <TechRing />
          <div className="relative z-10 h-full w-full">
            <Photo s={s} textSize="text-6xl" color portrait />
          </div>
          <div
            className={`pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-[#0e0f12]/70 via-transparent via-25% to-transparent ${
              wide
                ? "md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-[#0e0f12]/60"
                : "lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#0e0f12]/60"
            }`}
          />
          <div
            className="scan-line pointer-events-none absolute inset-0 z-30"
            aria-hidden="true"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center p-5 sm:p-6 md:p-8">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#FCD608]">
            {label}
          </span>
          <h4 className="mt-3 text-xl font-bold leading-tight text-white sm:text-2xl md:text-3xl">
            {s.name}
          </h4>
          <p className="mt-2 text-sm text-white/60 sm:text-base">{s.role}</p>
          {s.topic && (
            <p className="mt-4 border-t border-white/10 pt-4 text-sm text-[#4d9cff]">
              {s.topic}
            </p>
          )}
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-white/60 transition-colors group-hover:text-white">
            View profile
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
      </button>
    </li>
  );
}

/* small card: everyone else */
function CompactCard({ s, onOpen }: { s: Speaker; onOpen: () => void }) {
  return (
    <li className="group min-w-0 rounded-xl border border-white/10 bg-white/5 transition duration-300 hover:border-[#4d9cff]/40 hover:bg-white/10 hover:shadow-[0_0_30px_-10px_rgba(77,156,255,0.6)]">
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        className="flex w-full cursor-pointer items-center gap-3 rounded-xl p-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#4d9cff] sm:gap-4"
      >
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-gradient-to-b from-[#FCD608] via-[#4788C8] to-[#132049] grayscale transition-all duration-500 group-hover:grayscale-0 ring-1 ring-white/15 group-hover:ring-[#4d9cff]/60 sm:h-24 sm:w-24">
          <Photo s={s} textSize="text-xl" small />
        </div>
        <div className="min-w-0 flex-1">
          <h5
            className="line-clamp-2 text-sm font-semibold leading-snug text-white"
            title={s.name}
          >
            {s.name}
          </h5>
          <p
            className="mt-0.5 line-clamp-2 text-xs leading-5 text-white/55"
            title={s.role}
          >
            {s.role}
          </p>
        </div>
        <ArrowUpRight
          className="hidden h-4 w-4 shrink-0 text-[#4d9cff] opacity-0 transition-opacity group-hover:opacity-100 sm:block"
          aria-hidden="true"
        />
      </button>
    </li>
  );
}

function SessionHeading({ title, total }: { title: string; total: number }) {
  return (
    <div className="flex items-center gap-4">
      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
        {title}
      </h3>
      <span className="font-mono text-xs text-white/40">
        {String(total).padStart(2, "0")}
      </span>
      <div className="h-px flex-1 bg-white/10" />
    </div>
  );
}

/* details dialog */
function SpeakerModal({
  entry,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  entry: Entry;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const { speaker: s, session } = entry;
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // lock page scroll, focus the dialog, and give focus back to the card on close
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

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowRight") onNext();
    if (e.key === "ArrowLeft") onPrev();

    // keep Tab inside the dialog
    if (e.key === "Tab") {
      const els = panelRef.current?.querySelectorAll<HTMLElement>(
        'button, a[href], [tabindex="0"]',
      );
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-4"
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
        aria-labelledby="speaker-modal-title"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
        className="modal-glow relative flex h-[88dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0e0f12] shadow-[0_0_80px_-20px_rgba(77,156,255,0.5)] md:h-[85vh] md:max-h-[540px]"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur-md hover:bg-white/10 md:h-9 md:w-9"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        {/* mobile: this whole area scrolls. md+: two columns, only the bio scrolls */}
        <motion.div
          key={s.name}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain md:grid md:grid-cols-[2fr_3fr] md:grid-rows-1 md:overflow-hidden"
        >
          {/* photo */}
          {/* photo */}
          <div className="group relative isolate h-80 shrink-0 overflow-hidden bg-gradient-to-b from-[#FCD608] via-[#4788C8] to-[#132049] pt-4 md:h-full">
            <TechRing />
            <div className="relative z-10 h-full">
              <Photo s={s} textSize="text-7xl" color portrait />
            </div>
            <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-[#0e0f12] via-transparent via-20% to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-[#0e0f12]/70" />
            <div
              className="scan-line pointer-events-none absolute inset-0 z-30"
              aria-hidden="true"
            />
          </div>

          {/* details */}
          <div className="flex flex-col p-5 sm:p-6 md:min-h-0 md:p-8">
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-[#4d9cff]">
              {session}
            </span>
            <h3
              id="speaker-modal-title"
              className="mt-3 shrink-0 text-2xl font-bold leading-tight text-white md:text-3xl"
            >
              {s.name}
            </h3>
            <p className="mt-2 shrink-0 text-sm text-white/60 md:text-base">
              {s.role}
            </p>

            {s.topic && (
              <div className="mt-4 shrink-0 rounded-xl border border-[#4d9cff]/30 bg-[#4d9cff]/10 p-3 md:mt-6 md:p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#4d9cff]">
                  Topic
                </p>
                <p className="mt-1 text-sm text-white">{s.topic}</p>
              </div>
            )}

            <h4 className="mt-5 shrink-0 text-xs font-semibold uppercase tracking-[0.18em] text-white/50 md:mt-6">
              About
            </h4>

            {/* mobile: flows with the page. md+: this box scrolls on its own */}
            <div
              className="mt-2 md:min-h-0 md:flex-1 md:overflow-y-auto md:pr-2 md:[scrollbar-color:rgba(255,255,255,0.2)_transparent] md:[scrollbar-width:thin]"
              tabIndex={0}
              aria-label="Speaker biography"
            >
              <p className="text-sm leading-7 text-white/75">
                {s.bio || "Biography coming soon."}
              </p>
            </div>
          </div>
        </motion.div>

        {/* footer: position + prev/next */}
        <div className="flex shrink-0 items-center justify-between border-t border-white/10 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:px-6">
          <span className="font-mono text-xs text-white/50">
            <span className="text-white">
              {String(index + 1).padStart(2, "0")}
            </span>
            {" / "}
            {String(total).padStart(2, "0")}
          </span>
          <div className="flex gap-2">
            {[
              { fn: onPrev, Icon: ChevronLeft, label: "Previous speaker" },
              { fn: onNext, Icon: ChevronRight, label: "Next speaker" },
            ].map(({ fn, Icon, label }) => (
              <button
                key={label}
                type="button"
                onClick={fn}
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white hover:bg-white/10 md:h-8 md:w-8"
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

export default function SpeakerDirectory() {
  const [active, setActive] = useState(SPEAKER_GROUPS[0].id);
  const [open, setOpen] = useState<Speaker | null>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      SPEAKER_GROUPS.forEach((g) =>
        g.sessions.forEach((ss) =>
          ss.speakers.forEach((p) => {
            const u = thumbOf(p.image);
            if (u) {
              const img = new Image();
              img.decoding = "async";
              img.src = u;
            }
          }),
        ),
      );
    }, 1500);
    return () => clearTimeout(id);
  }, []);
  const FEATURED_IDS = ["featured", "program"];
  const group =
    SPEAKER_GROUPS.find((g) => g.id === active) ?? SPEAKER_GROUPS[0];
  const featured = FEATURED_IDS.includes(group.id);

  // every speaker in the current tab, in display order (for prev/next)
  const flat: Entry[] = group.sessions.flatMap((ss) =>
    ss.speakers.map((speaker) => ({ speaker, session: ss.title })),
  );
  const openIdx = open ? flat.findIndex((f) => f.speaker === open) : -1;

  const step = (d: number) =>
    setOpen(flat[(openIdx + d + flat.length) % flat.length].speaker);

  return (
    <div className="mt-12">
      {/* tabs */}
      <div
        role="tablist"
        aria-label="Speaker groups"
        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2"
      >
        {SPEAKER_GROUPS.map((g) => {
          const selected = g.id === active;
          return (
            <button
              key={g.id}
              type="button"
              role="tab"
              id={`tab-${g.id}`}
              aria-selected={selected}
              aria-controls={`panel-${g.id}`}
              onClick={() => {
                setActive(g.id);
                setOpen(null);
              }}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                selected
                  ? "border-white bg-white text-black"
                  : "border-white/15 bg-white/5 text-white/70 hover:border-[#4d9cff]/50 hover:text-white"
              }`}
            >
              {g.label}
              <span
                className={`font-mono text-[11px] ${
                  selected ? "text-black/50" : "text-white/40"
                }`}
              >
                {count(g.sessions)}
              </span>
            </button>
          );
        })}
      </div>

      {/* panel */}
      <motion.div
        key={group.id}
        role="tabpanel"
        id={`panel-${group.id}`}
        aria-labelledby={`tab-${group.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="mt-8 space-y-12"
      >
        {group.sessions.map((session) => (
          <section
            key={session.title}
            aria-label={session.title}
            className="[content-visibility:auto] [contain-intrinsic-size:auto_420px]"
          >
            <SessionHeading
              title={session.title}
              total={session.speakers.length}
            />

            {featured ? (
              <ul className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                {session.speakers.map((s) => (
                  <FeaturedCard
                    key={s.name}
                    s={s}
                    label={session.title.replace(/s$/, "")}
                    wide={session.speakers.length === 1}
                    onOpen={() => setOpen(s)}
                  />
                ))}
              </ul>
            ) : (
              <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {session.speakers.map((s) => (
                  <CompactCard key={s.name} s={s} onOpen={() => setOpen(s)} />
                ))}
              </ul>
            )}
          </section>
        ))}
      </motion.div>

      {/* rendered in <body> so the animated tab panel can't offset it */}
      {createPortal(
        <AnimatePresence>
          {openIdx >= 0 && (
            <SpeakerModal
              key="speaker-modal"
              entry={flat[openIdx]}
              index={openIdx}
              total={flat.length}
              onClose={() => setOpen(null)}
              onPrev={() => step(-1)}
              onNext={() => step(1)}
            />
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
}
