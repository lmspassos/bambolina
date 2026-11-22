"use client";

import { useEffect, useRef, useState } from "react";
import { lenisRef } from "@/lib/jornada";

// Menu em Swung Note. No hover: oval desenhada à mão + doodle ABAIXO do link (acima era cortado pela borda da tela). CSS puro.
const DOODLES = {
  rosto: (
    <>
      <circle cx="24" cy="27" r="11" />
      <path d="M19.5 25v2.5M28.5 25v2.5M19 32q5 4.5 10 0M8 10l4 4M40 10l-4 4M24 3v6" />
    </>
  ),
  estrela: <path d="M24 5l4.5 14.5L43 24l-14.5 4.5L24 43l-4.5-14.5L5 24l14.5-4.5zM38 8c3 1 4 4 3 7" />,
  ingresso: <path d="M5 13h38v7a4 4 0 0 0 0 8v7H5v-7a4 4 0 0 0 0-8zM30 13v4M30 22v4M30 31v4M13 21h9M13 27h6" />,
  camera: (
    <>
      <rect x="5" y="14" width="38" height="25" rx="4" />
      <path d="M17 14l3-6h8l3 6" />
      <circle cx="24" cy="26" r="7" />
    </>
  ),
  refletor: (
    <>
      <rect x="15" y="4" width="18" height="10" rx="3" />
      <path d="M17 14L8 43h32L31 14M24 22v6" />
    </>
  ),
};

const LINKS: { href: string; label: string; doodle: keyof typeof DOODLES }[] = [
  { href: "#inicio", label: "experiência", doodle: "refletor" },
  { href: "#roteiro", label: "roteiro", doodle: "rosto" },
  { href: "#areas", label: "áreas", doodle: "estrela" },
  { href: "#galeria", label: "galeria", doodle: "camera" },
  { href: "#contato", label: "contratar", doodle: "ingresso" },
];

