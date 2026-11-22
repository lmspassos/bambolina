"use client";

import { useEffect, useRef } from "react";
import {
  AmbientLight,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  DirectionalLight,
  DoubleSide,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  Shape,
  ShapeGeometry,
  SRGBColorSpace,
  TorusGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
  Path,
} from "three";
import { CH, CW, carregaImagens, desenhaFrente, desenhaVerso, type Imgs } from "./texturas";

// Cartão (unidades do mundo). A origem local é o centro do furo, onde o cordão prende.
const W = 1.35;
const H = 2.3;
const R = 0.12;
const SLOT_Y = 0.14; // distância do furo à borda de cima
const SLOT_W = 0.5;
const SLOT_H = 0.09;
const D = H - SLOT_Y - 0.3; // vara rígida furo → ponto pesado (perto da borda de baixo)

// Cordão
const N = 7; // segmentos do cordão
const SEG = 0.7 / N; // cordão curto: nasce na borda de cima das caixas e o cartão fica no meio
const G = 26;
const DT = 1 / 60;

// Câmera: altura visível fixa (≈4) para o cartão ter o mesmo tamanho em qualquer proporção.
const CAM_Z = 6.6;
const CAM_FOV = 30;
const VIS_H = 2 * CAM_Z * Math.tan((CAM_FOV * Math.PI) / 360);
const ANCORA_Y = VIS_H / 2 + 0.15; // o cordão nasce logo acima da borda de cima

type Props = { marcadas: boolean[]; nome: string; onFalha: () => void };

