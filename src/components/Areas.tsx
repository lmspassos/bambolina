"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import { AREAS } from "@/data/areas";

gsap.registerPlugin(ScrollTrigger, Draggable);

// [left %, top %, rotação °, parallax px] no desktop; no mobile os cards fluem em grade.
const LAYOUT: [number, number, number, number][] = [
  [5, 5, -4, 40],
  [38, 1, 3, 110],
  [70, 7, -2, 30],
  [9, 36, 5, 120],
  [40, 33, -5, 70],
  [71, 39, 3, 130],
  [4, 67, -3, 80],
  [38, 65, 4, 40],
  [70, 68, -4, 100],
];

export default function Areas() {
  const root = useRef<HTMLElement>(null);
  const board = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const panel = board.current;
    if (!el || !panel) return;
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      // Rotação inicial de cada card (inner), parallax no wrapper (par)
      gsap.utils.toArray<HTMLElement>("[data-drag]").forEach((card, i) => {
        gsap.set(card, { rotation: LAYOUT[i][2] });
      });

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      gsap.utils.toArray<HTMLElement>("[data-par]").forEach((par, i) => {
        gsap.fromTo(
          par,
          { y: LAYOUT[i][3] },
          { y: -LAYOUT[i][3], ease: "none", scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });

      // Entrada em cascata
      gsap.from("[data-drag]", {
        opacity: 0,
        scale: 0.8,
        y: 60,
        stagger: 0.1,
        duration: 0.7,
        ease: "back.out(1.5)",
        scrollTrigger: { trigger: panel, start: "top 70%" },
      });

      // Arrastar: o card vai para a frente e endireita
      let z = 10;
      const draggables = gsap.utils.toArray<HTMLElement>("[data-drag]").map((card, i) =>
        Draggable.create(card, {
          type: "x,y",
          bounds: panel,
          edgeResistance: 0.75,
          onPress() {
            z += 1;
            gsap.set(card.parentElement, { zIndex: z });
            gsap.to(card, { rotation: 0, scale: 1.06, duration: 0.25, ease: "power2.out", overwrite: "auto" });
          },
          onRelease() {
            gsap.to(card, { rotation: LAYOUT[i][2] * 0.6, scale: 1, duration: 0.35, ease: "power2.out", overwrite: "auto" });
          },
        })[0],
      );

      // Hover: endireita um pouco
      const cleanups: (() => void)[] = [];
      gsap.utils.toArray<HTMLElement>("[data-drag]").forEach((card, i) => {
        const on = () => gsap.to(card, { rotation: 0, scale: 1.04, duration: 0.25, overwrite: "auto" });
        const off = () => gsap.to(card, { rotation: LAYOUT[i][2], scale: 1, duration: 0.3, overwrite: "auto" });
        card.addEventListener("pointerenter", on);
        card.addEventListener("pointerleave", off);
        cleanups.push(() => {
          card.removeEventListener("pointerenter", on);
          card.removeEventListener("pointerleave", off);
        });
      });

      return () => {
        draggables.forEach((d) => d.kill());
        cleanups.forEach((fn) => fn());
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="areas" className="relative px-4 py-24 sm:px-16 md:py-32">
      <header className="mx-auto mb-14 max-w-3xl text-center">
        <p className="font-display text-xs font-bold uppercase tracking-[0.35em] text-rosa">As estações</p>
        <h2 className="mt-3 font-display text-4xl font-extrabold leading-tight md:text-6xl">
          Nove áreas. <span className="font-swung font-normal text-limao">Uma história só.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-creme/80">
          Iluminação, som, cenário, figurino… cada estação mostra um pedaço do que faz um espetáculo acontecer.
        </p>
        <p className="mt-4 hidden font-swung text-xl text-laranja md:block">↓ pegue os cards e mude de lugar</p>
      </header>

      <div className="relative mx-auto max-w-[78rem]">
        {/* base vinho inclinada (como o "quadro" da referência) */}
        <div aria-hidden className="absolute inset-0 -z-10 hidden translate-y-5 rotate-1 rounded-3xl bg-vinho md:block" />

        <div
          ref={board}
          className="planta relative rounded-3xl border border-creme/15 bg-palco p-4 md:h-[72rem] md:overflow-hidden md:p-0"
        >
          <Eixos />
          <ul className="grid grid-cols-2 gap-4 md:block">
            {AREAS.map((a, i) => (
              <li
                key={a.area}
                data-par
                className="md:absolute md:w-[23%]"
                style={{ left: `${LAYOUT[i][0]}%`, top: `${LAYOUT[i][1]}%` } as React.CSSProperties}
              >
                <article
                  data-drag
                  className="ingresso select-none bg-creme text-vinho shadow-xl md:cursor-grab md:active:cursor-grabbing"
                >
                  <div className="relative grid aspect-[16/10] place-items-center" style={{ background: a.bg }}>
                    <div
                      aria-hidden
                      className="mask-svg size-[58%]"
                      style={{ "--c": a.fg, "--src": `url(/brand/elementos/elemento-${a.shape}.svg)` } as React.CSSProperties}
                    />
                    <span className="absolute left-3 top-2 font-display text-[0.65rem] font-bold uppercase tracking-widest" style={{ color: a.ink }}>
                      Estação {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="px-4 pb-4 pt-5">
                    <h3 className="font-swung text-2xl leading-none md:text-3xl">{a.estacao}</h3>
                    <p className="mt-1 font-display text-[0.7rem] font-bold uppercase tracking-[0.25em] text-vinho/75">{a.area}</p>
                    <p className="mt-3 border-t border-dashed border-vinho/40 pt-3 text-[0.82rem] leading-snug">{a.desc}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// Números nos eixos, como numa planta de palco
function Eixos() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden font-mono text-[0.6rem] text-creme/35 md:block">
      <div className="absolute inset-x-6 top-2 flex justify-between">
        {Array.from({ length: 14 }, (_, i) => <span key={i}>{i + 1}</span>)}
      </div>
      <div className="absolute inset-y-8 left-2 flex flex-col justify-between">
        {Array.from({ length: 12 }, (_, i) => <span key={i}>{String.fromCharCode(65 + i)}</span>)}
      </div>
    </div>
  );
}
