import * as THREE from "three";
import { bx, cy, cabo, COR, texCanvas, type Ctx } from "./comum";
import { getKit, tela, rotulo, virar } from "./kit";

const grp = (c: Ctx, z: number) => {
  const g = new THREE.Group();
  g.position.z = z;
  c.mundo.add(g);
  return g;
};

/** 1 · Iluminação: mesa de luz, rack de dimmers, canhão seguidor, PARs no piso. */
export function estLuz(c: Ctx, est: number, z: number, s: number) {
  const { M } = c;
  const k = getKit(c);
  const g = grp(c, z);

  const mesa = new THREE.Group();
  mesa.position.set(s * 3.15, 0, 0.9);
  virar(mesa, s);
  g.add(mesa);
  bx(mesa, 1.6, 0.76, 0.6, k.preto, 0, 0.38, 0);
  bx(mesa, 1.66, 0.05, 0.64, k.plastico, 0, 0.78, 0);
  const painel = bx(mesa, 1.52, 0.05, 0.44, k.plastico, 0, 0.88, 0.07);
  painel.rotation.x = -0.22;
  const led = [COR.rosa, COR.azul, COR.limao, COR.laranja].map((cor) => {
    const m = M.emissivo(cor, 1.3);
    c.pratico(est, m, 1.3);
    return m;
  });
  const ranhura = M.std(0x050506, 0.6);
  for (let i = 0; i < 16; i++) {
    const x = -0.7 + i * 0.093;
    bx(painel, 0.008, 0.004, 0.22, ranhura, x, 0.027, -0.03, 0.001);
    const cap = bx(painel, 0.028, 0.022, 0.045, i % 5 === 0 ? led[(i / 5) | 0 % 4] : k.branco, x, 0.036, 0, 0.004);
    const ph = i * 0.7;
    c.anims.push((t) => {
      cap.position.z = -0.03 + Math.sin(t * 0.7 + ph) * 0.08;
    });
    for (let r = 0; r < 2; r++) bx(painel, 0.03, 0.012, 0.03, (i + r * 3) % 4 === 0 ? led[(i + r) % 4] : k.plastico, x, 0.03, 0.12 + r * 0.055, 0.003);
  }
  for (const dx of [-0.42, 0.42]) {
    const mon = new THREE.Group();
    mon.position.set(dx, 1.2, -0.18);
    mon.rotation.x = -0.12;
    bx(mon, 0.5, 0.32, 0.03, k.preto, 0, 0, 0);
    const t = tela(c, est, 0.46, 0.28, 0, 0, (x, W, H) => {
      x.fillStyle = "#0a0f1a";
      x.fillRect(0, 0, W, H);
      const cs = ["#ff1ec7", "#1f6bed", "#ddf230", "#ff5938"];
      for (let i = 0; i < 10; i++) {
        x.fillStyle = cs[i % 4];
        x.globalAlpha = 0.85;
        x.fillRect(12 + i * 24, H - 14 - ((i * 37) % 70), 16, ((i * 37) % 70) + 4);
      }
      x.globalAlpha = 0.5;
      x.fillStyle = "#cfd8ff";
      for (let i = 0; i < 6; i++) x.fillRect(12, 12 + i * 11, 70 + ((i * 53) % 90), 3);
    });
    t.position.z = 0.017;
    mon.add(t);
    cy(mon, 0.012, 0.012, 0.5, k.aco, 0, -0.38, -0.03, 8);
    mesa.add(mon);
  }
  // banqueta
  cy(mesa, 0.2, 0.2, 0.05, k.plastico, 0, 0.66, 1.15, 20);
  cy(mesa, 0.02, 0.02, 0.6, k.cromo, 0, 0.34, 1.15, 8);
  cy(mesa, 0.26, 0.26, 0.02, k.preto, 0, 0.03, 1.15, 5);

  // rack de dimmers
  const rack = new THREE.Group();
  rack.position.set(s * 3.9, 0, -1.5);
  virar(rack, s);
  g.add(rack);
  bx(rack, 0.58, 1.95, 0.62, k.preto, 0, 0.98, 0, 0.01);
  const ledVerde = M.emissivo(0x59ff8e, 1.6);
  c.pratico(est, ledVerde, 1.6);
  for (let i = 0; i < 8; i++) {
    const y = 0.25 + i * 0.22;
    bx(rack, 0.5, 0.18, 0.02, k.aco, 0, y, 0.32, 0.003);
    for (let j = 0; j < 6; j++) bx(rack, 0.02, 0.012, 0.012, (i + j) % 3 ? ledVerde : led[j % 4], -0.17 + j * 0.065, y + 0.04, 0.335, 0.002);
    bx(rack, 0.12, 0.012, 0.02, k.plastico, 0.12, y - 0.04, 0.335, 0.003);
  }
  for (let i = 0; i < 3; i++) cabo(g, [[s * 3.9, 1.95, -1.5], [s * (3.75 - i * 0.12), 3.4, -1.3 + i * 0.25], [s * (3.2 - i * 0.2), 5.45, -1 + i * 0.3]], k.cabo, 0.022);

  // canhão seguidor sobre tripé
  const cn = new THREE.Group();
  cn.position.set(s * 2.35, 0, -2.2);
  g.add(cn);
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    const perna = cy(cn, 0.014, 0.014, 1.5, k.aco, Math.cos(a) * 0.28, 0.72, Math.sin(a) * 0.28, 8);
    perna.rotation.set(Math.sin(a) * 0.3, 0, -Math.cos(a) * 0.3);
  }
  cy(cn, 0.03, 0.03, 0.2, k.aco, 0, 1.48, 0, 10);
  const cab = new THREE.Group();
  cab.position.y = 1.62;
  cab.rotation.set(0.0, -s * 1.1 + (s > 0 ? Math.PI : 0), 0);
  const tilt = new THREE.Group();
  tilt.rotation.x = -0.38;
  cab.add(tilt);
  const corpo = cy(tilt, 0.15, 0.15, 0.95, k.preto, 0, 0, 0, 24);
  corpo.rotation.x = Math.PI / 2;
  const cone = cy(tilt, 0.2, 0.15, 0.2, k.preto, 0, 0, 0.55, 24);
  cone.rotation.x = Math.PI / 2;
  const lenteSeg = M.emissivo(COR.quente, 2.0);
  c.pratico(est, lenteSeg, 2.0);
  const lente = new THREE.Mesh(new THREE.CircleGeometry(0.19, 24), lenteSeg);
  lente.position.z = 0.655;
  tilt.add(lente);
  for (let i = 0; i < 5; i++) cy(tilt, 0.162, 0.162, 0.02, k.aco, 0, 0, -0.3 + i * 0.12, 24).rotation.x = Math.PI / 2;
  bx(tilt, 0.04, 0.04, 0.5, k.preto, 0, 0.19, 0.05);
  cy(tilt, 0.012, 0.012, 0.35, k.aco, 0.0, -0.1, -0.5, 8).rotation.x = Math.PI / 2.6;
  bx(cab, 0.46, 0.04, 0.04, k.preto, 0, 0, 0);
  cn.add(cab);
  c.halo(tilt, 0, 0, 0.66, COR.quente, 1.1, est);

  // PARs no piso lavando a cena com cor
  [[COR.rosa, -0.2, -2.6], [COR.azul, 0.4, -1.2], [COR.laranja, -0.6, 0.2]].forEach(([cor, dx, dz], i) => {
    const p = new THREE.Group();
    p.position.set(s * (2.2 + dx), 0.12, dz as number);
    p.rotation.x = -0.35 - i * 0.05;
    p.rotation.y = s * 0.9;
    cy(p, 0.1, 0.1, 0.22, k.preto, 0, 0, 0, 16).rotation.x = Math.PI / 2;
    const m = M.emissivo(cor as number, 2.4);
    c.pratico(est, m, 2.4);
    const l = new THREE.Mesh(new THREE.CircleGeometry(0.095, 16), m);
    l.position.z = 0.112;
    p.add(l);
    bx(p, 0.26, 0.015, 0.05, k.preto, 0, -0.12, 0);
    const f = new THREE.Mesh(new THREE.ConeGeometry(1.55, 9, 18, 1, true).translate(0, -4.5, 0), c.feixe(cor as number));
    f.scale.set(0.16, 0.28, 0.16);
    f.rotation.x = Math.PI / 2 + 0.0;
    f.position.z = 0.115;
    f.userData.semSombra = true;
    p.add(f);
    c.halo(p, 0, 0, 0.12, cor as number, 0.7, est);
    g.add(p);
  });

  // case de transporte e cabos
  caso(c, g, "ILUMINAÇÃO", s * 3.55, 1.7, 0.2, s);
  for (let i = 0; i < 3; i++) cabo(g, [[s * 3.5, 0.02, -1.2], [s * (2.6 - i * 0.3), 0.02, -0.5 + i * 0.5], [s * 3.2, 0.02, 0.9]], k.cabo, 0.014);
  c.alvo(est, s * 3.2, 1.3, z - 0.2, 2.6, 2.8, 5);
}