export default function CrachaCanvas({ marcadas, nome, onFalha }: Props) {
  const raiz = useRef<HTMLDivElement>(null);
  const swungRef = useRef<HTMLSpanElement>(null);
  const displayRef = useRef<HTMLSpanElement>(null);
  const marcadasRef = useRef(marcadas);
  const nomeRef = useRef(nome);
  const apiRef = useRef<{ redesenha: () => void; vira: () => void } | null>(null);

  useEffect(() => {
    marcadasRef.current = marcadas;
    nomeRef.current = nome;
    apiRef.current?.redesenha();
  }, [marcadas, nome]);

  useEffect(() => {
    const el = raiz.current!;
    const reduzido = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    } catch {
      onFalha();
      return;
    }
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.domElement.className = "size-full block lg:[filter:drop-shadow(0_18px_26px_rgba(0,0,0,.55))]";
    renderer.domElement.setAttribute("aria-hidden", "true");
    el.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new PerspectiveCamera(CAM_FOV, 1, 0.1, 50);
    camera.position.set(0, 0, CAM_Z);
    scene.add(new AmbientLight(0xffffff, 1.5));
    const luz = new DirectionalLight(0xffffff, 1.1);
    luz.position.set(2, 3, 6);
    scene.add(luz);

    // ---------- texturas ----------
    const fam = (r: React.RefObject<HTMLSpanElement | null>) => (r.current ? getComputedStyle(r.current).fontFamily : "sans-serif");
    const mk = () => {
      const c = document.createElement("canvas");
      c.width = CW;
      c.height = CH;
      const t = new CanvasTexture(c);
      t.colorSpace = SRGBColorSpace;
      t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      // UV do ShapeGeometry = coordenadas do shape → mapeia para 0..1
      t.repeat.set(1 / W, 1 / H);
      t.offset.set(0.5, (H - SLOT_Y) / H);
      return t;
    };
    const texF = mk();
    const texV = mk();

    let imgs: Imgs | null = null;
    const redesenha = () => {
      const f = { swung: fam(swungRef), display: fam(displayRef) };
      desenhaFrente(texF.image.getContext("2d")!, f, marcadasRef.current, imgs, nomeRef.current);
      desenhaVerso(texV.image.getContext("2d")!, f, imgs);
      texF.needsUpdate = true;
      texV.needsUpdate = true;
      quadro();
    };
    Promise.all([
      document.fonts.load(`64px ${fam(swungRef)}`),
      document.fonts.load(`800 70px ${fam(displayRef)}`),
      carregaImagens().then((i) => { imgs = i; }, () => {}),
    ]).then(redesenha, redesenha);

    // ---------- cartão ----------
    const forma = new Shape();
    const x0 = -W / 2, x1 = W / 2, y0 = -(H - SLOT_Y), y1 = SLOT_Y;
    forma.moveTo(x0 + R, y0);
    forma.lineTo(x1 - R, y0);
    forma.quadraticCurveTo(x1, y0, x1, y0 + R);
    forma.lineTo(x1, y1 - R);
    forma.quadraticCurveTo(x1, y1, x1 - R, y1);
    forma.lineTo(x0 + R, y1);
    forma.quadraticCurveTo(x0, y1, x0, y1 - R);
    forma.lineTo(x0, y0 + R);
    forma.quadraticCurveTo(x0, y0, x0 + R, y0);
    const furo = new Path();
    const rr = SLOT_H / 2, sx0 = -SLOT_W / 2 + rr, sx1 = SLOT_W / 2 - rr;
    furo.moveTo(sx1, -rr);
    furo.absarc(sx1, 0, rr, -Math.PI / 2, Math.PI / 2, false);
    furo.absarc(sx0, 0, rr, Math.PI / 2, (3 * Math.PI) / 2, false);
    furo.closePath();
    forma.holes.push(furo);

    const gCorpo = new ExtrudeGeometry(forma, { depth: 0.04, bevelEnabled: false, curveSegments: 8 });
    gCorpo.translate(0, 0, -0.02);
    const gFace = new ShapeGeometry(forma, 8);
    const mCorpo = new MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6 });
    const matFace = (map: CanvasTexture) => new MeshStandardMaterial({ map, roughness: 0.5, metalness: 0, emissive: 0xffffff, emissiveMap: map, emissiveIntensity: 0.06 });
    const mFrente = matFace(texF);
    const mVerso = matFace(texV);
    const corpo = new Mesh(gCorpo, mCorpo);
    const frente = new Mesh(gFace, mFrente);
    frente.position.z = 0.0205;
    const verso = new Mesh(gFace, mVerso);
    verso.position.z = -0.0205;
    verso.rotation.y = Math.PI;

    // presilha metálica
    const mMetal = new MeshStandardMaterial({ color: 0x3a3a3a, metalness: 0.85, roughness: 0.35 });
    const gBarra = new BoxGeometry(0.36, 0.1, 0.07);
    const gArgola = new TorusGeometry(0.07, 0.022, 8, 20);
    const barra = new Mesh(gBarra, mMetal);
    barra.position.set(0, 0.2, 0);
    const argola = new Mesh(gArgola, mMetal);
    argola.position.set(0, 0.29, 0);

    const giro = new Group(); // gira em torno do eixo do cordão
    giro.add(corpo, frente, verso, barra, argola);
    const inclina = new Group(); // acompanha a vara (rotação em Z)
    inclina.add(giro);
    scene.add(inclina);

    // ---------- cordão (fita) ----------
    const AM = 22; // amostras da curva
    const gCordao = new BufferGeometry();
    const posAttr = new BufferAttribute(new Float32Array((AM + 1) * 2 * 3), 3);
    gCordao.setAttribute("position", posAttr);
    const idx: number[] = [];
    for (let i = 0; i < AM; i++) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
    gCordao.setIndex(idx);
    const cordao = new Mesh(gCordao, new MeshBasicMaterial({ color: 0x2e2e2e, side: DoubleSide }));
    cordao.frustumCulled = false;
    scene.add(cordao);

    // ---------- física (verlet 2D) ----------
    // nós 0..N = cordão (0 = âncora fixa, N = furo); N+1 = ponto pesado do cartão
    const pos: Vector3[] = [];
    const ant: Vector3[] = [];
    for (let i = 0; i <= N; i++) pos.push(new Vector3(0, ANCORA_Y - i * SEG, 0));
    pos.push(new Vector3(0, ANCORA_Y - N * SEG - D, 0));
    pos.forEach((p) => ant.push(p.clone()));
    const iw = pos.map((_, i) => (i === 0 ? 0 : i === N + 1 ? 0.5 : 1)); // massa inversa
    const lim = { x: 2, y: 2.4 };

    const restricoes = () => {
      for (let it = 0; it < 14; it++) {
        for (let i = 0; i <= N; i++) {
          const a = pos[i], b = pos[i + 1];
          const len = i === N ? D : SEG;
          const dx = b.x - a.x, dy = b.y - a.y;
          const d = Math.hypot(dx, dy) || 1e-6;
          const w = iw[i] + iw[i + 1];
          const k = (d - len) / d / w;
          a.x += dx * k * iw[i];
          a.y += dy * k * iw[i];
          b.x -= dx * k * iw[i + 1];
          b.y -= dy * k * iw[i + 1];
        }
        pos[0].set(0, ANCORA_Y, 0);
        // paredes: o cartão não sai do quadro
        for (const i of [N, N + 1]) {
          pos[i].x = Math.max(-lim.x, Math.min(lim.x, pos[i].x));
        }
        pos[N + 1].y = Math.max(-lim.y, pos[N + 1].y);
      }
    };

    // arrasto
    const arrasto = { ativo: false, t: 0, alvo: new Vector3(), x0: 0, y0: 0, t0: 0, moveu: false };
    const passo = () => {
      for (let i = 1; i <= N + 1; i++) {
        const p = pos[i], a = ant[i];
        let vx = (p.x - a.x) * 0.992, vy = (p.y - a.y) * 0.992;
        const v = Math.hypot(vx, vy);
        if (v > 0.45) { vx *= 0.45 / v; vy *= 0.45 / v; } // velocidade máxima (como na referência)
        a.copy(p);
        p.x += vx;
        p.y += vy - G * DT * DT;
      }
      if (arrasto.ativo) {
        const P = pos[N], Q = pos[N + 1];
        const gx = P.x + (Q.x - P.x) * arrasto.t, gy = P.y + (Q.y - P.y) * arrasto.t;
        let dx = arrasto.alvo.x - gx, dy = arrasto.alvo.y - gy;
        const d = Math.hypot(dx, dy);
        if (d > 0.5) { dx *= 0.5 / d; dy *= 0.5 / d; }
        const wp = Math.max(0, 1 - arrasto.t), wq = Math.min(1, arrasto.t);
        const s = wp + wq || 1;
        P.x += (dx * wp) / s * 0.85; P.y += (dy * wp) / s * 0.85;
        Q.x += (dx * wq) / s * 0.85; Q.y += (dy * wq) / s * 0.85;
      }
      restricoes();
    };

    // giro (virar) e inclinação ao passar o mouse
    let yaw = 0, yawV = 0, alvoYaw = 0;
    let tiltX = 0, tiltY = 0, alvoTX = 0, alvoTY = 0;

    const vira = () => {
      alvoYaw += Math.PI;
      if (reduzido) { yaw = alvoYaw; quadro(); } else acorda();
    };

    // ---------- desenho ----------
    // a curva guarda referências aos mesmos Vector3 de pos (atualizados no lugar), então não precisa recriar
    const curva = new CatmullRomCurve3(pos.slice(0, N + 1), false, "catmullrom", 0.5);
    const amostra = Array.from({ length: AM + 1 }, () => new Vector3());
    const atualizaVisual = () => {
      const P = pos[N], Q = pos[N + 1];
      const theta = Math.atan2(Q.x - P.x, -(Q.y - P.y));
      inclina.position.set(P.x, P.y, 0);
      inclina.rotation.z = theta;
      // balanço lateral dá um leve giro; mouse por cima inclina
      const vx = Q.x - ant[N + 1].x;
      giro.rotation.set(tiltX, yaw + tiltY + Math.max(-0.5, Math.min(0.5, vx * 3)), 0);

      for (let i = 0; i <= AM; i++) curva.getPoint(i / AM, amostra[i]);
      for (let i = 0; i <= AM; i++) {
        const p = amostra[i], a = amostra[Math.max(0, i - 1)], b = amostra[Math.min(AM, i + 1)];
        const tx = b.x - a.x, ty = b.y - a.y;
        const l = Math.hypot(tx, ty) || 1;
        const nx = -ty / l, ny = tx / l;
        const w = 0.045;
        posAttr.setXYZ(i * 2, p.x + nx * w, p.y + ny * w, -0.03);
        posAttr.setXYZ(i * 2 + 1, p.x - nx * w, p.y - ny * w, -0.03);
      }
      posAttr.needsUpdate = true;
    };

    const quadro = () => {
      atualizaVisual();
      renderer.render(scene, camera);
    };

    // ---------- tamanho ----------
    const redimensiona = () => {
      const w = el.clientWidth || 1, h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      lim.x = Math.max(0.6, (VIS_H * camera.aspect) / 2 - 0.85);
      lim.y = VIS_H / 2 - 0.25;
      quadro();
    };
    const ro = new ResizeObserver(redimensiona);
    ro.observe(el);
    redimensiona();

    // ---------- ponteiro ----------
    const dirTmp = new Vector3();
    const alvoMundo = (cx: number, cy: number, out: Vector3) => {
      const r = el.getBoundingClientRect();
      const ndc = new Vector2(((cx - r.left) / r.width) * 2 - 1, -(((cy - r.top) / r.height) * 2 - 1));
      out.set(ndc.x, ndc.y, 0.5).unproject(camera);
      const dir = dirTmp.copy(out).sub(camera.position).normalize();
      return out.copy(camera.position).addScaledVector(dir, -camera.position.z / dir.z); // plano z=0
    };
    /** Parâmetro t (0 = furo, 1 = ponto pesado) se o ponto estiver sobre o cartão; senão -1. */
    const acerta = (p: Vector3) => {
      const P = pos[N], Q = pos[N + 1];
      const dx = (Q.x - P.x) / D, dy = (Q.y - P.y) / D;
      const rx = p.x - P.x, ry = p.y - P.y;
      const lx = rx * -dy + ry * dx; // eixo X local = (-dy, dx)
      const baixo = rx * dx + ry * dy;
      return Math.abs(lx) < W / 2 && baixo > -SLOT_Y && baixo < H - SLOT_Y ? baixo / D : -1;
    };
    const mundo = new Vector3();
    let sobre = false;

    // O canvas fica com pointer-events:none (deixa passar cliques para o que está embaixo, como as caixas
    // da seção); os eventos vêm da janela, e o canvas só "pega" o ponteiro enquanto ele está sobre o cartão.
    const sobreCartao = (e: PointerEvent) => visivel && acerta(alvoMundo(e.clientX, e.clientY, mundo)) >= 0;
    const marca = (sobre_: boolean) => {
      sobre = sobre_;
      el.style.pointerEvents = sobre_ ? "auto" : "none";
      el.style.cursor = arrasto.ativo ? "grabbing" : sobre_ ? "grab" : "";
    };

    const aoMover = (e: PointerEvent) => {
      if (arrasto.ativo) {
        alvoMundo(e.clientX, e.clientY, arrasto.alvo);
        if (Math.hypot(e.clientX - arrasto.x0, e.clientY - arrasto.y0) > 4) arrasto.moveu = true;
        return;
      }
      if (e.pointerType === "touch") return;
      const dentro = sobreCartao(e);
      if (dentro !== sobre) marca(dentro);
      if (dentro && e.pointerType === "mouse") {
        const P = pos[N];
        alvoTX = Math.max(-0.3, Math.min(0.3, (P.y - 0.4 - mundo.y) * 0.1));
        alvoTY = Math.max(-0.3, Math.min(0.3, (mundo.x - P.x) * 0.25));
      } else { alvoTX = 0; alvoTY = 0; }
      if (reduzido) quadro(); else acorda();
    };
    const aoDescer = (e: PointerEvent) => {
      if (reduzido || e.button > 0 || !visivel) return;
      alvoMundo(e.clientX, e.clientY, mundo);
      const t = acerta(mundo);
      if (t < 0) return;
      arrasto.ativo = true; arrasto.moveu = false;
      arrasto.t = Math.min(1.2, t);
      arrasto.alvo.copy(mundo);
      arrasto.x0 = e.clientX; arrasto.y0 = e.clientY; arrasto.t0 = performance.now();
      try { el.setPointerCapture(e.pointerId); } catch { /* toque: o alvo original segue recebendo */ }
      document.body.style.userSelect = "none";
      marca(true);
      acorda();
      e.preventDefault();
    };
    const aoSoltar = (e: PointerEvent) => {
      if (!arrasto.ativo) return;
      arrasto.ativo = false;
      document.body.style.userSelect = "";
      try { el.releasePointerCapture(e.pointerId); } catch { /* sem captura */ }
      marca(e.pointerType !== "touch" && sobreCartao(e));
      // clique sem arrastar vira o cartão (e não dispara logo após um arraste)
      if (!arrasto.moveu && performance.now() - arrasto.t0 < 500) vira();
      acorda();
    };
    const aoSair = () => { if (!arrasto.ativo) { marca(false); alvoTX = 0; alvoTY = 0; acorda(); } };
    // no toque, só impede a rolagem da página quando o dedo começa em cima do cartão
    const aoTocar = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!reduzido && visivel && acerta(alvoMundo(t.clientX, t.clientY, new Vector3())) >= 0) e.preventDefault();
    };
    const aoTecla = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); vira(); return; }
      const dir = e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : 0;
      if (!dir || reduzido) return;
      e.preventDefault();
      ant[N + 1].x -= dir * 0.025; ant[N].x -= dir * 0.012;
      acorda();
    };
    window.addEventListener("pointermove", aoMover);
    window.addEventListener("pointerdown", aoDescer, true);
    window.addEventListener("pointerup", aoSoltar);
    window.addEventListener("pointercancel", aoSoltar);
    document.documentElement.addEventListener("pointerleave", aoSair);
    window.addEventListener("touchstart", aoTocar, { passive: false, capture: true });
    el.addEventListener("keydown", aoTecla);

    // ---------- laço ----------
    let raf = 0, visivel = true, aba = !document.hidden, ultimo = 0, acum = 0;
    let soma = 0, cont = 0, calmo = 0;
    const laco = (agora: number) => {
      raf = 0;
      if (!visivel || !aba) return;
      const dt = Math.min(0.05, Math.max(0, (agora - ultimo) / 1000));
      ultimo = agora;
      acum += dt;
      while (acum >= DT) { passo(); acum -= DT; }
      let mov = 0;
      for (let i = 1; i <= N + 1; i++) mov = Math.max(mov, Math.hypot(pos[i].x - ant[i].x, pos[i].y - ant[i].y));
      // giro com mola
      yawV += ((alvoYaw - yaw) * 70 - yawV * 10) * dt;
      yaw += yawV * dt;
      tiltX += (alvoTX - tiltX) * Math.min(1, dt * 10);
      tiltY += (alvoTY - tiltY) * Math.min(1, dt * 10);
      quadro();
      // tudo parado por ~1 s: dorme (sem gastar GPU/CPU) até um evento acordar
      const parado = !arrasto.ativo && mov < 1e-4 && Math.abs(alvoYaw - yaw) < 2e-3 && Math.abs(yawV) < 2e-2 && Math.abs(alvoTX - tiltX) < 1e-3 && Math.abs(alvoTY - tiltY) < 1e-3;
      calmo = parado ? calmo + 1 : 0;
      if (calmo > 60) { calmo = 0; return; }
      // se o quadro ficar caro, baixa a resolução (2 → 1,5 → 1)
      soma += dt; cont++;
      if (cont === 90) {
        if (soma / cont > 1 / 40 && dpr > 1) { dpr = Math.max(1, dpr - 0.5); renderer.setPixelRatio(dpr); }
        soma = 0; cont = 0;
      }
      raf = requestAnimationFrame(laco);
    };
    const acorda = () => {
      if (reduzido || raf || !visivel || !aba) return;
      ultimo = performance.now();
      acum = 0;
      calmo = 0;
      raf = requestAnimationFrame(laco);
    };
    const io = new IntersectionObserver(([en]) => { visivel = en.isIntersecting; acorda(); }, { rootMargin: "120px" });
    io.observe(el);
    const aoAba = () => { aba = !document.hidden; acorda(); };
    document.addEventListener("visibilitychange", aoAba);

    // começa já pendurado; no modo normal dá um balanço de entrada
    for (let i = 0; i < 240; i++) passo();
    if (reduzido) { quadro(); } else {
      ant[N + 1].x += 0.012; ant[N].x += 0.004; // pequeno balanço de entrada
      acorda();
    }

    apiRef.current = { redesenha, vira };

    return () => {
      apiRef.current = null;
      cancelAnimationFrame(raf);
      io.disconnect(); ro.disconnect();
      document.removeEventListener("visibilitychange", aoAba);
      window.removeEventListener("pointermove", aoMover);
      window.removeEventListener("pointerdown", aoDescer, true);
      window.removeEventListener("pointerup", aoSoltar);
      window.removeEventListener("pointercancel", aoSoltar);
      document.documentElement.removeEventListener("pointerleave", aoSair);
      window.removeEventListener("touchstart", aoTocar, true);
      el.removeEventListener("keydown", aoTecla);
      document.body.style.userSelect = "";
      [gCorpo, gFace, gBarra, gArgola, gCordao].forEach((g) => g.dispose());
      [mCorpo, mFrente, mVerso, mMetal, cordao.material as MeshBasicMaterial].forEach((m) => m.dispose());
      texF.dispose(); texV.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="absolute inset-0">
      <div
        ref={raiz}
        tabIndex={0}
        role="group"
        aria-label="Crachá interativo da Bambolina. Arraste para balançar; Enter vira o crachá; setas esquerda e direita dão um empurrão."
        className="pointer-events-none absolute inset-0 select-none focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-azul"
      >
        {/* fontes lidas do CSS (next/font gera o nome da família) */}
        <span ref={swungRef} aria-hidden className="font-swung pointer-events-none absolute opacity-0">.</span>
        <span ref={displayRef} aria-hidden className="font-display pointer-events-none absolute opacity-0">.</span>
      </div>
      <button
        type="button"
        onClick={() => apiRef.current?.vira()}
        className="pointer-events-auto absolute bottom-3 lg:bottom-32 left-1/2 -translate-x-1/2 rounded-full bg-creme/90 px-4 py-1.5 font-display text-xs font-bold text-vinho transition hover:bg-limao focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul"
      >
        virar crachá
      </button>
    </div>
  );
}
