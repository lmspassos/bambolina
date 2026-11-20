import * as THREE from "three";
import { texCanvas, type Ctx } from "./comum";

/** Materiais e peças que várias estações reutilizam. */
function criar(c: Ctx) {
  const M = c.M;
  return {
    preto: M.std(0x141415, 0.45, 0.75),
    aco: M.std(0x8b8e92, 0.3, 0.95),
    cromo: M.std(0xc7cacd, 0.15, 1),
    borracha: M.std(0x0b0b0c, 0.92),
    plastico: M.std(0x1d1d1f, 0.5),
    branco: M.std(0xd9d6c8, 0.6),
    latao: M.std(0xb08a3e, 0.35, 0.9),
    madeiraEsc: M.compensado(1.2, 1.2, 0x6b5a48),
    madeira: M.compensado(1.2, 1.2, 0xb9a58c),
    papel: M.std(0xe9e5d6, 0.9),
    cabo: M.std(0x070708, 0.75),
  };
}
type Kit = ReturnType<typeof criar>;
const kits = new WeakMap<Ctx, Kit>();
export function getKit(c: Ctx): Kit {
  let k = kits.get(c);
  if (!k) kits.set(c, (k = criar(c)));
  return k;
}

/** Orienta um grupo para o centro do corredor (frente = +z local aponta para x=0). */
export function virar(g: THREE.Object3D, s: number) {
  g.rotation.y = -s * Math.PI / 2;
}

/** Tela emissiva com conteúdo desenhado em canvas. */
export function tela(
  c: Ctx, est: number, w: number, h: number, px: number, py: number,
  desenhar: (x: CanvasRenderingContext2D, W: number, H: number) => void, int = 1.2,
) {
  const W = 256;
  const H = Math.round(256 * (h / w));
  const t = texCanvas(W, H, (x) => desenhar(x, W, H));
  const m = new THREE.MeshStandardMaterial({ map: t, emissiveMap: t, emissive: 0xffffff, emissiveIntensity: int, roughness: 0.4 });
  c.pratico(est, m, int);
  const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m);
  void px;
  void py;
  return p;
}

/** Texto estampado (caixas, placas). */
export function rotulo(texto: string, w: number, h: number, fundo: string, cor: string, fonte = "bold 54px Montserrat, Arial, sans-serif") {
  return texCanvas(256, Math.round(256 * (h / w)), (x) => {
    x.fillStyle = fundo;
    x.fillRect(0, 0, 256, 256);
    x.fillStyle = cor;
    x.font = fonte;
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillText(texto, 128, Math.round(128 * (h / w)) + 3);
  });
}
