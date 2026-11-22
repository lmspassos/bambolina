"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { FOTOS, src, type Foto } from "@/data/galeria";
import { lenisRef } from "@/lib/jornada";

// Galeria de 20 imagens ilustrativas.
// Carrossel em colagem que anda sozinho (3 fotos por vez no desktop, 2 no tablet, 1 no celular), com setas e arrastar
// (segurar e puxar). "Ver galeria" abre as 20 em grade; clicar numa foto abre a visualização grande com legenda.
const TOTAL = FOTOS.length;
const INTERVALO = 3200;
const ATRASO_SAIDA = 320; // ms: duração da animação de fechar (grade)
const VOO_IDA = 650; // ms: a foto "pega" no carrossel voa até o tamanho grande
const VOO_VOLTA = 460; // ms: e volta ao mesmo lugar ao fechar

// Onde estava a miniatura clicada (centro, largura visual e giro), para a foto grande sair dela e voltar a ela
type Origem = { cx: number; cy: number; w: number; rot: number; i: number };

// Giro, deslocamento vertical, escala e camada de cada foto na colagem (determinístico, sem sorteio a cada render)
const ruido = (i: number, k: number) => ((Math.sin(i * 12.9898 + k * 78.233) * 43758.5453) % 1 + 1) % 1 - 0.5;
const COLAGEM = FOTOS.map((_, i) => ({
  r: Math.round(ruido(i, 1) * 16 * 10) / 10, // ±8°
  y: Math.round(ruido(i, 2) * 48), // ±24 px
  s: Math.round((1 + ruido(i, 3) * 0.14) * 100) / 100, // ±7 %
  z: 1 + Math.floor((ruido(i, 4) + 0.5) * 5),
}));

type Modo = "fechado" | "grade" | "foto";

const movimentoReduzido = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
function useReduzido() {
  return useSyncExternalStore(
    (cb) => {
      const m = matchMedia("(prefers-reduced-motion: reduce)");
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    movimentoReduzido,
    () => false,
  );
}

function useColunas() {
  return useSyncExternalStore(
    (cb) => {
      const ms = [matchMedia("(min-width:640px)"), matchMedia("(min-width:1024px)")];
      ms.forEach((m) => m.addEventListener("change", cb));
      return () => ms.forEach((m) => m.removeEventListener("change", cb));
    },
    () => (matchMedia("(min-width:1024px)").matches ? 3 : matchMedia("(min-width:640px)").matches ? 2 : 1),
    () => 3,
  );
}

function Pilula({ f }: { f: Foto }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-limao px-3 py-1 font-display text-xs font-bold text-palco">
      {f.shape && (
        <span
          aria-hidden
          className="mask-svg size-3.5"
          style={{ "--c": "var(--color-palco)", "--src": `url(/brand/elementos/elemento-${f.shape}.svg)` } as React.CSSProperties}
        />
      )}
      {f.tag}
    </span>
  );
}

function Cartao({ i, onPrev, onNext, onFechar, fecharRef, saindo }: { i: number; onPrev: () => void; onNext: () => void; onFechar: () => void; fecharRef: React.Ref<HTMLButtonElement>; saindo: boolean }) {
  const f = FOTOS[i];
  const seta = "grid size-10 place-items-center rounded-full bg-creme text-azul transition hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-limao motion-reduce:transition-none";
  return (
    <div role="region" aria-label="Legenda da foto" aria-live="polite" className={`${saindo ? "invisible" : ""} w-full rounded-3xl bg-azul p-6 text-white shadow-2xl lg:w-80 lg:shrink-0`}>
      <div className="flex items-start justify-between gap-3">
        <Pilula f={f} />
        <button ref={fecharRef} type="button" aria-label="Fechar foto" onClick={onFechar} className="grid size-9 shrink-0 place-items-center rounded-full bg-laranja text-palco transition hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-limao motion-reduce:transition-none">
          <svg aria-hidden viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-[3] [stroke-linecap:round]"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>
      <h3 className="mt-4 font-swung text-4xl leading-none">{f.titulo}</h3>
      <p className="mt-3 text-base leading-snug text-white/90">{f.texto}</p>
      <div className="mt-5 flex items-center gap-2">
        <button type="button" aria-label="Foto anterior" onClick={onPrev} className={seta}>
          <svg aria-hidden viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-[3] [stroke-linecap:round] [stroke-linejoin:round]"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <button type="button" aria-label="Próxima foto" onClick={onNext} className={seta}>
          <svg aria-hidden viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-[3] [stroke-linecap:round] [stroke-linejoin:round]"><path d="M9 5l7 7-7 7" /></svg>
        </button>
        <span className="ml-auto font-display text-sm font-bold text-white/80">{i + 1} / {TOTAL}</span>
      </div>
    </div>
  );
}

