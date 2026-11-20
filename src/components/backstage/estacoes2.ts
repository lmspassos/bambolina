import * as THREE from "three";
import { bx, cy, cabo, COR, texCanvas, type Ctx } from "./comum";
import { getKit, tela, virar } from "./kit";
import { caso } from "./estacoes1";
import { pessoa } from "./pessoas";
import { ALT, LARG, Z_FIM, ZE, LADO } from "./geometria";

const grp = (c: Ctx, z: number) => {
  const g = new THREE.Group();
  g.position.z = z;
  c.mundo.add(g);
  return g;
};

/** 5 · Maquiagem: bancada com espelho de camarim, pincéis, paletas, perucas. */
export function estMaquiagem(c: Ctx, est: number, z: number, s: number) {
  const { M } = c;
  const k = getKit(c);
  const g = grp(c, z);
  const b = new THREE.Group();
  b.position.set(s * 3.85, 0, 0.3);
  virar(b, s);
  g.add(b);
  const laminado = M.std(0xe6e2d6, 0.35);
  bx(b, 2.6, 0.05, 0.56, laminado, 0, 0.8, 0, 0.006);
  bx(b, 2.5, 0.76, 0.5, k.madeiraEsc, 0, 0.38, -0.01, 0.01);
  for (let i = 0; i < 3; i++) {
    bx(b, 0.74, 0.2, 0.02, k.madeira, -0.82 + i * 0.82, 0.62, 0.25, 0.004);
    bx(b, 0.12, 0.014, 0.02, k.aco, -0.82 + i * 0.82, 0.62, 0.27, 0.003);
  }
  // espelho com moldura de lâmpadas
  bx(b, 2.2, 1.18, 0.05, k.preto, 0, 1.55, -0.22, 0.01);
  const esp = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 0.98), M.std(0xe4e9ee, 0.04, 1));
  esp.position.set(0, 1.55, -0.19);
  b.add(esp);
  const mb = M.emissivo(0xfff0cc, 3);
  c.pratico(est, mb, 3);
  const geoB = new THREE.SphereGeometry(0.03, 12, 8);
  let nHalo = 0;
  const lamp = (x: number, y: number) => {
    const bb = new THREE.Mesh(geoB, mb);
    bb.position.set(x, y, -0.17);
    b.add(bb);
    cy(b, 0.014, 0.014, 0.025, k.aco, x, y, -0.2, 8).rotation.x = Math.PI / 2;
    if (++nHalo % 2 === 0) c.halo(b, x, y, -0.15, 0xffe2b0, 0.34, est); // metade das lâmpadas ganha halo (menos overdraw)
  };
  for (let i = 0; i < 10; i++) {
    lamp(-1.0 + (i * 2.0) / 9, 2.1);
    lamp(-1.0 + (i * 2.0) / 9, 1.01);
  }
  for (let i = 1; i < 4; i++) {
    lamp(-1.05, 1.01 + (i * 1.09) / 4);
    lamp(1.05, 1.01 + (i * 1.09) / 4);
  }
  // pincéis, paletas e frascos
  const vidro = M.std(0xb8c8d0, 0.12);
  for (const [dx, h] of [[-0.95, 0.13], [-0.78, 0.1]] as const) {
    cy(b, 0.045, 0.04, h, vidro, dx, 0.825 + h / 2, 0.05, 14);
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2;
      const p = cy(b, 0.004, 0.005, 0.2, k.madeiraEsc, dx + Math.cos(a) * 0.02, 0.96, 0.05 + Math.sin(a) * 0.02, 5);
      p.rotation.set(Math.sin(a) * 0.18, 0, -Math.cos(a) * 0.18);
      const pt = cy(b, 0.009, 0.004, 0.04, k.preto, dx + Math.cos(a) * 0.038, 1.07, 0.05 + Math.sin(a) * 0.038, 6);
      pt.rotation.set(Math.sin(a) * 0.18, 0, -Math.cos(a) * 0.18);
    }
  }
  const pans = [COR.rosa, COR.laranja, COR.azul, COR.vinho, COR.creme, COR.limao, 0xb08a3e, 0x5a1a22];
  for (let p = 0; p < 2; p++) {
    const pl = new THREE.Group();
    pl.position.set(-0.3 + p * 0.5, 0.828, 0.1);
    pl.rotation.y = p ? -0.3 : 0.2;
    bx(pl, 0.3, 0.02, 0.2, k.preto, 0, 0.01, 0, 0.006);
    for (let i = 0; i < 8; i++) cy(pl, 0.026, 0.026, 0.008, M.std(pans[(i + p * 3) % 8], 0.7), -0.105 + (i % 4) * 0.07, 0.022, -0.04 + Math.floor(i / 4) * 0.08, 14);
    b.add(pl);
  }
  [[0.5, COR.rosa], [0.55, COR.laranja], [0.6, COR.vinho], [0.65, 0x5a1a22]].forEach(([dx, cor]) => {
    cy(b, 0.011, 0.011, 0.07, k.latao, (dx as number) + 0.35, 0.865, 0.1, 10);
    cy(b, 0.0105, 0.0105, 0.04, M.std(cor as number, 0.35), (dx as number) + 0.35, 0.92, 0.1, 10);
  });
  for (const [dx, r, h, cor] of [[0.2, 0.04, 0.12, 0xd6d2c4], [0.9, 0.03, 0.18, 0xc8d4dc], [1.0, 0.035, 0.1, 0xd6d2c4]] as const) {
    cy(b, r, r, h, M.std(cor, 0.25), dx, 0.825 + h / 2, -0.1, 16);
    cy(b, r * 0.9, r * 0.9, 0.02, k.latao, dx, 0.835 + h, -0.1, 16);
  }
  const esponja = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), M.std(0xf0c6a8, 0.9));
  esponja.scale.y = 0.6;
  esponja.position.set(0.1, 0.84, 0.15);
  b.add(esponja);

  // cabeças de peruca
  [[-1.15, COR.rosa], [1.2, 0x2a1a16]].forEach(([dx, cor], i) => {
    const w = new THREE.Group();
    w.position.set(dx as number, 0.825, -0.02);
    cy(w, 0.03, 0.045, 0.05, M.std(0xe9e5d6, 0.8), 0, 0.03, 0, 12);
    const cb = new THREE.Mesh(new THREE.SphereGeometry(0.1, 18, 14), M.std(0xe9e5d6, 0.85));
    cb.scale.set(0.85, 1.12, 0.95);
    cb.position.y = 0.18;
    w.add(cb);
    const cabelo = new THREE.Mesh(new THREE.SphereGeometry(0.112, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.62), M.std(cor as number, 0.7));
    cabelo.scale.set(0.9, 1.2, 1.05);
    cabelo.position.y = 0.2;
    w.add(cabelo);
    for (let j = 0; j < 10; j++) {
      const a = (j / 10) * Math.PI * 2;
      const m = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.16 + (i ? 0.1 : 0), 6), M.std(cor as number, 0.7));
      m.position.set(Math.cos(a) * 0.1, 0.14, Math.sin(a) * 0.1);
      m.rotation.x = Math.PI;
      w.add(m);
    }
    b.add(w);
  });

  // cadeira de maquiagem
  const ch = new THREE.Group();
  ch.position.set(s * 2.9, 0, 0.35);
  ch.rotation.y = s * Math.PI / 2 + 0.25;
  g.add(ch);
  const couro = M.std(0x17171a, 0.45);
  bx(ch, 0.46, 0.07, 0.44, couro, 0, 0.5, 0, 0.025);
  bx(ch, 0.46, 0.52, 0.07, couro, 0, 0.83, -0.2, 0.03);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) cy(ch, 0.016, 0.014, 0.5, k.cromo, sx * 0.19, 0.25, sz * 0.17, 8);
  for (const sx of [-1, 1]) bx(ch, 0.04, 0.03, 0.4, k.cromo, sx * 0.23, 0.68, -0.02, 0.005);
  bx(ch, 0.38, 0.015, 0.015, k.cromo, 0, 0.12, 0.17, 0.003);
  c.alvo(est, s * 3.3, 1.3, z, 2.6, 2.8, 5.4);
}

