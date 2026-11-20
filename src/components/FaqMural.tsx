"use client";

import { useId, useState } from "react";

/**
 * FAQ em forma de mural de abas (referência: jogo "abra os bastidores"):
 * cada pergunta é uma aba colada em cima da resposta; clicar levanta a aba (dobradiça no topo) e revela o papel.
 * Acessível: a aba é um botão com aria-expanded; a resposta fica fora da árvore de acessibilidade enquanto coberta.
 */
const CORES = [
  { bg: "var(--color-limao)", fg: "var(--color-palco)" },
  { bg: "var(--color-rosa)", fg: "var(--color-palco)" },
  { bg: "var(--color-laranja)", fg: "var(--color-palco)" },
  { bg: "var(--color-azul)", fg: "#ffffff" },
  { bg: "var(--color-creme)", fg: "var(--color-vinho)" },
  { bg: "var(--color-vinho)", fg: "var(--color-creme)" },
];
const ROT = [-1.1, 0.8, -0.6, 1.0, -0.9, 0.7, -0.5, 1.1, -0.8];

export default function FaqMural({ itens }: { itens: [string, string][] }) {
  const [aberta, setAberta] = useState<number | null>(null); // só uma pergunta aberta por vez
  const id = useId();
  const alternar = (i: number) => setAberta((a) => (a === i ? null : i));

  return (
    <div className="faq-quadro">
      <div className="faq-titulo">
        <h3>Perguntas frequentes</h3>
        <svg aria-hidden viewBox="0 0 300 16" preserveAspectRatio="none" className="faq-onda">
          <path d="M2 8q9-9 18 0t18 0 18 0 18 0 18 0 18 0 18 0 18 0 18 0 18 0 18 0 18 0 18 0 18 0 18 0 18 0" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>

      <ul className="faq-grade">
        {itens.map(([q, a], i) => {
          const cor = CORES[i % CORES.length];
          const aberto = aberta === i;
          return (
            <li
              key={q}
              className="faq-card"
              data-aberto={aberto || undefined}
              onClick={aberto ? (e) => !(e.target as Element).closest("button") && alternar(i) : undefined} // clicar no papel aberto também fecha
              style={{ "--bg": cor.bg, "--fg": cor.fg, "--rot": `${ROT[i % ROT.length]}deg` } as React.CSSProperties}
            >
              <div id={`${id}-r${i}`} role="region" aria-labelledby={`${id}-b${i}`} className="faq-resposta">
                <p>{a}</p>
                <button type="button" className="faq-fechar" tabIndex={aberto ? 0 : -1} aria-label={`Fechar a resposta: ${q}`} onClick={() => alternar(i)}>
                  baixar aba ↓
                </button>
              </div>
              <button
                type="button"
                id={`${id}-b${i}`}
                className="faq-aba"
                aria-expanded={aberto}
                aria-controls={`${id}-r${i}`}
                onClick={() => alternar(i)}
              >
                <span className="faq-frente">
                  <span className="faq-pergunta">{q}</span>
                  <span className="faq-dica" aria-hidden>
                    levante a aba ↑
                  </span>
                </span>
                <span className="faq-verso" aria-hidden>
                  {q}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
