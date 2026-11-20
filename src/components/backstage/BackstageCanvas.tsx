"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { criarBackstage, type Backstage } from "./cena";
import type { InfoSinal } from "./estacoes2";
import { AREAS } from "@/data/areas";
import { jornada, lenisRef, irParaPasso } from "@/lib/jornada";
import { N_EST } from "./geometria";

/** Trecho de rolagem (em "passos") depois da estação 9 em que a cortina se fecha. */
const FECHA = 0.7;
const TOTAL = N_EST + FECHA;

const HEX: Record<string, string> = {
  rosa: "#ff1ec7", limao: "#ddf230", laranja: "#ff5938", azul: "#1f6bed", vinho: "#750015", creme: "#f2f1e8", palco: "#1d1d1b",
};
const hex = (v: string) => {
  const m = /--color-(\w+)/.exec(v);
  return m ? HEX[m[1]] ?? "#f2f1e8" : v;
};

/**
 * Canvas do backstage 3D + jornada: o Hero fica fixo (pin) enquanto o scroll leva a câmera por 9 estações,
 * uma por área. Marca a <section> com data-backstage="on"; se falhar, remove a marca e o Hero volta ao normal.
 */
export default function BackstageCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const secao = canvas?.closest("section");
    if (!canvas || !secao) return;

    const reduzido = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const leve =
      matchMedia("(max-width: 767px)").matches ||
      matchMedia("(pointer: coarse)").matches ||
      (navigator.hardwareConcurrency ?? 8) <= 4;

    const fonte = getComputedStyle(document.documentElement).getPropertyValue("--font-swung-note").trim();
    const info: InfoSinal[] = AREAS.map((a, i) => ({
      numero: String(i + 1).padStart(2, "0"),
      nome: a.area,
      bg: hex(a.bg),
      fg: hex(a.fg),
      shape: a.shape,
      fonte,
    }));

    let cena: Backstage | null = null;
    const limpezas: (() => void)[] = [];
    const desmontar = () => {
      // ao tirar o pin a página encolhe: volta ao topo para o visitante não cair no meio de outra seção
      if (jornada.st && window.scrollY > 0) {
        if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true, force: true });
        else window.scrollTo(0, 0);
      }
      delete secao.dataset.backstage;
      delete secao.dataset.fase;
      secao.style.removeProperty("--intro");
      secao.style.removeProperty("--fecha");
      delete secao.dataset.fim;
      jornada.st = null;
      limpezas.forEach((f) => f());
      limpezas.length = 0;
      cena?.dispose();
      cena = null;
      window.dispatchEvent(new CustomEvent("bambolina:passo", { detail: 0 }));
    };

    try {
      cena = criarBackstage(canvas, {
        leve,
        reduzido,
        aoFalhar: desmontar,
        aoEstacao: (p) => window.dispatchEvent(new CustomEvent("bambolina:passo", { detail: p })),
        aoHover: (e) => window.dispatchEvent(new CustomEvent("bambolina:hover", { detail: e })),
        info,
      });
    } catch {
      // sem WebGL: fica o fallback (formas flutuantes)
      return;
    }
    const c = cena;
    // gancho de depuração (?bd-debug): permite saltar entre estações em capturas de tela
    if (location.search.includes("bd-debug")) (window as unknown as { __bd: Backstage }).__bd = c;
    secao.dataset.backstage = "on";
    secao.dataset.fase = "intro";

    if (reduzido || secao.dataset.aberta) c.acender();
    const aoAbrir = () => c.acender();
    window.addEventListener("bambolina:cortina", aoAbrir);
    limpezas.push(() => window.removeEventListener("bambolina:cortina", aoAbrir));

    if (!reduzido) {
      // Hero fixo durante a jornada
      jornada.passos = N_EST;
      jornada.total = TOTAL;
      let ultimoFim = false;
      const st = ScrollTrigger.create({
        trigger: secao,
        start: "top top",
        end: () => "+=" + Math.round(window.innerHeight * 0.85 * TOTAL),
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: 10, // o pin do Hero deve ser medido antes dos pins das seções seguintes (ex.: livro do Roteiro)
        onUpdate: (s) => {
          const pt = s.progress * TOTAL;
          const p = Math.min(N_EST, pt);
          c.setPasso(p);
          const fecha = Math.max(0, Math.min(1, (pt - N_EST) / FECHA));
          secao.style.setProperty("--fecha", fecha.toFixed(3));
          if (fecha > 0.85) secao.dataset.fim = "1";
          else delete secao.dataset.fim;
          const fim = fecha > 0.5;
          if (fim !== ultimoFim) {
            ultimoFim = fim;
            window.dispatchEvent(new CustomEvent("bambolina:fecha", { detail: fim })); // ponto final da navegação
          }
          const intro = Math.max(0, 1 - p * 1.7);
          secao.style.setProperty("--intro", intro.toFixed(3));
          secao.dataset.fase = intro < 0.04 ? "jornada" : "intro";
        },
      });
      jornada.st = st;
      // as seções abaixo já mediram suas posições antes deste pin existir: refaz o cálculo
      requestAnimationFrame(() => ScrollTrigger.refresh());
      limpezas.push(() => {
        st.kill();
        if (jornada.st === st) jornada.st = null;
      });

      // encaixe suave na estação mais próxima quando o scroll para
      let tm: ReturnType<typeof setTimeout> | undefined;
      const lenis = lenisRef.current;
      const aoRolar = () => {
        clearTimeout(tm);
        tm = setTimeout(() => {
          if (jornada.navegando || !jornada.st || !jornada.st.isActive) return;
          const p = jornada.st.progress * TOTAL;
          // depois da estação 9 encaixa na cortina aberta (9) ou totalmente fechada (TOTAL)
          const alvo = p > N_EST ? (p - N_EST > FECHA / 2 ? TOTAL : N_EST) : Math.round(p);
          if (Math.abs(p - alvo) > 0.04) irParaPasso(alvo, 0.9);
        }, 170);
      };
      lenis?.on("scroll", aoRolar);
      limpezas.push(() => {
        clearTimeout(tm);
        lenis?.off("scroll", aoRolar);
      });

      const io = new IntersectionObserver(([e]) => c.setAtivo(e.isIntersecting));
      io.observe(secao);
      limpezas.push(() => io.disconnect());

      const apontar = (e: PointerEvent | MouseEvent) => {
        const r = secao.getBoundingClientRect();
        c.apontar(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
      };
      const mover = (e: PointerEvent) => {
        if (e.pointerType === "touch") return;
        apontar(e);
      };
      const sair = () => c.sairPonteiro();
      // clicar numa estação (objeto 3D) leva a câmera até ela
      const clicar = (e: MouseEvent) => {
        const alvo = e.target as Element | null;
        if (alvo?.closest("a,button,summary,input,[data-jornada]")) return;
        apontar(e);
        const est = c.estacaoSob();
        if (est !== null) irParaPasso(est + 1);
        if ((e as PointerEvent).pointerType === "touch") c.sairPonteiro();
      };
      secao.addEventListener("pointermove", mover);
      secao.addEventListener("pointerleave", sair);
      secao.addEventListener("click", clicar);
      limpezas.push(() => {
        secao.removeEventListener("pointermove", mover);
        secao.removeEventListener("pointerleave", sair);
        secao.removeEventListener("click", clicar);
      });
    }

    return () => {
      desmontar();
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="h-full w-full" />;
}