/** 6 · Dramaturgia: escrivaninha, máquina de escrever, quadro de cortiça, varal de páginas, estante. */
export function estDramaturgia(c: Ctx, est: number, z: number, s: number) {
  const { M } = c;
  const k = getKit(c);
  const g = grp(c, z);
  const madEsc = M.compensado(1.5, 1.5, 0x5d4a38);

  const m = new THREE.Group();
  m.position.set(s * 3.55, 0, 0.5);
  virar(m, s);
  g.add(m);
  bx(m, 1.7, 0.055, 0.78, madEsc, 0, 0.76, 0, 0.008);
  for (const dx of [-0.78, 0.78]) for (const dz of [-0.32, 0.32]) bx(m, 0.06, 0.76, 0.06, madEsc, dx, 0.38, dz, 0.008);
  bx(m, 0.5, 0.52, 0.7, madEsc, 0.55, 0.48, 0, 0.01);
  for (let i = 0; i < 3; i++) {
    bx(m, 0.44, 0.14, 0.02, k.madeira, 0.55, 0.28 + i * 0.16, 0.36, 0.004);
    cy(m, 0.012, 0.012, 0.025, k.latao, 0.55, 0.28 + i * 0.16, 0.38, 8).rotation.x = Math.PI / 2;
  }
  // máquina de escrever
  const mt = new THREE.Group();
  mt.position.set(-0.1, 0.79, 0.05);
  m.add(mt);
  const verde = M.std(0x24352c, 0.4, 0.2);
  bx(mt, 0.4, 0.11, 0.32, verde, 0, 0.07, 0, 0.035);
  bx(mt, 0.4, 0.06, 0.12, verde, 0, 0.17, -0.1, 0.02);
  cy(mt, 0.022, 0.022, 0.44, k.preto, 0, 0.22, -0.13, 12).rotation.z = Math.PI / 2;
  for (const sx of [-1, 1]) cy(mt, 0.02, 0.02, 0.03, k.cromo, sx * 0.235, 0.22, -0.13, 10).rotation.z = Math.PI / 2;
  const folha = bx(mt, 0.22, 0.3, 0.002, k.papel, 0, 0.36, -0.15, 0.0005);
  folha.rotation.x = -0.18;
  for (let r = 0; r < 4; r++)
    for (let q = 0; q < 11 - (r % 2); q++) {
      const t = cy(mt, 0.0095, 0.0095, 0.012, k.branco, -0.15 + q * 0.03 + (r % 2) * 0.015, 0.128 + r * 0.012, 0.1 - r * 0.045, 8);
      t.rotation.x = 0.18 * r * 0.3;
    }
  bx(mt, 0.3, 0.012, 0.015, k.preto, 0, 0.135, 0.15, 0.002);
  // lâmpada de banqueiro (verde)
  const lb = new THREE.Group();
  lb.position.set(-0.65, 0.79, -0.2);
  m.add(lb);
  cy(lb, 0.1, 0.11, 0.02, k.latao, 0, 0.01, 0, 18);
  cy(lb, 0.012, 0.012, 0.3, k.latao, 0, 0.17, 0, 8);
  const mLb = M.emissivo(0x8bd68a, 1.0);
  const abaj = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 0.12, 22, 1, true, 0, Math.PI), new THREE.MeshStandardMaterial({ color: 0x1b6b3a, emissive: 0x55c27a, emissiveIntensity: 0.9, roughness: 0.3, side: THREE.DoubleSide }));
  abaj.rotation.set(Math.PI / 2, 0, s * Math.PI / 2 + Math.PI / 2);
  abaj.position.set(0, 0.34, 0.05);
  lb.add(abaj);
  c.pratico(est, abaj.material as THREE.Material, 0.9);
  const bulbo = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), mLb);
  bulbo.position.set(0, 0.32, 0.05);
  lb.add(bulbo);
  c.halo(lb, 0, 0.32, 0.06, 0xffd890, 0.9, est);
  // roteiros, páginas soltas, lápis, tinteiro
  [[0.25, COR.vinho], [0.28, COR.azul], [0.31, 0xd9d2c0]].forEach(([dz, cor], i) => {
    bx(m, 0.24, 0.045, 0.32, M.std(cor as number, 0.7), 0.5 - i * 0.02, 0.81 + i * 0.045, -0.1 - (dz as number) * 0, 0.01).rotation.y = i * 0.15 - 0.1;
  });
  for (let i = 0; i < 6; i++) {
    const p = bx(m, 0.21, 0.002, 0.29, k.papel, 0.3 + (i % 3) * 0.15, 0.79 + i * 0.002, 0.1 + (i % 2) * 0.12, 0.0005);
    p.rotation.y = (i * 0.9) % 1.5 - 0.7;
  }
  cy(m, 0.04, 0.036, 0.1, M.std(0xb89a6a, 0.6), 0.7, 0.84, 0.25, 12);
  for (let i = 0; i < 5; i++) {
    const l = cy(m, 0.004, 0.004, 0.15, M.std([COR.rosa, COR.limao, COR.azul, COR.laranja, 0xe9e5d6][i], 0.5), 0.7 + (i - 2) * 0.01, 0.93, 0.25, 5);
    l.rotation.z = (i - 2) * 0.12;
  }
  cy(m, 0.03, 0.04, 0.05, M.std(0x1a1a1c, 0.2), -0.45, 0.815, 0.25, 14);
  const pena = new THREE.Mesh(new THREE.ConeGeometry(0.008, 0.22, 6), M.std(0xe9e5d6, 0.8));
  pena.position.set(-0.4, 0.9, 0.25);
  pena.rotation.z = -0.5;
  m.add(pena);
  const caneca = cy(m, 0.04, 0.035, 0.09, M.std(0xe9e5d6, 0.4), 0.2, 0.84, -0.25, 16);
  void caneca;
  const al = new THREE.Mesh(new THREE.TorusGeometry(0.025, 0.006, 6, 12, Math.PI), M.std(0xe9e5d6, 0.4));
  al.position.set(0.245, 0.84, -0.25);
  al.rotation.z = -Math.PI / 2;
  m.add(al);
  // cadeira de madeira
  const cd = new THREE.Group();
  cd.position.set(s * 2.45, 0, 0.5);
  cd.rotation.y = s * Math.PI / 2 + 0.3;
  g.add(cd);
  bx(cd, 0.42, 0.04, 0.42, k.madeiraEsc, 0, 0.46, 0, 0.01);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) bx(cd, 0.035, 0.46, 0.035, k.madeiraEsc, sx * 0.18, 0.23, sz * 0.18, 0.006);
  for (const sx of [-0.17, 0.17]) bx(cd, 0.035, 0.5, 0.035, k.madeiraEsc, sx, 0.74, -0.18, 0.006);
  for (let i = 0; i < 4; i++) bx(cd, 0.026, 0.4, 0.02, k.madeiraEsc, -0.12 + i * 0.08, 0.74, -0.18, 0.004);
  bx(cd, 0.4, 0.05, 0.03, k.madeiraEsc, 0, 0.98, -0.18, 0.008);

  // quadro de cortiça com cartões e barbante
  const cort = texCanvas(512, 256, (x) => {
    x.fillStyle = "#b48a5a";
    x.fillRect(0, 0, 512, 256);
    for (let i = 0; i < 3500; i++) {
      x.fillStyle = `rgba(${90 + Math.random() * 70},${55 + Math.random() * 40},${25 + Math.random() * 25},0.35)`;
      x.fillRect(Math.random() * 512, Math.random() * 256, 2 + Math.random() * 3, 2 + Math.random() * 2);
    }
    const cs = ["#f2f1e8", "#ddf230", "#ffc4ee", "#c6dbff", "#ffd2c4", "#f2f1e8"];
    const cards: [number, number][] = [];
    for (let i = 0; i < 12; i++) {
      const cx = 36 + (i % 6) * 78 + ((i * 17) % 20), cy2 = 52 + Math.floor(i / 6) * 118 + ((i * 29) % 22);
      cards.push([cx + 28, cy2 + 20]);
      x.save();
      x.translate(cx + 28, cy2 + 20);
      x.rotate(((i * 37) % 11) / 40 - 0.12);
      x.fillStyle = "rgba(0,0,0,0.25)";
      x.fillRect(-27, -17, 58, 42);
      x.fillStyle = cs[i % cs.length];
      x.fillRect(-28, -20, 58, 42);
      x.fillStyle = "rgba(40,40,40,0.55)";
      for (let l = 0; l < 4; l++) x.fillRect(-22, -12 + l * 8, 30 + ((i * l * 13) % 16), 2);
      x.restore();
    }
    x.strokeStyle = "#c01a2a";
    x.lineWidth = 2;
    x.beginPath();
    [0, 3, 7, 4, 8, 11, 6, 2, 5].forEach((ci, n) => (n ? x.lineTo(cards[ci][0], cards[ci][1]) : x.moveTo(cards[ci][0], cards[ci][1])));
    x.stroke();
    cards.forEach(([px, py], i) => {
      x.fillStyle = ["#ff1ec7", "#1f6bed", "#ddf230", "#ff5938"][i % 4];
      x.beginPath();
      x.arc(px, py, 4, 0, 7);
      x.fill();
    });
  });
  const qd = new THREE.Group();
  qd.position.set(s * (LARG - 0.1), 2.0, -0.1);
  virar(qd, s);
  g.add(qd);
  bx(qd, 2.3, 1.2, 0.04, M.std(0x2a2118, 0.6), 0, 0, 0, 0.01);
  const cm = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.1), new THREE.MeshStandardMaterial({ map: cort, roughness: 0.95 }));
  cm.position.z = 0.022;
  qd.add(cm);

  // varal de páginas sobre a mesa
  const varal: [number, number, number][] = [[s * 4.3, 3.35, 1.9], [s * 3.4, 3.1, 0.3], [s * 2.7, 3.4, -1.7]];
  cabo(g, varal, M.std(0xb9a98a, 0.8), 0.006);
  const pag = texCanvas(128, 160, (x) => {
    x.fillStyle = "#f1eddf";
    x.fillRect(0, 0, 128, 160);
    x.fillStyle = "rgba(40,40,45,0.6)";
    for (let l = 0; l < 13; l++) x.fillRect(12, 16 + l * 10, 70 + ((l * 29) % 36), 2.5);
  });
  const mp = new THREE.MeshStandardMaterial({ map: pag, roughness: 0.9, side: THREE.DoubleSide });
  const nPag = c.leve ? 5 : 9;
  for (let i = 0; i < nPag; i++) {
    const t = (i + 0.5) / nPag;
    const p = new THREE.Group();
    const pt = new THREE.QuadraticBezierCurve3(new THREE.Vector3(...varal[0]), new THREE.Vector3(...varal[1]), new THREE.Vector3(...varal[2])).getPoint(t);
    p.position.copy(pt);
    p.rotation.y = Math.PI / 2 + (i % 2 ? 0.25 : -0.2);
    const folha = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.26), mp);
    folha.position.y = -0.14;
    p.add(folha);
    bx(p, 0.02, 0.05, 0.012, k.madeira, 0, -0.01, 0, 0.003);
    c.anims.push((tt) => {
      p.rotation.z = Math.sin(tt * 0.8 + i * 1.3) * 0.06;
    });
    g.add(p);
  }

  // estante de livros
  const es = new THREE.Group();
  es.position.set(s * (LARG - 0.3), 0, -2.9);
  virar(es, s);
  g.add(es);
  for (const dx of [-0.8, 0.8]) bx(es, 0.04, 2.1, 0.3, madEsc, dx, 1.05, 0, 0.006);
  const lv = [0x5a1a22, 0x1c2540, 0xb59a3a, 0xd9d2c0, 0x17171a, COR.vinho, 0x3a4a3a, COR.azul, COR.rosa, 0xe9e5d6, COR.laranja];
  for (let r = 0; r < 4; r++) {
    bx(es, 1.62, 0.03, 0.3, madEsc, 0, 0.35 + r * 0.5, 0, 0.005);
    let x = -0.74;
    let i = 0;
    while (x < 0.7) {
      const w = 0.03 + ((r * 7 + i * 5) % 5) * 0.008;
      const h = 0.22 + ((r + i * 3) % 4) * 0.045;
      const lean = (i + r) % 9 === 0 ? 0.18 : 0;
      const l = bx(es, w, h, 0.2, M.std(lv[(r * 3 + i) % lv.length], 0.75), x + w / 2, 0.365 + r * 0.5 + h / 2, 0, 0.004);
      l.rotation.z = lean;
      x += w + 0.004;
      i++;
    }
  }
  c.alvo(est, s * 3.3, 1.4, z, 2.6, 3, 5.6);
}

