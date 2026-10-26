import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { motion, useReducedMotion } from "framer-motion";

const SVG_NS = "http://www.w3.org/2000/svg";
const SCATTERED = 2.4;
const HOVER = { from: 2.7, to: 4.7 };
const LEAVE = { from: 0.5, to: 2.2 };
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// the lock is not rendered (or downloaded) below this width, i.e. on phones
const SHOW_QUERY = "(min-width: 768px)";

const rand = (a: number, b: number) => a + Math.random() * (b - a);

function useMatches(query: string) {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

export default function LockHero() {
  const reduce = useReducedMotion();
  const show = useMatches(SHOW_QUERY);

  // the 619 KB SVG is its own chunk, fetched only when the lock is shown
  const [markup, setMarkup] = useState<string | null>(null);
  useEffect(() => {
    if (!show || markup) return;
    let cancelled = false;
    import("./assets/lock-animated.svg?raw").then((m) => {
      if (!cancelled) setMarkup(m.default);
    });
    return () => {
      cancelled = true;
    };
  }, [show, markup]);

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

  // wrap every piece in a <g> that carries its own random orbit
  useLayoutEffect(() => {
    if (!show || !markup) return;
    const svg = getSvg();
    if (!svg) return;

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
  }, [show, markup, getSvg]);

  // intro: assemble once, hold, then break apart into the idle orbit
  useEffect(() => {
    if (reduce || !show || !markup) return;
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
  }, [reduce, show, markup, setHover, playRange]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  if (!show) return null;

  return (
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
          dangerouslySetInnerHTML={{ __html: markup ?? "" }}
        />
      </motion.div>
    </div>
  );
}
