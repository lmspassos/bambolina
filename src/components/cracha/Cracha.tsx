"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

// Three.js só carrega no cliente e em chunk separado.
const Canvas = dynamic(() => import("./CrachaCanvas"), { ssr: false });

/** Crachá pendurado por um cordão, arrastável (substitui a antiga cena do palco). */
export default function Cracha({ marcadas }: { marcadas: boolean[] }) {
  const [falhou, setFalhou] = useState(false);
  const n = marcadas.filter(Boolean).length;
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border-4 border-vinho bg-palco shadow-2xl">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_30%,rgba(255,30,199,.22),transparent)]" />
      {falhou ? (
        <div className="absolute inset-0 grid place-items-center">
          <div className="w-1/2 rotate-2 rounded-2xl bg-creme p-5 text-center text-vinho">
            <p className="font-swung text-4xl leading-none">Bambolina</p>
            <p className="mt-2 font-display text-xs font-bold">{n} de 8 habilidades</p>
          </div>
        </div>
      ) : (
        <Canvas marcadas={marcadas} onFalha={() => setFalhou(true)} />
      )}
      <p className="sr-only" aria-live="polite">{n} de 8 habilidades marcadas no crachá.</p>
    </div>
  );
}
