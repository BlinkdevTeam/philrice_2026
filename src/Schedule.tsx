import { useState } from "react";
import { MotionConfig, motion, type Variants } from "framer-motion";
import { WRAP, SectionLabel } from "./ui";
import { SCHEDULE } from "./data";

const DAYS = [
  { id: 1, label: "Day 1", date: "Nov 23" },
  { id: 2, label: "Day 2", date: "Nov 24" },
  { id: 3, label: "Day 3", date: "Nov 25" },
] as const;

type DayId = (typeof DAYS)[number]["id"];

// one color per track, assigned in the order tracks first appear
const TRACK_COLORS = [
  "#4d9cff",
  "#34d399",
  "#f59e0b",
  "#c084fc",
  "#fb7185",
  "#2dd4bf",
  "#a3e635",
];
const TRACKS = Array.from(
  new Set(
    Object.values(SCHEDULE)
      .flat()
      .map((s) => s.track),
  ),
);
const colorOf = (track: string) =>
  TRACK_COLORS[TRACKS.indexOf(track) % TRACK_COLORS.length];

const initials = (name: string) =>
  name
    .replace(
      /^(Dr\.|Prof\.|Engr\.|Atty\.|Hon\.|Sec\.|Gov\.|Rep\.|Dir\.|Mr\.|Ms\.)\s*/,
      "",
    )
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

/* ---------- motion ---------- */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// header
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.1 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};
const line: Variants = {
  hidden: { y: "110%" },
  show: { y: 0, transition: { duration: 1, ease: EASE } },
};

// timeline row: time, rail, node and card arrive one after another
const rowVariants: Variants = {
  hidden: {},
  show: (i: number) => ({
    transition: { delayChildren: Math.min(i, 3) * 0.07, staggerChildren: 0.12 },
  }),
};
const timeIn: Variants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } },
};
const cardIn: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};
const nodeIn: Variants = {
  hidden: { scale: 0 },
  show: {
    scale: 1,
    transition: { type: "spring", stiffness: 500, damping: 22 },
  },
};
const railIn: Variants = {
  hidden: { scaleY: 0 },
  show: { scaleY: 1, transition: { duration: 0.7, ease: EASE } },
};