/** Caixa de transporte (flight case) com ferragens e etiqueta. */
export function caso(c: Ctx, g: THREE.Object3D, texto: string, x: number, zloc: number, y: number, s: number) {
  const k = getKit(c);
  const cs = new THREE.Group();
  cs.position.set(x, y, zloc);
  cs.rotation.y = -s * Math.PI / 2 + 0.1;
  const corpo = bx(cs, 1.0, 0.62, 0.62, c.M.chapa(1, 1, 0x38393b), 0, 0.31, 0, 0.012);
  void corpo;
  for (const sx of [-1, 1])
    for (const sy of [0, 1])
      for (const sz of [-1, 1]) bx(cs, 0.07, 0.07, 0.07, k.aco, sx * 0.485, 0.035 + sy * 0.55, sz * 0.285, 0.008);
  bx(cs, 1.02, 0.03, 0.64, k.aco, 0, 0.62, 0, 0.004);
  for (const sx of [-0.3, 0.3]) {
    bx(cs, 0.1, 0.06, 0.02, k.aco, sx, 0.5, 0.315, 0.004);
    bx(cs, 0.05, 0.02, 0.025, k.preto, sx, 0.5, 0.32, 0.003);
  }
  const t = rotulo(texto, 0.5, 0.14, "#0e0e0e", "#d9d6c8", "bold 36px Montserrat, Arial, sans-serif");
  const et = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.14), new THREE.MeshStandardMaterial({ map: t, roughness: 0.7 }));
  et.position.set(0, 0.28, 0.316);
  cs.add(et);
  for (const sx of [-1, 1]) cy(cs, 0.012, 0.012, 0.13, k.aco, sx * 0.5, 0.45, 0.0, 6).rotation.x = Math.PI / 2;
  g.add(cs);
}

