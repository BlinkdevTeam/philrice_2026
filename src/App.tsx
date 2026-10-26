import {
  useCallback,
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";

import "./App.css";
import {
  MotionConfig,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { WRAP, SectionLabel } from "./ui"; // adjust
import { Mail, Plus, ArrowUp, ArrowUpRight } from "lucide-react";

import Header from "./Header";
import GalleryList from "./GalleryList";
import { SPEAKER_GROUPS } from "./speakers";
import SpeakerDirectory from "./SpeakerDirectory";
import Schedule from "./Schedule";
import GridRain from "./GridRain";

import {
  EVENT_DATE,
  DETAILS,
  STATS,
  FEATURES,
  // SCHEDULE,
  FAQS,
  FOOT_COLS,
} from "./data";

import lockAnimated from "./assets/lock-animated.svg?raw";

import daPHILRICE from "./assets/da-philrice.png";
import BagongPilipinas from "./assets/bagong-pilipinas.png";
import UgnayPalay from "./assets/ugnay-palay-logo.png";

const SVG_NS = "http://www.w3.org/2000/svg";
const SCATTERED = 2.4;
const HOVER = { from: 2.7, to: 4.7 };
const LEAVE = { from: 0.5, to: 2.2 };
const rand = (a: number, b: number) => a + Math.random() * (b - a);

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  className: "h-5 w-5",
};

// -------------------Start of Hero--------------------- //
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.2 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};
const line: Variants = {
  hidden: { y: "110%" },
  show: { y: 0, transition: { duration: 1, ease: EASE } },
};
const tiles: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};
const tile: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.92 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: EASE },
  },
};

// shows 0 → value while the intro plays, then the live value
function CountNumber({
  value,
  intro,
}: {
  value: number;
  intro: MotionValue<number>;
}) {
  const text = useTransform(intro, (p) =>
    String(Math.round(value * p)).padStart(2, "0"),
  );
  return <motion.span>{text}</motion.span>;
}
// -------------------End of Hero--------------------- //

// -------------------Start of About--------------------- //
const highlight: Variants = {
  hidden: { backgroundSize: "0% 100%" },
  show: {
    backgroundSize: "100% 100%",
    transition: { duration: 1.2, delay: 0.6, ease: EASE },
  },
};

// "10+" → counts 0 → 10 and keeps the "+"; "5,000" keeps the comma
function CountStat({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();

  const match = value.match(/^([\d,]+)(.*)$/);
  const target = match ? Number(match[1].replace(/,/g, "")) : 0;
  const suffix = match?.[2] ?? "";

  const count = useMotionValue(reduce ? target : 0);
  const text = useTransform(count, (v) =>
    Math.round(v).toLocaleString("en-US"),
  );

  useEffect(() => {
    if (!inView || reduce || !match) return;
    const c = animate(count, target, { duration: 1.6, delay: 0.4, ease: EASE });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, target]);

  if (!match) return <span>{value}</span>;

  return (
    <span ref={ref}>
      <motion.span>{text}</motion.span>
      {suffix}
    </span>
  );
}
// -------------------End of About--------------------- //

// -------------------Start of Speakers--------------------- //
// unique people across every group (Dr. Pinto appears in two sessions)
const SPEAKER_TOTAL = new Set(
  SPEAKER_GROUPS.flatMap((g) =>
    g.sessions.flatMap((s) => s.speakers.map((p) => p.name)),
  ),
).size;
// -------------------End of Speakers--------------------- //

// -------------------Start of faqs--------------------- //
const faqList: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.25 } },
};
// -------------------End of faqs--------------------- //

