"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { rolarPara } from "@/lib/jornada";

gsap.registerPlugin(ScrollTrigger);

// Roteiro: capa vinho que abre ao meio com o scroll e revela notas do manifesto.
export default function Roteiro() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add({ mov: "(prefers-reduced-motion: no-preference)", mob: "(max-width: 767px)" }, (ctx) => {
      if (!ctx.conditions?.mov) return;
      const mob = !!ctx.conditions.mob;
      // Celular: o livro é bem maior que a tela e a "câmera" passa da capa → página esquerda → página direita.
      // Progresso (0–1) em que o livro conta como aberto e em que a leitura da página esquerda está centrada.
      const ABERTO = mob ? 0.3 : 0.55;
      const LEITURA = mob ? 0.31 : 1;
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          id: "livro", // usado por "Pular" (lib/jornada.ts) para chegar ao livro fechado
          trigger: el,
          start: "top top",
          end: mob ? "+=480%" : "+=300%",
          scrub: 1.4,
          pin: true,
          onUpdate: (s) => {
            const livro = el.querySelector<HTMLElement>("[data-book]");
            if (!livro) return;
            if (s.progress > ABERTO) livro.dataset.aberto = "1";
            else delete livro.dataset.aberto;
            livro.setAttribute("aria-expanded", String(s.progress > ABERTO));
          },
        },
      });

      // Clicar (ou Enter/Espaço) no livro fechado o abre, percorrendo a mesma rolagem que o scroll faria.
      const livro = el.querySelector<HTMLElement>("[data-book]");
      // Fechado: abre. Aberto: página esquerda fecha o livro; página direita segue para a próxima seção.
      const abrir = (e?: Event) => {
        const st = ScrollTrigger.getById("livro");
        if (!st) return;
        if (st.progress <= ABERTO) return rolarPara(st.start + (st.end - st.start) * LEITURA, mob ? 2.4 : 3.4);
        const r = livro?.getBoundingClientRect();
        const x = e instanceof MouseEvent ? e.clientX : null;
        if (r && x !== null && x < r.left + r.width / 2) return rolarPara(st.start, 3);
        if (mob && st.progress < 0.9) return rolarPara(st.end, 2.4); // celular: página direita = avançar a leitura
        const prox = document.getElementById("areas");
        if (prox) rolarPara(prox, 1.8);
      };
      const teclar = (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          abrir(); // teclado: abre; já aberto, segue adiante
        }
      };
      if (mob) {
        // 0–1: capa abre e a câmera vai à página esquerda · 1–1.5: leitura · 1.5–2.6: desliza à página direita · notas entram
        tl.fromTo("[data-wrap]", { xPercent: -25 }, { xPercent: 25, duration: 1 }, 0)
          .fromTo("[data-cover]", { rotateY: 0 }, { rotateY: -180, duration: 1 }, 0)
          .to("[data-wrap]", { xPercent: -25, duration: 1.1 }, 1.9)
          .from("[data-nota]", { opacity: 0, y: 40, scale: 0.85, rotate: 0, stagger: 0.25, duration: 0.6, ease: "back.out(1.6)" }, 2.5);
      } else {
        tl.fromTo("[data-wrap]", { xPercent: -25 }, { xPercent: 0, duration: 1 }, 0)
          .fromTo("[data-cover]", { rotateY: 0 }, { rotateY: -180, duration: 1 }, 0)
          .from("[data-nota]", { opacity: 0, y: 40, scale: 0.85, rotate: 0, stagger: 0.18, duration: 0.5, ease: "back.out(1.6)" }, 0.85);
      }

      livro?.addEventListener("click", abrir);
      livro?.addEventListener("keydown", teclar);
      return () => {
        livro?.removeEventListener("click", abrir);
        livro?.removeEventListener("keydown", teclar);
      };
    });

    // Movimento reduzido: livro já aberto, sem pin
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set("[data-cover]", { rotateY: -180 });
      const livro = el.querySelector<HTMLElement>("[data-book]");
      livro?.removeAttribute("role");
      livro?.removeAttribute("tabindex");
      livro?.removeAttribute("aria-label");
      livro?.removeAttribute("aria-expanded");
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      id="roteiro"
      className="relative grid h-svh place-items-center overflow-hidden px-4 sm:px-16"
    >
      <div
        data-book
        role="button"
        tabIndex={0}
        aria-label="Abrir o livro Roteiro"
        aria-expanded={false}
        className="absolute left-1/2 top-1/2 aspect-[3/2] -translate-x-1/2 -translate-y-1/2 w-[176vw] motion-reduce:w-[min(94vw,62rem)] md:w-[min(94vw,62rem)] [perspective:2200px]"
      >
        <div data-wrap className="absolute inset-0 [transform-style:preserve-3d]">
          {/* Página direita: notas do manifesto */}
          <div className="pagina absolute right-0 top-0 grid h-full w-1/2 place-content-center gap-[3%] rounded-r-2xl p-[5%] shadow-2xl">
            <Nota bg="var(--color-limao)" rot={-4}>Mas quantas dessas histórias conhecemos?</Nota>
            <Nota bg="var(--color-creme)" rot={3} className="ml-[8%]">Todo jovem merece explorar novos caminhos.</Nota>
            <Nota bg="var(--color-rosa)" rot={-2} className="text-palco">Bambolina, um palco de possibilidades.</Nota>
          </div>

          {/* Capa: frente vinho, verso = página esquerda */}
          <div data-cover className="absolute right-0 top-0 h-full w-1/2 origin-left [transform-style:preserve-3d]">
            <div className="cortina absolute inset-0 grid place-content-center justify-items-center gap-[6%] rounded-r-2xl p-[8%] shadow-2xl [backface-visibility:hidden]">
              {/* eslint-disable-next-line @next/next/no-img-element -- SVG vetorial da marca */}
              <img src="/brand/logo/reduzida-rosa.svg" alt="Bambolina" className="w-[85%]" />
              <p className="font-display text-sm motion-reduce:text-[clamp(0.55rem,1.3vw,0.9rem)] md:text-[clamp(0.55rem,1.3vw,0.9rem)] font-bold uppercase tracking-[0.3em] text-creme">
                Roteiro
              </p>
            </div>
            <div className="pagina absolute inset-0 grid place-content-center rounded-l-2xl p-[8%] shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <p className="font-swung text-[1.9rem] motion-reduce:text-[clamp(1.1rem,3.2vw,2.6rem)] md:text-[clamp(1.1rem,3.2vw,2.6rem)] leading-tight">
                O teatro começa muito antes de as cortinas se abrirem.
              </p>
              <p className="mt-[5%] text-lg motion-reduce:text-[clamp(0.6rem,1.3vw,1rem)] md:text-[clamp(0.6rem,1.3vw,1rem)] leading-snug">
                Existe um mundo inteiro acontecendo por trás do palco.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Nota({
  children,
  bg,
  rot,
  className = "",
}: {
  children: React.ReactNode;
  bg: string;
  rot: number;
  className?: string;
}) {
  return (
    <p
      data-nota
      className={`nota font-swung text-[1.4rem] motion-reduce:text-[clamp(0.8rem,1.9vw,1.5rem)] md:text-[clamp(0.8rem,1.9vw,1.5rem)] leading-tight text-vinho ${className}`}
      style={{ background: bg, rotate: `${rot}deg` }}
    >
      {children}
    </p>
  );
}