/** 7 · Direção: cadeira de diretor, mesa de contrarregra com monitores e luzes de deixa, planta baixa. */
export function estDirecao(c: Ctx, est: number, z: number, s: number) {
  const { M } = c;
  const k = getKit(c);
  const g = grp(c, z);

  // cadeira de diretor
  const ch = new THREE.Group();
  ch.position.set(s * 2.6, 0, 1.5);
  ch.rotation.y = -s * Math.PI / 2 - s * 0.4;
  g.add(ch);
  const lona = M.std(0x1c1c1e, 0.9);
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const p = bx(ch, 0.035, 0.52, 0.035, k.madeiraEsc, sx * 0.24, 0.26, sz * 0.2, 0.006);
      p.rotation.z = -sx * 0.05;
    }
    const x1 = bx(ch, 0.025, 0.62, 0.025, k.madeiraEsc, sx * 0.24, 0.3, 0, 0.004);
    x1.rotation.x = 0.55;
    bx(ch, 0.03, 0.03, 0.46, k.madeiraEsc, sx * 0.25, 0.7, 0.02, 0.006); // braço
    bx(ch, 0.035, 0.5, 0.035, k.madeiraEsc, sx * 0.25, 0.97, -0.2, 0.006); // montante alto
  }
  bx(ch, 0.5, 0.02, 0.4, lona, 0, 0.55, 0.0, 0.006);
  const dirTex = texCanvas(256, 64, (x) => {
    x.fillStyle = "#17171a";
    x.fillRect(0, 0, 256, 64);
    x.fillStyle = "#f2f1e8";
    x.font = "bold 34px Montserrat, Arial, sans-serif";
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillText("DIREÇÃO", 128, 34);
  });
  const costas = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.115), new THREE.MeshStandardMaterial({ map: dirTex, roughness: 0.9 }));
  costas.position.set(0, 1.05, -0.178);
  costas.rotation.y = Math.PI;
  ch.add(costas);
  const costas2 = costas.clone();
  costas2.rotation.y = 0;
  costas2.position.z = -0.222;
  ch.add(costas2);
  bx(ch, 0.5, 0.4, 0.012, lona, 0, 0.82, -0.2, 0.004);
  // megafone sobre o assento
  const mg = new THREE.Group();
  mg.position.set(0.02, 0.62, 0.02);
  mg.rotation.set(0, 0.5, 0);
  ch.add(mg);
  const pts = [[0.04, 0], [0.05, 0.08], [0.1, 0.26], [0.115, 0.3]].map(([r, y]) => new THREE.Vector2(r, y));
  const cone = new THREE.Mesh(new THREE.LatheGeometry(pts, 20), M.std(0xd9d6c8, 0.35, 0.1));
  cone.rotation.z = -Math.PI / 2;
  mg.add(cone);
  cy(mg, 0.04, 0.045, 0.1, k.preto, -0.04, -0.02, 0, 14).rotation.z = Math.PI / 2;
  bx(mg, 0.04, 0.1, 0.035, k.preto, -0.05, -0.08, 0, 0.01);

  // mesa de contrarregra / direção de palco
  const mesa = new THREE.Group();
  mesa.position.set(s * 3.65, 0, -0.9);
  virar(mesa, s);
  g.add(mesa);
  bx(mesa, 2.0, 0.05, 0.72, k.preto, 0, 0.76, 0, 0.008);
  for (const dx of [-0.92, 0.92]) bx(mesa, 0.05, 0.76, 0.66, k.preto, dx, 0.38, 0, 0.008);
  bx(mesa, 1.8, 0.4, 0.02, k.preto, 0, 0.55, -0.3, 0.005);
  const dados: [number, number][] = [[-0.55, 0], [0.1, 1]];
  dados.forEach(([dx, tipo]) => {
    const m = new THREE.Group();
    m.position.set(dx, 0.79, -0.15);
    m.rotation.x = -0.1;
    mesa.add(m);
    bx(m, 0.52, 0.33, 0.03, k.preto, 0, 0.19, 0, 0.008);
    cy(m, 0.012, 0.012, 0.18, k.aco, 0, 0.06, -0.03, 8);
    bx(m, 0.18, 0.02, 0.12, k.preto, 0, 0.005, -0.02, 0.005);
    const t = tela(c, est, 0.47, 0.28, 0, 0, (x, W, H) => {
      x.fillStyle = tipo ? "#101820" : "#0b0f12";
      x.fillRect(0, 0, W, H);
      for (let i = 0; i < 9; i++) {
        x.fillStyle = ["#59ff8e", "#ff5938", "#ddf230", "#1f6bed"][(i + tipo) % 4];
        x.fillRect(12, 14 + i * 12, 6, 6);
        x.fillStyle = "rgba(220,225,235,0.7)";
        x.fillRect(26, 15 + i * 12, 50 + ((i * 47 + tipo * 30) % 120), 3);
        x.fillStyle = "rgba(220,225,235,0.35)";
        x.fillRect(26, 21 + i * 12, 40 + ((i * 31) % 90), 2);
      }
    }, 1.15);
    t.position.z = 0.017;
    t.position.y = 0.19;
    m.add(t);
  });
  // painel de luzes de deixa
  const painel = bx(mesa, 0.55, 0.07, 0.2, k.preto, 0.62, 0.83, 0.1, 0.01);
  void painel;
  const vd = M.emissivo(0x59ff8e, 2.2);
  const vm = M.emissivo(0xff3030, 2.2);
  c.pratico(est, vd, 2.2);
  c.pratico(est, vm, 2.2);
  for (let i = 0; i < 6; i++) {
    cy(mesa, 0.017, 0.017, 0.014, i % 2 ? vm : vd, 0.4 + i * 0.09, 0.872, 0.1, 12);
    bx(mesa, 0.03, 0.012, 0.03, k.aco, 0.4 + i * 0.09, 0.855, 0.16, 0.003);
    if (i < 2) c.halo(mesa, 0.4 + i * 0.09, 0.88, 0.1, i % 2 ? 0xff3030 : 0x59ff8e, 0.25, est);
  }
  // headset, cronômetro, prancheta
  const hs = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.01, 6, 20, Math.PI), k.preto);
  hs.position.set(-0.85, 0.9, 0.2);
  hs.rotation.y = 0.4;
  mesa.add(hs);
  for (const sx of [-1, 1]) cy(mesa, 0.04, 0.04, 0.03, k.plastico, -0.85 + sx * 0.082, 0.84, 0.2 + sx * 0.03, 12).rotation.z = Math.PI / 2;
  cy(mesa, 0.032, 0.032, 0.014, k.cromo, -0.2, 0.793, 0.2, 18);
  cy(mesa, 0.03, 0.03, 0.002, M.std(0xf4f1e6, 0.4), -0.2, 0.801, 0.2, 18);
  const pr = bx(mesa, 0.23, 0.01, 0.31, k.madeira, 0.15, 0.79, 0.22, 0.004);
  pr.rotation.y = 0.2;
  bx(mesa, 0.2, 0.004, 0.27, k.papel, 0.15, 0.798, 0.22, 0.001).rotation.y = 0.2;
  cy(mesa, 0.007, 0.007, 0.4, k.preto, 0.9, 0.97, 0.15, 8);
  const mc = new THREE.Mesh(new THREE.CapsuleGeometry(0.014, 0.04, 4, 8), k.preto);
  mc.position.set(0.9, 1.19, 0.15);
  mesa.add(mc);

  // planta baixa em cavalete
  const cav = new THREE.Group();
  cav.position.set(s * 2.2, 0, -2.4);
  cav.rotation.y = -s * Math.PI / 2 - s * 0.5;
  g.add(cav);
  for (const sx of [-0.5, 0.5]) {
    const p = bx(cav, 0.035, 1.95, 0.035, k.madeiraEsc, sx, 0.97, -0.1, 0.005);
    p.rotation.x = 0.08;
  }
  const pl = bx(cav, 0.09, 0.04, 0.55, k.madeiraEsc, 0, 0.3, -0.14, 0.005);
  pl.rotation.y = Math.PI / 2;
  const planta = texCanvas(512, 340, (x) => {
    x.fillStyle = "#16365e";
    x.fillRect(0, 0, 512, 340);
    x.strokeStyle = "rgba(255,255,255,0.12)";
    x.lineWidth = 1;
    for (let i = 0; i < 512; i += 17) {
      x.beginPath();
      x.moveTo(i, 0);
      x.lineTo(i, 340);
      x.stroke();
    }
    for (let j = 0; j < 340; j += 17) {
      x.beginPath();
      x.moveTo(0, j);
      x.lineTo(512, j);
      x.stroke();
    }
    x.strokeStyle = "rgba(255,255,255,0.9)";
    x.lineWidth = 2.5;
    x.strokeRect(44, 40, 424, 260);
    x.beginPath();
    x.moveTo(44, 250);
    x.lineTo(468, 250);
    x.stroke();
    x.setLineDash([8, 6]);
    x.beginPath();
    x.arc(256, 150, 80, 0, 7);
    x.stroke();
    x.setLineDash([]);
    [["#ff1ec7", 120, 120], ["#ddf230", 256, 90], ["#ff5938", 390, 120], ["#f2f1e8", 190, 200], ["#1f6bed", 330, 200]].forEach(([cor, px, py]) => {
      x.fillStyle = cor as string;
      x.beginPath();
      x.arc(px as number, py as number, 11, 0, 7);
      x.fill();
    });
    x.strokeStyle = "rgba(255,255,255,0.8)";
    x.lineWidth = 2;
    x.beginPath();
    x.moveTo(120, 120);
    x.quadraticCurveTo(190, 40, 256, 90);
    x.quadraticCurveTo(330, 150, 390, 120);
    x.stroke();
    x.fillStyle = "rgba(255,255,255,0.8)";
    for (let l = 0; l < 3; l++) x.fillRect(60, 268 + l * 8, 100 - l * 18, 2.5);
  });
  bx(cav, 1.28, 0.9, 0.02, k.madeira, 0, 1.25, -0.08, 0.006);
  const pm = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.8), new THREE.MeshStandardMaterial({ map: planta, roughness: 0.8 }));
  pm.position.set(0, 1.25, -0.066);
  cav.add(pm);
  void cabo;
  c.alvo(est, s * 3.2, 1.3, z, 2.8, 2.8, 5.4);
}