/** 2 · Sonoplastia: mesa de som, caixas de retorno, rack, microfone, cabos. */
export function estSom(c: Ctx, est: number, z: number, s: number) {
  const { M } = c;
  const k = getKit(c);
  const g = grp(c, z);

  const mesa = new THREE.Group();
  mesa.position.set(s * 3.0, 0, 0);
  virar(mesa, s);
  g.add(mesa);
  mesa.rotation.y = -s * Math.PI / 2;
  bx(mesa, 2.1, 0.78, 0.74, k.preto, 0, 0.39, 0);
  const tampo = bx(mesa, 2.0, 0.07, 0.62, k.plastico, 0, 0.84, 0.06, 0.012);
  tampo.rotation.x = -0.2;
  const knobC = [0xe9e5d6, COR.azul, COR.laranja, COR.rosa].map((cor) => M.std(cor, 0.45));
  const vu: THREE.Mesh[] = [];
  const mVu = M.emissivo(COR.limao, 1.8);
  c.pratico(est, mVu, 1.8);
  const canais = c.leve ? 12 : 20;
  for (let i = 0; i < canais; i++) {
    const x = -0.9 + (i * 1.8) / (canais - 1);
    bx(tampo, 0.07, 0.004, 0.62, i % 2 ? k.plastico : k.preto, x, 0.036, 0, 0.001);
    bx(tampo, 0.008, 0.004, 0.2, M.std(0x020203), x, 0.04, 0.12, 0.001);
    const cap = bx(tampo, 0.032, 0.026, 0.05, k.branco, x, 0.048, 0.12, 0.005);
    const ph = i * 0.6;
    c.anims.push((t) => {
      cap.position.z = 0.12 + Math.sin(t * 0.6 + ph) * 0.07;
    });
    for (let r = 0; r < 3; r++) cy(tampo, 0.013, 0.015, 0.02, knobC[(i + r) % 4], x, 0.05, -0.22 - r * 0.075 + 0.22, 10);
    const gv = new THREE.BoxGeometry(0.014, 0.1, 0.012);
    gv.translate(0, 0.05, 0);
    const bar = new THREE.Mesh(gv, mVu);
    bar.position.set(x, 0.04, -0.26);
    tampo.add(bar);
    vu.push(bar);
  }
  c.anims.push((t) => {
    vu.forEach((b, i) => {
      b.scale.y = 0.15 + Math.abs(Math.sin(t * 4.2 + i * 1.3)) * (0.5 + 0.5 * Math.sin(t * 1.3 + i));
    });
  });
  // notebook com forma de onda
  const nb = new THREE.Group();
  nb.position.set(0.55, 0.9, -0.08);
  nb.rotation.x = -0.2;
  bx(nb, 0.36, 0.01, 0.25, k.aco, 0, 0, 0, 0.004);
  const tl = bx(nb, 0.36, 0.23, 0.008, k.aco, 0, 0.115, -0.125, 0.004);
  tl.rotation.x = -0.35;
  const sc = tela(c, est, 0.33, 0.2, 0, 0, (x, W, H) => {
    x.fillStyle = "#0b1118";
    x.fillRect(0, 0, W, H);
    x.strokeStyle = "#ff5938";
    x.lineWidth = 2;
    x.beginPath();
    for (let i = 0; i < W; i += 3) {
      const a = Math.sin(i * 0.09) * Math.sin(i * 0.013) * H * 0.34;
      x.moveTo(i, H / 2 - a);
      x.lineTo(i, H / 2 + a);
    }
    x.stroke();
  });
  sc.position.set(0, 0.002, 0.006);
  tl.add(sc);
  tampo.add(nb);
  nb.position.set(0.5, 0.06, -0.1);
  // fone de ouvido
  const fo = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.012, 8, 20, Math.PI), k.preto);
  fo.position.set(-0.45, 0.1, -0.05);
  tampo.add(fo);
  for (const sx of [-1, 1]) cy(tampo, 0.045, 0.045, 0.035, k.plastico, -0.45 + sx * 0.08, 0.04, -0.05, 14).rotation.z = Math.PI / 2;

  // caixas de retorno com woofer animado
  [[-2.1, 1], [2.3, -1]].forEach(([dz, side], i) => {
    const cx = new THREE.Group();
    cx.position.set(s * 3.55, 0, dz as number);
    cx.rotation.y = -s * Math.PI / 2 + (side as number) * 0.25;
    g.add(cx);
    bx(cx, 0.56, 0.9, 0.46, k.preto, 0, 1.1, 0, 0.02);
    const gr = bx(cx, 0.5, 0.82, 0.02, M.chapa(2, 3, 0x2a2a2a), 0, 1.1, 0.235, 0.004);
    void gr;
    const aro = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.018, 8, 28), k.borracha);
    aro.position.set(0, 0.98, 0.248);
    cx.add(aro);
    const cone = new THREE.Mesh(
      new THREE.LatheGeometry([[0.0001, 0.0], [0.04, 0.0], [0.15, -0.05]].map(([r, y]) => new THREE.Vector2(r, y)), 20),
      k.borracha,
    );
    cone.rotation.x = Math.PI / 2;
    cone.position.set(0, 0.98, 0.25);
    cx.add(cone);
    const trb = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.01, 6, 14), k.aco);
    trb.position.set(0, 1.35, 0.248);
    cx.add(trb);
    bx(cx, 0.14, 0.04, 0.02, k.plastico, 0, 0.7, 0.24, 0.004);
    for (const sx of [-1, 1]) bx(cx, 0.03, 0.1, 0.03, k.preto, sx * 0.29, 1.3, 0, 0.005);
    // tripé
    cy(cx, 0.018, 0.018, 0.65, k.cromo, 0, 0.32, 0, 10);
    for (let l = 0; l < 3; l++) {
      const a = (l / 3) * Math.PI * 2 + 0.5;
      cy(cx, 0.012, 0.012, 0.62, k.cromo, Math.cos(a) * 0.2, 0.28, Math.sin(a) * 0.2, 6).rotation.set(Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5);
    }
    c.anims.push((t) => {
      const b = Math.pow(Math.max(0, Math.sin(t * 4 + i * 1.6)), 5);
      cone.position.z = 0.25 - b * 0.012;
      cone.scale.setScalar(1 + b * 0.1);
      aro.scale.setScalar(1 + b * 0.015);
    });
  });

  // rack de áudio
  const rack = new THREE.Group();
  rack.position.set(s * 3.95, 0, 1.9);
  virar(rack, s);
  g.add(rack);
  bx(rack, 0.56, 1.25, 0.55, k.preto, 0, 0.64, 0, 0.01);
  const amb = M.emissivo(0xffa63a, 1.6);
  const vde = M.emissivo(0x59ff8e, 1.6);
  c.pratico(est, amb, 1.6);
  c.pratico(est, vde, 1.6);
  for (let i = 0; i < 6; i++) {
    const y = 0.2 + i * 0.18;
    bx(rack, 0.5, 0.15, 0.02, k.aco, 0, y, 0.28, 0.003);
    for (let j = 0; j < 7; j++) bx(rack, 0.014, 0.014, 0.012, (i + j) % 3 ? vde : amb, -0.2 + j * 0.03, y + 0.035, 0.292, 0.002);
    for (let j = 0; j < 3; j++) cy(rack, 0.014, 0.014, 0.02, k.plastico, 0.05 + j * 0.06, y - 0.01, 0.295, 10).rotation.x = Math.PI / 2;
  }

  // microfone de pedestal
  const mic = new THREE.Group();
  mic.position.set(s * 2.0, 0, 1.9);
  g.add(mic);
  cy(mic, 0.14, 0.15, 0.03, k.preto, 0, 0.015, 0, 20);
  cy(mic, 0.012, 0.012, 1.5, k.preto, 0, 0.78, 0, 8);
  const boom = cy(mic, 0.008, 0.008, 0.6, k.preto, -s * 0.2, 1.55, 0, 8);
  boom.rotation.z = Math.PI / 2 - s * 0.35;
  const mc = new THREE.Mesh(new THREE.CapsuleGeometry(0.025, 0.1, 4, 10), k.cromo);
  mc.position.set(-s * 0.48, 1.62, 0);
  mc.rotation.z = Math.PI / 2;
  mic.add(mc);
  const pop = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.004, 6, 24), k.preto);
  pop.position.set(-s * 0.56, 1.6, 0);
  pop.rotation.y = Math.PI / 2;
  mic.add(pop);

  caso(c, g, "SOM", s * 3.6, 0.0, 0.0, s);
  for (let i = 0; i < 5; i++) cabo(g, [[s * 3.3, 0.02, 0.3 + i * 0.1], [s * (2.4 - i * 0.12), 0.02, -0.5 - i * 0.2], [s * 3.5, 0.02, i % 2 ? -2.1 : 2.3]], k.cabo, 0.014);
  c.alvo(est, s * 3.2, 1.2, z, 2.4, 2.6, 5.4);
}

