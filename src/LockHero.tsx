import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useId,
  type MouseEvent,
} from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// the lock is not rendered (or downloaded) below this width, i.e. on phones
const SHOW_QUERY = "(min-width: 768px)";

// true: snap back to the first frame on leave. false: stay on the last frame.
const RESET_ON_LEAVE = true;

// how far before the end of the cycle to hold (ms). Raise it if the very last frame is blank.
const HOLD_BEFORE_END = 40;

const MAX_TILT = 8; // degrees of tilt at the edge. Use a negative number to tilt toward the cursor instead of away.
const TILT_SPRING = { stiffness: 150, damping: 18, mass: 0.6 };

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

const toMs = (v: string | null) => {
  const m = v?.trim().match(/^(-?[\d.]+)\s*(ms|s)?$/);
  if (!m) return 0;
  return parseFloat(m[1]) * (m[2] === "ms" ? 1 : 1000);
};

// length of one animation cycle in ms (SMIL and CSS)
function measureCycle(svg: SVGSVGElement) {
  let end = 0;
  svg
    .querySelectorAll("animate, animateTransform, animateMotion, set")
    .forEach((el) => {
      end = Math.max(
        end,
        toMs(el.getAttribute("begin")) + toMs(el.getAttribute("dur")),
      );
    });
  svg.getAnimations({ subtree: true }).forEach((a) => {
    const t = a.effect?.getComputedTiming();
    if (t) end = Math.max(end, Number(t.delay ?? 0) + Number(t.duration ?? 0));
  });
  return end;
}

// each layer rotates around the SVG's center
const HUD =
  "[transform-box:view-box] [transform-origin:50%_50%] motion-reduce:animate-none";

function TechRings() {
  const sweep = useId().replace(/:/g, "");

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 400"
      className="h-full w-full text-[#dcecff] opacity-60 transition-[color,opacity] duration-700 group-hover:text-[#4d9cff] group-hover:opacity-100"
    >
      <defs>
        {/* trailing edge transparent, leading edge bright */}
        <linearGradient
          id={sweep}
          gradientUnits="userSpaceOnUse"
          x1="200"
          y1="36"
          x2="309"
          y2="75"
        >
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.45" />
        </linearGradient>
      </defs>

      {/* corner brackets */}
      {/* <path
        d="M6 40V6H40M360 6H394V40M394 360V394H360M40 394H6V360"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      /> */}

      {/* outer hairline: draws itself in */}
      <motion.circle
        cx="200"
        cy="200"
        r="196"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.3"
        strokeWidth="0.8"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 0.4, ease: EASE }}
      />
      {/* crosshair marks */}
      <path
        d="M200 0v14M200 386v14M0 200h14M386 200h14"
        stroke="currentColor"
        strokeOpacity="0.7"
        strokeWidth="1.5"
      />

      {/* bearing labels + readouts */}
      <g
        fill="currentColor"
        fillOpacity="0.6"
        fontFamily="ui-monospace, monospace"
        fontSize="7"
        textAnchor="middle"
      >
        {/* <text x="200" y="19">
          000
        </text>
        <text x="386" y="203">
          090
        </text>
        <text x="200" y="391">
          180
        </text>
        <text x="14" y="203">
          270
        </text> */}
        {/* <text x="352" y="19" textAnchor="start">
          SYS//LOCK
        </text> */}
        <text x="48" y="19" textAnchor="end">
          R4D//38
        </text>
        {/* <text x="48" y="391" textAnchor="start">
          SEC.LVL 03
        </text> */}
        <text x="352" y="391" textAnchor="end">
          ONLINE
        </text>
      </g>
      <circle
        cx="358"
        cy="388.5"
        r="2"
        fill="currentColor"
        className="animate-pulse"
      />

      {/* tick marks (every 5°) with a major tick every 30°, slow clockwise */}
      <g className={`${HUD} animate-[hud-spin_80s_linear_infinite]`}>
        <circle
          cx="200"
          cy="200"
          r="172"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.45"
          strokeWidth="6"
          strokeDasharray="1.5 13.51"
        />
        <circle
          cx="200"
          cy="200"
          r="172"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.9"
          strokeWidth="10"
          strokeDasharray="3 87.06"
        />
      </g>

      {/* segmented arcs, counter-clockwise */}
      <g className={`${HUD} animate-[hud-spin_30s_linear_infinite_reverse]`}>
        <circle
          cx="200"
          cy="200"
          r="152"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="285 33.35"
        />
        <circle cx="200" cy="48" r="4" fill="currentColor" fillOpacity="0.25" />
        <circle cx="200" cy="48" r="2" fill="currentColor" />
      </g>

      {/* two bright accent arcs, clockwise */}
      <g className={`${HUD} animate-[hud-spin_12s_linear_infinite]`}>
        <circle
          cx="200"
          cy="200"
          r="134"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="80 341"
        />
      </g>

      {/* fine dashed ring, counter-clockwise */}
      <g className={`${HUD} animate-[hud-spin_20s_linear_infinite_reverse]`}>
        <circle
          cx="200"
          cy="200"
          r="116"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.5"
          strokeWidth="1"
          strokeDasharray="3 5.01"
        />
        <circle cx="200" cy="84" r="3" fill="currentColor" />
      </g>

      {/* radar sweep with a bright leading line */}
      <g className={`${HUD} animate-[hud-spin_8s_linear_infinite]`}>
        <path
          d="M200 200 L200 36 A164 164 0 0 1 309.3 75.8 Z"
          fill={`url(#${sweep})`}
        />
        <line
          x1="200"
          y1="200"
          x2="309.3"
          y2="75.8"
          stroke="currentColor"
          strokeOpacity="0.8"
          strokeWidth="1"
        />
      </g>

      {/* inner ring and center dot */}
      <circle
        cx="200"
        cy="200"
        r="86"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="0.8"
      />
      <circle cx="200" cy="200" r="3" fill="currentColor" fillOpacity="0.8" />
    </svg>
  );
}