/** 8 · Produção: quadro de cronograma, mesa com notebook, rádios, estante com cases, relógio. */
export function estProducao(c: Ctx, est: number, z: number, s: number) {
  const { M } = c;
  const k = getKit(c);
  const g = grp(c, z);

  // quadro branco com cronograma e post-its
  const q = texCanvas(512, 256, (x) => {
    x.fillStyle = "#f2f0ea";
    x.fillRect(0, 0, 512, 256);
    x.fillStyle = "#16365e";
    x.fillRect(0, 0, 512, 34);
    x.fillStyle = "rgba(255,255,255,0.85)";
    x.fillRect(16, 14, 120, 6);
    x.strokeStyle = "rgba(40,50,70,0.55)";
    x.lineWidth = 1.5;
    for (let r = 0; r < 6; r++) {
      x.beginPath();
      x.moveTo(8, 34 + r * 37);
      x.lineTo(504, 34 + r * 37);
      x.stroke();
    }
    for (const cx of [110, 250, 390]) {
      x.beginPath();
      x.moveTo(cx, 34);
      x.lineTo(cx, 256);
      x.stroke();
    }
    const notas = ["#ff9bde", "#e8f56a", "#ffb199", "#9cc0ff", "#ff9bde", "#e8f56a", "#9cc0ff", "#ffb199", "#e8f56a"];
    notas.forEach((cor, i) => {
      const px = 16 + (i % 3) * 140 + ((i * 13) % 14), py = 46 + Math.floor(i / 3) * 70 + ((i * 7) % 10);
      x.save();
      x.translate(px, py);
      x.rotate(((i * 31) % 9) / 50 - 0.08);
      x.fillStyle = "rgba(0,0,0,0.18)";
      x.fillRect(2, 2, 64, 54);
      x.fillStyle = cor;
      x.fillRect(0, 0, 64, 54);
      x.fillStyle = "rgba(30,30,40,0.65)";
      for (let l = 0; l < 3; l++) x.fillRect(8, 12 + l * 10, 38 + ((i + l * 11) % 14), 2.5);
      x.restore();
    });
    x.strokeStyle = "#1a9b4b";
    x.lineWidth = 3;
    for (let i = 0; i < 4; i++) {
      x.beginPath();
      x.moveTo(430, 60 + i * 52);
      x.lineTo(438, 70 + i * 52);
      x.lineTo(454, 50 + i * 52);
      x.stroke();
    }
    x.strokeStyle = "#d03030";
    x.beginPath();
    x.moveTo(300, 224);
    x.lineTo(470, 218);
    x.stroke();
  });
  const qd = new THREE.Group();
  qd.position.set(s * (LARG - 0.12), 1.85, 0.2);
  virar(qd, s);
  g.add(qd);
  bx(qd, 2.4, 1.24, 0.04, k.aco, 0, 0, 0, 0.01);
  const qm = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 1.14), new THREE.MeshStandardMaterial({ map: q, roughness: 0.25, metalness: 0 }));
  qm.position.z = 0.022;
  qd.add(qm);
  bx(qd, 1.3, 0.04, 0.08, k.aco, 0, -0.64, 0.05, 0.005);
  [COR.azul, 0x17171a, COR.laranja].forEach((cor, i) => cy(qd, 0.009, 0.009, 0.12, M.std(cor, 0.5), -0.3 + i * 0.14, -0.62, 0.08, 8).rotation.z = Math.PI / 2);

  // relógio de parede analógico
  const rl = texCanvas(128, 128, (x) => {
    x.fillStyle = "#f4f1e6";
    x.beginPath();
    x.arc(64, 64, 62, 0, 7);
    x.fill();
    x.strokeStyle = "#17171a";
    x.lineWidth = 3;
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      x.beginPath();
      x.moveTo(64 + Math.sin(a) * 50, 64 - Math.cos(a) * 50);
      x.lineTo(64 + Math.sin(a) * 58, 64 - Math.cos(a) * 58);
      x.stroke();
    }
  });
  const rg = new THREE.Group();
  rg.position.set(s * (LARG - 0.08), 3.4, -2.2);
  virar(rg, s);
  g.add(rg);
  cy(rg, 0.17, 0.17, 0.05, k.preto, 0, 0, 0, 28).rotation.x = Math.PI / 2;
  const face = new THREE.Mesh(new THREE.CircleGeometry(0.155, 28), new THREE.MeshStandardMaterial({ map: rl, roughness: 0.4 }));
  face.position.z = 0.027;
  rg.add(face);
  const ponteiro = (len: number, w: number, cor: number) => {
    const p = new THREE.Group();
    const m = bx(p, w, len, 0.004, M.std(cor, 0.5), 0, len / 2, 0, 0.001);
    void m;
    p.position.z = 0.032;
    rg.add(p);
    return p;
  };
  const hh = ponteiro(0.08, 0.008, 0x17171a);
  const mm = ponteiro(0.12, 0.006, 0x17171a);
  const ss = ponteiro(0.13, 0.003, 0xcc2222);
  c.anims.push((t) => {
    const d = new Date();
    const sec = d.getSeconds() + (t % 1);
    ss.rotation.z = -(sec / 60) * Math.PI * 2;
    mm.rotation.z = -((d.getMinutes() + sec / 60) / 60) * Math.PI * 2;
    hh.rotation.z = -(((d.getHours() % 12) + d.getMinutes() / 60) / 12) * Math.PI * 2;
  });

  // mesa de produção
  const mesa = new THREE.Group();
  mesa.position.set(s * 3.35, 0, 1.45);
  virar(mesa, s);
  g.add(mesa);
  bx(mesa, 1.5, 0.05, 0.75, k.madeira, 0, 0.76, 0, 0.008);
  for (const dx of [-0.68, 0.68]) bx(mesa, 0.05, 0.76, 0.66, k.madeiraEsc, dx, 0.38, 0, 0.008);
  const nb = new THREE.Group();
  nb.position.set(-0.2, 0.79, -0.05);
  mesa.add(nb);
  bx(nb, 0.34, 0.012, 0.23, k.aco, 0, 0.006, 0, 0.004);
  const tp = new THREE.Group();
  tp.position.set(0, 0.012, -0.115);
  tp.rotation.x = -0.28;
  nb.add(tp);
  bx(tp, 0.34, 0.22, 0.008, k.aco, 0, 0.11, 0, 0.003);
  const sc = tela(c, est, 0.31, 0.2, 0, 0, (x, W, H) => {
    x.fillStyle = "#f4f6fa";
    x.fillRect(0, 0, W, H);
    x.fillStyle = "#1a7f4b";
    x.fillRect(0, 0, W, 12);
    x.strokeStyle = "rgba(60,70,90,0.5)";
    for (let i = 0; i < 9; i++) {
      x.beginPath();
      x.moveTo(0, 12 + i * 12);
      x.lineTo(W, 12 + i * 12);
      x.stroke();
    }
    for (let i = 0; i < 6; i++) {
      x.beginPath();
      x.moveTo(i * 44, 12);
      x.lineTo(i * 44, H);
      x.stroke();
    }
    x.fillStyle = "rgba(255,30,199,0.5)";
    x.fillRect(46, 36, 42, 11);
    x.fillStyle = "rgba(31,107,237,0.5)";
    x.fillRect(134, 60, 80, 11);
  }, 0.9);
  sc.position.set(0, 0.11, 0.006);
  tp.add(sc);
  cy(mesa, 0.036, 0.032, 0.09, M.std(0xe9e5d6, 0.4), 0.35, 0.845, 0.05, 16);
  cy(mesa, 0.03, 0.03, 0.2, k.cromo, 0.5, 0.88, -0.1, 14);
  const cl = bx(mesa, 0.24, 0.008, 0.32, k.madeiraEsc, 0.25, 0.79, 0.15, 0.003);
  cl.rotation.y = -0.2;
  bx(mesa, 0.21, 0.003, 0.28, k.papel, 0.25, 0.795, 0.15, 0.001).rotation.y = -0.2;
  bx(mesa, 0.2, 0.04, 0.28, k.papel, -0.55, 0.81, 0.1, 0.002).rotation.y = 0.15;
  // rádios no carregador
  bx(mesa, 0.34, 0.03, 0.12, k.preto, -0.55, 0.79, -0.2, 0.006);
  const rd = M.emissivo(0x59ff8e, 2);
  c.pratico(est, rd, 2);
  for (let i = 0; i < 3; i++) {
    bx(mesa, 0.05, 0.16, 0.03, k.plastico, -0.66 + i * 0.11, 0.9, -0.2, 0.008);
    cy(mesa, 0.003, 0.003, 0.08, k.preto, -0.66 + i * 0.11 + 0.018, 1.02, -0.2, 4);
    cy(mesa, 0.006, 0.006, 0.006, rd, -0.66 + i * 0.11, 0.96, -0.183, 8).rotation.x = Math.PI / 2;
  }

  // estante com cases, caixas e carretéis
  const es = new THREE.Group();
  es.position.set(s * (LARG - 0.35), 0, -2.6);
  virar(es, s);
  g.add(es);
  for (const dx of [-0.95, 0.95]) for (const dz of [-0.25, 0.25]) bx(es, 0.04, 2.2, 0.04, k.aco, dx, 1.1, dz, 0.005);
  for (const y of [0.15, 0.95, 1.75]) bx(es, 1.95, 0.035, 0.56, k.madeiraEsc, 0, y, 0, 0.006);
  const kraft = M.std(0xa88a60, 0.9);
  [["FIGURINO", -0.45], ["CENÁRIO", 0.45]].forEach(([t, dx]) => {
    const w = new THREE.Group();
    es.add(w);
    caso(c, w, t as string, 0, 0, 0.17, 1);
    w.children[0].position.set(dx as number, 0.17, 0.0);
    w.children[0].rotation.y = 0;
    w.children[0].scale.setScalar(0.85);
  });
  bx(es, 0.55, 0.38, 0.42, kraft, -0.6, 1.17, 0, 0.01);
  bx(es, 0.56, 0.02, 0.1, M.std(0xd9d2c0, 0.6), -0.6, 1.36, 0.0, 0.003);
  bx(es, 0.45, 0.32, 0.4, kraft, 0.1, 1.15, 0, 0.01);
  bx(es, 0.5, 0.3, 0.38, kraft, 0.7, 1.14, 0.0, 0.01);
  for (let i = 0; i < 3; i++) {
    const cr = new THREE.Group();
    cr.position.set(-0.5 + i * 0.5, 1.9, 0);
    cy(cr, 0.11, 0.11, 0.2, M.std(0xff5938, 0.5), 0, 0, 0, 18).rotation.x = Math.PI / 2;
    cy(cr, 0.05, 0.05, 0.22, k.plastico, 0, 0, 0, 14).rotation.x = Math.PI / 2;
    es.add(cr);
  }
  bx(es, 0.4, 0.28, 0.4, M.std(COR.limao, 0.55), 0.7, 1.9, 0, 0.012);
  c.alvo(est, s * 3.3, 1.3, z, 2.6, 2.8, 5.8);
}