/** 3 · Cenografia: verso de painéis, painel pintado, maquete, latas de tinta, escada. */
export function estCenografia(c: Ctx, est: number, z: number, s: number) {
  const { M } = c;
  const k = getKit(c);
  const g = grp(c, z);
  const mad = M.compensado(0.7, 2.2, 0xa8957c);

  // painéis (flats) encostados, vistos por trás: bastidor de madeira
  for (let i = 0; i < 4; i++) {
    const f = new THREE.Group();
    f.position.set(s * (4.05 - i * 0.04), 0, -1.7 + i * 0.95);
    f.rotation.z = -s * (0.07 + i * 0.012);
    f.rotation.y = (i % 2 ? 1 : -1) * 0.04;
    g.add(f);
    bx(f, 0.012, 3.3, 0.92, M.std(0xcfc7b3, 0.95), 0, 1.7, 0, 0.002); // musselina
    for (const dz of [-0.44, 0.44]) bx(f, 0.075, 3.3, 0.04, mad, -s * 0.04, 1.7, dz, 0.004);
    for (const y of [0.05, 1.0, 1.7, 2.4, 3.3]) bx(f, 0.075, 0.04, 0.88, mad, -s * 0.04, y, 0, 0.004);
    for (const y of [0.35, 2.9]) bx(f, 0.012, 0.1, 0.12, k.aco, -s * 0.08, y, 0.44, 0.002); // ferragens
    const esc = bx(f, 0.04, 2.6, 0.04, mad, -s * 0.7, 1.2, 0.2, 0.004);
    esc.rotation.z = s * 0.6;
    bx(f, 0.3, 0.07, 0.2, k.preto, -s * 0.9, 0.04, 0.2, 0.01); // peso de palco
  }
  // painel pintado de frente: arco, lua e casas, em cores da marca
  const pint = texCanvas(256, 512, (x) => {
    x.fillStyle = "#eadfc8";
    x.fillRect(0, 0, 256, 512);
    x.fillStyle = "#1f6bed";
    x.fillRect(0, 0, 256, 300);
    x.fillStyle = "#f2f1e8";
    x.beginPath();
    x.arc(176, 110, 46, 0, 7);
    x.fill();
    x.fillStyle = "#750015";
    x.fillRect(0, 300, 256, 212);
    x.fillStyle = "#ff1ec7";
    x.beginPath();
    x.arc(100, 380, 70, Math.PI, 0);
    x.fill();
    x.fillStyle = "#1d1d1b";
    x.beginPath();
    x.arc(100, 380, 38, Math.PI, 0);
    x.fill();
    x.fillRect(62, 380, 76, 132);
    x.fillStyle = "#ddf230";
    x.fillRect(196, 330, 44, 90);
    x.fillStyle = "#ff5938";
    x.beginPath();
    x.moveTo(190, 330);
    x.lineTo(218, 296);
    x.lineTo(246, 330);
    x.fill();
    for (let i = 0; i < 1400; i++) {
      x.fillStyle = `rgba(255,255,255,${Math.random() * 0.05})`;
      x.fillRect(Math.random() * 256, Math.random() * 512, 3, 3);
    }
  });
  const pf = new THREE.Group();
  pf.position.set(s * 2.55, 0, 1.25);
  pf.rotation.y = -s * Math.PI / 2 + s * 0.35;
  g.add(pf);
  const pp = new THREE.Mesh(new THREE.BoxGeometry(1.25, 2.5, 0.05), [k.madeira, k.madeira, k.madeira, k.madeira, new THREE.MeshStandardMaterial({ map: pint, roughness: 0.85 }), k.madeira]);
  pp.position.y = 1.25;
  pf.add(pp);
  for (const sx of [-0.45, 0.45]) {
    bx(pf, 0.06, 0.35, 0.4, k.preto, sx, 0.2, -0.28, 0.008);
    const br = bx(pf, 0.04, 1.6, 0.04, mad, sx, 0.9, -0.2, 0.004);
    br.rotation.x = 0.42;
  }

  // maquete do cenário numa mesa
  const mq = new THREE.Group();
  mq.position.set(s * 3.3, 0, -0.1);
  g.add(mq);
  bx(mq, 1.0, 0.04, 0.7, k.madeira, 0, 0.76, 0, 0.005);
  for (const [dx, dz] of [[-0.45, -0.3], [0.45, -0.3], [-0.45, 0.3], [0.45, 0.3]]) bx(mq, 0.05, 0.76, 0.05, k.madeiraEsc, dx, 0.38, dz, 0.005);
  const caixaM = new THREE.Group();
  caixaM.position.y = 0.78;
  mq.add(caixaM);
  const papelM = M.std(0xe8e2d2, 0.9);
  bx(caixaM, 0.7, 0.01, 0.5, M.std(0x252320, 0.7), 0, 0.005, 0, 0.002);
  bx(caixaM, 0.7, 0.42, 0.01, papelM, 0, 0.21, -s * 0.25, 0.002);
  bx(caixaM, 0.01, 0.42, 0.5, papelM, -0.35, 0.21, 0, 0.002);
  bx(caixaM, 0.01, 0.42, 0.5, papelM, 0.35, 0.21, 0, 0.002);
  bx(caixaM, 0.7, 0.01, 0.5, papelM, 0, 0.42, 0, 0.002);
  const arq = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.012, 6, 20, Math.PI), M.std(COR.azul, 0.6));
  arq.position.set(0.1, 0.01, -s * 0.12);
  caixaM.add(arq);
  const lua = new THREE.Mesh(new THREE.CircleGeometry(0.05, 18), M.std(COR.creme, 0.7));
  lua.position.set(-0.15, 0.28, -s * 0.243);
  caixaM.add(lua);
  bx(caixaM, 0.13, 0.12, 0.01, M.std(COR.rosa, 0.7), -0.2, 0.07, 0.05, 0.002);
  bx(caixaM, 0.1, 0.2, 0.01, M.std(COR.limao, 0.7), 0.22, 0.1, 0.0, 0.002);
  const figM = new THREE.Mesh(new THREE.ConeGeometry(0.014, 0.06, 8), M.std(COR.creme, 0.6));
  figM.position.set(0.02, 0.04, 0.08);
  caixaM.add(figM);
  const mLamp = M.emissivo(0xffd9a0, 2.2);
  c.pratico(est, mLamp, 2.2);
  const lp = new THREE.Mesh(new THREE.SphereGeometry(0.018, 10, 8), mLamp);
  lp.position.set(0, 0.4, 0);
  caixaM.add(lp);
  c.halo(caixaM, 0, 0.4, 0, 0xffc880, 0.5, est);

  // latas de tinta, pincéis e lona suja
  const lona = texCanvas(256, 256, (x) => {
    x.fillStyle = "#cfc7b3";
    x.fillRect(0, 0, 256, 256);
    const cs = ["#ff1ec7", "#1f6bed", "#ddf230", "#ff5938", "#750015"];
    for (let i = 0; i < 26; i++) {
      x.fillStyle = cs[i % 5];
      x.globalAlpha = 0.65;
      x.beginPath();
      x.ellipse(Math.random() * 256, Math.random() * 256, 4 + Math.random() * 16, 3 + Math.random() * 9, Math.random() * 3, 0, 7);
      x.fill();
    }
  });
  const lonaM = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.1), new THREE.MeshStandardMaterial({ map: lona, roughness: 0.95, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
  lonaM.rotation.set(-Math.PI / 2, 0, 0.3);
  lonaM.position.set(s * 2.1, 0.006, -1.4);
  g.add(lonaM);
  [[COR.rosa, 0], [COR.azul, 1], [COR.limao, 2], [0xe9e5d6, 3]].forEach(([cor, i]) => {
    const x = s * (1.8 + (i as number) * 0.3);
    const zz = -1.5 + ((i as number) % 2) * 0.3;
    cy(g, 0.11, 0.1, 0.24, M.std(0xb6b9bc, 0.35, 0.9), x, 0.12, zz, 20);
    const tp = cy(g, 0.095, 0.095, 0.01, M.std(cor as number, 0.35), x, 0.243, zz, 20);
    void tp;
    const al = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.006, 5, 18, Math.PI), k.aco);
    al.position.set(x, 0.24, zz);
    al.rotation.set(0, i ? 0.5 : 0, 0);
    g.add(al);
  });
  const jarra = cy(g, 0.05, 0.05, 0.14, M.std(0xaec4d2, 0.2), s * 3.0, 0.07, 0.95, 14);
  void jarra;
  for (let i = 0; i < 4; i++) cy(g, 0.004, 0.006, 0.16, k.madeiraEsc, s * 3.0 + (i - 1.5) * 0.015, 0.2, 0.95 + (i % 2) * 0.01, 5).rotation.z = (i - 1.5) * 0.12;

  // escada de abrir
  const es = new THREE.Group();
  es.position.set(s * 2.0, 0, 2.55);
  es.rotation.y = -s * Math.PI / 2 + 0.15;
  g.add(es);
  for (const dz of [-0.2, 0.2]) {
    const r = bx(es, 0.05, 2.1, 0.03, k.aco, 0.0, 1.0, dz, 0.004);
    r.rotation.x = dz * 0.9;
  }
  for (let i = 0; i < 6; i++) bx(es, 0.05, 0.03, 0.46 - i * 0.04, k.aco, 0, 0.3 + i * 0.32, 0, 0.003).rotation.z = 0;
  void cy;
  c.alvo(est, s * 3.1, 1.4, z, 2.6, 3, 5.4);
}