export default function Nav() {
  const [aberto, setAberto] = useState(false);
  const [pronto, setPronto] = useState(false); // hambúrguer só aparece depois que a cortina do Hero abre
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const mostra = (ms: number) => (t = setTimeout(() => setPronto(true), ms));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) mostra(0); // sem cortina animada
    const aoAbrir = () => mostra(2000); // a cortina leva ~2 s para abrir
    window.addEventListener("bambolina:cortina", aoAbrir);
    return () => {
      window.removeEventListener("bambolina:cortina", aoAbrir);
      clearTimeout(t);
    };
  }, []);

  const botao = useRef<HTMLButtonElement>(null);
  const fechar = useRef<HTMLButtonElement>(null);

  // Menu lateral aberto: trava a rolagem (Lenis), Esc fecha, foco vai ao X e volta ao botão.
  useEffect(() => {
    if (!aberto) return;
    lenisRef.current?.stop();
    fechar.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    window.addEventListener("keydown", esc);
    const btn = botao.current;
    return () => {
      window.removeEventListener("keydown", esc);
      lenisRef.current?.start();
      btn?.focus({ preventScroll: true });
    };
  }, [aberto]);

  return (
    <>
    <button
      ref={botao}
      type="button"
      aria-label="Abrir menu"
      aria-expanded={aberto}
      aria-controls="menu-lateral"
      onClick={() => setAberto(true)}
      className={`fixed left-4 top-4 z-[45] grid size-12 place-content-center gap-[5px] drop-shadow-[0_1px_4px_rgb(0_0_0/0.7)] transition-all duration-500 focus-visible:outline-2 focus-visible:outline-limao motion-reduce:transition-none md:hidden ${pronto ? "scale-100 opacity-100" : "pointer-events-none scale-50 opacity-0"}`}
      tabIndex={pronto ? 0 : -1}
      aria-hidden={!pronto}
    >
      <span aria-hidden className="h-[3px] w-6 rounded-full bg-creme" />
      <span aria-hidden className="h-[3px] w-6 rounded-full bg-limao" />
      <span aria-hidden className="h-[3px] w-4 justify-self-end rounded-full bg-rosa" />
    </button>

    <div
      aria-hidden
      onClick={() => setAberto(false)}
      className={`fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm transition-opacity duration-300 motion-reduce:transition-none md:hidden ${aberto ? "opacity-100" : "pointer-events-none opacity-0"}`}
    />
    <aside
      id="menu-lateral"
      aria-label="Menu"
      inert={!aberto}
      className={`cortina fixed inset-y-0 left-0 z-[71] flex w-[min(84vw,22rem)] flex-col px-7 pb-8 pt-5 shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none md:hidden ${aberto ? "translate-x-0" : "-translate-x-full invisible"}`}
      style={aberto ? undefined : { transitionProperty: "translate, visibility", transitionDelay: "0s, 0.5s" }}
    >
      <button
        ref={fechar}
        type="button"
        aria-label="Fechar menu"
        onClick={() => setAberto(false)}
        className="grid size-12 shrink-0 place-items-center self-start focus-visible:outline-2 focus-visible:outline-limao"
      >
        <svg aria-hidden viewBox="0 0 24 24" className="size-6 fill-none stroke-creme stroke-[2.5] [stroke-linecap:round]">
          <path d="M5 5l14 14M19 5L5 19" />
        </svg>
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element -- SVG vetorial da marca */}
      <img src="/brand/logo/reduzida-rosa.svg" alt="Bambolina" className="mx-auto mt-4 w-44" />
      <nav aria-label="Principal (celular)" className="mt-10">
        <ul className="space-y-2 font-swung text-4xl">
          {LINKS.map((l, i) => (
            <li
              key={l.href}
              className={`transition-all duration-500 motion-reduce:transition-none ${aberto ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"}`}
              style={{ transitionDelay: aberto ? `${200 + i * 90}ms` : "0ms" }}
            >
              <a
                href={l.href}
                onClick={() => {
                  lenisRef.current?.start();
                  setAberto(false);
                }}
                className="flex items-center gap-4 rounded-xl px-2 py-3 hover:text-limao focus-visible:text-limao focus-visible:outline-2 focus-visible:outline-limao active:text-limao"
              >
                <svg aria-hidden viewBox="0 0 48 48" className="size-9 shrink-0 fill-none stroke-limao stroke-2 [stroke-linecap:round] [stroke-linejoin:round]">
                  {DOODLES[l.doodle]}
                </svg>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>

    <nav
      aria-label="Principal"
      className="fixed left-1/2 top-4 z-[45] hidden -translate-x-1/2 rounded-full bg-palco/70 px-7 py-2.5 backdrop-blur-md md:block"
    >
      <ul className="flex items-center gap-7 font-swung text-xl md:gap-10 md:text-2xl">
        {LINKS.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              className="group relative inline-block px-1 transition-colors hover:text-limao focus-visible:text-limao focus-visible:outline-none"
            >
              <svg
                aria-hidden
                viewBox="0 0 48 48"
                className="absolute left-1/2 top-[calc(100%+0.1rem)] size-9 -translate-x-1/2 scale-50 -rotate-12 fill-none stroke-limao stroke-2 opacity-0 transition duration-300 [stroke-linecap:round] [stroke-linejoin:round] group-hover:scale-100 group-hover:rotate-0 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:rotate-0 group-focus-visible:opacity-100"
              >
                {DOODLES[l.doodle]}
              </svg>
              <svg
                aria-hidden
                viewBox="0 0 100 40"
                preserveAspectRatio="none"
                className="absolute -inset-x-3 -inset-y-1 h-[calc(100%+0.5rem)] w-[calc(100%+1.5rem)] fill-none stroke-limao stroke-2 [stroke-linecap:round]"
              >
                <path
                  d="M9 23C5 9 40 4 62 5c28 1 36 9 30 20-5 11-40 13-62 11C12 35 3 29 10 17"
                  vectorEffect="non-scaling-stroke"
                  className="[stroke-dasharray:330] [stroke-dashoffset:330] transition-[stroke-dashoffset] duration-500 group-hover:[stroke-dashoffset:0] group-focus-visible:[stroke-dashoffset:0]"
                />
              </svg>
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
    </>
  );
}