/** 9 · Atuação: baú de adereços, máscaras, espelho de aquecimento; o corredor termina no palco. */
export function estAtuacao(c: Ctx, est: number, z: number, s: number) {
  const { M } = c;
  const k = getKit(c);
  const g = grp(c, z);

  // baú de adereços aberto
  const ba = new THREE.Group();
  ba.position.set(s * 2.3, 0, 0.5);
  ba.rotation.y = -s * 0.5; // de frente para quem entra no palco
  g.add(ba);
  const mad = M.compensado(1, 1, 0x7a5a3c);
  bx(ba, 1.1, 0.5, 0.6, mad, 0, 0.25, 0, 0.02);
  bx(ba, 1.14, 0.045, 0.64, k.aco, 0, 0.5, 0, 0.005);
  bx(ba, 1.14, 0.06, 0.64, k.aco, 0, 0.03, 0, 0.005);
  for (const sx of [-0.4, 0.4]) bx(ba, 0.05, 0.5, 0.62, k.aco, sx, 0.25, 0, 0.005);
  const tampa = new THREE.Group();
  tampa.position.set(0, 0.5, -0.3);
  tampa.rotation.x = -1.9;
  ba.add(tampa);
  bx(tampa, 1.1, 0.04, 0.6, mad, 0, 0.0, 0.3, 0.01);
  const tc = M.tecido(COR.vinho);
  const tec = new THREE.Mesh(new THREE.SphereGeometry(0.28, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), tc);
  tec.scale.set(1.5, 0.55, 0.9);
  tec.position.set(-0.1, 0.5, 0);
  ba.add(tec);
  // coroa
  const co = new THREE.Group();
  co.position.set(0.3, 0.6, 0.05);
  ba.add(co);
  const ouro = M.std(0xd6a736, 0.25, 1);
  const aro = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.014, 8, 24), ouro);
  aro.rotation.x = Math.PI / 2;
  co.add(aro);
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2;
    const p = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.08, 6), ouro);
    p.position.set(Math.cos(a) * 0.1, 0.05, Math.sin(a) * 0.1);
    co.add(p);
    const jj = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 6), M.std(i % 2 ? COR.rosa : COR.azul, 0.2, 0.2));
    jj.position.set(Math.cos(a) * 0.1, 0.095, Math.sin(a) * 0.1);
    co.add(jj);
  }
  co.rotation.set(0.25, 0.4, 0.1);

  // painel com máscaras da comédia e da tragédia
  const pn = new THREE.Group();
  pn.position.set(s * 1.9, 0, -1.9);
  pn.rotation.y = -s * 0.4;
  g.add(pn);
  bx(pn, 1.2, 1.7, 0.04, mad, 0, 1.2, 0, 0.008);
  for (const sx of [-0.5, 0.5]) bx(pn, 0.08, 0.35, 0.3, k.preto, sx, 0.18, -0.12, 0.01);
  const mascara = (cor: number, dx: number, alegre: boolean) => {
    const m = new THREE.Group();
    m.position.set(dx, 1.35, 0.06);
    pn.add(m);
    const rosto = new THREE.Mesh(new THREE.SphereGeometry(0.16, 22, 16), M.std(cor, 0.55));
    rosto.scale.set(0.85, 1.1, 0.34);
    m.add(rosto);
    for (const sx of [-1, 1]) {
      const olho = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), M.std(0x0a0a0a, 0.4));
      olho.scale.set(1.3, alegre ? 0.6 : 1, 0.5);
      olho.position.set(sx * 0.065, 0.05, 0.05);
      olho.rotation.z = (alegre ? 1 : -1) * sx * 0.3;
      m.add(olho);
    }
    const boca = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.011, 6, 18, Math.PI), M.std(0x0a0a0a, 0.4));
    boca.position.set(0, alegre ? -0.065 : -0.1, 0.055);
    boca.rotation.z = alegre ? Math.PI : 0;
    m.add(boca);
    const fita = bx(m, 0.01, 0.4, 0.004, M.std(0xe9e5d6, 0.8), 0, 0.2, -0.0, 0.001);
    void fita;
    c.anims.push((t) => {
      m.rotation.z = Math.sin(t * 0.8 + dx * 3) * 0.04;
    });
  };
  mascara(0xe9e1cc, -0.3, true);
  mascara(COR.rosa, 0.3, false);

  // espelho de aquecimento em pé (cavalete), à esquerda
  const esp = new THREE.Group();
  esp.position.set(-2.7, 1.2, 0.4);
  esp.rotation.y = 0.45;
  g.add(esp);
  bx(esp, 1.2, 2.2, 0.05, k.madeiraEsc, 0, 0, 0, 0.01);
  for (const sx of [-0.55, 0.55]) bx(esp, 0.1, 0.08, 0.5, k.madeiraEsc, sx, -1.16, -0.1, 0.01);
  bx(esp, 0.04, 1.7, 0.04, k.madeiraEsc, 0, -0.3, -0.35, 0.004).rotation.x = 0.35;
  // vara de iluminação sobre a estação (segura o sinal)
  bx(g, 7, 0.06, 0.06, k.preto, 0, 5.5, 1.2, 0.01);
  const ef = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 2.1), M.std(0xdde3e8, 0.04, 1));
  ef.position.z = 0.03;
  esp.add(ef);
  c.alvo(est, s * 1.2, 1.3, z - 3, 6, 2.8, 8);
}

