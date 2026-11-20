"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// Anel que segue o ponteiro e cresce sobre links/botões. Não esconde o cursor nativo (acessibilidade).
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ring.current;
    if (!el || !window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;

    gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 });
    const x = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });

    const move = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
      gsap.to(el, { opacity: 1, duration: 0.2, overwrite: "auto" });
      const hot = (e.target as Element | null)?.closest("a,button,[data-cursor]");
      gsap.to(el, { scale: hot ? 2.2 : 1, duration: 0.25, overwrite: "auto" });
    };
    const leave = () => gsap.to(el, { opacity: 0, duration: 0.2 });

    window.addEventListener("pointermove", move);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div
      ref={ring}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60] size-7 rounded-full border-2 border-limao mix-blend-difference"
    />
  );
}