/** Miniatura em moldura de papel (WebP leve; as fotos são 3:2, então a moldura é uniforme). */
function Impressa({ f }: { f: Foto }) {
  return (
    <span className="block bg-creme p-1.5 shadow-[0_6px_18px_rgb(0_0_0/0.5)]">
      {/* eslint-disable-next-line @next/next/no-img-element -- export estático, imagens já otimizadas em WebP */}
      <img src={src(f.n)} alt={f.alt} width={640} height={427} loading="lazy" decoding="async" draggable={false} className="block aspect-[3/2] w-full bg-palco object-cover" />
    </span>
  );
}

const pre = (n: number) => {
  const im = new Image();
  im.src = src(n, true);
};

/** Foto grande: a miniatura (já em cache) aparece na hora e a versão de 1280 px surge por cima quando carregar. */
function FotoGrande({ f, dir }: { f: Foto; dir: number }) {
  const [pronta, setPronta] = useState(false);
  return (
    <span style={{ "--d": dir } as React.CSSProperties} className={`relative block aspect-[3/2] ${dir ? "gal-troca" : ""} w-[min(calc(100vw-3rem),calc((70dvh-1rem)*1.5))] lg:w-[min(70vw,1180px,calc((82dvh-1rem)*1.5))]`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- export estático */}
      <img src={src(f.n)} alt={f.alt} className="absolute inset-0 size-full object-cover" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src(f.n, true)} alt="" aria-hidden onLoad={() => setPronta(true)} className={`absolute inset-0 size-full object-cover ${pronta ? "opacity-100" : "opacity-0"}`} />
    </span>
  );
}

const nomeFoto = (f: Foto) => `${f.titulo}: ${f.alt}`;
const foco = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-limao";

function Seta({ lado, onClick }: { lado: "esq" | "dir"; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={lado === "esq" ? "Fotos anteriores" : "Próximas fotos"}
      onClick={onClick}
      className={`absolute top-1/2 z-40 grid cursor-pointer size-11 -translate-y-1/2 place-items-center rounded-full border border-creme/25 bg-palco/55 text-creme backdrop-blur-sm transition hover:scale-110 hover:bg-palco/85 motion-reduce:transition-none ${lado === "esq" ? "left-2 md:left-4" : "right-2 md:right-4"} ${foco}`}
    >
      <svg aria-hidden viewBox="0 0 24 24" className="size-5 fill-none stroke-current stroke-[2.5] [stroke-linecap:round] [stroke-linejoin:round]">
        <path d={lado === "esq" ? "M14.5 5l-7 7 7 7" : "M9.5 5l7 7-7 7"} />
      </svg>
    </button>
  );
}

