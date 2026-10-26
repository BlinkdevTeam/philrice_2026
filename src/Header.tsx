import { useEffect, useRef, useState } from "react";
import { NAV } from "./nav";

export default function Header() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = (e: Event) => {
      const t = e.target;
      const y =
        t === document
          ? window.scrollY
          : t instanceof HTMLElement
            ? t.scrollTop
            : window.scrollY;

      const delta = y - lastY.current;

      setScrolled(y > 80);

      if (y < 80) {
        setHidden(false);
      } else if (delta > 6) {
        setHidden(true);
      } else if (delta < -6) {
        setHidden(false);
      }

      lastY.current = y;
    };

    document.addEventListener("scroll", onScroll, {
      passive: true,
      capture: true,
    });

    return () => document.removeEventListener("scroll", onScroll, true);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color,box-shadow] duration-300 ease-out motion-reduce:transition-none ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${
        scrolled
          ? // phones get a solid bar; the blur is switched off for them in App.css
            "border-b border-white/10 bg-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-xl backdrop-saturate-150 max-md:bg-[#121314]"
          : "border-b border-transparent bg-transparent shadow-none"
      }`}
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-3 text-xl font-bold">
          <span
            className="h-10 w-10 rounded-lg border border-white/20 bg-white/10"
            aria-hidden="true"
          />
          PHILRICE
        </a>

        <nav className="hidden gap-10 md:flex" aria-label="Primary">
          {NAV.map((n) => (
            <a
              key={n}
              href={`#${n.toLowerCase()}`}
              className="text-white/70 transition-colors hover:text-white"
            >
              {n}
            </a>
          ))}
        </nav>

        <a
          href="https://ugnaypalay.philrice.gov.ph/registration-form/ABCDefgHI"
          className="rounded-lg border border-white/20 bg-white/10 px-5 py-2.5 font-semibold backdrop-blur transition-colors hover:bg-white/20"
        >
          Register
        </a>
      </div>
    </header>
  );
}
