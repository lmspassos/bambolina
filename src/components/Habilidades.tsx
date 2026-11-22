"use client";

import { useRef, useState } from "react";
import { HABILIDADES } from "@/data/habilidades";
import Cracha from "./cracha/Cracha";

const CORES = ["var(--color-limao)", "var(--color-rosa)", "var(--color-laranja)", "var(--color-azul)"];

export default function Habilidades() {
  const [marcadas, setMarcadas] = useState<Set<number>>(new Set());
  const [nome, setNome] = useState(""); // fica só no navegador; aparece no crachá
  const [editaNome, setEditaNome] = useState(false); // easter egg: o campo só aparece ao clicar no ícone
  const campoNome = useRef<HTMLInputElement>(null);
  const miolo = useRef<HTMLDivElement>(null);
  const [recuo, setRecuo] = useState(0); // altura que o campo ocupa: o crachá a desconta para não crescer
  const [balao, setBalao] = useState(false); // toque (sem hover): mostra o balão "Suas?"
  const abreNome = (abrir: boolean) => {
    setEditaNome(abrir);
    setRecuo(abrir ? (miolo.current?.scrollHeight ?? 0) : 0);
    if (abrir) setTimeout(() => campoNome.current?.focus(), 250);
  };
  const total = HABILIDADES.length;
  const algum = marcadas.size > 0;

  const alterna = (i: number) =>
    setMarcadas((prev) => {
      const n = new Set(prev);
      if (!n.delete(i)) n.add(i);
      return n;
    });

  // Profissões ligadas às habilidades marcadas, sem repetir
  const profissoes = [...new Set([...marcadas].sort((a, b) => a - b).flatMap((i) => HABILIDADES[i].profissoes))];

  return (
    <section id="habilidades" className="relative px-4 py-16 sm:px-16 md:py-24">
      <header className="mx-auto mb-10 max-w-3xl md:mb-14 text-center">
        <p className="font-display text-xs font-bold uppercase tracking-[0.35em] text-rosa">Teatro e futuro</p>
        <h2 className="mt-3 font-display text-4xl font-extrabold leading-tight md:text-6xl">
          O que você leva <span className="font-swung font-normal text-limao">dos bastidores?</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-creme/80">
          Marque as habilidades que você já tem ou quer desenvolver, pendure o crachá e veja onde elas aparecem, no teatro e fora dele.
        </p>
      </header>

      <div className="mx-auto max-w-6xl">
      {/* só as duas caixas: o crachá se posiciona em relação a este bloco, então o aviso verde abaixo não muda o tamanho dele */}
      <div className="relative grid items-stretch gap-8 lg:grid-cols-2 lg:gap-6">
        {/* Esquerda (desktop): checklist em caderno. A coluna junto ao crachá fica livre para ele não cobrir o texto. */}
        <div className="pagina rounded-3xl p-6 shadow-2xl md:p-8 lg:order-1 lg:pr-40">
          {/* easter egg: ao passar o mouse em "Minhas" surge o balão "Suas?"; clicar nele abre o campo de nome.
              O crachá recebe a altura do campo (recuo) e não cresce junto com a caixa. */}
          <h3 className="font-swung text-3xl leading-none md:text-4xl">
            <span className="group relative inline-block" onClick={() => { setBalao(true); setTimeout(() => setBalao(false), 3500); }}>
              Minhas
              <span className={`absolute bottom-full left-0 pb-2 transition duration-200 motion-reduce:transition-none group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 ${balao || editaNome ? "visible translate-y-0 opacity-100" : "invisible translate-y-1 opacity-0"}`}>
                <button
                  type="button"
                  aria-label="Suas? Colocar seu nome no crachá"
                  aria-expanded={editaNome}
                  aria-controls="campo-nome"
                  onClick={(e) => {
                    e.stopPropagation();
                    abreNome(!editaNome);
                  }}
                  className="relative whitespace-nowrap rounded-full bg-limao px-3 py-1 font-display text-xs font-bold leading-none text-palco shadow-md after:absolute after:left-4 after:top-full after:size-0 after:border-x-[5px] after:border-t-[6px] after:border-x-transparent after:border-t-limao hover:bg-rosa focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul"
                >
                  Suas?
                </button>
              </span>
            </span>{" "}
            habilidades
          </h3>
          <div id="campo-nome" inert={!editaNome} className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${editaNome ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
            <div ref={miolo} className="overflow-hidden">
              <label className="block pb-1 pt-5">
                <span className="font-display text-sm font-bold">Seu nome no crachá</span>
                <input
                  ref={campoNome}
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  onKeyDown={(e) => e.key === "Escape" && abreNome(false)}
                  maxLength={20}
                  autoComplete="off"
                  placeholder="Como você quer ser chamado?"
                  className="mt-1.5 w-full rounded-xl border-2 border-vinho bg-creme px-4 py-2.5 font-display text-base font-bold text-vinho placeholder:font-normal placeholder:text-vinho/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul lg:max-w-72"
                />
              </label>
            </div>
          </div>
          <ul className="mt-5 divide-y divide-vinho/15">
            {HABILIDADES.map((h, i) => {
              const marcada = marcadas.has(i);
              return (
                <li key={h.nome}>
                  <label className="flex cursor-pointer items-start gap-3 py-3">
                    <input
                      type="checkbox"
                      checked={marcada}
                      onChange={() => alterna(i)}
                      className="peer sr-only"
                    />
                    <span
                      aria-hidden
                      className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md border-2 border-vinho bg-creme text-limao transition peer-checked:bg-vinho peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-azul motion-reduce:transition-none"
                    >
                      <svg viewBox="0 0 20 20" className={`size-4 fill-none stroke-current stroke-[3] [stroke-linecap:round] [stroke-linejoin:round] transition ${marcada ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}>
                        <path d="M4 11l4 4 8-9" />
                      </svg>
                    </span>
                    <span>
                      <span className="block font-display text-base font-bold leading-tight">
                        {h.nome}
                      </span>
                      <span className="mt-0.5 block text-[0.78rem] text-vinho/70">{h.areas.join(" · ")}</span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
          <div className="mt-5 flex items-center justify-between gap-4 border-t border-dashed border-vinho/40 pt-4">
            <p aria-live="polite" className="font-display text-sm font-bold">
              {marcadas.size} de {total} marcadas
            </p>
            <button
              type="button"
              onClick={() => setMarcadas(new Set())}
              className="rounded-full border-2 border-vinho px-4 py-1 font-display text-xs font-bold transition hover:bg-vinho hover:text-creme focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul"
            >
              recomeçar
            </button>
          </div>
        </div>

        {/* Centro (desktop): o crachá flutua sobre as duas caixas; no celular fica entre elas */}
        <Cracha marcadas={HABILIDADES.map((_, i) => marcadas.has(i))} nome={nome} recuo={recuo} />

        {/* Direita (desktop): pílulas das profissões ligadas ao que foi marcado */}
        <div className="flex flex-col rounded-3xl border border-creme/15 bg-vinho p-6 shadow-2xl md:p-8 lg:order-2 lg:pl-40">
          <div>
            <h3 className="font-swung text-3xl leading-none md:text-4xl">Onde isso aparece</h3>
            <p className="mt-2 text-sm text-creme/70">No teatro e fora dele.</p>
            <ul className="mt-5 flex min-h-12 flex-wrap gap-2">
              {profissoes.length === 0 && <li className="text-creme/50">As profissões ligadas às suas habilidades aparecem aqui.</li>}
              {profissoes.map((p, i) => (
                <li
                  key={p}
                  className="rounded-full px-3.5 py-1.5 font-display text-sm font-bold text-palco"
                  style={{ background: CORES[i % CORES.length] }}
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Aviso: aparece já na 1ª habilidade marcada (some se desmarcar tudo). Abaixo das duas caixas, largura total. */}
      <div
        inert={!algum}
        aria-hidden={!algum}
        className={`grid transition-[grid-template-rows,opacity,margin] duration-500 ease-out motion-reduce:transition-none ${algum ? "mt-6 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div
            className={`flex flex-col gap-4 rounded-3xl bg-limao p-6 text-palco transition-transform duration-500 ease-out motion-reduce:transition-none md:flex-row md:items-center md:justify-between md:p-8 ${algum ? "translate-y-0 scale-100" : "translate-y-6 scale-95"}`}
          >
            <div>
              <p className="font-swung text-3xl leading-tight md:text-4xl">Nenhum espetáculo acontece sozinho.</p>
              <p className="mt-1 max-w-xl text-sm md:text-base">Cada pessoa contribui de um jeito, e o resultado depende de todos os talentos juntos.</p>
            </div>
            <a href="#contato" className="shrink-0 self-start rounded-full bg-palco px-6 py-3 font-display text-sm font-bold text-limao transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palco motion-reduce:transition-none md:self-auto">
              Leve essa experiência para sua escola
            </a>
          </div>
        </div>
      </div>
      </div>

      <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-creme/60">
        A Bambolina não faz teste vocacional nem garante aptidão para uma carreira. A proposta é mostrar conexões, ampliar referências e incentivar jovens a explorar possibilidades.
      </p>
    </section>
  );
}
