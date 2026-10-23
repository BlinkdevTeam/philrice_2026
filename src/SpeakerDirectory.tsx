import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { SPEAKER_GROUPS, type Session, type Speaker } from "./speakers";

type Entry = { speaker: Speaker; session: string };

const initials = (name: string) =>
  name
    .replace(/^(Dr\.|Prof\.|Engr\.|Atty\.|Hon\.)\s*/, "")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

const count = (sessions: Session[]) =>
  sessions.reduce((sum, s) => sum + s.speakers.length, 0);

/** Fills its (relative) parent: photo, or initials if there's no image yet. */
function Photo({
  s,
  textSize = "text-2xl",
  color = false,
}: {
  s: Speaker;
  textSize?: string;
  color?: boolean;
}) {
  return s.image ? (
    <img
      src={s.image}
      alt={s.name}
      loading="lazy"
      draggable={false}
      className={`absolute inset-0 h-full w-full object-cover transition duration-500 ${
        color ? "" : "grayscale group-hover:scale-105 group-hover:grayscale-0"
      }`}
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

/* large card: Guest of Honor and Keynotes */
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
      className={`tech-card group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition duration-300 hover:-translate-y-1 hover:border-[#4d9cff]/40 hover:shadow-[0_0_50px_-8px_rgba(77,156,255,0.55)] ${
        wide ? "sm:col-span-2" : ""
      }`}
    >
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        className="flex h-full w-full cursor-pointer flex-col text-left outline-none focus-visible:ring-2 focus-visible:ring-[#4d9cff] sm:flex-row"
      >
        <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden bg-[#0b1b3d] sm:aspect-auto sm:min-h-72 sm:w-2/5">
          <Photo s={s} textSize="text-6xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0f12]/70 via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-[#0e0f12]/60" />
          <div className="scan-line" aria-hidden="true" />
        </div>

        <div className="flex flex-1 flex-col justify-center p-6 sm:p-8">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#4d9cff]">
            {label}
          </span>
          <h4 className="mt-3 text-2xl font-bold leading-tight text-white sm:text-3xl">
            {s.name}
          </h4>
          <p className="mt-2 text-white/60">{s.role}</p>
          {s.topic && (
            <p className="mt-5 border-t border-white/10 pt-4 text-sm text-[#4d9cff]">
              {s.topic}
            </p>
          )}
          <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-white/60 transition-colors group-hover:text-white">
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
    <li className="group rounded-xl border border-white/10 bg-white/5 transition duration-300 hover:border-[#4d9cff]/40 hover:bg-white/10 hover:shadow-[0_0_30px_-10px_rgba(77,156,255,0.6)]">
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        className="flex w-full cursor-pointer items-center gap-3 rounded-xl p-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#4d9cff]"
      >
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full bg-[#0b1b3d] ring-1 ring-white/15 transition group-hover:ring-[#4d9cff]/60">
          <Photo s={s} textSize="text-base" />
        </div>
        <div className="min-w-0 flex-1">
          <h5
            className="truncate text-sm font-semibold text-white"
            title={s.name}
          >
            {s.name}
          </h5>
          <p className="truncate text-xs text-white/55" title={s.role}>
            {s.role}
          </p>
        </div>
        <ArrowUpRight
          className="h-4 w-4 shrink-0 text-[#4d9cff] opacity-0 transition-opacity group-hover:opacity-100"
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
      const els =
        panelRef.current?.querySelectorAll<HTMLElement>("button, a[href]");
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
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
        className="modal-glow relative max-h-[90vh] w-full max-w-3xl overflow-y-auto overflow-x-hidden rounded-2xl border border-white/10 bg-[#0e0f12] shadow-[0_0_80px_-20px_rgba(77,156,255,0.5)]"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur-md hover:bg-white/10"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        {/* content swaps (fades in) when you step to another speaker */}
        <motion.div
          key={s.name}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="grid md:grid-cols-[2fr_3fr]"
        >
          <div className="relative aspect-[4/5] bg-[#0b1b3d] md:aspect-auto md:min-h-96">
            <Photo s={s} textSize="text-7xl" color />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0f12] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#0e0f12]/70" />
          </div>

          <div className="flex flex-col p-6 sm:p-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#4d9cff]">
              {session}
            </span>
            <h3
              id="speaker-modal-title"
              className="mt-3 text-3xl font-bold leading-tight text-white"
            >
              {s.name}
            </h3>
            <p className="mt-2 text-white/60">{s.role}</p>

            {s.topic && (
              <div className="mt-6 rounded-xl border border-[#4d9cff]/30 bg-[#4d9cff]/10 p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#4d9cff]">
                  Topic
                </p>
                <p className="mt-1 text-sm text-white">{s.topic}</p>
              </div>
            )}

            <h4 className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
              About
            </h4>
            <p className="mt-2 text-sm leading-7 text-white/75">
              {s.bio ?? "Biography coming soon."}
            </p>
          </div>
        </motion.div>

        {/* footer: position + prev/next */}
        <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
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

export default function SpeakerDirectory() {
  const [active, setActive] = useState(SPEAKER_GROUPS[0].id);
  const [open, setOpen] = useState<Speaker | null>(null);

  const group =
    SPEAKER_GROUPS.find((g) => g.id === active) ?? SPEAKER_GROUPS[0];
  const featured = group.id === "featured";

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
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mt-8 space-y-12"
      >
        {group.sessions.map((session) => (
          <section key={session.title} aria-label={session.title}>
            <SessionHeading
              title={session.title}
              total={session.speakers.length}
            />

            {featured ? (
              <ul className="mt-6 grid gap-5 sm:grid-cols-2">
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
              <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
