import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export type Anim = (t: number, dt: number) => void;

export const COR = {
  rosa: 0xff1ec7,
  limao: 0xddf230,
  laranja: 0xff5938,
  azul: 0x1f6bed,
  vinho: 0x750015,
  creme: 0xf2f1e8,
  palco: 0x1d1d1b,
  fundo: 0x07080b,
  quente: 0xffd4a0, // tungstênio
  frio: 0xa9c4ff,
};

/** Dados que cada construtor de estação/arquitetura recebe. */
export interface Ctx {
  mundo: THREE.Group;
  M: Mats;
  /** Brilho geral 0..1 (sobe quando a cortina abre). */
  lum: { value: number };
  /** Ponto no piso sob o ponteiro e o quanto os refletores o seguem (0..1). */
  foco: { alvo: THREE.Vector3; peso: number };
  /** Material do feixe de luz (cone aditivo) numa cor. */
  feixe: (cor: number) => THREE.ShaderMaterial;
  anims: Anim[];
  leve: boolean;
  rand: () => number;
  /** Luz registrada: a intensidade final é base × brilho geral. */
  luz: <T extends THREE.Light>(l: T, base: number) => T;
  /** Material/sprite aceso que "esquenta" quando a estação `est` está ativa ou sob o ponteiro. */
  pratico: (est: number, m: THREE.Material, base: number) => void;
  /** Brilho falso (halo aditivo) em volta de uma lâmpada. */
  halo: (pai: THREE.Object3D, x: number, y: number, z: number, cor: number, tam: number, est?: number) => THREE.Sprite;
  /** Alvo clicável/hover da estação. */
  alvo: (est: number, x: number, y: number, z: number, w: number, h: number, d: number) => void;
}

export interface Mats {
  tijolo: (rx: number, ry: number) => THREE.MeshStandardMaterial;
  piso: (rx: number, ry: number) => THREE.MeshStandardMaterial;
  compensado: (rx: number, ry: number, tint?: number) => THREE.MeshStandardMaterial;
  veludo: (cor: number, rx?: number, ry?: number) => THREE.MeshStandardMaterial;
  chapa: (rx: number, ry: number, tint?: number) => THREE.MeshStandardMaterial;
  std: (cor: number, rough?: number, metal?: number) => THREE.MeshStandardMaterial;
  emissivo: (cor: number, int?: number) => THREE.MeshStandardMaterial;
  tecido: (cor: number) => THREE.MeshStandardMaterial;
  halo: THREE.Texture;
}

const geoCache = new Map<string, THREE.BufferGeometry>();
/** Caixa com quina chanfrada (muito mais realista que caixa seca). */
export function bx(
  pai: THREE.Object3D, w: number, h: number, d: number, mat: THREE.Material,
  x = 0, y = 0, z = 0, r = 0.012,
) {
  const rr = Math.min(r, w / 2 - 1e-4, h / 2 - 1e-4, d / 2 - 1e-4);
  const k = `${w}|${h}|${d}|${rr}`;
  let g = geoCache.get(k);
  if (!g) {
    // quina chanfrada só onde aparece (peças maiores); peças pequenas usam caixa simples (12 triângulos)
    g = rr > 0.006 && Math.min(w, h, d) >= 0.09 ? new RoundedBoxGeometry(w, h, d, 1, rr) : new THREE.BoxGeometry(w, h, d);
    geoCache.set(k, g);
  }
  const m = new THREE.Mesh(g, mat);
  m.position.set(x, y, z);
  pai.add(m);
  return m;
}

export function cy(
  pai: THREE.Object3D, rTop: number, rBot: number, h: number, mat: THREE.Material,
  x = 0, y = 0, z = 0, seg = 18,
) {
  const k = `c${rTop}|${rBot}|${h}|${seg}`;
  let g = geoCache.get(k);
  if (!g) {
    g = new THREE.CylinderGeometry(rTop, rBot, h, seg);
    geoCache.set(k, g);
  }
  const m = new THREE.Mesh(g, mat);
  m.position.set(x, y, z);
  pai.add(m);
  return m;
}

export function limparCacheGeo() {
  geoCache.forEach((g) => g.dispose());
  geoCache.clear();
}

/** Textura desenhada em canvas. */
export function texCanvas(w: number, h: number, desenhar: (c: CanvasRenderingContext2D) => void) {
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  desenhar(cv.getContext("2d")!);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}


/** Cabo caindo em curva (catenária simples). */
export function cabo(pai: THREE.Object3D, pts: [number, number, number][], mat: THREE.Material, r = 0.012) {
  const curva = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)));
  const m = new THREE.Mesh(new THREE.TubeGeometry(curva, Math.max(8, pts.length * 8), r, 5), mat);
  pai.add(m);
  return m;
}

export function mulberry(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
