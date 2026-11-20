import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { COR, limparCacheGeo, mulberry, type Anim, type Ctx } from "./comum";
import { criarMateriais } from "./materiais";
import { construirCasca, construirRig } from "./arquitetura";
import { estLuz, estSom, estCenografia, estFigurino } from "./estacoes1";
import {
  estMaquiagem, estDramaturgia, estDirecao, estProducao, estAtuacao, construirPalcoFim, construirSinal, type InfoSinal,
} from "./estacoes2";
import { pessoa } from "./pessoas";
import { mesclarEstaticos } from "./otimizar";
import { ALT, LADO, LARG, N_EST, Z_INI, ZE } from "./geometria";

/**
 * Backstage em Three.js: corredor lateral de teatro com 9 estações (uma por área).
 * Materiais PBR com texturas CC0 (Poly Haven), luz com sombra, bloom e névoa.
 * Estação 0 do passo = vista inicial do Hero; passos 1..9 = as 9 áreas.
 */

export interface OpcoesBackstage {
  leve: boolean;
  reduzido: boolean;
  aoFalhar: () => void;
  aoEstacao: (passo: number) => void;
  aoHover: (est: number | null) => void;
  info: InfoSinal[];
}

export interface Backstage {
  /** 0..9 contínuo: 0 = vista do Hero; i = estação i (1..9). */
  setPasso(p: number): void;
  /** Salta direto para o passo p, sem suavização (testes e capturas). */
  forcar(p: number): void;
  /** Contadores do renderer (diagnóstico). */
  stats(): Record<string, number>;
  setAtivo(a: boolean): void;
  acender(): void;
  apontar(nx: number, ny: number): void;
  sairPonteiro(): void;
  estacaoSob(): number | null;
  dispose(): void;
}

const ACENTO = [0x7d96ff, 0xff8a52, 0xffdca8, 0xffb4da, 0xffd9b8, 0xffc27a, 0x93b3ff, 0xfff0d6, 0xffc890];
const H_FEIXE = 9;

