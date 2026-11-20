"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AREAS } from "@/data/areas";
import { congelar, irParaPasso, jornada, pularJornada } from "@/lib/jornada";
import { LADO } from "./backstage/geometria";

const MQ = "(prefers-reduced-motion: reduce)";
function assinarMovimento(cb: () => void) {
  const m = matchMedia(MQ);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
}

/**
 * Interface da jornada pelo backstage: legenda da estação atual, navegação pelas 9 áreas e "pular".
 * Fica oculta (CSS) enquanto o 3D não estiver ativo. Com movimento reduzido vira uma lista estática das 9 áreas.
 */
export default function HeroJornada() {
  const [passo, setPasso] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [fim, setFim] = useState(false); // cortina fechando, depois da estação 9
  const [congelada, setCongelada] = useState(false);
  const reduzido = useSyncExternalStore(assinarMovimento, () => matchMedia(MQ).matches, () => false);

  useEffect(() => {
    const p = (e: Event) => setPasso((e as CustomEvent<number>).detail);
    const h = (e: Event) => setHover((e as CustomEvent<number | null>).detail);
    const f = (e: Event) => setFim((e as CustomEvent<boolean>).detail);
    const c = (e: Event) => setCongelada((e as CustomEvent<boolean>).detail);
    window.addEventListener("bambolina:congelada", c);
    try {
      if (localStorage.getItem("bambolina:congelada") === "1") congelar(true, false);
    } catch {}
    window.addEventListener("bambolina:passo", p);
    window.addEventListener("bambolina:hover", h);
    window.addEventListener("bambolina:fecha", f);
    return () => {
      window.removeEventListener("bambolina:fecha", f);
      window.removeEventListener("bambolina:congelada", c);
      window.removeEventListener("bambolina:passo", p);
      window.removeEventListener("bambolina:hover", h);
    };
  }, []);

  const atual = passo >= 1 && !fim ? AREAS[passo - 1] : null;
  const dica = hover !== null && hover + 1 !== passo ? AREAS[hover] : null;

  if (reduzido) {
    return (
      <nav data-jornada aria-label="As 9 áreas" className="jornada-estatica">
        <ul>
          {AREAS.map((a) => (
            <li key={a.area}>
              <a href="#areas">{a.area}</a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <div data-jornada className="jornada">
      {/* legenda da estação atual */}
      <div className="jornada-legenda" aria-live="polite" data-lado={atual ? LADO[passo - 1] : undefined}>
        {atual && (
          <div key={passo} className="jornada-card" style={{ "--cor": atual.bg, "--ink": atual.ink } as React.CSSProperties}>
            <p className="jornada-num">
              <span>{String(passo).padStart(2, "0")}/09</span> {atual.estacao}
            </p>
            <h2 className="jornada-titulo">{atual.area}</h2>
            <p className="jornada-desc">{atual.desc}</p>
            {passo === 9 && (
              <a href="#contato" className="jornada-cta">
                Leve a Bambolina para sua escola
              </a>
            )}
          </div>
        )}
      </div>
      {!atual && !fim && !congelada && (
        <p className="jornada-dica-scroll">
          <span aria-hidden>↓</span> Role para atravessar os bastidores
        </p>
      )}

      {/* navegação pelas 9 áreas */}
      <nav aria-label="Estações do backstage" className="jornada-nav">
        {!congelada && (<>
        <button type="button" className="jornada-ponto jornada-inicio" aria-label="Voltar ao início do backstage" aria-current={passo === 0 && !fim} onClick={() => irParaPasso(0)}>
          <span aria-hidden>●</span>
        </button>
        {AREAS.map((a, i) => (
          <button
            key={a.area}
            type="button"
            className="jornada-ponto"
            style={{ "--cor": a.bg, "--ink": a.ink } as React.CSSProperties}
            aria-label={`${i + 1} ${a.area}`}
            title={`Ir para ${a.area}`}
            aria-current={passo === i + 1 ? "step" : undefined}
            data-ativo={(passo === i + 1 && !fim) || undefined}
            data-hover={hover === i || undefined}
            onClick={() => irParaPasso(i + 1)}
          >
            <span className="jornada-n">{i + 1}</span>{" "}
            <span className="jornada-nome">{a.area}</span>
          </button>
        ))}
        <button type="button" className="jornada-ponto jornada-inicio" aria-label="Fechar a cortina" title="Fechar a cortina" aria-current={fim} onClick={() => irParaPasso(jornada.total)}>
          <span aria-hidden>●</span>
        </button>
        <button type="button" className="jornada-pular" onClick={pularJornada}>
          Pular <span aria-hidden>↓</span>
        </button>
        </>)}
        <button
          type="button"
          className="jornada-trava"
          aria-pressed={congelada}
          aria-label={congelada ? "Descongelar a experiência 3D" : "Congelar a experiência 3D: a rolagem vai direto ao conteúdo"}
          title={congelada ? "Descongelar a experiência" : "Congelar a experiência (rolar direto ao conteúdo)"}
          onClick={() => congelar(!congelada)}
        >
          <svg aria-hidden viewBox="0 0 24 24" className="jornada-cadeado">
            <rect x="5" y="11" width="14" height="10" rx="2.5" />
            <path d={congelada ? "M8 11V8a4 4 0 0 1 8 0v3" : "M8 11V8a4 4 0 0 1 7.5-2"} />
            <path d="M12 15.5v2" />
          </svg>
          {congelada && <span>Descongelar</span>}
        </button>
      </nav>

      {dica && (
        <p className="jornada-hint" aria-hidden>
          Clique para ver <strong>{dica.area}</strong>
        </p>
      )}
    </div>
  );
}