export default function Galeria() {
  const reduzido = useReduzido();
  const colunas = useColunas();
  const [modo, setModo] = useState<Modo>("fechado");
  const [exibe, setExibe] = useState<Modo>("fechado"); // o que está montado (continua montado durante a animação de saída)
  const [aberto, setAberto] = useState(false); // liga/desliga as animações de entrada e saída
  const [foto, setFoto] = useState(0);
  const [dir, setDir] = useState(0); // sentido da última troca por seta (0 = abertura, sem deslize)
  const [gradeMontada, setGradeMontada] = useState(false); // a grade fica montada por baixo da foto grande (não reinicia ao voltar)
  const [voando, setVoando] = useState(false); // foto voltando à miniatura: fundo e legenda saem na hora
  const daGrade = useRef(false);
  const origemEl = useRef<HTMLElement | null>(null);
  const gatilho = useRef<HTMLElement | null>(null);
  const dialogoGrade = useRef<HTMLDivElement>(null);
  const dialogoFoto = useRef<HTMLDivElement>(null);
  const fecharFoto = useRef<HTMLButtonElement>(null);
  const fecharGrade = useRef<HTMLButtonElement>(null);
  const miniaturas = useRef<(HTMLButtonElement | null)[]>([]);
  const saida = useRef<number>(0);
  const origem = useRef<Origem | null>(null);
  const quadro = useRef<HTMLSpanElement>(null); // moldura da foto grande (é ela que voa)
  const fotoRef = useRef(0);
  const exibeRef = useRef<Modo>("fechado");
  const [escondida, setEscondida] = useState<number | null>(null); // miniatura "pega": some do carrossel enquanto a foto está aberta
  const [hover, setHover] = useState<number | null>(null); // foto sob o mouse (ganha o foco no lugar da do centro)

  // ---------- carrossel ----------
  // A faixa tem 3 cópias da lista (60 fotos) e começa na cópia do meio; sai da cópia do meio → volta ±TOTAL sem animar.
  const [pos, setPos] = useState(TOTAL);
  const [semTransicao, setSemTransicao] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [parado, setParado] = useState(false); // mouse/foco em cima
  const [visivel, setVisivel] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState(true);
  const [dx, setDx] = useState(0); // deslocamento (px) enquanto o usuário segura e puxa
  const [passos, setPassos] = useState(0); // o mesmo deslocamento, em "fotos" (decide qual está no centro durante o puxão)
  const [arrastando, setArrastando] = useState(false);
  const raiz = useRef<HTMLElement>(null);
  const regiao = useRef<HTMLDivElement>(null);
  const puxar = useRef<{ x0: number; id: number; moved: boolean } | null>(null);
  const bloqueiaClique = useRef(false);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisivel(e.isIntersecting));
    io.observe(raiz.current!);
    const aba = () => setAbaAtiva(!document.hidden);
    document.addEventListener("visibilitychange", aba);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", aba);
    };
  }, []);

  const andando = !reduzido && !pausado && !parado && visivel && abaAtiva && modo === "fechado";
  useEffect(() => {
    if (!andando) return;
    const t = setInterval(() => setPos((p) => (p < 3 * TOTAL - 6 ? p + 1 : p)), INTERVALO);
    return () => clearInterval(t);
  }, [andando]);

  const volta = (p: number) => (p >= 2 * TOTAL ? p - TOTAL : p < TOTAL ? p + TOTAL : p);
  const normaliza = () => {
    setSemTransicao(true);
    setPos(volta);
    requestAnimationFrame(() => requestAnimationFrame(() => setSemTransicao(false)));
  };
  const fimDaFaixa = (e: React.TransitionEvent) => {
    if (e.target === e.currentTarget && (pos >= 2 * TOTAL || pos < TOTAL)) normaliza();
  };
  // sem animação (movimento reduzido) não há transitionend: já normaliza ao mover
  const ir = (d: number) =>
    setPos((p) => {
      const n = Math.min(3 * TOTAL - 6, Math.max(4, p + d));
      return reduzido ? volta(n) : n;
    });

  // Segurar e puxar (mouse, caneta e toque; no toque a rolagem vertical da página continua livre)
  const passoPx = () => {
    const el = regiao.current!;
    const cs = getComputedStyle(el);
    return el.clientWidth / (parseFloat(cs.getPropertyValue("--n")) + parseFloat(cs.getPropertyValue("--o")));
  };
  const aoDescer = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    puxar.current = { x0: e.clientX, id: e.pointerId, moved: false };
  };
  const aoMover = (e: React.PointerEvent) => {
    const p = puxar.current;
    if (!p) return;
    const d = e.clientX - p.x0;
    if (!p.moved) {
      if (Math.abs(d) < 6) return;
      p.moved = true;
      regiao.current?.setPointerCapture(p.id);
      setArrastando(true);
      setHover(null);
    }
    setDx(d);
    setPassos(d / passoPx());
  };
  const aoSoltar = (e: React.PointerEvent) => {
    const p = puxar.current;
    puxar.current = null;
    if (!p?.moved) return;
    bloqueiaClique.current = true;
    setTimeout(() => (bloqueiaClique.current = false), 60);
    const d = e.clientX - p.x0;
    const passo = passoPx();
    let k = Math.round(-d / passo);
    if (k === 0 && Math.abs(d) > passo * 0.15) k = d < 0 ? 1 : -1; // puxão curto já avança uma foto
    setArrastando(false);
    setDx(0);
    setPassos(0);
    ir(k);
  };

  // ---------- visualização (grade e foto) ----------
  const mudaModo = (m: Modo, atraso = ATRASO_SAIDA) => {
    setModo(m);
    window.clearTimeout(saida.current);
    if (m !== "fechado") {
      setExibe(m);
      setAberto(true);
    } else {
      setAberto(false);
      saida.current = window.setTimeout(() => {
        setExibe("fechado");
        setEscondida(null);
        setGradeMontada(false);
      }, reduzido ? 0 : atraso);
    }
  };
  useEffect(() => () => window.clearTimeout(saida.current), []);
  useEffect(() => { fotoRef.current = foto; }, [foto]);
  useEffect(() => { exibeRef.current = exibe; }, [exibe]);

  // A foto grande sai da miniatura clicada (zoom da moldura inteira, com o mesmo giro) e volta a ela ao fechar
  const capturaOrigem = (el: HTMLElement, i: number) => {
    const fr = el.firstElementChild as HTMLElement;
    const b = fr.getBoundingClientRect();
    const cs = getComputedStyle(el);
    origem.current = { cx: b.left + b.width / 2, cy: b.top + b.height / 2, w: fr.offsetWidth * (parseFloat(cs.scale) || 1), rot: parseFloat(cs.rotate) || 0, i };
  };
  const voo = (el: HTMLElement, o: Origem, ida: boolean) => {
    const t = el.getBoundingClientRect();
    const tr = `translate(${o.cx - (t.left + t.width / 2)}px, ${o.cy - (t.top + t.height / 2)}px) rotate(${o.rot}deg) scale(${o.w / el.offsetWidth})`;
    if (ida) {
      el.style.transition = "none";
      el.style.transform = tr;
      void el.offsetWidth; // força o layout: o próximo estilo anima a partir daqui
      el.style.transition = `transform ${VOO_IDA}ms cubic-bezier(0.2, 0.8, 0.2, 1)`;
      el.style.transform = "none";
    } else {
      el.style.transition = `transform ${VOO_VOLTA}ms cubic-bezier(0.55, 0, 0.35, 1)`;
      el.style.transform = tr;
    }
  };
  useLayoutEffect(() => {
    if (exibe === "foto" && origem.current && quadro.current && !reduzido) voo(quadro.current, origem.current, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exibe]);
  // Fim da foto grande: volta à grade (que continua montada, sem reiniciar) ou fecha tudo
  const encerraFoto = (paraGrade: boolean) => {
    window.clearTimeout(saida.current);
    setVoando(false);
    setEscondida(null);
    if (paraGrade) {
      setModo("grade");
      setExibe("grade");
    } else {
      setModo("fechado");
      setAberto(false);
      setExibe("fechado");
      setGradeMontada(false);
    }
  };
  // A foto voa de volta ao lugar exato da miniatura (na grade: onde ela está agora; no carrossel: onde estava ao abrir)
  const voltarDaFoto = () => {
    const i = fotoRef.current;
    const paraGrade = daGrade.current;
    let o: Origem | null = null;
    if (paraGrade) {
      const el = miniaturas.current[i];
      if (el) {
        capturaOrigem(el, i);
        o = origem.current;
      }
    } else if (origem.current && origem.current.i === i) {
      // a foto clicada pode ter ido para o centro do carrossel: lê onde a miniatura está agora
      const el = origemEl.current;
      if (el?.isConnected) capturaOrigem(el, i);
      o = origem.current;
    }
    if (o && quadro.current && !reduzido) {
      setVoando(true);
      voo(quadro.current, o, false);
      saida.current = window.setTimeout(() => encerraFoto(paraGrade), VOO_VOLTA + 40);
    } else encerraFoto(paraGrade);
  };

  const lembraGatilho = () => {
    if (modo === "fechado") gatilho.current = document.activeElement as HTMLElement | null;
  };
  const abrirGrade = () => {
    lembraGatilho();
    daGrade.current = false;
    setGradeMontada(true);
    mudaModo("grade");
  };
  const abrirFoto = (i: number, deGrade: boolean, el: HTMLElement) => {
    lembraGatilho();
    daGrade.current = deGrade;
    setGradeMontada(deGrade);
    capturaOrigem(el, i);
    origemEl.current = deGrade ? null : el;
    setDir(0);
    setEscondida(i);
    pre(FOTOS[i].n);
    setFoto(i);
    mudaModo("foto");
  };
  const vai = (d: number) => {
    const i = (fotoRef.current + d + TOTAL) % TOTAL;
    fotoRef.current = i;
    setDir(d);
    setFoto(i);
    setEscondida(i);
    // na grade: já deixa a miniatura da foto atual à vista (escondido sob o fundo), para a volta cair no lugar certo
    if (daGrade.current) miniaturas.current[i]?.scrollIntoView({ block: "nearest" });
  };
  const voltar = () => (modo === "foto" ? voltarDaFoto() : mudaModo("fechado"));

  useEffect(() => {
    if (modo === "fechado") return;
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") voltar();
      else if (modo === "foto" && e.key === "ArrowRight") vai(1);
      else if (modo === "foto" && e.key === "ArrowLeft") vai(-1);
      else if (e.key === "Tab") {
        // mantém o Tab dentro do diálogo do topo (a foto grande, ou a grade)
        const topo = modo === "foto" ? dialogoFoto.current : dialogoGrade.current;
        if (!topo) return;
        const itens = [...topo.querySelectorAll<HTMLElement>("button")];
        if (!itens.length) return;
        const primeiro = itens[0], ultimo = itens[itens.length - 1];
        if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
        else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
      }
    };
    window.addEventListener("keydown", tecla);
    lenisRef.current?.stop();
    return () => {
      window.removeEventListener("keydown", tecla);
      lenisRef.current?.start();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modo]);

  // foco: entra no diálogo; ao voltar à grade, na miniatura que estava aberta; ao fechar tudo, no gatilho
  useEffect(() => {
    if (modo === "foto") fecharFoto.current?.focus();
    else if (modo === "grade") (daGrade.current ? miniaturas.current[foto] : fecharGrade.current)?.focus();
    else gatilho.current?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modo]);

  const slides = [...FOTOS, ...FOTOS, ...FOTOS];
  const centro = ((Math.round(pos - passos) + Math.floor((colunas - 1) / 2)) % TOTAL + TOTAL) % TOTAL;
  const anim = aberto ? "gal-entra" : "gal-sai";

  return (
    <section ref={raiz} id="galeria" className="relative px-4 py-16 sm:px-8 md:py-24">
      <header className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
        <p className="font-display text-xs font-bold uppercase tracking-[0.35em] text-rosa">Galeria</p>
        <h2 className="mt-3 font-display text-4xl font-extrabold leading-tight md:text-6xl">
          A experiência <span className="font-swung font-normal text-limao">por dentro.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-balance text-lg text-creme/80">Clique numa foto para ver de perto e descobrir o que acontece em cada momento.</p>
      </header>

      {/* Carrossel em colagem (referência "Repository of Remnants"): fotos que se sobrepõem um pouco, cada uma com giro,
          altura e escala próprios; a que recebe o mouse sobe, se endireita e cresce. Anda sozinho; pausa com o mouse/foco
          em cima, no botão de pausa e fora da tela. Setas e "segurar e puxar" avançam à mão. */}
      <div
        role="region"
        aria-roledescription="carrossel"
        aria-label="Fotos da experiência"
        onPointerEnter={() => setParado(true)}
        onPointerLeave={() => setParado(false)}
        onFocusCapture={() => setParado(true)}
        onBlurCapture={() => setParado(false)}
        className="relative mx-auto max-w-7xl"
      >
        <div
          ref={regiao}
          onPointerDown={aoDescer}
          onPointerMove={aoMover}
          onPointerUp={aoSoltar}
          onPointerCancel={aoSoltar}
          onClickCapture={(e) => {
            if (bloqueiaClique.current) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          className={`touch-pan-y select-none [mask-image:linear-gradient(90deg,transparent,#000_3.5%,#000_96.5%,transparent)] overflow-x-clip [--n:1] [--o:0] sm:[--n:2] sm:[--o:0.2] lg:[--n:3] lg:[--o:0.22] ${arrastando ? "cursor-grabbing" : "cursor-grab"}`}
        >
          <ul
            onTransitionEnd={fimDaFaixa}
            className={`flex py-10 [translate:calc(var(--pos)*-100%/(var(--n)+var(--o))_+_var(--dx))] ${semTransicao || arrastando ? "" : "transition-[translate] duration-[800ms] ease-[cubic-bezier(0.65,0,0.35,1)]"} motion-reduce:transition-none`}
            style={{ "--pos": pos, "--dx": `${dx}px` } as React.CSSProperties}
          >
            {slides.map((f, k) => {
              const i = k % TOTAL;
              const real = k >= TOTAL && k < 2 * TOTAL; // só a cópia do meio entra na ordem de Tab e no leitor de tela
              const c = COLAGEM[i];
              const emFoco = i === (hover !== null && !arrastando ? hover : centro); // por padrão a do meio; com o mouse, a que está sob ele
              return (
                <li
                  key={k}
                  aria-hidden={real ? undefined : true}
                  className="z-(--z) shrink-0 basis-[calc(100%/(var(--n)+var(--o))*(1+var(--o)))] [margin-right:calc(-100%/(var(--n)+var(--o))*var(--o))]"
                  style={{ "--z": emFoco ? 60 : c.z, opacity: escondida === i && exibe !== "fechado" ? 0 : 1 } as React.CSSProperties}
                  onPointerEnter={(e) => { if (e.pointerType === "mouse") { setHover(i); pre(f.n); } }}
                  onPointerLeave={() => setHover(null)}
                >
                  <button
                    type="button"
                    tabIndex={real ? 0 : -1}
                    aria-label={nomeFoto(f)}
                    onClick={(e) => { abrirFoto(i, false, e.currentTarget); const d = k - (pos + Math.floor((colunas - 1) / 2)); if (d) ir(d); /* a clicada vira a central */ }}
                    onFocus={() => { setHover(i); pre(f.n); }}
                    onBlur={() => setHover(null)}
                    className={`block w-full [cursor:inherit] [translate:0_var(--y)] [rotate:var(--r)] [scale:var(--s)] [filter:brightness(var(--b))] transition-[rotate,scale,translate,filter] duration-500 ease-out motion-reduce:transition-none ${foco}`}
                    style={{ "--r": emFoco ? "0deg" : `${c.r}deg`, "--y": emFoco ? "0px" : `${c.y}px`, "--s": emFoco ? 1.14 : Math.round(c.s * 90) / 100, "--b": emFoco ? 1 : 0.78 } as React.CSSProperties}
                  >
                    <Impressa f={f} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <Seta lado="esq" onClick={() => ir(-1)} />
        <Seta lado="dir" onClick={() => ir(1)} />
      </div>

      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={abrirGrade}
          className={`rounded-full bg-limao px-8 py-3.5 font-display text-base font-bold text-palco transition hover:scale-105 motion-reduce:transition-none ${foco}`}
        >
          Ver galeria
        </button>
        {!reduzido && (
          <button
            type="button"
            aria-pressed={pausado}
            aria-label={pausado ? "Retomar carrossel" : "Pausar carrossel"}
            onClick={() => setPausado((v) => !v)}
            className={`grid size-12 place-items-center rounded-full border-2 border-creme/40 text-creme transition hover:border-limao hover:text-limao motion-reduce:transition-none ${foco}`}
          >
            <svg aria-hidden viewBox="0 0 24 24" className="size-4 fill-current">{pausado ? <path d="M7 4l13 8-13 8z" /> : <path d="M6 4h4v16H6zM14 4h4v16h-4z" />}</svg>
          </button>
        )}
      </div>

      {/* Grade com as 20 fotos (entra e sai com animação; continua montada por baixo da foto grande) */}
      {(exibe === "grade" || (exibe === "foto" && gradeMontada)) && (
        <div
          ref={dialogoGrade}
          role="dialog"
          aria-modal="true"
          aria-label={`Galeria com ${TOTAL} fotos`}
          inert={exibe === "foto"}
          data-lenis-prevent
          className={`fixed inset-0 z-[90] overflow-y-auto overscroll-contain bg-palco/95 backdrop-blur-sm ${aberto ? "gal-fundo-entra" : "gal-fundo-sai"}`}
          onClick={(e) => e.target === e.currentTarget && voltar()}
        >
          <div className={`mx-auto max-w-7xl px-4 pb-10 sm:px-8 ${anim}`} onClick={(e) => e.target === e.currentTarget && voltar()}>
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-palco/90 py-4 backdrop-blur">
              <h3 className="font-swung text-3xl md:text-4xl">Galeria <span className="font-display text-sm font-bold text-creme/60">· {TOTAL} fotos</span></h3>
              <button ref={fecharGrade} type="button" onClick={() => mudaModo("fechado")} className={`rounded-full bg-limao px-5 py-2 font-display text-sm font-bold text-palco ${foco}`}>
                Fechar galeria
              </button>
            </div>
            <ul className="mt-4 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
              {FOTOS.map((f, i) => (
                <li key={f.n} className="gal-item" style={{ "--i": i, visibility: escondida === i && exibe === "foto" ? "hidden" : "visible" } as React.CSSProperties}>
                  <button
                    ref={(el) => { miniaturas.current[i] = el; }}
                    type="button"
                    aria-label={nomeFoto(f)}
                    onClick={(e) => abrirFoto(i, true, e.currentTarget)}
                    className={`block w-full transition-transform duration-300 hover:scale-[1.04] motion-reduce:transition-none ${foco}`}
                  >
                    <Impressa f={f} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Foto grande (sem fade): a moldura voa da miniatura e volta a ela */}
      {exibe === "foto" && (
        <div
          ref={dialogoFoto}
          role="dialog"
          aria-modal="true"
          aria-label="Foto ampliada"
          data-lenis-prevent
          className={`fixed inset-0 z-[95] overflow-y-auto overscroll-contain ${voando ? "bg-transparent" : "bg-palco/95 backdrop-blur-sm"}`}
          onClick={(e) => e.target === e.currentTarget && voltar()}
        >
          <div className="mx-auto flex min-h-full max-w-[1500px] flex-col items-center justify-center gap-5 p-4 lg:flex-row lg:gap-8 lg:p-10" onClick={(e) => e.target === e.currentTarget && voltar()}>
            {/* A moldura abraça a foto (caixa 3:2 + borda igual de 8 px). É ela que voa da miniatura até aqui e volta ao fechar. */}
            <span ref={quadro} className="block shrink-0 overflow-hidden rounded bg-creme p-2 shadow-2xl will-change-transform">
              <FotoGrande key={FOTOS[foto].n} f={FOTOS[foto]} dir={dir} />
            </span>
            <Cartao key={foto} i={foto} onPrev={() => vai(-1)} onNext={() => vai(1)} onFechar={voltar} fecharRef={fecharFoto} saindo={voando} />
          </div>
        </div>
      )}
    </section>
  );
}