export default function Schedule() {
  const [day, setDay] = useState<DayId>(1);
  const [track, setTrack] = useState<string>("ALL");

  const rows = SCHEDULE[day].filter(
    (s) => track === "ALL" || s.track === track,
  );

  return (
    <MotionConfig reducedMotion="user">
      <section id="schedule" className="border-t border-white/10 py-24">
        <div className={WRAP}>
          {/* header: label, heading lines, tabs and filters in sequence */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={rise}>
              <SectionLabel num="03" name="SCHEDULE" />
            </motion.div>

            <h2 className="mt-4 text-4xl font-extrabold sm:text-5xl">
              <span className="block overflow-hidden pb-1">
                <motion.span variants={line} className="block">
                  Three Days.
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-1">
                <motion.span variants={line} className="block text-white/60">
                  {TRACKS.length} Tracks.
                </motion.span>
              </span>
            </h2>

            {/* day tabs: the white pill slides between days */}
            <motion.div
              variants={rise}
              role="tablist"
              aria-label="Event day"
              className="mt-10 flex flex-wrap gap-2"
            >
              {DAYS.map((d) => {
                const selected = day === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setDay(d.id)}
                    className={`relative flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold transition-colors ${
                      selected
                        ? "border-white text-black"
                        : "border-white/15 bg-white/5 text-white/70 hover:border-[#4d9cff]/50 hover:text-white"
                    }`}
                  >
                    {selected && (
                      <motion.span
                        layoutId="day-pill"
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full bg-white"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 32,
                        }}
                      />
                    )}
                    <span className="relative">{d.label}</span>
                    <span
                      className={`relative font-mono text-[11px] ${
                        selected ? "text-black/50" : "text-white/40"
                      }`}
                    >
                      {d.date}
                    </span>
                  </button>
                );
              })}
            </motion.div>

            {/* track filter */}
            <motion.div
              variants={rise}
              role="group"
              aria-label="Filter by track"
              className="mt-4 flex flex-wrap gap-2"
            >
              {["ALL", ...TRACKS].map((t) => {
                const selected = track === t;
                return (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setTrack(t)}
                    className={`flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                      selected
                        ? "border-white/60 bg-white/10 text-white"
                        : "border-white/10 text-white/50 hover:text-white"
                    }`}
                  >
                    {t !== "ALL" && (
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: colorOf(t) }}
                      />
                    )}
                    {t}
                  </button>
                );
              })}
            </motion.div>
          </motion.div>

          {/* timeline */}
          {rows.length === 0 ? (
            <p className="mt-12 rounded-2xl border border-dashed border-white/15 p-10 text-center text-sm text-white/50">
              No sessions in this track on this day.
            </p>
          ) : (
            <ol
              key={`${day}-${track}`}
              aria-label={`Day ${day} schedule`}
              className="mt-12"
            >
              {rows.map((s, i) => {
                const first = i === 0;
                const last = i === rows.length - 1;
                const color = colorOf(s.track);

                return (
                  <motion.li
                    key={s.time + s.title}
                    custom={i}
                    variants={rowVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-60px" }}
                    className="group relative grid gap-3 pb-6 md:grid-cols-[7rem_1fr] md:gap-x-10"
                  >
                    {/* rail draws downward, node pops in */}
                    <motion.span
                      variants={railIn}
                      aria-hidden="true"
                      className={`absolute left-[8.25rem] hidden w-px origin-top bg-white/10 ${
                        rows.length > 1 ? "md:block" : ""
                      } ${first ? "top-7" : "top-0"} ${last ? "h-7" : "bottom-0"}`}
                    />
                    <motion.span
                      variants={nodeIn}
                      aria-hidden="true"
                      className="absolute left-[calc(8.25rem-3.5px)] top-7 hidden h-2 w-2 rounded-full border border-white/30 bg-[#0e0f12] transition-[background-color,border-color,box-shadow] duration-300 group-hover:border-transparent group-hover:bg-[#4d9cff] group-hover:shadow-[0_0_12px_2px_rgba(77,156,255,0.7)] md:block"
                    />

                    <motion.time
                      variants={timeIn}
                      className="font-mono text-sm font-semibold tracking-wider text-[#4d9cff] md:pt-5 md:text-right"
                    >
                      {s.time}
                    </motion.time>

                    <motion.div
                      variants={cardIn}
                      className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-[border-color,box-shadow,translate] duration-300 group-hover:-translate-y-0.5 group-hover:border-[#4d9cff]/40 group-hover:shadow-[0_0_40px_-12px_rgba(77,156,255,0.5)]"
                    >
                      <h3 className="text-lg font-semibold leading-snug text-white">
                        {s.title}
                      </h3>
                      {s.meta && (
                        <p className="mt-1 text-sm text-white/60">{s.meta}</p>
                      )}

                      {s.items && (
                        <ul className="mt-4 space-y-3 border-t border-white/10 pt-4">
                          {s.items.map((it) => (
                            <li
                              key={it.title + (it.speaker ?? "")}
                              className="text-sm"
                            >
                              <p className="font-medium text-white/90">
                                {it.title}
                              </p>
                              {it.note && (
                                <p className="mt-0.5 text-xs leading-5 text-white/50">
                                  {it.note}
                                </p>
                              )}
                              {(it.speaker || it.role) && (
                                <p className="mt-1 text-xs text-[#4d9cff]">
                                  {it.speaker}
                                  {it.role && (
                                    <span className="text-white/50">
                                      {it.speaker ? " · " : ""}
                                      {it.role}
                                    </span>
                                  )}
                                </p>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                        <span
                          className="rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em]"
                          style={{
                            color,
                            borderColor: `${color}55`,
                            backgroundColor: `${color}1a`,
                          }}
                        >
                          {s.track}
                        </span>

                        {s.speaker && (
                          <span className="flex items-center gap-2.5">
                            <span
                              aria-hidden="true"
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0b1b3d] text-[11px] font-bold text-white/60 ring-1 ring-white/15"
                            >
                              {initials(s.speaker)}
                            </span>
                            <span className="text-sm font-medium text-white/80">
                              {s.speaker}
                            </span>
                          </span>
                        )}
                      </div>
                    </motion.div>
                  </motion.li>
                );
              })}
            </ol>
          )}
        </div>
      </section>
    </MotionConfig>
  );
}
