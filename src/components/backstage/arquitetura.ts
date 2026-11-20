import * as THREE from "three";
import { bx, cy, cabo, COR, texCanvas, type Ctx } from "./comum";
import { ALT, LARG, Z_FIM, Z_INI } from "./geometria";

const COMP = Z_INI - Z_FIM;
const MEIO = (Z_INI + Z_FIM) / 2;
const ABAIXO = new THREE.Vector3(0, -1, 0);

/** Casca do corredor: piso de palco, tijolo, coxia com pernas de veludo, teto técnico. */
export function construirCasca(c: Ctx) {
  const { mundo, M } = c;

  // piso de palco pintado de preto
  const piso = new THREE.Mesh(new THREE.PlaneGeometry(LARG * 2, COMP), M.piso(3, COMP / 3.2));
  piso.rotation.x = -Math.PI / 2;
  piso.position.set(0, 0, MEIO);
  mundo.add(piso);

  // parede esquerda: tijolo escuro
  const tij = new THREE.Mesh(new THREE.PlaneGeometry(COMP, ALT), M.tijolo(COMP / 2.6, ALT / 2.6));
  tij.rotation.y = Math.PI / 2;
  tij.position.set(-LARG, ALT / 2, MEIO);
  mundo.add(tij);
  // rodapé e colunas de aço
  bx(mundo, 0.1, 0.35, COMP, M.std(0x0e0e0e, 0.7), -LARG + 0.05, 0.175, MEIO, 0.01);
  for (let z = Z_INI - 1; z > Z_FIM; z -= 6.5) {
    bx(mundo, 0.32, ALT, 0.32, M.chapa(1, 4, 0x555555), -LARG + 0.16, ALT / 2, z, 0.01);
    bx(mundo, 0.5, 0.05, 0.5, M.std(0x1b1b1b, 0.6, 0.6), -LARG + 0.25, 0.025, z, 0.005);
  }
  // eletrodutos e bandeja de cabos
  const metal = M.std(0x6a6d70, 0.4, 0.85);
  for (const y of [4.25, 4.5]) {
    const t = cy(mundo, 0.03, 0.03, COMP, metal, -LARG + 0.12, y, MEIO, 8);
    t.rotation.x = Math.PI / 2;
  }
  bx(mundo, 0.3, 0.05, COMP, M.chapa(1, 20, 0x666666), -LARG + 0.25, 3.95, MEIO, 0.005);
  for (let z = Z_INI - 1; z > Z_FIM; z -= 3) bx(mundo, 0.04, 0.3, 0.04, metal, -LARG + 0.12, 4.1, z, 0.005);
  // caixas de passagem
  for (let z = -2; z > Z_FIM; z -= 11) {
    bx(mundo, 0.14, 0.22, 0.3, M.std(0x2b2e30, 0.5, 0.6), -LARG + 0.12, 3.3, z, 0.01);
    cy(mundo, 0.012, 0.012, 0.8, metal, -LARG + 0.12, 3.75, z);
  }
  // luminárias de serviço com gaiola (luz de serviço da coxia)
  const mServ = M.emissivo(0xffc88a, 1.6);
  c.pratico(0, mServ, 1.6);
  for (let z = -1; z > Z_FIM + 6; z -= 8.5) {
    const g = new THREE.Group();
    g.position.set(-LARG + 0.22, 3.2, z);
    bx(g, 0.1, 0.1, 0.1, M.std(0x222222, 0.5, 0.7), 0, 0.12, 0);
    const bulbo = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), mServ);
    g.add(bulbo);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      cy(g, 0.004, 0.004, 0.2, metal, Math.cos(a) * 0.09, 0, Math.sin(a) * 0.09, 4);
    }
    mundo.add(g);
    c.halo(g, 0, 0, 0, 0xffb878, 1.3, 0);
  }
  // saída de emergência e extintor
  {
    const sinal = texCanvas(256, 96, (x) => {
      x.fillStyle = "#0c3d22";
      x.fillRect(0, 0, 256, 96);
      x.fillStyle = "#7dffae";
      x.font = "bold 52px Montserrat, Arial, sans-serif";
      x.textAlign = "center";
      x.textBaseline = "middle";
      x.fillText("SAÍDA", 128, 52);
    });
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(0.7, 0.26),
      new THREE.MeshStandardMaterial({ map: sinal, emissiveMap: sinal, emissive: 0xffffff, emissiveIntensity: 1.4 }),
    );
    m.rotation.y = Math.PI / 2;
    m.position.set(-LARG + 0.04, 3.0, Z_FIM + 12);
    mundo.add(m);
    c.pratico(0, m.material as THREE.Material, 1.4);
    const ex = new THREE.Group();
    ex.position.set(-LARG + 0.2, 0, -30.8);
    cy(ex, 0.07, 0.07, 0.42, M.std(0xb3151b, 0.35, 0.3), 0, 0.85, 0);
    cy(ex, 0.03, 0.05, 0.08, M.std(0x222222, 0.4, 0.6), 0, 1.1, 0);
    bx(ex, 0.12, 0.03, 0.03, M.std(0x222222, 0.4, 0.6), 0.04, 1.17, 0);
    bx(ex, 0.08, 0.4, 0.02, M.std(0x444444, 0.5, 0.5), -0.1, 0.85, 0);
    mundo.add(ex);
  }

  // coxia direita: pernas de veludo preto com frestas de luz de palco
  const nPernas = Math.floor(COMP / 2.7);
  const geoPerna = [0, 1, 2].map((k) => {
    const g = new THREE.PlaneGeometry(1.95, 5.4, 26, 1);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const u = p.getX(i);
      p.setZ(i, Math.sin(u * 5.2 + k * 1.7) * 0.075 + Math.sin(u * 11 + k) * 0.018);
    }
    g.computeVertexNormals();
    return g;
  });
  const matPerna = M.veludo(0x1a1a1e, 1.4, 3);
  for (let i = 0; i < nPernas; i++) {
    const m = new THREE.Mesh(geoPerna[i % 3], matPerna);
    m.rotation.y = -Math.PI / 2;
    m.position.set(LARG - 0.1 + (i % 2) * 0.22, 2.75, Z_INI - 1.3 - i * 2.7);
    mundo.add(m);
  }
  // ripas (bastões) que seguram as pernas
  bx(mundo, 0.05, 0.05, COMP, M.std(0x111111, 0.5, 0.6), LARG - 0.1, 5.45, MEIO, 0.004);
  // palco ao fundo: brilho quente/frio que vaza pelas frestas
  const faixa = texCanvas(512, 8, (x) => {
    const g = x.createLinearGradient(0, 0, 512, 0);
    g.addColorStop(0, "#ffe3bd");
    g.addColorStop(0.25, "#ffd09a");
    g.addColorStop(0.5, "#bcd2ff");
    g.addColorStop(0.75, "#ffd7a6");
    g.addColorStop(1, "#ffefd6");
    x.fillStyle = g;
    x.fillRect(0, 0, 512, 8);
  });
  const palco = new THREE.Mesh(
    new THREE.PlaneGeometry(COMP, ALT + 1),
    new THREE.MeshBasicMaterial({ map: faixa, toneMapped: false, color: 0xffffff, fog: false }),
  );
  palco.rotation.y = -Math.PI / 2;
  palco.position.set(LARG + 3, ALT / 2, MEIO);
  mundo.add(palco);
  // feixes de luz atravessando as frestas
  const gradFeixe = texCanvas(128, 64, (x) => {
    const g = x.createLinearGradient(0, 0, 128, 0);
    g.addColorStop(0, "rgba(255,255,255,0.9)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    x.fillStyle = g;
    x.fillRect(0, 0, 128, 64);
    x.globalCompositeOperation = "destination-in";
    const v = x.createLinearGradient(0, 0, 0, 64);
    v.addColorStop(0, "rgba(0,0,0,0)");
    v.addColorStop(0.35, "rgba(0,0,0,1)");
    v.addColorStop(0.65, "rgba(0,0,0,1)");
    v.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = v;
    x.fillRect(0, 0, 128, 64);
  });
  const matFeixeFresta = new THREE.MeshBasicMaterial({
    map: gradFeixe, color: 0xffd7a8, transparent: true, opacity: 0.13, depthWrite: false,
    blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false,
  });
  const passo = c.leve ? 2 : 1;
  for (let i = 0; i < nPernas; i += passo) {
    const zf = Z_INI - 1.3 - i * 2.7 - 1.35; // fresta entre duas pernas
    const s = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 4.6), matFeixeFresta);
    s.rotation.y = 2.55;
    s.position.set(LARG - 0.4 - Math.cos(0.59) * 1.8, 2.5, zf - 0.7);
    mundo.add(s);
  }

  // teto técnico: vigas, tubos, dutos
  bx(mundo, LARG * 2, 0.2, COMP, M.std(0x0b0b0c, 0.9), 0, ALT + 0.1, MEIO, 0.005);
  for (let z = Z_INI - 2; z > Z_FIM; z -= 4.6) {
    bx(mundo, LARG * 2, 0.04, 0.3, M.chapa(4, 1, 0x4a4a4a), 0, ALT - 0.2, z, 0.004); // mesa da viga
    bx(mundo, LARG * 2, 0.3, 0.04, M.chapa(4, 1, 0x4a4a4a), 0, ALT - 0.35, z, 0.004);
    bx(mundo, LARG * 2, 0.04, 0.3, M.chapa(4, 1, 0x4a4a4a), 0, ALT - 0.5, z, 0.004);
  }
  const duto = cy(mundo, 0.34, 0.34, COMP, M.chapa(8, 1, 0x707478), 0, ALT - 0.9, MEIO, 20);
  duto.rotation.x = Math.PI / 2;
  for (let z = Z_INI - 3; z > Z_FIM; z -= 6) cy(mundo, 0.355, 0.355, 0.08, M.std(0x2b2d2f, 0.5, 0.8), 0, ALT - 0.9, z, 20).rotation.x = Math.PI / 2;
  // varas (tubos de iluminação) ao longo do corredor
  for (const x of [-2.3, 2.3]) {
    const v = cy(mundo, 0.024, 0.024, COMP, M.std(0x8a8d90, 0.35, 0.9), x, 4.85, MEIO, 8);
    v.rotation.x = Math.PI / 2;
    for (let z = Z_INI - 2; z > Z_FIM; z -= 2.3) {
      cy(mundo, 0.004, 0.004, 0.75, M.std(0x555555, 0.5, 0.8), x, 5.2, z, 4); // pendural
    }
  }

  // linhas de segurança (fita luminescente) e marcações no piso
  const fita = new THREE.MeshStandardMaterial({
    color: 0x9fe8b8, emissive: 0x6fe39a, emissiveIntensity: 0.45, roughness: 0.6,
    polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2,
  });
  c.pratico(0, fita, 0.45);
  for (const x of [-LARG + 0.5, LARG - 0.6]) {
    const f = new THREE.Mesh(new THREE.PlaneGeometry(0.06, COMP), fita);
    f.rotation.x = -Math.PI / 2;
    f.position.set(x, 0.004, MEIO);
    mundo.add(f);
  }
  const fitaBr = new THREE.MeshStandardMaterial({
    color: 0xd9d6c8, roughness: 0.55, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3,
  });
  for (let z = Z_INI - 2, i = 0; z > Z_FIM + 2; z -= 3.1, i++) {
    const x = ((i * 37) % 7) / 7 * 3 - 1.5;
    for (const a of [Math.PI / 4, -Math.PI / 4]) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(0.045, 0.34), fitaBr);
      m.rotation.set(-Math.PI / 2, 0, a);
      m.position.set(x, 0.005, z);
      mundo.add(m);
    }
  }
}

