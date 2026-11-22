"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// Three.js só carrega no cliente, em chunk separado, e só quando a seção chega perto da tela
// (evita um 2º contexto WebGL e o download do chunk enquanto o Hero 3D ainda está em uso).
const Canvas = dynamic(() => import("./CrachaCanvas"), { ssr: false });

/** Crachá pendurado por um cordão, arrastável (substitui a antiga cena do palco). */
export default function Cracha({ marcadas }: { marcadas: boolean[] }) {
  const raiz = useRef<HTMLDivElement>(null);
  const [perto, setPerto] = useState(false);
  const [falhou, setFalhou] = useState(false);
  const n = marcadas.filter(Boolean).length;

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setPerto(true), io.disconnect()), { rootMargin: "700px 0px" });
    io.observe(raiz.current!);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={raiz} className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border-4 border-vinho bg-palco shadow-2xl lg:pointer-events-none lg:absolute lg:inset-x-0 lg:-bottom-28 lg:top-0 lg:z-20 lg:aspect-auto lg:overflow-visible lg:rounded-none lg:border-0 lg:bg-transparent lg:shadow-none">
      <div aria-hidden className="pointer-events-none absolute inset-0 lg:hidden bg-[radial-gradient(60%_50%_at_50%_30%,rgba(255,30,199,.22),transparent)]" />
      {falhou ? (
        <div className="absolute inset-0 grid place-items-center">
          <div className="w-1/2 rotate-2 rounded-2xl bg-creme p-5 text-center text-vinho">
            <p className="font-swung text-4xl leading-none">Bambolina</p>
            <p className="mt-2 font-display text-xs font-bold">{n} de 8 habilidades</p>
          </div>
        </div>
      ) : (
        perto && <Canvas marcadas={marcadas} onFalha={() => setFalhou(true)} />
      )}
      <p className="sr-only" aria-live="polite">{n} de 8 habilidades marcadas no crachá.</p>
    </div>
  );
}