export default function LockHero() {
  const show = useMatches(SHOW_QUERY);
  const reduce = useReducedMotion();

  // cursor position over the lock, from -0.5 (left/top) to 0.5 (right/bottom)
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(
    useTransform(px, [-0.5, 0.5], [-MAX_TILT, MAX_TILT]),
    TILT_SPRING,
  );
  const rotateX = useSpring(
    useTransform(py, [-0.5, 0.5], [MAX_TILT, -MAX_TILT]),
    TILT_SPRING,
  );

  // the SVG is its own chunk, fetched only when the lock is shown
  const [markup, setMarkup] = useState<string | null>(null);
  useEffect(() => {
    if (!show || markup) return;
    let cancelled = false;
    import("./assets/PADLOCK.svg?raw").then((m) => {
      if (!cancelled) setMarkup(m.default);
    });
    return () => {
      cancelled = true;
    };
  }, [show, markup]);

  const wrapRef = useRef<HTMLDivElement>(null);
  const cycle = useRef(0); // ms
  const timer = useRef<number | undefined>(undefined);

  const getSvg = useCallback(
    () => wrapRef.current?.querySelector("svg") ?? null,
    [],
  );

  // pause everything at a given time (ms)
  const freezeAt = useCallback(
    (ms: number) => {
      const svg = getSvg();
      if (!svg) return;
      svg.pauseAnimations();
      svg.setCurrentTime(ms / 1000);
      svg.getAnimations({ subtree: true }).forEach((a) => {
        a.pause();
        a.currentTime = ms;
      });
    },
    [getSvg],
  );

  const setPlaying = useCallback(
    (on: boolean) => {
      const svg = getSvg();
      if (!svg) return;
      window.clearTimeout(timer.current);

      if (on) {
        // play one cycle from the first frame, then hold the last frame
        svg.setCurrentTime(0);
        svg.unpauseAnimations();
        svg.getAnimations({ subtree: true }).forEach((a) => {
          a.currentTime = 0;
          a.play();
        });
        const hold = cycle.current - HOLD_BEFORE_END;
        if (hold > 0)
          timer.current = window.setTimeout(() => freezeAt(hold), hold);
      } else if (RESET_ON_LEAVE) {
        freezeAt(0);
      } else {
        svg.pauseAnimations();
        svg.getAnimations({ subtree: true }).forEach((a) => a.pause());
      }
    },
    [getSvg, freezeAt],
  );

  // measure the cycle and stop on the first frame before the first paint
  useLayoutEffect(() => {
    if (!show || !markup) return;
    const svg = getSvg();
    if (!svg) return;
    cycle.current = measureCycle(svg);
    freezeAt(0);
  }, [show, markup, getSvg, freezeAt]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // every hook is above this line
  if (!show) return null;

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };

  const onLeave = () => {
    px.set(0); // springs back to flat
    py.set(0);
    setPlaying(false);
  };

  return (
    <div
      className="group relative lg:translate-x-20"
      onMouseEnter={() => setPlaying(true)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {/* tech rings: scale in first, then spin */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, delay: 0.3, ease: EASE }}
      >
        {/* soft glow behind the lock, lights up on hover */}
        <div className="absolute inset-[30%] rounded-full bg-[#4d9cff]/0 blur-3xl transition-colors duration-700 group-hover:bg-[#4d9cff]/25" />

        {/* ping on hover */}
        <div className="absolute inset-[22%] rounded-full border border-[#4d9cff]/50 opacity-0 group-hover:animate-ping group-hover:opacity-100 motion-reduce:hidden" />

        <TechRings />
      </motion.div>

      {/* tilt layer: follows the cursor */}
      <motion.div style={{ rotateX, rotateY, transformPerspective: 900 }}>
        {/* the padlock fades and scales in */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 2.5 }}
          transition={{ duration: 1.2, delay: 0.5, ease: EASE }}
        >
          <div
            ref={wrapRef}
            role="img"
            aria-label="Animated padlock illustration"
            className="relative flex aspect-square w-full items-center justify-center [&>svg]:h-full [&>svg]:w-full"
            dangerouslySetInnerHTML={{ __html: markup ?? "" }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
