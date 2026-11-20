import type Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Ponte entre o scroll suave (Lenis), o pin do Hero e a interface da jornada. */
export const lenisRef: { current: Lenis | null } = { current: null };
/** `passos` = nº de estações; `total` = passos + trecho final em que a cortina se fecha. */
export const jornada: { st: ScrollTrigger | null; passos: number; total: number; navegando: boolean } = { st: null, passos: 9, total: 9, navegando: false };

/**
 * Rolagem programática suave (menu, "pular", abrir o livro, estações). Enquanto dura, `jornada.navegando`
 * é true para o encaixe automático nas estações NÃO sequestrar o movimento (em PCs lentos ele disparava no meio).
 */
export function rolarPara(alvo: number | HTMLElement, dur = 1.5, extra: { easing?: (t: number) => number; onComplete?: () => void } = {}) {
  const lenis = lenisRef.current;
  if (!lenis) {
    if (typeof alvo === "number") window.scrollTo({ top: alvo, behavior: "smooth" });
    else alvo.scrollIntoView({ behavior: "smooth" });
    extra.onComplete?.();
    return;
  }
  jornada.navegando = true;
  const fim = () => {
    jornada.navegando = false;
  };
  setTimeout(fim, dur * 1000 + 800); // segurança caso o usuário interrompa a rolagem
  lenis.scrollTo(alvo, {
    duration: dur,
    easing: extra.easing,
    onComplete: () => {
      fim();
      extra.onComplete?.();
    },
  });
}

/** Leva a câmera/scroll até o passo p (0 = vista do Hero, 1..9 = estações). */
export function irParaPasso(p: number, dur = 1.5) {
  const st = jornada.st;
  if (!st) return;
  const y = st.start + (Math.max(0, Math.min(jornada.total, p)) / jornada.total) * (st.end - st.start);
  rolarPara(y, dur);
}

/** Sai da jornada e vai direto ao livro (Roteiro), no ponto em que ele ainda está FECHADO. */
export function pularJornada() {
  const livro = ScrollTrigger.getById("livro");
  const y = livro ? livro.start : jornada.st ? jornada.st.end + 4 : null;
  if (y === null) return;
  const st = jornada.st;
  const lenis = lenisRef.current;
  if (st && lenis && st.isActive) {
    // Sem percorrer a jornada: salta ao palco final (estação 9), a cortina se fecha e a rolagem segue ao livro.
    const y9 = st.start + (jornada.passos / jornada.total) * (st.end - st.start);
    if (window.scrollY < y9 - 2) {
      jornada.navegando = true;
      lenis.scrollTo(y9, { immediate: true, force: true });
      ScrollTrigger.update();
    }
    rolarPara(y, 2.2);
    return;
  }
  jornada.navegando = true;
  if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
  else window.scrollTo(0, y);
  ScrollTrigger.update();
  setTimeout(() => {
    jornada.navegando = false;
  }, 400);
}
