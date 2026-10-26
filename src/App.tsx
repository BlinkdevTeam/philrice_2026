import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";

import "./App.css";
// import { motion } from "framer-motion";
import { WRAP, SectionLabel } from "./ui"; // adjust
import { Mail, Plus } from "lucide-react";

import Header from "./Header";
import GalleryList from "./GalleryList";
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

import facebookLogo from "./assets/facebook-2-white.svg";
import youtubeLogo from "./assets/youtube-2-white.svg";
import gmailLogo from "./assets/gmail-2-white.svg";
import lockAnimated from "./assets/lock-animated.svg?raw";

import daPHILRICE from "./assets/da-philrice.png";
import BagongPilipinas from "./assets/bagong-pilipinas.png";
import UgnayPalay from "./assets/ugnay-palay-logo.png";

/* ---------- dotted grid (schedule + footer) ---------- */
const DOT = "border-dotted border-gray-500";
const LINK_STYLE = "space-y-1.5 text-sm font-medium tracking-wide";

type Pos = "tl" | "tr" | "bl" | "br" | "tc" | "bc";
const CROSS: Record<Pos, string> = {
  tl: "left-0 top-0 -translate-x-1/2 -translate-y-1/2",
  tr: "right-0 top-0 translate-x-1/2 -translate-y-1/2",
  bl: "left-0 bottom-0 -translate-x-1/2 translate-y-1/2",
  br: "right-0 bottom-0 translate-x-1/2 translate-y-1/2",
  tc: "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2",
  bc: "left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2",
};

