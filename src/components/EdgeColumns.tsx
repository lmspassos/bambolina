const SHAPES = ["iluminacao", "cenografia", "direcao", "sonoplastia", "contrarregragem"];
// [fundo, forma]
const PAIRS = [
  ["var(--color-rosa)", "var(--color-palco)"],
  ["var(--color-limao)", "var(--color-azul)"],
  ["var(--color-laranja)", "var(--color-vinho)"],
  ["var(--color-azul)", "var(--color-creme)"],
  ["var(--color-vinho)", "var(--color-rosa)"],
  ["var(--color-creme)", "var(--color-laranja)"],
];

function Tiles({ offset }: { offset: number }) {
  return (
    <>
      {Array.from({ length: 12 }, (_, i) => {
        const [bg, fg] = PAIRS[(i + offset) % PAIRS.length];
        const shape = SHAPES[(i * 2 + offset) % SHAPES.length];
        return (
          <div key={i} className="aspect-square shrink-0 rounded-lg p-2" style={{ background: bg }}>
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

function Coluna({ side, offset }: { side: "left" | "right"; offset: number }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed top-0 z-40 hidden h-dvh w-11 overflow-hidden sm:block md:w-14 ${side === "left" ? "left-0" : "right-0"}`}
    >
      <div className={`coluna-track flex flex-col gap-2 p-1 ${side === "right" ? "reverso" : ""}`}>
        <Tiles offset={offset} />
        <Tiles offset={offset} />
      </div>
    </div>
  );
}

export default function EdgeColumns() {
  return (
    <>
      <div aria-hidden className="ribalta" />
      <Coluna side="left" offset={0} />
      <Coluna side="right" offset={3} />
    </>
  );
}