//------------------Footer--------------------//
const FacebookIcon = () => (
  <svg {...iconProps}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg {...iconProps}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

const REGISTER_URL =
  FOOT_COLS.flatMap((c) => c.links).find((l) => l.label === "Register")?.href ??
  "#";
const YOUTUBE_URL = "https://www.youtube.com/@philricetv"; // TODO: put the real PhilRice channel link

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const SOCIAL =
  "relative grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 text-white/70 transition duration-300 hover:-translate-y-0.5 hover:border-[#4d9cff]/50 hover:bg-white/10 hover:text-white hover:shadow-[0_0_24px_-6px_rgba(77,156,255,0.7)]";
const LOGO = "h-14 w-auto object-contain";

/* ---------- page ---------- */
export default function App() {
  // const [day, setDay] = useState<1 | 2>(1);
  const [open, setOpen] = useState<number | null>(0);

  const [emailCopied, setEmailCopied] = useState(false);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateTimer = () => {
      const difference = Math.max(0, EVENT_DATE - Date.now());

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  const timerItems = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Minutes" },
    { value: timeLeft.seconds, label: "Seconds" },
  ];

  // at the top of your component
  const copyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("philrice@philrice.gov.ph");
      setEmailCopied(true);

      // reset the timer if clicked repeatedly
      if (copyTimeout.current) clearTimeout(copyTimeout.current);
      copyTimeout.current = setTimeout(() => setEmailCopied(false), 2500);
    } catch {
      setEmailCopied(false);
    }
  };

  // optional cleanup
  useEffect(() => {
    return () => {
      if (copyTimeout.current) clearTimeout(copyTimeout.current);
    };
  }, []);

  //svg animated
  // const DEBUG = false;
  const wrapRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);

  const getSvg = useCallback(
    () => wrapRef.current?.querySelector("svg") ?? null,
    [],
  );

  const setHover = useCallback((on: boolean) => {
    if (wrapRef.current) wrapRef.current.dataset.hover = String(on);
  }, []);

  const playRange = useCallback(
    (from: number, to: number) => {
      const svg = getSvg();
      if (!svg) return;
      window.clearTimeout(timer.current);
      svg.setCurrentTime(from);
      svg.unpauseAnimations();
      timer.current = window.setTimeout(
        () => {
          svg.setCurrentTime(to);
          svg.pauseAnimations();
        },
        (to - from) * 1000,
      );
    },
    [getSvg],
  );

  const reduce = useReducedMotion();

  // count-up progress (0 → 1), shared by all four tiles
  const intro = useMotionValue(0);
  useEffect(() => {
    if (reduce) {
      intro.set(1);
      return;
    }
    const c = animate(intro, 1, { duration: 1.6, delay: 0.7, ease: EASE });
    return () => c.stop();
  }, [intro, reduce]);

  // lock intro: assemble once, hold, then break apart into the idle orbit
  useEffect(() => {
    if (reduce) return;
    const group = wrapRef.current?.closest(".group");
    const timers: number[] = [];
    const cancel = () => timers.forEach((t) => window.clearTimeout(t));

    // if the visitor hovers during the intro, their hover takes over
    group?.addEventListener("mouseenter", cancel, { once: true });

    timers.push(
      window.setTimeout(() => {
        if (group?.matches(":hover")) return;
        setHover(true);
        playRange(HOVER.from, HOVER.to);

        timers.push(
          window.setTimeout(
            () => {
              setHover(false);
              playRange(LEAVE.from, LEAVE.to);
            },
            (HOVER.to - HOVER.from) * 1000 + 900,
          ),
        );
      }, 1000),
    );

    return () => {
      cancel();
      group?.removeEventListener("mouseenter", cancel);
    };
  }, [reduce, setHover, playRange]);

  useLayoutEffect(() => {
    const svg = getSvg();
    if (!svg) return;

    // wrap every piece in a <g> that carries its own random float
    svg.querySelectorAll("path").forEach((p) => {
      if (p.parentElement?.classList.contains("lock-piece")) return; // StrictMode runs this twice
      const g = document.createElementNS(SVG_NS, "g");
      g.setAttribute("class", "lock-piece");
      g.style.setProperty("--dir", Math.random() < 0.8 ? "1" : "-1"); // mostly one way, a few counter-orbit
      g.style.setProperty("--dur", `${rand(16, 40)}s`); // seconds per full circle
      g.style.setProperty("--delay", `-${rand(0, 40)}s`); // random starting angle
      p.replaceWith(g);
      g.appendChild(p);
    });

    svg.setCurrentTime(SCATTERED);
    svg.pauseAnimations();
  }, [getSvg]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <div className="relative isolate overflow-hidden min-h-screen bg-[#121314] text-white">
      <Header />

      <main className="mt-20" id="top">
        {/* radial */}
        <div
          aria-hidden
          className="glow-main pointer-events-none absolute left-0 top-0 -z-10 h-210 w-260 -translate-x-1/4 -translate-y-1/3 bg-[radial-gradient(ellipse_closest-side,rgba(77,156,255,0.6),rgba(77,156,255,0))]"
        />
        {/* hero */}
        <MotionConfig reducedMotion="user">
          <section
            className={`${WRAP} relative grid items-center gap-12 py-16 lg:grid-cols-2`}
          >
            {/* background layers fade in together */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.8, ease: "easeOut" }}
            >
              <div className="glow-alt pointer-events-none absolute -right-100 bottom-0 -z-10 h-300 w-300 translate-y-70 bg-[radial-gradient(circle_closest-side,rgba(0,85,255,0.5),rgba(0,136,255,0))] opacity-55" />
              <div className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-[linear-gradient(to_right,rgba(77,156,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(77,156,255,0.07)_1px,transparent_1px)] bg-size-[80px_80px] opacity-40" />
              <GridRain />
            </motion.div>

            {/* left column: staggered entrance */}
            <motion.div variants={container} initial="hidden" animate="show">
              <motion.span
                variants={rise}
                className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 py-1.5 pl-3 pr-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 shadow-[0_0_24px_rgba(77,156,255,0.15)] backdrop-blur-md"
              >
                <span className="flex items-center gap-2 text-white">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                  </span>
                  Live
                </span>
                <span className="h-3 w-px bg-white/20" aria-hidden="true" />
                <span>Hybrid · Nov 23–25, 2026</span>
              </motion.span>

              {/* each line slides up from behind a mask */}
              <h1 className="mt-6 text-6xl font-extrabold leading-tight md:text-7xl">
                <span className="block overflow-hidden pb-1">
                  <motion.span variants={line} className="block">
                    UNLOCKING
                  </motion.span>
                </span>
                <span className="block overflow-hidden pb-1">
                  <motion.span variants={line} className="block">
                    <span className="text-[#fef102]">THE</span> VISAYAS’
                  </motion.span>
                </span>
              </h1>

              <motion.p variants={rise} className="mt-6 text-2xl font-semibold">
                Potential for Rice Security Through <br /> Convergence and
                Shared Commitment
              </motion.p>

              <motion.div
                variants={tiles}
                className="mt-8 grid max-w-xl grid-cols-4 gap-3 sm:gap-4"
              >
                {timerItems.map((item) => {
                  const isSeconds = item.label.toLowerCase() === "seconds";
                  return (
                    <motion.div
                      key={item.label}
                      variants={tile}
                      className="flex min-w-0 flex-col items-center rounded-2xl border border-white/10 bg-white/5 px-2 py-4 backdrop-blur-md sm:py-5"
                    >
                      <span
                        key={item.value} // new key each change re-triggers the tick animation
                        className={`tick text-4xl font-bold leading-none tabular-nums tracking-tight sm:text-5xl md:text-6xl ${
                          isSeconds
                            ? "text-[#4d9cff] drop-shadow-[0_0_14px_rgba(77,156,255,0.6)]"
                            : "text-white"
                        }`}
                      >
                        <CountNumber value={item.value} intro={intro} />
                      </span>
                      <span className="mt-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/50 sm:text-xs">
                        {item.label}
                      </span>
                    </motion.div>
                  );
                })}
              </motion.div>

              <motion.dl
                variants={rise}
                className="mt-6 grid max-w-xl grid-cols-1 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md sm:grid-cols-3 sm:divide-x sm:divide-y-0"
              >
                {DETAILS.map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 px-4 py-3.5"
                  >
                    <Icon
                      className="h-5 w-5 shrink-0 text-[#4d9cff]"
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <dt className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">
                        {label}
                      </dt>
                      <dd className="mt-0.5 truncate text-sm font-semibold text-white">
                        {value}
                      </dd>
                    </div>
                  </div>
                ))}
              </motion.dl>
            </motion.div>

            {/* right column: the lock */}
            <div
              className="group relative lg:translate-x-20"
              onMouseEnter={() => {
                setHover(true);
                playRange(HOVER.from, HOVER.to);
              }}
              onMouseLeave={() => {
                setHover(false);
                playRange(LEAVE.from, LEAVE.to);
              }}
            >
              {/* globe rings expand outward first */}
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.4, delay: 0.3, ease: EASE }}
              >
                <div className="absolute inset-[6%] rounded-full border border-white/10 transition-colors duration-700 group-hover:border-[#4d9cff]/40" />
                <div className="absolute inset-[20%] animate-[spin_90s_linear_infinite] rounded-full border border-dashed border-white/10 transition-colors duration-700 group-hover:border-[#4d9cff]/30" />
                <div className="absolute inset-[30%] rounded-full bg-[#4d9cff]/0 blur-3xl transition-all duration-700 group-hover:bg-[#4d9cff]/25" />
              </motion.div>

              {/* the lock fades and scales in */}
              <motion.div
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.5, ease: EASE }}
              >
                <div
                  ref={wrapRef}
                  data-hover="false"
                  role="img"
                  aria-label="Animated lock illustration"
                  className="lock-wrap relative flex aspect-square w-full items-center justify-center [&>svg]:h-full [&>svg]:w-full"
                  dangerouslySetInnerHTML={{ __html: lockAnimated }}
                />
              </motion.div>
            </div>
          </section>
        </MotionConfig>

        {/* about */}
        <MotionConfig reducedMotion="user">
          <section id="about" className="overflow-x-clip py-30">
            <div className={WRAP}>
              <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                className="grid gap-10 lg:grid-cols-2 lg:gap-16"
              >
                <div>
                  <motion.div variants={rise}>
                    <SectionLabel num="01" name="ABOUT" />
                  </motion.div>

                  {/* each line slides up from behind a mask */}
                  <h2 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
                    <span className="block overflow-hidden pb-1">
                      <motion.span variants={line} className="block">
                        38th Ugnay Palay
                      </motion.span>
                    </span>
                    <span className="block overflow-hidden pb-1">
                      <motion.span
                        variants={line}
                        className="block text-white/60"
                      >
                        National Rice R4DE Conference
                      </motion.span>
                    </span>
                  </h2>

                  <motion.dl
                    variants={rise}
                    className="mt-10 grid max-w-md grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md"
                  >
                    {STATS.map((s) => (
                      <div
                        key={s.l}
                        className="flex flex-col-reverse px-5 py-4"
                      >
                        <dt className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">
                          {s.l}
                        </dt>
                        <dd className="text-3xl font-bold tabular-nums text-white">
                          <CountStat value={s.n} />
                        </dd>
                      </div>
                    ))}
                  </motion.dl>
                </div>

                <motion.p
                  variants={rise}
                  className="self-center text-base leading-8 text-white/70 lg:text-lg"
                >
                  The 38th Ugnay Palay National Rice R4D Conference arrives at a
                  crucial moment in the evolution of the Philippine rice
                  industry. This year’s theme,{" "}
                  <motion.span
                    variants={highlight}
                    className="bg-[linear-gradient(transparent_62%,rgba(77,156,255,0.3)_62%)] bg-no-repeat font-semibold text-white [box-decoration-break:clone]"
                  >
                    “UNLOCKING THE VISAYAS’ Potential for Rice Security Through
                    Convergence and Shared Commitment”
                  </motion.span>{" "}
                  encapsulates DA-PhilRice’s commitment to driving innovation,
                  resilience, and sustainability in Philippine agriculture. It
                  reflects the Institute’s dedication to placing farmers at the
                  core of these advancements, ensuring their needs are met and
                  their livelihoods are improved as they strive for greater
                  productivity.
                </motion.p>
              </motion.div>

              {/* gallery fades up once the text has settled */}
              <motion.div
                {...reveal}
                transition={{ ...reveal.transition, delay: 0.15 }}
              >
                <GalleryList items={FEATURES} />
              </motion.div>
            </div>
          </section>
        </MotionConfig>

        {/* speakers */}
        <MotionConfig reducedMotion="user">
          <section id="speakers" className="border-t border-white/10 py-24">
            <div className={WRAP}>
              <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                className="flex flex-wrap items-end justify-between gap-6"
              >
                <div>
                  <motion.div variants={rise}>
                    <SectionLabel num="02" name="SPEAKERS" />
                  </motion.div>
                  <h2 className="mt-4 text-4xl font-extrabold sm:text-5xl">
                    <span className="block overflow-hidden pb-1">
                      <motion.span variants={line} className="block">
                        Minds Behind
                      </motion.span>
                    </span>
                    <span className="block overflow-hidden pb-1">
                      <motion.span
                        variants={line}
                        className="block text-white/60"
                      >
                        Next
                      </motion.span>
                    </span>
                  </h2>
                </div>

                <motion.div variants={rise} className="text-right">
                  <p className="text-5xl font-extrabold tabular-nums text-white">
                    <CountStat value={String(SPEAKER_TOTAL)} />
                  </p>
                  <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">
                    Speakers
                  </p>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <SpeakerDirectory />
              </motion.div>
            </div>
          </section>
        </MotionConfig>

        {/* schedule */}
        <section id="schedule" className="">
          <Schedule />
        </section>

        {/* faq */}
        <MotionConfig reducedMotion="user">
          <section id="faq" className="border-t border-white/10 py-24">
            <div
              className={`${WRAP} grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16`}
            >
              {/* left: builds in sequence, stays in view while the list scrolls */}
              <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                className="lg:sticky lg:top-24 lg:self-start"
              >
                <motion.div variants={rise}>
                  <SectionLabel num="04" name="FAQ" />
                </motion.div>

                <h2 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
                  <span className="block overflow-hidden pb-1">
                    <motion.span variants={line} className="block">
                      Questions,
                    </motion.span>
                  </span>
                  <span className="block overflow-hidden pb-1">
                    <motion.span
                      variants={line}
                      className="block text-white/60"
                    >
                      answered.
                    </motion.span>
                  </span>
                </h2>

                <motion.p
                  variants={rise}
                  className="mt-6 max-w-xs leading-7 text-white/60"
                >
                  Can’t find what you’re looking for? Our team replies within 24
                  hours.
                </motion.p>

                <motion.a
                  variants={rise}
                  href="mailto:hello@EVENT2027.example"
                  className="group mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:border-[#4d9cff]/50 hover:bg-white/10"
                >
                  <Mail
                    className="h-4 w-4 text-[#4d9cff] transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110"
                    aria-hidden="true"
                  />
                  Contact Us
                </motion.a>
              </motion.div>

              {/* right: accordion, questions rise one after another */}
              <motion.ul
                variants={faqList}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-80px" }}
                className="space-y-3"
              >
                {FAQS.map((f, i) => {
                  const isOpen = open === i;
                  return (
                    <motion.li
                      key={f.q}
                      variants={rise}
                      className={`relative overflow-hidden rounded-2xl border transition-[border-color,background-color,box-shadow] duration-300 ${
                        isOpen
                          ? "border-[#4d9cff]/40 bg-white/[0.07] shadow-[0_0_40px_-14px_rgba(77,156,255,0.5)]"
                          : "border-white/10 bg-white/5 hover:border-white/25"
                      }`}
                    >
                      {/* glowing accent bar on the open item */}
                      <span
                        aria-hidden="true"
                        className={`absolute inset-y-4 left-0 w-0.5 rounded-full bg-[#4d9cff] shadow-[0_0_12px_rgba(77,156,255,0.8)] transition-transform duration-300 ${
                          isOpen ? "scale-y-100" : "scale-y-0"
                        }`}
                      />

                      <h3>
                        <button
                          id={`faq-btn-${i}`}
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={`faq-panel-${i}`}
                          onClick={() => setOpen(isOpen ? null : i)}
                          className="flex w-full items-center gap-4 rounded-2xl px-5 py-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#4d9cff] sm:px-6"
                        >
                          <span
                            className={`font-mono text-xs transition-colors ${
                              isOpen ? "text-[#4d9cff]" : "text-white/40"
                            }`}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="flex-1 font-semibold text-white">
                            {f.q}
                          </span>
                          <span
                            aria-hidden="true"
                            className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition duration-300 ${
                              isOpen
                                ? "rotate-45 border-[#4d9cff]/60 bg-[#4d9cff]/15 text-[#4d9cff]"
                                : "border-white/15 text-white/60"
                            }`}
                          >
                            <Plus className="h-4 w-4" />
                          </span>
                        </button>
                      </h3>

                      {/* smooth height: animates the grid row from 0fr to 1fr */}
                      <div
                        id={`faq-panel-${i}`}
                        role="region"
                        aria-labelledby={`faq-btn-${i}`}
                        className={`grid transition-[grid-template-rows,visibility] duration-300 ease-out motion-reduce:transition-none ${
                          isOpen
                            ? "visible grid-rows-[1fr]"
                            : "invisible grid-rows-[0fr]"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p
                            className={`border-t border-white/10 px-5 py-5 leading-7 text-white/70 transition-[opacity,translate] duration-300 motion-reduce:transition-none sm:px-6 sm:pl-17 ${
                              isOpen
                                ? "translate-y-0 opacity-100 delay-100"
                                : "-translate-y-1 opacity-0"
                            }`}
                          >
                            {f.a}
                          </p>
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </div>
          </section>
        </MotionConfig>
      </main>

      {/* footer */}
      <MotionConfig reducedMotion="user">
        <footer className="relative isolate mt-10 overflow-hidden border-t border-white/10">
          {/* soft glow on the top edge */}
          <div
            aria-hidden
            className="glow-main pointer-events-none absolute left-1/2 top-0 -z-10 h-112 w-4xl -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_closest-side,rgba(77,156,255,0.6),rgba(77,156,255,0))]"
          />

          {/* closing call to action */}
          <div className={`${WRAP} pt-20`}>
            <motion.div
              {...reveal}
              className="flex flex-col items-start justify-between gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md sm:p-12 lg:flex-row lg:items-center"
            >
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#4d9cff]">
                  {DETAILS[0].value} · {DETAILS[1].value}
                </p>
                <h2 className="mt-3 max-w-xl text-3xl font-extrabold leading-tight sm:text-4xl">
                  Unlocking the Visayas’ potential starts with you.
                </h2>
              </div>
              <a
                href={REGISTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition duration-300 hover:shadow-[0_0_40px_-4px_rgba(77,156,255,0.8)]"
              >
                Register now
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
            </motion.div>
          </div>

          {/* main */}
          <div className={`${WRAP} grid gap-14 py-16 lg:grid-cols-[1.1fr_2fr]`}>
            {/* brand */}
            <motion.div {...reveal}>
              <div className="flex flex-wrap items-center gap-5">
                <img src={daPHILRICE} alt="DA-PhilRice" className={LOGO} />
                <img
                  src={BagongPilipinas}
                  alt="Bagong Pilipinas"
                  className={LOGO}
                />
                <img src={UgnayPalay} alt="Ugnay Palay" className={LOGO} />
              </div>

              <address className="mt-8 text-sm not-italic leading-7 text-white/60">
                <p className="font-semibold text-white">PHILRICE</p>
                <p>Iloilo Convention Center</p>
                <p>Iloilo City, Philippines</p>
              </address>

              <div className="mt-6 flex gap-3">
                <a
                  href="https://www.facebook.com/PhilRice.ricematters"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="PhilRice on Facebook"
                  className={SOCIAL}
                >
                  <FacebookIcon />
                </a>

                <a
                  href={YOUTUBE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="PhilRice on YouTube"
                  className={SOCIAL}
                >
                  <YoutubeIcon />
                </a>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  aria-label="Copy email address"
                  className={`${SOCIAL} cursor-pointer`}
                >
                  <Mail
                    className={`h-5 w-5 transition-transform duration-200 ${
                      emailCopied ? "scale-110 text-[#4d9cff]" : ""
                    }`}
                    aria-hidden="true"
                  />
                  {/* pop-up tooltip */}
                  <span
                    role="status"
                    aria-live="polite"
                    className={`pointer-events-none absolute left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-md bg-black px-3 py-2 text-xs font-medium text-white shadow-lg transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                      emailCopied
                        ? "-top-12 scale-100 opacity-100"
                        : "-top-6 scale-50 opacity-0"
                    }`}
                  >
                    <svg
                      className="h-3.5 w-3.5 text-green-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    Email copied!
                    <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-black" />
                  </span>
                </button>
              </div>
            </motion.div>

            {/* link columns */}
            <nav
              aria-label="Footer"
              className="grid grid-cols-2 gap-10 sm:grid-cols-4"
            >
              {FOOT_COLS.map((c, i) => (
                <motion.div
                  key={c.title}
                  {...reveal}
                  transition={{ ...reveal.transition, delay: 0.08 * i }}
                >
                  <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
                    {c.title}
                  </h2>
                  <ul className="mt-5 space-y-3">
                    {c.links.map((l) => {
                      const external = l.href.startsWith("http");
                      return (
                        <li key={l.label}>
                          <a
                            href={l.href}
                            {...(external
                              ? { target: "_blank", rel: "noopener noreferrer" }
                              : {})}
                            className="group inline-flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white"
                          >
                            <span className="relative">
                              {l.label}
                              <span
                                aria-hidden="true"
                                className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[#4d9cff] transition-transform duration-300 ease-out group-hover:scale-x-100"
                              />
                            </span>
                            {external && (
                              <>
                                <ArrowUpRight
                                  className="h-3.5 w-3.5 -translate-x-1 text-[#4d9cff] opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                                  aria-hidden="true"
                                />
                                <span className="sr-only">
                                  (opens in a new tab)
                                </span>
                              </>
                            )}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              ))}
            </nav>
          </div>

          {/* giant faded wordmark */}
          <motion.div
            {...reveal}
            aria-hidden="true"
            className="pointer-events-none select-none overflow-hidden text-center"
          >
            <p className="bg-linear-to-b from-white/15 to-transparent bg-clip-text text-[clamp(4rem,16vw,14rem)] font-extrabold leading-[0.85] tracking-tight text-transparent">
              UGNAY PALAY
            </p>
          </motion.div>

          {/* bottom bar */}
          <div className="border-t border-white/10">
            <div
              className={`${WRAP} flex flex-col items-center justify-between gap-4 py-6 text-xs text-white/50 sm:flex-row`}
            >
              <p>© 2026 PHILRICE. All rights reserved.</p>
              <button
                type="button"
                onClick={() =>
                  window.scrollTo({
                    top: 0,
                    behavior: window.matchMedia(
                      "(prefers-reduced-motion: reduce)",
                    ).matches
                      ? "auto"
                      : "smooth",
                  })
                }
                className="group inline-flex items-center gap-2 transition-colors hover:text-white"
              >
                Back to top
                <ArrowUp
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
        </footer>
      </MotionConfig>
    </div>
  );
}