export function criarBackstage(canvas: HTMLCanvasElement, op: OpcoesBackstage): Backstage {
  const { leve, reduzido } = op;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  // Começa barato (sem bloom/sombra, resolução moderada) e SOBE de nível só se o aparelho aguentar (ver loop).
  let dpr = Math.min(window.devicePixelRatio || 1, 1.25);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(COR.fundo);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = !leve;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(COR.fundo, leve ? 0.032 : 0.026);
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 140);
  const rand = mulberry(11);

  // ambiente refletido (muito baixo): dá brilho no piso e nos metais
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.1;

  const { M, dispose: disposeMat } = criarMateriais(renderer, leve);

  // ---------- estado de luz e interação ----------
  const lum = { value: reduzido ? 1 : 0.1 };
  let lumAlvo = reduzido ? 1 : 0.1;
  const luzes: { l: THREE.Light; base: number }[] = [];
  const luz = <T extends THREE.Light>(l: T, base: number) => {
    luzes.push({ l, base });
    l.intensity = base * lum.value;
    return l;
  };
  const q = new Array(N_EST + 1).fill(0) as number[]; // q[0] = sempre aceso; q[i+1] = estação i
  q[0] = 1;
  const praticos: { est: number; mat: THREE.Material; base: number }[] = [];
  const alvos: THREE.Mesh[] = [];
  const mundo = new THREE.Group();
  scene.add(mundo);
  const anims: Anim[] = [];
  const foco = { alvo: new THREE.Vector3(0, 0, -8), peso: 0 };

  // feixes de luz (cone aditivo)
  const matFeixe = new Map<number, THREE.ShaderMaterial>();
  const feixe = (cor: number) => {
    let m = matFeixe.get(cor);
    if (!m) {
      m = new THREE.ShaderMaterial({
        uniforms: { uCor: { value: new THREE.Color(cor) }, uLum: lum, uH: { value: H_FEIXE } },
        vertexShader: `uniform float uH; varying float vH; varying float vD; varying vec3 vN; varying vec3 vV;
          void main(){ vH = -position.y / uH; vN = normalize(normalMatrix * normal);
            vec4 mv = modelViewMatrix * vec4(position, 1.0); vV = normalize(-mv.xyz); vD = length(mv.xyz);
            gl_Position = projectionMatrix * mv; }`,
        fragmentShader: `uniform vec3 uCor; uniform float uLum; varying float vH; varying float vD; varying vec3 vN; varying vec3 vV;
          void main(){ float e = pow(abs(dot(normalize(vN), normalize(vV))), 1.9);
            float a = e * pow(1.0 - clamp(vH, 0.0, 1.0), 1.5) * 0.26 * uLum * smoothstep(2.2, 7.0, vD);
            gl_FragColor = vec4(uCor, a);
            #include <colorspace_fragment>
          }`,
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      });
      matFeixe.set(cor, m);
    }
    return m;
  };

  const ctx: Ctx = {
    mundo, M, lum, foco, feixe, anims, leve, rand, luz,
    pratico: (est, mat, base) => {
      praticos.push({ est, mat, base });
    },
    halo: (pai, x, y, z, cor, tam, est = 0) => {
      const mat = new THREE.SpriteMaterial({
        map: M.halo, color: cor, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.6, fog: false,
      });
      const sp = new THREE.Sprite(mat);
      sp.position.set(x, y, z);
      sp.scale.setScalar(tam);
      sp.userData.semSombra = true;
      pai.add(sp);
      praticos.push({ est, mat, base: 0.6 });
      return sp;
    },
    alvo: (est, x, y, z, w, h, d) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshBasicMaterial({ visible: false }));
      m.position.set(x, y, z);
      m.userData.est = est;
      mundo.add(m);
      alvos.push(m);
    },
  };
  // Convenção: `est` = 1..9 (número da estação); `est` 0 em pratico/halo = sempre aceso. q[est] = calor da estação.

  // ---------- construção ----------
  construirCasca(ctx);
  construirRig(ctx);
  const construtores = [estLuz, estSom, estCenografia, estFigurino, estMaquiagem, estDramaturgia, estDirecao, estProducao, estAtuacao];
  const porEst: THREE.Object3D[][] = [];
  construtores.forEach((fn, i) => {
    const antes = mundo.children.length;
    fn(ctx, i + 1, ZE[i], LADO[i]); // est (1..9) para praticos
    construirSinal(ctx, i + 1, ZE[i], LADO[i], op.info[i]);
    porEst[i] = mundo.children.slice(antes);
  });
  construirPalcoFim(ctx);
  construirEquipe();
  // mescla o que é estático por material: de milhares de draw calls para algumas centenas
  const faixas: THREE.Object3D[] = [];
  const nAntes = mundo.children.length;
  mesclarEstaticos(mundo, mundo, anims);
  for (let i = nAntes; i < mundo.children.length; i++) if (mundo.children[i].userData.zc !== undefined) faixas.push(mundo.children[i]);
  porEst.forEach((l, i) => (porEst[i] = l.filter((o) => o.parent)));

  function construirEquipe() {
    const mat = new THREE.MeshStandardMaterial({ color: 0x1b1b1d, roughness: 0.85 });
    const add = (p: ReturnType<typeof pessoa>, x: number, y: number, z: number, ry: number) => {
      p.g.position.set(x, y, z);
      p.g.rotation.y = ry;
      mundo.add(p.g);
      return p;
    };
    // escada + técnico alcançando o refletor
    const esc = new THREE.Group();
    esc.position.set(1.9, 0, ZE[0] - 3.4);
    const aco = M.std(0x9a9da0, 0.35, 0.9);
    for (const dz of [-0.22, 0.22]) {
      const r = new THREE.Mesh(new THREE.BoxGeometry(0.045, 3.1, 0.03), aco);
      r.position.set(0, 1.5, dz);
      r.rotation.x = dz * 0.9;
      esc.add(r);
    }
    for (let i = 0; i < 8; i++) {
      const d = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, 0.5 - i * 0.03), aco);
      d.position.set(0, 0.3 + i * 0.36, 0);
      esc.add(d);
    }
    mundo.add(esc);
    porEst[0].push(esc);
    const tec = add(
      pessoa(mat, { braco: [-2.8, -0.4], antebraco: [0.0, -0.3], coxa: [-0.35, -0.05], canela: [0.4, 0.05], tronco: -0.05, cabeca: -0.3 }),
      1.9, 1.8, ZE[0] - 3.4, Math.PI / 2,
    );
    porEst[0].push(tec.g);
    anims.push((t) => {
      tec.bracos[0].rotation.x = -2.8 + Math.sin(t * 1.4) * 0.12;
    });
    // operador de som em pé diante da mesa
    const op1 = add(pessoa(mat, { tronco: 0.22, braco: [-0.95, -0.95], antebraco: [-0.6, -0.6], cabeca: 0.3 }), -2.1, 0, ZE[1] + 0.2, -Math.PI / 2);
    porEst[1].push(op1.g);
    anims.push((t) => {
      op1.bracos[1].rotation.x = -0.95 + Math.sin(t * 0.8) * 0.1;
      op1.tronco.rotation.x = 0.22 + Math.sin(t * 0.5) * 0.015;
    });
    // costureira sentada
    const cos = add(pessoa(mat, { hipY: 0.5, coxa: [-1.5, -1.5], canela: [1.5, 1.5], tronco: 0.3, braco: [-1.0, -1.0], antebraco: [-0.7, -0.7], cabeca: 0.5 }), -2.7, 0, ZE[3] - 2.5, -Math.PI / 2);
    const banc = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.05, 14), M.std(0x2a2a2c, 0.7));
    banc.position.set(-2.72, 0.47, ZE[3] - 2.5);
    mundo.add(banc);
    porEst[3].push(cos.g, banc);
    anims.push((t) => {
      cos.bracos[0].rotation.x = -1.0 + Math.sin(t * 6) * 0.03;
    });
    // roteirista sentado escrevendo
    const rot = add(pessoa(mat, { hipY: 0.48, coxa: [-1.5, -1.5], canela: [1.5, 1.5], tronco: 0.32, braco: [-0.9, -0.9], antebraco: [-0.9, -0.9], cabeca: 0.55 }), -2.5, 0, ZE[5] + 0.5, -Math.PI / 2);
    porEst[5].push(rot.g);
    anims.push((t) => {
      rot.bracos[0].rotation.x = -0.9 + Math.sin(t * 3) * 0.04;
      rot.bracos[1].rotation.x = -0.9 + Math.sin(t * 3.3 + 1) * 0.04;
    });
    // diretora de pé, braços cruzados, olhando a planta
    const dir = add(pessoa(mat, { braco: [-0.55, -0.55], antebraco: [-1.9, -1.9], bracoZ: [0.35, -0.35], coxa: [0.02, -0.04], cabeca: 0.1 }), 2.4, 0, ZE[6] + 0.2, Math.PI / 2 + 0.4);
    porEst[6].push(dir.g);
    anims.push((t) => {
      dir.g.rotation.y = Math.PI / 2 + 0.4 + Math.sin(t * 0.3) * 0.2;
    });
    // produtor escrevendo no quadro
    const pro = add(pessoa(mat, { braco: [-1.6, -0.2], antebraco: [-0.3, -0.3], tronco: 0.04 }), -3.7, 0, ZE[7] - 1.7, -Math.PI / 2 + 0.15);
    porEst[7].push(pro.g);
    anims.push((t) => {
      pro.bracos[0].rotation.x = -1.6 + Math.sin(t * 2.4) * 0.07;
    });
  }

  // sombras: só meshes opacos; o spot-chave projeta
  if (!leve) {
    mundo.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh || o.userData.semSombra) return;
      const mt = m.material as THREE.Material;
      if (mt && ((mt as THREE.ShaderMaterial).isShaderMaterial || mt.transparent || !mt.visible)) return;
      m.castShadow = true;
      m.receiveShadow = true;
    });
  }

  // ---------- luzes globais ----------
  scene.add(luz(new THREE.AmbientLight(0x303752, 1), 0.28));
  scene.add(luz(new THREE.HemisphereLight(0x34406a, 0x14100d, 1), 0.3));
  const rim = luz(new THREE.DirectionalLight(0xffc890, 1), 0.16);
  scene.add(rim, rim.target);
  const chave = luz(new THREE.SpotLight(0xffe2bc, 1, 15, 0.62, 0.9, 1.6), 75);
  chave.castShadow = false; // liga só no nível alto
  chave.shadow.mapSize.set(1024, 1024);
  chave.shadow.bias = -0.0004;
  chave.shadow.normalBias = 0.03;
  chave.shadow.camera.near = 0.5;
  chave.shadow.camera.far = 16;
  scene.add(chave, chave.target);
  const enchimento = luz(new THREE.PointLight(0xffffff, 1, 8, 2), 14);
  scene.add(enchimento);
  const luzCursor = luz(new THREE.PointLight(0xfff0dd, 1, 6, 2), 1.6);
  scene.add(luzCursor);
  const reg = (l: THREE.Light) => luzes.find((x) => x.l === l)!;
  const regChave = reg(chave);
  const regEnc = reg(enchimento);
  const regCur = reg(luzCursor);

  // poeira suspensa
  const nPoeira = reduzido ? 120 : leve ? 80 : 220;
  const pos = new Float32Array(nPoeira * 3);
  for (let i = 0; i < nPoeira; i++) {
    pos[i * 3] = (rand() - 0.5) * LARG * 2;
    pos[i * 3 + 1] = rand() * ALT;
    pos[i * 3 + 2] = Z_INI - rand() * 105;
  }
  const geoP = new THREE.BufferGeometry();
  const attrP = new THREE.BufferAttribute(pos, 3);
  geoP.setAttribute("position", attrP);
  const matP = new THREE.PointsMaterial({
    color: 0xf2f1e8, size: 0.035, transparent: true, opacity: 0.5, depthWrite: false,
    blending: THREE.AdditiveBlending, sizeAttenuation: true, fog: false,
  });
  scene.add(new THREE.Points(geoP, matP));
  anims.push((t) => {
    for (let i = 0; i < nPoeira; i++) {
      let y = pos[i * 3 + 1] + 0.0018 + (i % 5) * 0.0005;
      if (y > ALT) y = 0;
      pos[i * 3 + 1] = y;
      pos[i * 3] += Math.sin(t * 0.3 + i) * 0.0007;
    }
    attrP.needsUpdate = true;
  });

  // ---------- jornada da câmera ----------
  const KP: THREE.Vector3[] = [new THREE.Vector3(0, 1.65, 6)];
  const KT: THREE.Vector3[] = [new THREE.Vector3(0, 2.0, -30)];
  ZE.forEach((zi, i) => {
    const s = LADO[i];
    KP.push(new THREE.Vector3(-s * 0.55, 1.62, zi + 3.7));
    KT.push(new THREE.Vector3(s * 3.1, 1.2, zi - 0.4));
  });
  KT[1].set(LADO[0] * 2.3, 2.15, ZE[0] - 1.1);
  KP[1].set(-LADO[0] * 0.6, 1.6, ZE[0] + 3.2);
  // estação 9: a câmera entra no palco e para de frente para os atores (sem diagonal)
  KP[9].set(-0.2, 1.6, ZE[8] + 3.6);
  KT[9].set(0.2, 1.45, ZE[8] - 5.5);
  KT[3].set(LADO[2] * 3.0, 1.35, ZE[2] - 0.2);

  let passoAlvo = 0;
  let passo = 0;
  let estAtiva = -1;
  const alvoPonteiro = { x: 0, y: 0 };
  const ponteiro = { x: 0, y: 0 };
  let temPonteiro = false;
  let hover: number | null = null;
  const pCam = new THREE.Vector3();
  const pTgt = new THREE.Vector3();
  const tmp = new THREE.Vector3();
  const ray = new THREE.Raycaster();
  const planoPiso = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.05);
  const chavePos = new THREE.Vector3();
  const chaveTgt = new THREE.Vector3();
  const encPos = new THREE.Vector3();
  const encCor = new THREE.Color();
  let t = reduzido ? 2.0 : 0;
  let sigPrat = -1;

  const suave = (x: number) => x * x * x * (x * (x * 6 - 15) + 10);

  function camera3(dt: number) {
    passo += (passoAlvo - passo) * (1 - Math.exp(-dt * 6));
    ponteiro.x += (alvoPonteiro.x - ponteiro.x) * (1 - Math.exp(-dt * 4));
    ponteiro.y += (alvoPonteiro.y - ponteiro.y) * (1 - Math.exp(-dt * 4));
    const a = Math.min(N_EST - 1, Math.max(0, Math.floor(passo)));
    const f = suave(Math.min(1, passo - a));
    pCam.lerpVectors(KP[a], KP[a + 1], f);
    pTgt.lerpVectors(KT[a], KT[a + 1], f);
    if (passo >= N_EST) {
      pCam.copy(KP[N_EST]);
      pTgt.copy(KT[N_EST]);
    }
    const w = a === 0 && passo < 1 ? 0.45 : 1;
    camera.position.set(pCam.x + ponteiro.x * 0.3 * w + Math.sin(t * 0.3) * 0.04, pCam.y - ponteiro.y * 0.08 + Math.sin(t * 0.4) * 0.025, pCam.z + (reduzido ? 0 : Math.sin(t * 0.25) * 0.12));
    camera.lookAt(pTgt.x + ponteiro.x * 0.9, pTgt.y + ponteiro.y * 0.55, pTgt.z);
    camera.updateMatrixWorld();

    // estação ativa
    const idx = Math.round(passo);
    if (idx !== estAtiva) {
      estAtiva = idx;
      op.aoEstacao(idx);
    }

    // luzes seguem a estação ativa
    const e = Math.max(0, Math.min(N_EST - 1, idx - 1));
    const s = LADO[e];
    const zi = ZE[e];
    const ligada = idx >= 1 ? 1 : 0;
    chavePos.set(-s * 0.9, 4.7, zi + 1.6);
    chaveTgt.set(s * 3.3, 0.9, zi - 0.3);
    if (e === N_EST - 1) {
      chavePos.set(-1.2, 4.8, zi + 1.5);
      chaveTgt.set(1.6, 0.9, zi - 1.5);
    }
    const k = 1 - Math.exp(-dt * 3);
    chave.position.lerp(chavePos, ligada ? k : 1);
    chave.target.position.lerp(chaveTgt, k);
    regChave.base += (75 * ligada - regChave.base) * k;
    encPos.set(s * 2.3, 2.3, zi - 0.2);
    enchimento.position.lerp(encPos, k);
    encCor.set(ACENTO[e]);
    enchimento.color.lerp(encCor, k);
    regEnc.base += (14 * (0.35 + 0.65 * ligada) - regEnc.base) * k;
    rim.position.set(9, 4, camera.position.z - 4);
    rim.target.position.set(0, 1, camera.position.z - 7);

    // luz do cursor: 6,5 unidades à frente do ponteiro
    if (temPonteiro) {
      tmp.set(ponteiro.x, ponteiro.y, 0.5).unproject(camera).sub(camera.position).normalize();
      luzCursor.position.copy(camera.position).addScaledVector(tmp, 6.5);
    } else luzCursor.position.set(camera.position.x, 2.4, camera.position.z - 5);
    regCur.base += (1.6 * (temPonteiro ? 1 : 0.2) - regCur.base) * k;

    // refletores da estação de luz seguem o ponteiro no piso
    if (temPonteiro) {
      ray.setFromCamera(new THREE.Vector2(ponteiro.x, ponteiro.y), camera);
      if (ray.ray.intersectPlane(planoPiso, tmp)) foco.alvo.lerp(tmp, 1 - Math.exp(-dt * 6));
    }
    foco.peso += ((idx === 1 && temPonteiro ? 1 : 0) - foco.peso) * (1 - Math.exp(-dt * 3));

    // estações quentes (ativa ou sob o ponteiro)
    for (let i = 1; i <= N_EST; i++) {
      const alvoQ = i === idx || i - 1 === hover ? 1 : idx === 0 ? 0.35 : 0;
      q[i] += (alvoQ - q[i]) * (1 - Math.exp(-dt * 4));
    }
    const lumE = 0.15 + 0.85 * lum.value;
    // só recalcula os práticos (centenas de materiais) quando algo realmente mudou
    let sig = lumE * 100;
    for (let i = 1; i <= N_EST; i++) sig += q[i] * (i + 1);
    if (Math.abs(sig - sigPrat) > 1e-4) {
      sigPrat = sig;
      for (const p of praticos) {
        const v = (p.est === 0 ? 1 : 0.35 + 0.65 * q[p.est]) * lumE;
        if ("emissiveIntensity" in p.mat) (p.mat as THREE.MeshStandardMaterial).emissiveIntensity = p.base * v;
        else (p.mat as THREE.SpriteMaterial).opacity = p.base * v;
      }
    }
    // faixas mescladas muito longe da câmera ficam fora (já estão quase todas engolidas pela névoa)
    for (const m of faixas) {
      const vis = Math.abs(camera.position.z - ((m.userData.zc as number) * 12 + 6)) < 52;
      if (m.visible !== vis) m.visible = vis;
    }
    // visibilidade por distância (poupa CPU/GPU)
    for (let i = 0; i < N_EST; i++) {
      const vis = Math.abs(camera.position.z - ZE[i]) < 26;
      const lista = porEst[i];
      if (lista[0] && lista[0].visible !== vis) lista.forEach((o) => (o.visible = vis));
    }
  }

  // ---------- render, pós-processamento e loop ----------
  // Níveis: 1 = básico (sem bloom nem sombra); 2 = alto (bloom, MSAA, sombra do spot-chave).
  // Começa no 1 e tenta subir ao 2 se o fps estiver alto; se o 2 ficar lento, volta e não tenta de novo.
  let nivel = 1;
  let podeSubir = !leve && !reduzido;
  let composer: EffectComposer | null = null;
  function montarPos(w: number, h: number) {
    const rt = new THREE.WebGLRenderTarget(w * dpr, h * dpr, { type: THREE.HalfFloatType, samples: 2 });
    composer = new EffectComposer(renderer, rt);
    composer.setPixelRatio(dpr);
    composer.setSize(w, h);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(w / 2, h / 2), 0.42, 0.55, 0.88));
    composer.addPass(new OutputPass());
  }
  let tam = { w: 1, h: 1 };
  function resize() {
    const p = canvas.parentElement ?? canvas;
    const w = Math.max(1, p.clientWidth);
    const h = Math.max(1, p.clientHeight);
    tam = { w, h };
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = camera.aspect < 0.8 ? 74 : camera.aspect < 1.2 ? 60 : 50;
    camera.updateProjectionMatrix();
    if (composer) {
      composer.setPixelRatio(dpr);
      composer.setSize(w, h);
    }
  }
  let aquecer = 0; // quadros ignorados na medição (compilação de shaders etc.)
  function aplicarNivel(n: number) {
    nivel = n;
    if (n === 2) {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      renderer.setPixelRatio(dpr);
      chave.castShadow = !leve;
      resize();
      if (!composer) montarPos(tam.w, tam.h);
    } else {
      dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      renderer.setPixelRatio(dpr);
      chave.castShadow = false;
      composer?.dispose();
      composer = null;
      resize();
    }
    aquecer = 30;
  }
  resize();
  if (reduzido && !leve) aplicarNivel(2); // quadro estático: pode pagar o custo uma vez
  const ro = new ResizeObserver(() => {
    resize();
    if (reduzido) quadro(0);
  });
  ro.observe(canvas.parentElement ?? canvas);

  let rodando = false;
  let ativo = true;
  let ultimo = 0;
  let raf = 0;
  let acumulado = 0;
  let amostras = 0;
  let morto = false;
  let nq = 0;
  let passoAnim = 2; // as animações rodam a cada `passoAnim` quadros no nível básico
  renderer.shadowMap.autoUpdate = false;

  function quadro(dt: number) {
    t += dt;
    nq++;
    lum.value += (lumAlvo - lum.value) * (1 - Math.exp(-dt * 1.3));
    for (const x of luzes) x.l.intensity = x.base * lum.value;
    // no nível básico as animações rodam a cada 2 quadros (metade do custo de CPU)
    if (nivel === 2 || reduzido || nq % passoAnim === 0) for (const a of anims) a(t, dt);
    camera3(dt);
    if (nivel === 2 && (nq % 4 === 0 || reduzido)) renderer.shadowMap.needsUpdate = true;
    if (composer && nivel === 2) composer.render();
    else renderer.render(scene, camera);
  }

  /** Decide o nível a partir do fps médio medido. Retorna false se desistiu do 3D. */
  function ajustar(fps: number) {
    if (nivel === 2) {
      if (fps < 42) {
        aplicarNivel(1);
        podeSubir = false;
      }
      return true;
    }
    if (fps < 30) {
      // Nunca desiste do 3D no meio da jornada (desmontar o pin faz a página despencar):
      // só vai ficando mais barato — resolução menor, depois animações mais espaçadas.
      if (dpr > 0.65) {
        dpr = Math.max(0.6, dpr - 0.25);
        renderer.setPixelRatio(dpr);
        resize();
        aquecer = 15;
      } else if (passoAnim < 6) {
        passoAnim += 2;
        aquecer = 15;
      }
    } else if (podeSubir && fps >= 54) aplicarNivel(2);
    return true;
  }

  function loop(agora: number) {
    if (morto) return;
    if (!ativo || document.hidden) {
      rodando = false;
      return;
    }
    const bruto = (agora - ultimo) / 1000;
    ultimo = agora;
    quadro(Math.max(0, Math.min(0.05, bruto || 0.016))); // dt nunca negativo (o timestamp do rAF pode vir antes do performance.now() inicial)
    if (bruto < 0.25 && aquecer-- <= 0) {
      acumulado += bruto;
      if (++amostras >= 60) {
        const fps = amostras / acumulado;
        acumulado = 0;
        amostras = 0;
        if (!ajustar(fps)) return;
      }
    }
    raf = requestAnimationFrame(loop);
  }
  function iniciar() {
    if (rodando || morto || reduzido) return;
    rodando = true;
    ultimo = performance.now();
    acumulado = 0;
    amostras = 0;
    raf = requestAnimationFrame(loop);
  }
  const visib = () => {
    if (!document.hidden) iniciar();
  };
  document.addEventListener("visibilitychange", visib);
  const perdeu = (e: Event) => {
    e.preventDefault();
    op.aoFalhar();
  };
  canvas.addEventListener("webglcontextlost", perdeu);

  if (reduzido) quadro(0);
  else iniciar();

  function dispose() {
    morto = true;
    cancelAnimationFrame(raf);
    ro.disconnect();
    document.removeEventListener("visibilitychange", visib);
    canvas.removeEventListener("webglcontextlost", perdeu);
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose?.();
      const mt = m.material as THREE.Material | THREE.Material[] | undefined;
      if (mt)
        (Array.isArray(mt) ? mt : [mt]).forEach((x) => {
          const tx = x as THREE.MeshBasicMaterial;
          tx.map?.dispose();
          (x as THREE.MeshStandardMaterial).emissiveMap?.dispose();
          x.dispose();
        });
    });
    limparCacheGeo();
    matFeixe.forEach((m) => m.dispose());
    disposeMat();
    composer?.dispose();
    envTex.dispose();
    pmrem.dispose();
    renderer.dispose();
  }

  return {
    setPasso(p) {
      passoAlvo = Math.min(N_EST, Math.max(0, p));
      if (reduzido) quadro(0);
    },
    setAtivo(a) {
      ativo = a;
      if (a) iniciar();
    },
    acender() {
      lumAlvo = 1;
      if (reduzido) {
        lum.value = 1;
        quadro(0);
      }
    },
    apontar(nx, ny) {
      alvoPonteiro.x = nx;
      alvoPonteiro.y = ny;
      temPonteiro = true;
      ray.setFromCamera(new THREE.Vector2(nx, ny), camera);
      const hit = ray.intersectObjects(alvos, false)[0];
      const novo = hit ? ((hit.object.userData.est as number) - 1) : null;
      if (novo !== hover) {
        hover = novo;
        op.aoHover(novo);
      }
    },
    stats() {
      renderer.info.autoReset = false;
      renderer.info.reset();
      renderer.render(scene, camera);
      const i = renderer.info;
      renderer.info.autoReset = true;
      return { chamadas: i.render.calls, triangulos: i.render.triangles, geometrias: i.memory.geometries, texturas: i.memory.textures, programas: i.programs?.length ?? 0, luzes: luzes.length, nivel, dpr };
    },
    forcar(p) {
      passo = passoAlvo = Math.min(N_EST, Math.max(0, p));
      lum.value = lumAlvo = 1;
      for (let i = 1; i <= N_EST; i++) q[i] = i === Math.round(passo) ? 1 : 0;
      quadro(0.016);
    },
    sairPonteiro() {
      temPonteiro = false;
      alvoPonteiro.x = 0;
      alvoPonteiro.y = 0;
      if (hover !== null) {
        hover = null;
        op.aoHover(null);
      }
    },
    estacaoSob() {
      return hover;
    },
    dispose,
  };
}
