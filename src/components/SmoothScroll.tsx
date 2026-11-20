"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { lenisRef, rolarPara } from "@/lib/jornada";

gsap.registerPlugin(ScrollTrigger);

// Lenis conduzido pelo ticker do GSAP, para ScrollTrigger e scroll suave ficarem sincronizados.
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Ao recarregar (inclusive Ctrl+F5) o navegador restaura a rolagem anterior e a página abriria no meio
    // (ex.: no livro). A experiência começa sempre na cortina fechada, no topo — a menos que haja #âncora.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (!location.hash) window.scrollTo(0, 0);
    const noTopo = (e: PageTransitionEvent) => {
      if (e.persisted && !location.hash) window.scrollTo(0, 0); // voltar/avançar via cache de página
    };
    window.addEventListener("pageshow", noTopo);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => window.removeEventListener("pageshow", noTopo);

    const lenis = new Lenis({ autoRaf: false });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Links de âncora (menu, botões, "pular"): rolagem animada em vez de salto seco.
    // A duração cresce com a distância (limitada) e o foco vai para a seção ao chegar (teclado/leitor de tela).
    const aoClicar = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href^='#']") as HTMLAnchorElement | null;
      const id = a?.getAttribute("href");
      if (!a || !id || id === "#") return;
      const alvo = document.querySelector<HTMLElement>(id);
      if (!alvo) return;
      e.preventDefault();
      // O Hero fica pinado (seu topo é sempre 0): "#inicio" vai ao topo absoluto da página.
      const dist = id === "#inicio" ? window.scrollY : Math.abs(alvo.getBoundingClientRect().top);
      rolarPara(id === "#inicio" ? 0 : alvo,Math.min(2.8, 0.9 + dist / 3500), {
        easing: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
        onComplete: () => {
          history.replaceState(null, "", id);
          if (!alvo.hasAttribute("tabindex")) alvo.setAttribute("tabindex", "-1");
          alvo.focus({ preventScroll: true });
        },
      });
    };
    document.addEventListener("click", aoClicar);

    return () => {
      window.removeEventListener("pageshow", noTopo);
      document.removeEventListener("click", aoClicar);
      gsap.ticker.remove(tick);
      lenisRef.current = null;
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