/** Refletores Fresnel clampeados nas varas. Seguem o ponteiro na estação de Iluminação. */
export function construirRig(c: Ctx) {
  const { mundo, M } = c;
  const preto = M.std(0x151516, 0.42, 0.75);
  const aco = M.std(0x8b8e92, 0.32, 0.95);
  const perfil = [
    [0.001, 0.03], [0.07, 0.03], [0.08, 0.0], [0.085, -0.16], [0.125, -0.22], [0.14, -0.33], [0.128, -0.36], [0.001, -0.36],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  const geoCorpo = new THREE.LatheGeometry(perfil, c.leve ? 14 : 22);
  const geoLente = new THREE.CircleGeometry(0.118, 20);
  const geoAnel = new THREE.TorusGeometry(0.13, 0.012, 6, 22);
  const H = 9;
  const geoFeixe = new THREE.ConeGeometry(1.55, H, c.leve ? 14 : 20, 1, true);
  geoFeixe.translate(0, -H / 2, 0);

  const lista: { x: number; z: number; cor: number; est1?: boolean }[] = [];
  const quente = COR.quente;
  // estação 1: densa, com géis em cores da marca
  [[-2.3, -3.6, COR.rosa], [2.3, -5, quente], [-2.3, -6.6, COR.azul], [2.3, -8, COR.laranja], [-2.3, -9.6, quente], [2.3, -10.6, COR.limao]].forEach(([x, z, cor]) =>
    lista.push({ x, z, cor, est1: true }),
  );
  // resto do corredor: tungstênio e azul frio
  const resto = c.leve ? [-15, -23, -34, -47] : [-15, -19.5, -24, -29, -35, -41, -47, -53, -58];
  resto.forEach((z, i) => lista.push({ x: i % 2 ? 2.3 : -2.3, z, cor: i % 3 === 0 ? COR.frio : quente }));

  lista.forEach((l, k) => {
    const g = new THREE.Group();
    g.position.set(l.x, 4.62, l.z);
    // braçadeira + yoke
    const cl = cy(g, 0.04, 0.04, 0.14, aco, 0, 0.17, 0, 12);
    cl.rotation.x = Math.PI / 2;
    bx(g, 0.06, 0.1, 0.03, aco, 0, 0.1, 0.07);
    cy(g, 0.012, 0.012, 0.09, aco, 0.065, 0.17, 0.07, 6).rotation.z = Math.PI / 2;
    bx(g, 0.38, 0.03, 0.045, preto, 0, 0.03, 0);
    bx(g, 0.025, 0.36, 0.04, preto, -0.19, -0.16, 0);
    bx(g, 0.025, 0.36, 0.04, preto, 0.19, -0.16, 0);
    for (const s of [-1, 1]) cy(g, 0.028, 0.028, 0.03, aco, s * 0.205, -0.2, 0, 10).rotation.z = Math.PI / 2;
    // corpo
    const corpo = new THREE.Mesh(geoCorpo, preto);
    corpo.position.y = -0.0;
    g.add(corpo);
    for (let i = 0; i < 4; i++) {
      const al = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.006, 5, 18), preto);
      al.rotation.x = Math.PI / 2;
      al.position.y = -0.03 - i * 0.04;
      g.add(al);
    }
    const anel = new THREE.Mesh(geoAnel, aco);
    anel.rotation.x = Math.PI / 2;
    anel.position.y = -0.358;
    g.add(anel);
    const mLente = M.emissivo(l.cor, 2.2);
    c.pratico(l.est1 ? 1 : 0, mLente, 2.2);
    const lente = new THREE.Mesh(geoLente, mLente);
    lente.rotation.x = Math.PI / 2;
    lente.position.y = -0.361;
    g.add(lente);
    // aletas (barn doors)
    for (const [dx, dz, rz, rx] of [[0.16, 0, -0.65, 0], [-0.16, 0, 0.65, 0], [0, 0.16, 0, 0.65], [0, -0.16, 0, -0.65]] as const) {
      const a = bx(g, dz ? 0.2 : 0.012, dz ? 0.012 : 0.18, dz ? 0.012 : 0.2, preto, dx, -0.42, dz, 0.002);
      a.rotation.z = rz;
      a.rotation.x = rx;
    }
    // cabo e corrente de segurança
    cabo(g, [[0, 0.08, -0.07], [0.1, 0.12, -0.25], [(l.x > 0 ? 1 : -1) * 0.1, 0.45, -0.4]], M.std(0x050505, 0.7), 0.011);
    cy(g, 0.004, 0.004, 0.2, aco, 0.05, 0.12, 0.09, 4);
    // feixe
    const f = new THREE.Mesh(geoFeixe, c.feixe(l.cor));
    f.position.y = -0.37;
    f.userData.semSombra = true;
    g.add(f);
    c.halo(g, 0, -0.38, 0, l.cor, 1.1, l.est1 ? 1 : 0);
    mundo.add(g);

    const pos = g.position;
    const idle = new THREE.Vector3();
    const dir = new THREE.Vector3();
    const q1 = new THREE.Quaternion();
    const q2 = new THREE.Quaternion();
    const ph = k * 1.7;
    const v = 0.35 + (k % 4) * 0.08;
    const tx = l.x * -0.25;
    const tz = l.z - 1.2;
    c.anims.push((t) => {
      idle.set(tx + Math.sin(t * v + ph) * 1.1, 0, tz + Math.cos(t * v * 0.8 + ph) * 1.4).sub(pos).normalize();
      q1.setFromUnitVectors(ABAIXO, idle);
      dir.copy(c.foco.alvo).sub(pos).normalize();
      q2.setFromUnitVectors(ABAIXO, dir);
      g.quaternion.copy(q1).slerp(q2, c.foco.peso * (l.est1 ? 1 : 0));
    });
  });
}