/**
 * Fim do corredor: boca de cena e o PALCO de verdade — tábuas, pernas e bordas de veludo preto,
 * cortina de boca ao fundo, luz-fantasma, feixes do alto e dois atores sob o foco.
 * A estação 9 (Atuação) termina com a câmera aqui dentro, de frente para a cena.
 */
export function construirPalcoFim(c: Ctx) {
  const { M } = c;
  const k = getKit(c);
  const z0 = Z_FIM;
  // moldura da abertura
  const parede = M.std(0x0e0e10, 0.9);
  for (const sx of [-1, 1]) bx(c.mundo, 2.1, ALT, 0.5, parede, sx * 3.45, ALT / 2, z0, 0.01);
  bx(c.mundo, 4.8, ALT - 4.4, 0.5, parede, 0, 4.4 + (ALT - 4.4) / 2, z0, 0.01);

  // piso do palco (as mesmas tábuas do corredor) + poça de luz aditiva por cima
  const chao = new THREE.Mesh(new THREE.PlaneGeometry(22, 26), M.piso(7, 8));
  chao.rotation.x = -Math.PI / 2;
  chao.position.set(0, 0.001, z0 - 13);
  c.mundo.add(chao);
  const poca = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 12),
    new THREE.MeshBasicMaterial({
      map: M.halo, color: 0xffd9a8, transparent: true, opacity: 0.5, depthWrite: false,
      blending: THREE.AdditiveBlending, fog: false,
    }),
  );
  poca.rotation.x = -Math.PI / 2;
  poca.position.set(0.4, 0.012, z0 - 9.6);
  poca.userData.semSombra = true;
  c.mundo.add(poca);

  // pernas e bordas de veludo preto: esconde o vazio e dá cara de palco
  const veludo = M.veludo(0x121216, 1.2, 3);
  for (const sx of [-1, 1])
    for (let i = 0; i < 6; i++) {
      const perna = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 7.4), veludo);
      perna.rotation.y = -sx * Math.PI / 2;
      perna.position.set(sx * (8 + (i % 2) * 0.3), 3.7, z0 - 2.5 - i * 3.6);
      c.mundo.add(perna);
    }
  for (let i = 0; i < 3; i++) bx(c.mundo, 21, 1.5, 0.08, veludo, 0, 6.6, z0 - 4 - i * 6.5, 0.004);
  const aco = M.std(0x7c7f83, 0.35, 0.95);
  for (let i = 0; i < 3; i++) cy(c.mundo, 0.03, 0.03, 20, aco, 0, 5.75, z0 - 4 - i * 6.5, 8).rotation.z = Math.PI / 2;

  // cortina de boca ao fundo
  const dobras = texCanvas(512, 256, (x) => {
    for (let i = 0; i < 512; i++) {
      const f = 0.55 + 0.45 * Math.sin(i * 0.19) * Math.sin(i * 0.031 + 1);
      x.fillStyle = `rgb(${Math.round(150 * f + 20)},${Math.round(8 * f)},${Math.round(30 * f)})`;
      x.fillRect(i, 0, 1, 256);
    }
    const v = x.createLinearGradient(0, 0, 0, 256);
    v.addColorStop(0, "rgba(0,0,0,0.85)");
    v.addColorStop(0.6, "rgba(0,0,0,0.0)");
    v.addColorStop(1, "rgba(0,0,0,0.5)");
    x.fillStyle = v;
    x.fillRect(0, 0, 512, 256);
  });
  const cort = new THREE.Mesh(new THREE.PlaneGeometry(30, 11), new THREE.MeshBasicMaterial({ map: dobras, toneMapped: false, fog: false }));
  cort.position.set(0, 5.4, z0 - 25);
  c.mundo.add(cort);

  // feixes do alto, um sobre cada ator e um lavado frio ao fundo
  for (const [dx, dz, cor] of [[-0.4, -9, 0xffe4bd], [0.9, -12.5, 0xffd9a0], [0.4, -15, 0xbdd0ff]] as const) {
    const f = new THREE.Mesh(new THREE.ConeGeometry(1.55, 9, 16, 1, true).translate(0, -4.5, 0), c.feixe(cor));
    f.position.set(dx, 8.8, z0 + dz);
    f.scale.set(1.1, 1.1, 1.1);
    f.userData.semSombra = true;
    c.mundo.add(f);
  }
  const foco = c.luz(new THREE.PointLight(0xffd6a6, 1, 16, 2), 95);
  foco.position.set(0.2, 5.6, z0 - 9.8);
  c.mundo.add(foco);

  // luz-fantasma (ghost light) no centro do palco
  const gl = new THREE.Group();
  gl.position.set(1.0, 0, z0 - 9.6);
  c.mundo.add(gl);
  cy(gl, 0.012, 0.012, 1.6, k.preto, 0, 0.8, 0, 8);
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    cy(gl, 0.01, 0.01, 0.5, k.preto, Math.cos(a) * 0.17, 0.12, Math.sin(a) * 0.17, 6).rotation.set(Math.sin(a) * 1.15, 0, -Math.cos(a) * 1.15);
  }
  const bulbo = new THREE.Mesh(new THREE.SphereGeometry(0.06, 14, 10), new THREE.MeshBasicMaterial({ color: 0xfff3d6, toneMapped: false, fog: false }));
  bulbo.position.y = 1.65;
  gl.add(bulbo);
  const gaiola = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), new THREE.MeshBasicMaterial({ color: 0x111111, wireframe: true, fog: false }));
  gaiola.position.y = 1.65;
  gl.add(gaiola);
  c.halo(gl, 0, 1.65, 0, 0xffe2b0, 2.4, 9);

  // atores sob o foco, de frente para quem chega
  const roupa = M.std(0x1a1a20, 0.8);
  const ator = pessoa(roupa, { braco: [0, 0], bracoZ: [-2.5, 2.5], antebraco: [0, 0], coxa: [0, 0] });
  ator.g.position.set(-0.4, 0, z0 - 9.0);
  ator.g.rotation.y = 0.25;
  ator.g.scale.setScalar(1.05);
  c.mundo.add(ator.g);
  const ator2 = pessoa(roupa, { braco: [-0.5, -1.6], antebraco: [-0.5, -0.4], coxa: [-0.5, 0.35], canela: [0.5, 0.1], tronco: 0.08 });
  ator2.g.position.set(0.9, 0, z0 - 12.5);
  ator2.g.rotation.y = -0.9;
  c.mundo.add(ator2.g);
  c.anims.push((t) => {
    ator.bracos[0].rotation.z = -2.5 + Math.sin(t * 0.9) * 0.18;
    ator.bracos[1].rotation.z = 2.5 - Math.sin(t * 0.9 + 1) * 0.18;
    ator.g.position.y = Math.abs(Math.sin(t * 1.8)) * 0.02;
    ator2.g.rotation.y = -0.9 + Math.sin(t * 0.4) * 0.15;
  });
  void ZE;
  void LADO;
  void cabo;
}