function Cross({ pos }: { pos: Pos }) {
  return (
    <svg
      aria-hidden="true"
      width="11"
      height="11"
      viewBox="0 0 11 11"
      className={`pointer-events-none absolute z-10 ${CROSS[pos]}`}
    >
      <path
        d="M0 5.5h11M5.5 0v11"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}

/* Every cell draws its own top/left dotted border and a "+" on its top-left corner.
   Cells on the right edge add top-right, cells on the bottom edge add bottom-left/right.
   The parent grid supplies the right + bottom borders. */
function GridCell({
  children,
  className = "",
  right = false,
  bottom = false,
  extra = [],
  role,
}: {
  children?: ReactNode;
  className?: string;
  right?: boolean;
  bottom?: boolean;
  extra?: Pos[];
  role?: string;
}) {
  const crosses: Pos[] = [
    "tl",
    ...(right ? (["tr"] as Pos[]) : []),
    ...(bottom ? (["bl"] as Pos[]) : []),
    ...(right && bottom ? (["br"] as Pos[]) : []),
    ...extra,
  ];
  return (
    <div
      role={role}
      className={`relative border-l border-t ${DOT} ${className}`}
    >
      {crosses.map((p) => (
        <Cross key={p} pos={p} />
      ))}
      {children}
    </div>
  );
}

const SVG_NS = "http://www.w3.org/2000/svg";
const SCATTERED = 2.4;
const HOVER = { from: 2.7, to: 4.7 };
const LEAVE = { from: 0.5, to: 2.2 };
const rand = (a: number, b: number) => a + Math.random() * (b - a);

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

  const getSvg = () => wrapRef.current?.querySelector("svg") ?? null;

  const setHover = (on: boolean) => {
    if (wrapRef.current) wrapRef.current.dataset.hover = String(on);
  };

  const playRange = (from: number, to: number) => {
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
  };

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
  }, []);

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
        <section
          className={`${WRAP} relative  grid items-center gap-12 py-16 lg:grid-cols-2`}
        >
          {/* radial */}
          <div
            aria-hidden
            className="glow-alt pointer-events-none absolute -right-100 bottom-0 -z-10 h-300 w-300 translate-y-70 bg-[radial-gradient(circle_closest-side,rgba(0,85,255,0.5),rgba(0,136,255,0))] opacity-55"
          />
          {/* grid lines */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-[linear-gradient(to_right,rgba(77,156,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(77,156,255,0.07)_1px,transparent_1px)] bg-size-[80px_80px] opacity-40"
          />
          <GridRain />
          <div>
            <span className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 py-1.5 pl-3 pr-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80 shadow-[0_0_24px_rgba(77,156,255,0.15)] backdrop-blur-md">
              {/* status */}
              <span className="flex items-center gap-2 text-white">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                </span>
                Live
              </span>

              {/* divider */}
              <span className="h-3 w-px bg-white/20" aria-hidden="true" />

              {/* detail */}
              <span>Hybrid · Nov 23–25, 2026</span>
            </span>
            <h1 className="mt-6 text-6xl font-extrabold leading-tight md:text-7xl">
              UNLOCKING
              <br />
              <span className="text-[#fef102]">THE</span> VISAYAS’
            </h1>
            <p className="mt-6 text-2xl font-semibold">
              Potential for Rice Security Through <br /> Convergence and Shared
              Commitment
            </p>
            <div className="mt-8 grid max-w-xl grid-cols-4 gap-3 sm:gap-4">
              {timerItems.map((item) => {
                const isSeconds = item.label.toLowerCase() === "seconds";
                return (
                  <div
                    key={item.label}
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
                      {String(item.value).padStart(2, "0")}
                    </span>
                    <span className="mt-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/50 sm:text-xs">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <dl className="mt-6 grid max-w-xl grid-cols-1 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md sm:grid-cols-3 sm:divide-x sm:divide-y-0">
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
            </dl>
          </div>

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
            {/* globe rings */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
            >
              <div className="absolute inset-[6%] rounded-full border border-white/10 transition-colors duration-700 group-hover:border-[#4d9cff]/40" />
              <div className="absolute inset-[20%] rounded-full border border-dashed border-white/10 transition-colors duration-700 group-hover:border-[#4d9cff]/30 animate-[spin_90s_linear_infinite]" />
              {/* center glow that lights up on hover */}
              <div className="absolute inset-[30%] rounded-full bg-[#4d9cff]/0 blur-3xl transition-all duration-700 group-hover:bg-[#4d9cff]/25" />
            </div>

            {/* the lock */}
            <div
              ref={wrapRef}
              data-hover="false"
              role="img"
              aria-label="Animated lock illustration"
              className="lock-wrap relative flex aspect-square w-full items-center justify-center [&>svg]:h-full [&>svg]:w-full"
              dangerouslySetInnerHTML={{ __html: lockAnimated }}
            />
          </div>
        </section>

        {/* about */}
        <section id="about" className="overflow-x-clip py-30">
          <div className={WRAP}>
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <SectionLabel num="01" name="ABOUT" />
                <h2 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
                  38th Ugnay Palay
                  <span className="block text-white/60">
                    National Rice R4DE Conference
                  </span>
                </h2>

                <dl className="mt-10 grid max-w-md grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
                  {STATS.map((s) => (
                    <div key={s.l} className="flex flex-col-reverse px-5 py-4">
                      <dt className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">
                        {s.l}
                      </dt>
                      <dd className="text-3xl font-bold tabular-nums text-white">
                        {s.n}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <p className="self-center text-base leading-8 text-white/70 lg:text-lg">
                The 38th Ugnay Palay National Rice R4D Conference arrives at a
                crucial moment in the evolution of the Philippine rice industry.
                This year’s theme,{" "}
                <span className="font-semibold text-white">
                  “UNLOCKING THE VISAYAS’ Potential for Rice Security Through
                  Convergence and Shared Commitment”
                </span>{" "}
                encapsulates DA-PhilRice’s commitment to driving innovation,
                resilience, and sustainability in Philippine agriculture. It
                reflects the Institute’s dedication to placing farmers at the
                core of these advancements, ensuring their needs are met and
                their livelihoods are improved as they strive for greater
                productivity.
              </p>
            </div>

            <GalleryList items={FEATURES} />
          </div>
        </section>

        {/* speakers */}
        <section id="speakers" className="border-t border-white/10 py-24">
          <div className={WRAP}>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <SectionLabel num="02" name="SPEAKERS" />
                <h2 className="mt-4 text-4xl font-extrabold sm:text-5xl">
                  Minds Behind
                  <span className="block text-white/60">Next</span>
                </h2>
              </div>
            </div>
            <SpeakerDirectory />
          </div>
        </section>

        {/* schedule */}
        <section id="schedule" className="">
          <Schedule />
        </section>

        {/* faq */}
        <section id="faq" className="border-t border-white/10 py-24">
          <div
            className={`${WRAP} grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-16`}
          >
            {/* left: stays in view while the list scrolls */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <SectionLabel num="04" name="FAQ" />
              <h2 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
                Questions,
                <span className="block text-white/60">answered.</span>
              </h2>
              <p className="mt-6 max-w-xs leading-7 text-white/60">
                Can’t find what you’re looking for? Our team replies within 24
                hours.
              </p>
              <a
                href="mailto:hello@EVENT2027.example"
                className="group mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:border-[#4d9cff]/50 hover:bg-white/10"
              >
                <Mail className="h-4 w-4 text-[#4d9cff]" aria-hidden="true" />
                Contact Us
              </a>
            </div>

            {/* right: accordion */}
            <ul className="space-y-3">
              {FAQS.map((f, i) => {
                const isOpen = open === i;
                return (
                  <li
                    key={f.q}
                    className={`rounded-2xl border transition duration-300 ${
                      isOpen
                        ? "border-[#4d9cff]/40 bg-white/[0.07] shadow-[0_0_40px_-14px_rgba(77,156,255,0.5)]"
                        : "border-white/10 bg-white/5 hover:border-white/25"
                    }`}
                  >
                    <h3>
                      <button
                        id={`faq-btn-${i}`}
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${i}`}
                        onClick={() => setOpen(isOpen ? null : i)}
                        className="flex w-full items-center gap-4 rounded-2xl px-5 py-5 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#4d9cff] sm:px-6"
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
                        <p className="border-t border-white/10 px-5 py-5 leading-7 text-white/70 sm:px-6 sm:pl-17">
                          {f.a}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </main>

      {/* footer */}
      <footer className="pt-16">
        <div
          className={`grid grid-cols-1 border-b border-r lg:grid-cols-4 ${DOT}`}
        >
          {/* row 1 — link columns */}
          {FOOT_COLS.map((c, i) => (
            <GridCell key={c.title} right={i === 3} className="min-h-62.5 p-8">
              <h2 className="text-2xl">{c.title}</h2>
              <ul className={`mt-5 ${LINK_STYLE}`}>
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="flex items-center justify-between"
                    >
                      {l.label}
                      {l.plus && (
                        <span aria-hidden="true" className="pr-3">
                          +
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </GridCell>
          ))}

          {/* row 2 — logo, legal, address */}
          <GridCell
            extra={["tc", "bc"]}
            className="flex min-h-87.5 items-center justify-center p-8 lg:col-span-2"
          >
            <div className="flex h-11 w-full items-center justify-center">
              <img
                src={daPHILRICE}
                alt="DAPHILRICE"
                className="h-116 w-116 object-contain"
              />
            </div>
          </GridCell>
          <GridCell className="flex min-h-87.5 items-center justify-center p-8 lg:col-span-1">
            <div className="flex h-11 w-full items-center justify-center">
              <img
                src={BagongPilipinas}
                alt="BagongPilipinas"
                className="h-36 w-36 object-contain"
              />
            </div>
          </GridCell>
          <GridCell right className="min-h-87.5 p-8">
            <h2 className="text-2xl">PHILRICE</h2>
            <address className={`mt-5 not-italic ${LINK_STYLE}`}>
              <p>Iloilo Convention Center</p>
              <p>Iloilo City, Philippines</p>
            </address>
            <div
              className="mt-8 grid h-24 w-24 place-items-center"
              role="img"
              aria-label="Badge placeholder"
            >
              <img
                src={UgnayPalay}
                alt="UgnayPalay"
                className="h-24 w-24 object-contain"
              />
            </div>
          </GridCell>

          <GridCell bottom className="flex min-h-36.25 items-center p-8">
            <a
              href="https://www.facebook.com/PhilRice.ricematters"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-11 w-full items-center justify-center"
              aria-label="Visit our Facebook page"
            >
              <img
                src={facebookLogo}
                alt="Facebook"
                className="h-31 w-31 object-contain transition-transform duration-300 ease-out will-change-transform group-hover:scale-105 group-active:scale-95 motion-reduce:transition-none"
              />
            </a>
          </GridCell>

          <GridCell bottom className="flex min-h-36.25 items-center p-8">
            <a
              href="https://www.facebook.com/PhilRice.ricematters"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-11 w-full items-center justify-center"
              aria-label="Visit our Facebook page"
            >
              <img
                src={youtubeLogo}
                alt="Youtube"
                className="h-28 w-28 object-contain transition-transform duration-300 ease-out will-change-transform group-hover:scale-105 group-active:scale-95 motion-reduce:transition-none"
              />
            </a>
          </GridCell>
          <GridCell bottom className="flex min-h-36.25 items-center p-8">
            <button
              type="button"
              onClick={handleCopyEmail}
              className="group relative flex h-11 w-full cursor-pointer items-center justify-center"
              aria-label="Copy email address"
            >
              <img
                src={gmailLogo}
                alt="Gmail"
                className={`h-10 w-10 object-contain transition-transform duration-200 ease-out group-hover:scale-110 group-active:scale-90 ${
                  emailCopied ? "scale-110" : ""
                }`}
              />

              {/* Pop-up tooltip */}
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
                {/* little arrow */}
                <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-black" />
              </span>
            </button>
          </GridCell>
          <GridCell
            right
            bottom
            className="flex min-h-36.25 flex-col justify-center gap-1.5 p-8 text-sm font-medium"
          >
            <p>© 2026 PHILRICE</p>
            <p>All rights reserved.</p>
          </GridCell>
        </div>
      </footer>
    </div>
  );
}
