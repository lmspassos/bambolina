// Marcador de DADO PENDENTE. Propositalmente fora da paleta da marca para não passar despercebido.
export default function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <span
      data-placeholder
      title="Dado de marcação: substituir antes de publicar (src/data/contato.ts)"
      className="inline-block rounded border-2 border-dashed border-red-600 bg-white px-2 py-0.5 align-baseline font-mono text-[0.78em] font-bold uppercase leading-snug tracking-tight text-red-600"
    >
      ⚠ [{children}]
    </span>
  );
}
