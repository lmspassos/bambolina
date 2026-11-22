"use client";

import { useEffect, useRef, useState } from "react";

// Cada forma representa UMA área da marca (docs/02, seção 5); o rótulo do hover é sempre o nome da própria forma.
const NOME = {
  iluminacao: "Iluminação",
  cenografia: "Cenografia",
  direcao: "Direção",
  sonoplastia: "Sonoplastia",
  contrarregragem: "Contrarregragem",
} as const;
type Forma = keyof typeof NOME;
const SHAPES = Object.keys(NOME) as Forma[];
// [fundo, forma]
const PAIRS = [
  ["var(--color-rosa)", "var(--color-palco)"],
  ["var(--color-limao)", "var(--color-azul)"],
  ["var(--color-laranja)", "var(--color-vinho)"],
  ["var(--color-azul)", "var(--color-creme)"],
  ["var(--color-vinho)", "var(--color-rosa)"],
  ["var(--color-creme)", "var(--color-laranja)"],
];
// [fundo, texto] do rótulo do hover (todos com contraste legível)
const ROTULO = [
  ["var(--color-rosa)", "var(--color-palco)"],
  ["var(--color-limao)", "var(--color-palco)"],
  ["var(--color-laranja)", "var(--color-palco)"],
  ["var(--color-azul)", "#ffffff"],
  ["var(--color-creme)", "var(--color-vinho)"],
  ["var(--color-vinho)", "var(--color-creme)"],
];

type Rotulo = { texto: string; bg: string; fg: string; lado: "left" | "right" };

function Tiles({ offset, lado, aoEntrar }: { offset: number; lado: "left" | "right"; aoEntrar: (el: HTMLElement, lado: "left" | "right", forma: Forma) => void }) {
  return (
    <>
      {Array.from({ length: 12 }, (_, i) => {
        const [bg, fg] = PAIRS[(i + offset) % PAIRS.length];
        const shape = SHAPES[(i * 2 + offset) % SHAPES.length];
        return (
          <div
            key={i}
            className="pointer-events-auto aspect-square shrink-0 rounded-lg p-2"
            style={{ background: bg }}
            onPointerEnter={(e) => e.pointerType === "mouse" && aoEntrar(e.currentTarget, lado, shape)}
          >
            <div
              className="mask-svg size-full"
              style={{ "--c": fg, "--src": `url(/brand/elementos/elemento-${shape}.svg)` } as React.CSSProperties}
            />
          </div>
        );
      })}
    </>
  );
}

function Coluna({ side, offset, aoEntrar, aoSair }: { side: "left" | "right"; offset: number; aoEntrar: (el: HTMLElement, lado: "left" | "right", forma: Forma) => void; aoSair: () => void }) {
  return (
    <div
      aria-hidden
      onPointerLeave={aoSair}
      className={`pointer-events-none fixed top-0 z-40 hidden h-dvh w-11 overflow-hidden sm:block md:w-14 ${side === "left" ? "left-0" : "right-0"}`}
    >
      <div className={`coluna-track flex flex-col gap-2 p-1 ${side === "right" ? "reverso" : ""}`}>
        <Tiles offset={offset} lado={side} aoEntrar={aoEntrar} />
        <Tiles offset={offset} lado={side} aoEntrar={aoEntrar} />
      </div>
    </div>
  );
}

export default function EdgeColumns() {
  const [rotulo, setRotulo] = useState<Rotulo | null>(null);
  const [visivel, setVisivel] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const tile = useRef<HTMLElement | null>(null);

  // O rótulo acompanha o quadrado enquanto ele sobe/desce sob o cursor.
  const seguir = () => {
    const t = tile.current;
    const b = box.current;
    if (t && b) {
      const r = t.getBoundingClientRect();
      b.style.top = `${r.top + r.height / 2}px`;
      if (b.dataset.lado === "left") b.style.left = `${r.right + 10}px`;
      else b.style.right = `${window.innerWidth - r.left + 10}px`;
      raf.current = requestAnimationFrame(seguir);
    }
  };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const aoEntrar = (el: HTMLElement, lado: "left" | "right", forma: Forma) => {
    const [bg, fg] = ROTULO[Math.floor(Math.random() * ROTULO.length)];
    const texto = NOME[forma];
    tile.current = el;
    setRotulo({ texto, bg, fg, lado });
    setVisivel(true);
    cancelAnimationFrame(raf.current);
    const b = box.current;
    if (b) {
      b.style.left = "auto";
      b.style.right = "auto";
      b.dataset.lado = lado;
    }
    seguir();
  };
  const aoSair = () => {
    tile.current = null;
    cancelAnimationFrame(raf.current);
    setVisivel(false);
  };

  return (
    <>
      <div aria-hidden className="ribalta" />
      <Coluna side="left" offset={0} aoEntrar={aoEntrar} aoSair={aoSair} />
      <Coluna side="right" offset={3} aoEntrar={aoEntrar} aoSair={aoSair} />
      <div
        ref={box}
        aria-hidden
        className="pointer-events-none fixed z-[41] hidden -translate-y-1/2 sm:block"
      >
        {rotulo && (
          <span
            className={`block whitespace-nowrap rounded-full px-4 py-1.5 font-swung text-2xl shadow-xl transition duration-200 motion-reduce:transition-none ${visivel ? "scale-100 opacity-100" : "scale-75 opacity-0"} ${rotulo.lado === "left" ? "origin-left" : "origin-right"}`}
            style={{ background: rotulo.bg, color: rotulo.fg, rotate: rotulo.lado === "left" ? "-3deg" : "3deg" }}
          >
            {rotulo.texto}
          </span>
        )}
      </div>
    </>
  );
}
