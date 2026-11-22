"use client";

import dynamic from "next/dynamic";
import { BACKSTAGE_3D } from "@/data/flags";
import HeroJornada from "./HeroJornada";

// Three.js só carrega no cliente e em chunk separado (não pesa o primeiro HTML).
const Canvas = dynamic(() => import("./backstage/BackstageCanvas"), { ssr: false });

/** Fundo 3D do Hero (backstage com 9 estações) + vinheta de legibilidade + interface da jornada. */
export default function HeroBackstage() {
  if (!BACKSTAGE_3D) return null;
  return (
    <>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20">
        <Canvas />
      </div>
      <div aria-hidden data-vinheta className="pointer-events-none absolute inset-0 -z-10 opacity-0" />
      <HeroJornada />
      {/* Cortina que se fecha ao fim da estação 9 (progresso em --fecha, definido pelo pin do Hero) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
        <div className="cortina absolute inset-y-0 left-0 w-[50.5%] [transform:translateX(calc(-100%*(1-var(--fecha,0))))]" />
        <div className="cortina absolute inset-y-0 right-0 w-[50.5%] [transform:translateX(calc(100%*(1-var(--fecha,0))))]" />
      </div>
    </>
  );
}
