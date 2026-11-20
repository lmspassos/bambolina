import * as THREE from "three";

export interface Pose {
  hipY?: number;
  coxa?: [number, number]; // rotação x (esq, dir); negativo = para frente
  canela?: [number, number];
  tronco?: number; // inclinação do tronco para frente (positivo)
  braco?: [number, number]; // rotação x do ombro
  antebraco?: [number, number];
  bracoZ?: [number, number]; // abertura lateral
  cabeca?: number;
}

/** Figura humana articulada simples (silhueta com membros em 2 segmentos). */
export function pessoa(mat: THREE.Material, pose: Pose = {}) {
  const g = new THREE.Group();
  const hipY = pose.hipY ?? 0.9;
  const quadril = new THREE.Group();
  quadril.position.y = hipY;
  g.add(quadril);

  const geoCoxa = new THREE.CapsuleGeometry(0.075, 0.34, 4, 8);
  const geoCanela = new THREE.CapsuleGeometry(0.058, 0.34, 4, 8);
  const geoBraco = new THREE.CapsuleGeometry(0.048, 0.22, 4, 8);
  const geoAnte = new THREE.CapsuleGeometry(0.042, 0.2, 4, 8);

  const pernas: THREE.Group[] = [];
  const bracos: THREE.Group[] = [];
  for (const [i, sx] of [-1, 1].entries()) {
    const coxa = new THREE.Group();
    coxa.position.set(sx * 0.09, 0, 0);
    coxa.rotation.x = pose.coxa?.[i] ?? 0;
    const cm = new THREE.Mesh(geoCoxa, mat);
    cm.position.y = -0.22;
    coxa.add(cm);
    const canela = new THREE.Group();
    canela.position.y = -0.43;
    canela.rotation.x = pose.canela?.[i] ?? 0;
    const km = new THREE.Mesh(geoCanela, mat);
    km.position.y = -0.22;
    canela.add(km);
    const pe = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.05, 0.22), mat);
    pe.position.set(0, -0.45, 0.05);
    canela.add(pe);
    coxa.add(canela);
    quadril.add(coxa);
    pernas.push(coxa);
  }

  const tronco = new THREE.Group();
  tronco.rotation.x = pose.tronco ?? 0;
  quadril.add(tronco);
  const corpo = new THREE.Mesh(new THREE.CapsuleGeometry(0.17, 0.3, 6, 12), mat);
  corpo.position.y = 0.3;
  corpo.scale.set(1, 1, 0.68);
  tronco.add(corpo);
  const pescoco = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.1, 8), mat);
  pescoco.position.y = 0.66;
  tronco.add(pescoco);
  const cab = new THREE.Mesh(new THREE.SphereGeometry(0.108, 14, 12), mat);
  cab.scale.set(0.9, 1.1, 1);
  cab.position.set(0, 0.79, 0.01);
  cab.rotation.x = pose.cabeca ?? 0;
  tronco.add(cab);

  for (const [i, sx] of [-1, 1].entries()) {
    const ombro = new THREE.Group();
    ombro.position.set(sx * 0.215, 0.55, 0);
    ombro.rotation.x = pose.braco?.[i] ?? 0;
    ombro.rotation.z = pose.bracoZ?.[i] ?? sx * 0.06;
    const bm = new THREE.Mesh(geoBraco, mat);
    bm.position.y = -0.17;
    ombro.add(bm);
    const cotovelo = new THREE.Group();
    cotovelo.position.y = -0.31;
    cotovelo.rotation.x = pose.antebraco?.[i] ?? 0;
    const am = new THREE.Mesh(geoAnte, mat);
    am.position.y = -0.15;
    cotovelo.add(am);
    const mao = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 6), mat);
    mao.position.y = -0.31;
    cotovelo.add(mao);
    ombro.add(cotovelo);
    tronco.add(ombro);
    bracos.push(ombro);
  }
  return { g, quadril, tronco, pernas, bracos, cabeca: cab };
}
