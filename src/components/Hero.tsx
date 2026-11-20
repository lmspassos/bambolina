"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroBackstage from "./HeroBackstage";
import { BACKSTAGE_3D } from "@/data/flags";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    // Movimento completo
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // A cortina espera uma interação (clique, tecla, rolagem ou toque) para abrir.
      const tl = gsap.timeline({ paused: true });
      tl.to("[data-convite]", { opacity: 0, y: -20, duration: 0.5, ease: "power2.in" }, 0)
        .set("[data-convite]", { display: "none" })
        .from("[data-logo]", { opacity: 0, scale: 0.85, duration: 1.4, ease: "power3.out" }, 0.3)
        .to("[data-cortina='esq']", { xPercent: -100, duration: 1.8, ease: "power3.inOut" }, 0.3)
        .to("[data-cortina='dir']", { xPercent: 100, duration: 1.8, ease: "power3.inOut" }, 0.3)
        .from("[data-reveal]", { opacity: 0, y: 24, duration: 0.9, stagger: 0.12, ease: "power2.out" }, 1.6);

      let aberta = false;
      const abrir = (e?: Event) => {
        if (aberta) return;
        aberta = true;
        el.dataset.aberta = "1";
        window.dispatchEvent(new Event("bambolina:cortina")); // acende o backstage 3D
        e?.preventDefault();
        e?.stopPropagation();
        tl.play();
      };
      // Antes de abrir, qualquer rolagem/tecla só abre a cortina (capture: antes do Lenis).
      const bloqueia = (e: Event) => {
        if (aberta) return;
        if (e instanceof KeyboardEvent && (e.key === "Tab" || e.key === "Shift")) return;
        abrir(e);
      };
      const evs = ["wheel", "touchmove", "keydown"] as const;
      evs.forEach((n) => window.addEventListener(n, bloqueia, { capture: true, passive: false }));
      el.querySelector("[data-convite]")?.addEventListener("click", abrir);

      // Spotlight segue o cursor
      const setX = gsap.quickTo(el, "--mx", { duration: 0.6, ease: "power3" });
      const setY = gsap.quickTo(el, "--my", { duration: 0.6, ease: "power3" });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        setX(((e.clientX - r.left) / r.width) * 100);
        setY(((e.clientY - r.top) / r.height) * 100);
      };
      el.addEventListener("pointermove", move);

      // Parallax ao rolar (só no Hero original; com o backstage 3D o Hero fica fixo e o scroll conduz a câmera)
      if (!BACKSTAGE_3D) {
        gsap.to("[data-content]", {
          yPercent: -12,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((s) => {
          gsap.to(s, {
            yPercent: -Number(s.dataset.speed),
            rotate: Number(s.dataset.rot ?? 0),
            ease: "none",
            scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
          });
        });
      }

      // Palavra rotativa: luz → som → cenário → figurino → futuro
      const words = [
        { t: "luz", c: "var(--color-limao)" },
        { t: "som", c: "var(--color-laranja)" },
        { t: "cenário", c: "var(--color-azul)" },
        { t: "figurino", c: "var(--color-rosa)" },
        { t: "futuro", c: "var(--color-creme)" },
      ];
      const word = el.querySelector<HTMLElement>("[data-word]")!;
      let i = 0;
      const timer = setInterval(() => {
        gsap.to(word, {
          yPercent: -120,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete() {
            i = (i + 1) % words.length;
            word.textContent = words[i].t;
            word.style.color = words[i].c;
            gsap.fromTo(word, { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.45, ease: "power3.out" });
          },
        });
      }, 2400);

      return () => {
        evs.forEach((n) => window.removeEventListener(n, bloqueia, { capture: true }));
        el.removeEventListener("pointermove", move);
        clearInterval(timer);
      };
    });

    // Movimento reduzido: frase estática
    mm.add("(prefers-reduced-motion: reduce)", () => {
      const word = el.querySelector<HTMLElement>("[data-word]");
      if (word) word.textContent = "possibilidades";
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      id="inicio"
      className="relative isolate flex min-h-svh items-center justify-center overflow-hidden"
      style={
        {
          "--mx": 50,
          "--my": 40,
          background:
            "radial-gradient(60rem 60rem at calc(var(--mx) * 1%) calc(var(--my) * 1%), rgb(255 255 255 / 0.14), transparent 60%), var(--color-palco)",
        } as React.CSSProperties
      }
    >
      {/* Backstage 3D (liga/desliga em src/data/flags.ts); se falhar, valem as formas abaixo */}
      <HeroBackstage />

      {/* Formas de marca flutuando (parallax); escondidas quando o backstage 3D está ativo */}
      <div data-shapes aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <Shape name="iluminacao" color="var(--color-limao)" className="left-[8%] top-[14%] w-32 md:w-52" speed={30} rot={-20} />
        <Shape name="cenografia" color="var(--color-azul)" className="right-[10%] top-[18%] w-24 md:w-40" speed={55} />
        <Shape name="direcao" color="var(--color-rosa)" className="bottom-[12%] left-[14%] w-28 md:w-44" speed={45} rot={15} />
        <Shape name="sonoplastia" color="var(--color-laranja)" className="bottom-[16%] right-[12%] w-28 md:w-44" speed={25} rot={-10} />
      </div>

      {/* Conteúdo */}
      <div data-content className="flex w-full flex-col items-center px-6 text-center">
        <h1 data-logo className="w-[min(70vw,32rem)]">
          {/* eslint-disable-next-line @next/next/no-img-element -- SVG vetorial da marca */}
          <img src="/brand/logo/completa-rosa.svg" alt="Bambolina — teatro além do palco" className="w-full" />
        </h1>
      </div>

      {/* Texto de apoio e CTA, no rodapé da primeira dobra */}
      <div data-apoio className="absolute inset-x-0 bottom-[7svh] flex flex-col items-center gap-4 px-6 text-center">
        <p className="hidden font-swung text-3xl leading-tight motion-reduce:block md:text-5xl">
          O teatro é só o começo de <span className="text-limao">possibilidades</span>
        </p>
        <p data-reveal className="max-w-xl text-base text-creme/80 md:text-lg">
          Uma experiência teatral imersiva e interativa que revela aos jovens as possibilidades que existem dentro e fora do palco.
        </p>
        <a
          data-reveal
          href="#contato"
          className="rounded-full bg-limao px-7 py-3 font-display text-sm font-bold text-palco transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-limao"
        >
          Leve a Bambolina para sua escola
        </a>
      </div>

      {/* Convite sobre a cortina fechada: clique/rolagem/tecla abre */}
      <button
        type="button"
        data-convite
        aria-label="Abrir a cortina"
        className="absolute inset-0 z-30 flex cursor-pointer flex-col items-center justify-center gap-6 px-6 text-center motion-reduce:hidden"
      >
        <span className="font-swung text-3xl leading-tight md:text-5xl">
          O teatro é só o começo de
          <span className="block h-[1.25em] overflow-hidden">
            <span data-word className="inline-block text-limao">luz</span>
          </span>
        </span>
        <span className="animate-pulse font-display text-xs font-bold uppercase tracking-[0.3em] text-creme/70">
          Clique para abrir a cortina
        </span>
      </button>

      {/* Cortina que abre na entrada (decorativa) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-20">
        <div data-cortina="esq" className="cortina absolute inset-y-0 left-0 w-1/2" />
        <div data-cortina="dir" className="cortina absolute inset-y-0 right-0 w-1/2" />
        <div className="absolute inset-x-0 top-0">
          <div className="bambolina-base" />
          <div className="bambolina" />
        </div>
      </div>
    </section>
  );
}

function Shape({
  name,
  color,
  className,
  speed,
  rot,
}: {
  name: string;
  color: string;
  className: string;
  speed: number;
  rot?: number;
}) {
  return (
    <div
      data-speed={speed}
      data-rot={rot}
      className={`mask-svg absolute aspect-square opacity-90 ${className}`}
      style={{ "--c": color, "--src": `url(/brand/elementos/elemento-${name}.svg)` } as React.CSSProperties}
    />
  );
}