/** Sinal pendurado identificando a estação: cor da área + forma da marca + nome. */
export interface InfoSinal {
  numero: string;
  nome: string;
  bg: string;
  fg: string;
  shape: string;
  fonte: string;
}
export function construirSinal(c: Ctx, est: number, z: number, s: number, info: InfoSinal) {
  const k = getKit(c);
  const W = 512;
  const H = 256;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const img = new Image();
  let pronta = false;
  const desenhar = () => {
    const x = cv.getContext("2d")!;
    x.clearRect(0, 0, W, H);
    x.fillStyle = info.bg;
    x.beginPath();
    x.roundRect(6, 6, W - 12, H - 12, 26);
    x.fill();
    x.lineWidth = 5;
    x.strokeStyle = "rgba(0,0,0,0.35)";
    x.stroke();
    if (pronta) {
      const t = document.createElement("canvas");
      t.width = t.height = 180;
      const tx = t.getContext("2d")!;
      tx.drawImage(img, 0, 0, 180, 180);
      tx.globalCompositeOperation = "source-in";
      tx.fillStyle = info.fg;
      tx.fillRect(0, 0, 180, 180);
      x.drawImage(t, 24, 38, 180, 180);
    }
    x.fillStyle = info.fg === info.bg ? "#111" : "#16140f";
    x.font = `bold 34px Montserrat, Arial, sans-serif`;
    x.textBaseline = "alphabetic";
    x.fillText(info.numero, 222, 82);
    x.font = `64px ${info.fonte || "Montserrat, Arial, sans-serif"}`;
    const nome = info.nome;
    let tam = 64;
    while (x.measureText(nome).width > 270 && tam > 28) {
      tam -= 4;
      x.font = `${tam}px ${info.fonte || "Montserrat, Arial, sans-serif"}`;
    }
    x.fillText(nome, 222, 150);
    x.font = "bold 20px Montserrat, Arial, sans-serif";
    x.globalAlpha = 0.7;
    x.fillText("ESTAÇÃO", 222, 188);
    x.globalAlpha = 1;
    tex.needsUpdate = true;
  };
  img.onload = () => {
    pronta = true;
    desenhar();
  };
  img.src = `/brand/elementos/elemento-${info.shape}.svg`;
  desenhar();
  if (info.fonte && document.fonts) document.fonts.load(`64px ${info.fonte}`).then(desenhar).catch(() => {});

  const g = new THREE.Group();
  g.position.set(s * 1.9, 3.55, z + 1.2);
  g.rotation.y = s * 0.12;
  c.mundo.add(g);
  const placa = new THREE.Mesh(
    new RoundedPlane(1.5, 0.75),
    new THREE.MeshStandardMaterial({ map: tex, roughness: 0.4, metalness: 0.1, emissiveMap: tex, emissive: 0xffffff, emissiveIntensity: 0.0, alphaTest: 0.5 }),
  );
  c.pratico(est, placa.material as THREE.Material, 0.55);
  g.add(placa);
  const verso = bx(g, 1.5, 0.75, 0.018, k.preto, 0, 0, -0.012, 0.01);
  void verso;
  for (const sx of [-0.62, 0.62]) {
    cy(g, 0.004, 0.004, 1.9, k.aco, sx, 0.95 + 0.37, 0.0, 5);
    cy(g, 0.012, 0.012, 0.04, k.aco, sx, 0.34, 0.0, 8);
  }
  const alvo = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.9, 0.3), new THREE.MeshBasicMaterial({ visible: false }));
  alvo.userData.estacao = est;
  g.add(alvo);
  c.anims.push((t) => {
    g.rotation.z = Math.sin(t * 0.5 + est) * 0.012;
  });
}

// Plano simples (a "placa" usa PlaneGeometry; a borda arredondada vem do canvas).
class RoundedPlane extends THREE.PlaneGeometry {}
