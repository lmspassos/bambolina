import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { Anim } from "./comum";

const faixaDe = (m: THREE.Mesh) => Math.floor(m.matrixWorld.elements[14] / 12);

/**
 * Reduz draw calls mesclando malhas que usam o mesmo material:
 *  - peças ESTÁTICAS: mescladas no mundo, em faixas de 12 m ao longo do corredor;
 *  - peças que se movem JUNTAS (as partes de um refletor que balança, de uma junta de braço, de uma
 *    peça de roupa): mescladas dentro do objeto animado que as carrega.
 *
 * Como saber o que anima sem marcar à mão: roda as animações em dois instantes e compara a matriz
 * local de cada objeto. Quem mudou é "animado"; o resto é rígido em relação ao seu ancestral animado.
 */
export function mesclarEstaticos(raiz: THREE.Object3D, destino: THREE.Object3D, anims: Anim[]) {
  const nos: THREE.Object3D[] = [];
  raiz.traverse((o) => nos.push(o));
  const medir = (t: number) => {
    for (const a of anims) a(t, 0.016);
    raiz.updateMatrixWorld(true);
    return nos.map((o) => Float32Array.from(o.matrix.elements));
  };
  raiz.updateMatrixWorld(true);
  const A = medir(0.31);
  const B = medir(4.07);
  medir(0); // volta ao estado inicial

  const animados = new Set<THREE.Object3D>();
  nos.forEach((o, i) => {
    for (let k = 0; k < 16; k++)
      if (Math.abs(A[i][k] - B[i][k]) > 1e-6) {
        animados.add(o);
        break;
      }
  });
  const dono = (m: THREE.Object3D) => {
    for (let p: THREE.Object3D | null = m; p && p !== raiz; p = p.parent) if (animados.has(p)) return p;
    return null;
  };

  // grupos: chave -> { dono (null = mundo), malhas }
  const grupos = new Map<string, { dono: THREE.Object3D | null; lista: THREE.Mesh[] }>();
  for (const o of nos) {
    const m = o as THREE.Mesh;
    if (!m.isMesh) continue;
    const mt = m.material as THREE.Material;
    if (Array.isArray(mt) || !mt.visible || mt.transparent) continue;
    if (!(mt as THREE.MeshStandardMaterial).isMeshStandardMaterial && !(mt as THREE.MeshBasicMaterial).isMeshBasicMaterial) continue;
    if (m.userData.semSombra || m.userData.est) continue;
    const g = m.geometry;
    if (!g.attributes.position || !g.attributes.normal) continue;
    if (animados.has(m)) continue; // a própria malha se move sozinha
    const d = dono(m);
    const chave = d ? `${mt.uuid}|${d.uuid}` : `${mt.uuid}|z${faixaDe(m)}`;
    const grp = grupos.get(chave) ?? { dono: d, lista: [] };
    grupos.set(chave, grp);
    grp.lista.push(m);
  }

  const inv = new THREE.Matrix4();
  const rel = new THREE.Matrix4();
  grupos.forEach(({ dono: d, lista }) => {
    if (lista.length < 2) return;
    const indexada = lista.every((m) => m.geometry.index);
    if (d) inv.copy(d.matrixWorld).invert();
    const geos = lista.map((m) => {
      let g = m.geometry.clone();
      if (!indexada && g.index) g = g.toNonIndexed();
      if (!g.attributes.uv) g.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
      for (const nome of Object.keys(g.attributes)) if (nome !== "position" && nome !== "normal" && nome !== "uv") g.deleteAttribute(nome);
      g.applyMatrix4(d ? rel.copy(inv).multiply(m.matrixWorld) : m.matrixWorld);
      return g;
    });
    const unida = mergeGeometries(geos, false);
    geos.forEach((g) => g.dispose());
    if (!unida) return;
    const nova = new THREE.Mesh(unida, lista[0].material);
    nova.matrixAutoUpdate = false;
    if (!d) nova.userData.zc = faixaDe(lista[0]); // faixa em z, para esconder o que está muito longe
    (d ?? destino).add(nova);
    lista.forEach((m) => m.removeFromParent());
  });
}