/** 4 · Figurino: araras, vestidos, jaquetas, manequim de costura, máquina de costura. */
export function estFigurino(c: Ctx, est: number, z: number, s: number) {
  const { M } = c;
  const k = getKit(c);
  const g = grp(c, z);

  const vestido = (cor: number, h: number, rt: number, rb: number, ph: number) => {
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= 12; i++) {
      const t = i / 12;
      pts.push(new THREE.Vector2(rt + (rb - rt) * Math.pow(t, 1.5), -t * h));
    }
    const geo = new THREE.LatheGeometry(pts, 40);
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const a = Math.atan2(p.getZ(i), p.getX(i));
      const kk = 1 + 0.07 * Math.sin(a * 13 + ph) * (-p.getY(i) / h);
      p.setX(i, p.getX(i) * kk);
      p.setZ(i, p.getZ(i) * kk);
    }
    geo.computeVertexNormals();
    return new THREE.Mesh(geo, M.tecido(cor));
  };
  const jaqueta = (cor: number) => {
    const j = new THREE.Group();
    const t = M.tecido(cor);
    bx(j, 0.36, 0.6, 0.15, t, 0, -0.35, 0, 0.04);
    for (const sx of [-1, 1]) {
      const m = bx(j, 0.11, 0.55, 0.11, t, sx * 0.23, -0.34, 0, 0.04);
      m.rotation.z = sx * 0.1;
    }
    bx(j, 0.16, 0.05, 0.17, t, 0, -0.07, 0, 0.02);
    return j;
  };
  const cores = [0x5a1a22, 0x1c2540, 0xb59a3a, 0xd9d2c0, 0x17171a, COR.rosa, 0x3a4a3a, 0x7a2a3a];
  const arara = (zz: number, n: number, dx: number) => {
    const r = new THREE.Group();
    r.position.set(s * (3.5 + dx), 0, zz);
    g.add(r);
    for (const sz of [-0.8, 0.8]) {
      cy(r, 0.015, 0.015, 1.75, k.cromo, 0, 0.9, sz, 10);
      bx(r, 0.5, 0.03, 0.04, k.cromo, 0, 0.05, sz, 0.005);
      for (const sx of [-0.22, 0.22]) cy(r, 0.04, 0.04, 0.025, k.borracha, sx, 0.04, sz, 12).rotation.z = Math.PI / 2;
    }
    const tr = cy(r, 0.013, 0.013, 1.65, k.cromo, 0, 1.76, 0, 10);
    tr.rotation.x = Math.PI / 2;
    for (let i = 0; i < n; i++) {
      const piv = new THREE.Group();
      piv.position.set(0, 1.76, -0.72 + (i * 1.44) / (n - 1));
      const ph = i * 0.9 + zz;
      const cor = cores[(i + (zz > z ? 0 : 3)) % cores.length];
      const hook = new THREE.Mesh(new THREE.TorusGeometry(0.025, 0.004, 5, 10, Math.PI * 1.5), k.cromo);
      hook.rotation.y = Math.PI / 2;
      hook.position.y = 0.02;
      piv.add(hook);
      bx(piv, 0.003, 0.003, 0.4, k.cromo, 0, -0.04, 0, 0.001);
      if (i % 3 === 1) {
        const j = jaqueta(cor);
        j.rotation.y = Math.PI / 2;
        piv.add(j);
      } else {
        const v = vestido(cor, 1.1 + (i % 2) * 0.2, 0.11, 0.3 + (i % 3) * 0.05, ph);
        v.position.y = -0.1;
        piv.add(v);
      }
      c.anims.push((t) => {
        piv.rotation.x = Math.sin(t * 0.9 + ph) * 0.05;
        piv.rotation.z = Math.sin(t * 0.6 + ph * 1.7) * 0.035;
      });
      r.add(piv);
    }
  };
  arara(1.2, c.leve ? 6 : 9, 0.0);
  arara(-1.3, c.leve ? 5 : 7, 0.05);

  // manequim de costura com tecido alfinetado
  const mn = new THREE.Group();
  mn.position.set(s * 2.45, 0, 0.1);
  mn.rotation.y = -s * Math.PI / 2 + 0.5;
  g.add(mn);
  const perfil = [[0.0001, 0], [0.12, 0.02], [0.17, 0.12], [0.13, 0.3], [0.16, 0.45], [0.18, 0.55], [0.11, 0.68], [0.055, 0.74], [0.0001, 0.77]].map(([r, y]) => new THREE.Vector2(r, y));
  const torso = new THREE.Mesh(new THREE.LatheGeometry(perfil, 28), M.std(0xcdbfa3, 0.92));
  torso.position.y = 0.95;
  mn.add(torso);
  cy(mn, 0.03, 0.03, 0.06, k.cromo, 0, 1.76, 0, 10);
  cy(mn, 0.014, 0.014, 0.95, k.cromo, 0, 0.47, 0, 8);
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    cy(mn, 0.012, 0.012, 0.5, k.preto, Math.cos(a) * 0.2, 0.03, Math.sin(a) * 0.2, 6).rotation.set(Math.sin(a) * 1.35, 0, -Math.cos(a) * 1.35);
  }
  const drap = vestido(COR.rosa, 0.7, 0.19, 0.3, 1);
  drap.position.y = 1.35;
  mn.add(drap);
  const fita = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.009, 6, 28), M.std(0xe8c43a, 0.6));
  fita.rotation.x = Math.PI / 2;
  fita.position.y = 1.4;
  mn.add(fita);

  // mesa com máquina de costura
  const ms = new THREE.Group();
  ms.position.set(s * 3.5, 0, -2.5);
  ms.rotation.y = -s * Math.PI / 2;
  g.add(ms);
  bx(ms, 1.3, 0.05, 0.65, k.madeira, 0, 0.78, 0, 0.006);
  for (const [dx, dz] of [[-0.6, -0.28], [0.6, -0.28], [-0.6, 0.28], [0.6, 0.28]]) bx(ms, 0.05, 0.78, 0.05, k.madeiraEsc, dx, 0.39, dz, 0.005);
  const mq = new THREE.Group();
  mq.position.set(-0.15, 0.805, 0.0);
  ms.add(mq);
  const esm = M.std(0xd9d4c2, 0.28, 0.2);
  bx(mq, 0.4, 0.04, 0.18, esm, 0, 0.02, 0, 0.012);
  bx(mq, 0.07, 0.3, 0.12, esm, 0.15, 0.18, 0, 0.02);
  bx(mq, 0.36, 0.07, 0.12, esm, 0.0, 0.32, 0, 0.025);
  bx(mq, 0.09, 0.14, 0.11, esm, -0.17, 0.27, 0, 0.02);
  cy(mq, 0.004, 0.004, 0.1, k.cromo, -0.17, 0.15, 0.0, 6);
  cy(mq, 0.05, 0.05, 0.03, k.preto, 0.22, 0.3, 0.07, 18).rotation.x = Math.PI / 2;
  cy(mq, 0.012, 0.012, 0.07, k.cromo, 0.0, 0.39, 0, 8);
  const carretel = cy(mq, 0.025, 0.025, 0.05, M.std(COR.rosa, 0.5), 0.05, 0.4, 0, 12);
  void carretel;
  const tecido = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.3, 6, 6), M.tecido(COR.rosa));
  const pp = tecido.geometry.attributes.position;
  for (let i = 0; i < pp.count; i++) pp.setZ(i, Math.sin(pp.getX(i) * 14) * 0.012 + Math.cos(pp.getY(i) * 11) * 0.008);
  tecido.geometry.computeVertexNormals();
  tecido.rotation.x = -Math.PI / 2;
  tecido.position.set(-0.25, 0.057, 0.12);
  tecido.rotation.z = 0.35;
  mq.add(tecido);
  // tesoura
  for (const a of [0.25, -0.25]) {
    const l = bx(ms, 0.012, 0.004, 0.2, k.aco, 0.35, 0.82, 0.12, 0.001);
    l.rotation.y = a;
    const an = new THREE.Mesh(new THREE.TorusGeometry(0.025, 0.005, 5, 12), k.preto);
    an.rotation.x = Math.PI / 2;
    an.position.set(0.35 - Math.sin(a) * 0.1, 0.82, 0.12 + Math.cos(a) * 0.12);
    ms.add(an);
  }
  // luminária articulada
  const mlz = M.emissivo(0xffe2b0, 2);
  c.pratico(est, mlz, 2);
  cy(ms, 0.06, 0.06, 0.02, k.preto, 0.5, 0.815, -0.2, 16);
  const braco = cy(ms, 0.007, 0.007, 0.55, k.preto, 0.5, 1.1, -0.2, 6);
  braco.rotation.z = 0.2;
  const sh = cy(ms, 0.01, 0.07, 0.09, k.preto, 0.4, 1.4, -0.2, 16);
  sh.rotation.z = 0.5;
  const bl = new THREE.Mesh(new THREE.SphereGeometry(0.025, 10, 8), mlz);
  bl.position.set(0.41, 1.36, -0.2);
  ms.add(bl);
  c.halo(ms, 0.41, 1.36, -0.2, 0xffd08a, 0.8, est);

  // carretéis de linha na parede
  if (!c.leve) {
    const cs = [0xd9d2c0, 0x5a1a22, 0x1c2540, 0xb59a3a, COR.rosa, 0x17171a, 0x3a4a3a, COR.azul, 0xe9e5d6];
    bx(c.mundo, 0.03, 0.56, 1.8, k.madeiraEsc, s * 4.42, 2.3, z - 2.5, 0.005);
    for (let r = 0; r < 4; r++)
      for (let q = 0; q < 12; q++) {
        const cr = cy(c.mundo, 0.022, 0.022, 0.05, M.std(cs[(r * 5 + q) % cs.length], 0.6), s * 4.38, 2.1 + r * 0.14, z - 2.5 - 0.8 + q * 0.145, 10);
        cr.rotation.z = Math.PI / 2;
      }
  }
  // rolos de tecido no chão
  [0x7a2a3a, 0xd9d2c0, 0x1c2540, 0x3a4a3a].forEach((cor, i) => {
    const r = cy(g, 0.1, 0.1, 1.0, M.tecido(cor), s * 4.0, 0.1 + Math.floor(i / 3) * 0.19, 2.6 + (i % 3) * 0.2, 18);
    r.rotation.x = Math.PI / 2;
    r.rotation.z = 0.0;
  });
  // chapéu
  const ch = new THREE.Group();
  ch.position.set(s * 3.2, 0.81, -2.0);
  cy(ch, 0.11, 0.12, 0.14, M.tecido(0x17171a), 0, 0.07, 0, 20);
  cy(ch, 0.2, 0.2, 0.012, M.tecido(0x17171a), 0, 0.006, 0, 24);
  cy(ch, 0.121, 0.121, 0.035, M.std(COR.vinho, 0.6), 0, 0.04, 0, 20);
  c.mundo.add(ch);
  ch.position.z += z;
  c.alvo(est, s * 3.3, 1.2, z, 2.6, 2.6, 5.6);
}
