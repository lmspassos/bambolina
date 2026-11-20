import * as THREE from "three";
import type { Mats } from "./comum";

const BASE = "/backstage/tex/";

/** Materiais PBR: texturas fotográficas CC0 (Poly Haven) + materiais simples. */
export function criarMateriais(renderer: THREE.WebGLRenderer, leve: boolean): { M: Mats; dispose: () => void } {
  const loader = new THREE.TextureLoader();
  const aniso = Math.min(renderer.capabilities.getMaxAnisotropy(), leve ? 2 : 4);
  const lista: THREE.Material[] = [];
  const texs: THREE.Texture[] = [];

  // Texturas e materiais são reaproveitados por chave: menos memória de vídeo, menos trocas de estado e
  // permite mesclar geometrias que usam o mesmo material (ver otimizar.ts).
  const cacheTex = new Map<string, THREE.Texture>();
  const cacheMat = new Map<string, THREE.MeshStandardMaterial>();
  const tex = (arq: string, srgb: boolean, rx: number, ry: number) => {
    const chave = `${arq}|${srgb}|${rx}|${ry}`;
    const ja = cacheTex.get(chave);
    if (ja) return ja;
    const t = loader.load(BASE + arq + ".jpg");
    cacheTex.set(chave, t);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(rx, ry);
    t.anisotropy = aniso;
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    texs.push(t);
    return t;
  };
  const pbr = (nome: string, rx: number, ry: number, o: { tint?: number; rough?: number; metal?: number; rmap?: boolean; nscale?: number; side?: THREE.Side } = {}) => {
    const ck = `${nome}|${rx}|${ry}|${o.tint}|${o.rough}|${o.metal}|${o.rmap}|${o.nscale}|${o.side}`;
    const ex = cacheMat.get(ck);
    if (ex) return ex;
    const m = new THREE.MeshStandardMaterial({
      map: tex(nome + "_diff", true, rx, ry),
      normalMap: tex(nome + "_nor", false, rx, ry),
      normalScale: new THREE.Vector2(o.nscale ?? 1, o.nscale ?? 1),
      color: o.tint ?? 0xffffff,
      roughness: o.rough ?? 1,
      metalness: o.metal ?? 0,
      side: o.side ?? THREE.FrontSide,
    });
    if (o.rmap) {
      m.roughnessMap = tex(nome + "_rough", false, rx, ry);
    }
    lista.push(m);
    cacheMat.set(ck, m);
    return m;
  };
  const std = (cor: number, rough = 0.6, metal = 0) => {
    const ck = `std|${cor}|${rough}|${metal}`;
    const ex = cacheMat.get(ck);
    if (ex) return ex;
    const m = new THREE.MeshStandardMaterial({ color: cor, roughness: rough, metalness: metal });
    lista.push(m);
    cacheMat.set(ck, m);
    return m;
  };

  // halo radial (brilho de lâmpada)
  const cv = document.createElement("canvas");
  cv.width = cv.height = 128;
  const x = cv.getContext("2d")!;
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.18, "rgba(255,255,255,0.55)");
  g.addColorStop(0.5, "rgba(255,255,255,0.12)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  x.fillStyle = g;
  x.fillRect(0, 0, 128, 128);
  const halo = new THREE.CanvasTexture(cv);
  halo.colorSpace = THREE.SRGBColorSpace;
  texs.push(halo);

  const M: Mats = {
    tijolo: (rx, ry) => pbr("dark_brick_wall", rx, ry, { tint: 0x8d8a88, rmap: true, nscale: 1.4 }),
    piso: (rx, ry) => pbr("black_painted_planks", rx, ry, { tint: 0xb4b4b4, rmap: true }),
    compensado: (rx, ry, tint = 0xb8a690) => pbr("plywood", rx, ry, { tint, rough: 0.85 }),
    veludo: (cor, rx = 1, ry = 1) => pbr("velour_velvet", rx, ry, { tint: cor, rough: 1, side: THREE.DoubleSide }),
    chapa: (rx, ry, tint = 0x9a9a9a) => pbr("metal_plate", rx, ry, { tint, rough: 0.5, metal: 0.8 }),
    std,
    emissivo: (cor, int = 2) => {
      const m = new THREE.MeshStandardMaterial({ color: 0x111111, emissive: cor, emissiveIntensity: int, roughness: 0.4 });
      lista.push(m);
      return m;
    },
    tecido: (cor) => {
      const ck = `tecido|${cor}`;
      const ex = cacheMat.get(ck);
      if (ex) return ex;
      const m = new THREE.MeshStandardMaterial({
        color: cor, roughness: 0.95, side: THREE.DoubleSide,
        normalMap: tex("velour_velvet_nor", false, 2, 2), normalScale: new THREE.Vector2(0.6, 0.6),
      });
      lista.push(m);
      cacheMat.set(ck, m);
      return m;
    },
    halo,
  };

  return {
    M,
    dispose() {
      lista.forEach((m) => m.dispose());
      texs.forEach((t) => t.dispose());
    },
  };
}
