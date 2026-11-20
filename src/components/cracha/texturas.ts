// Arte do crachá (frente e verso) desenhada em canvas 2D, usada como textura.
// Segue a aplicação do manual da marca (TCC): cartão grafite com listras verticais, nome em branco,
// formas oficiais à direita e logo rosa no verso. Proporção = cartão 1,35 × 2,3 (ver CrachaCanvas.tsx).
export const CW = 576;
export const CH = 981;

const CORES = { rosa: "#FF1EC7", limao: "#DDF230", laranja: "#FF5938", azul: "#1F6BED" };
const COR_HAB = [CORES.rosa, CORES.limao, CORES.laranja, CORES.azul, CORES.rosa, CORES.limao, CORES.laranja, CORES.azul];

type Fontes = { swung: string; display: string };
type Forma = "iluminacao" | "cenografia" | "direcao" | "sonoplastia" | "contrarregragem";
export type Imgs = { formas: Record<Forma, HTMLImageElement>; logo: HTMLImageElement };

const FORMAS: Forma[] = ["iluminacao", "cenografia", "direcao", "sonoplastia", "contrarregragem"];

function carrega(src: string) {
  return new Promise<HTMLImageElement>((ok, falha) => {
    const i = new Image();
    i.onload = () => ok(i);
    i.onerror = falha;
    i.src = src;
  });
}

/** Formas oficiais e logo (SVG em /public/brand). */
export async function carregaImagens(): Promise<Imgs> {
  const [logo, ...fs] = await Promise.all([carrega("/brand/logo/completa-rosa.svg"), ...FORMAS.map((f) => carrega(`/brand/elementos/elemento-${f}.svg`))]);
  return { logo, formas: Object.fromEntries(FORMAS.map((f, i) => [f, fs[i]])) as Imgs["formas"] };
}

/** Desenha uma forma oficial recolorida (os SVGs usam currentColor) com a largura dada. */
function forma(ctx: CanvasRenderingContext2D, img: HTMLImageElement, cor: string, x: number, y: number, w: number) {
  const h = (w * img.naturalHeight) / img.naturalWidth;
  const c = document.createElement("canvas");
  c.width = Math.ceil(w);
  c.height = Math.ceil(h);
  const k = c.getContext("2d")!;
  k.drawImage(img, 0, 0, c.width, c.height);
  k.globalCompositeOperation = "source-in";
  k.fillStyle = cor;
  k.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(c, x, y);
}

/** Fundo grafite com listras verticais sutis, como o PVC do cartão do manual. */
function fundo(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#171717";
  ctx.fillRect(0, 0, CW, CH);
  for (let x = 0; x < CW; x += 6) {
    const a = 0.015 + 0.05 * Math.abs(Math.sin(x * 12.9898) * Math.cos(x * 0.37));
    ctx.fillStyle = `rgba(255,255,255,${a.toFixed(3)})`;
    ctx.fillRect(x, 0, 6, CH);
  }
  const g = ctx.createLinearGradient(0, 0, 0, CH);
  g.addColorStop(0, "rgba(0,0,0,.35)");
  g.addColorStop(0.5, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,.4)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, CW, CH);
}

function arredondado(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

export function desenhaFrente(ctx: CanvasRenderingContext2D, f: Fontes, marcadas: boolean[], im: Imgs | null) {
  ctx.clearRect(0, 0, CW, CH);
  fundo(ctx);

  if (im) {
    // Sonoplastia (meias-luas) limão + Cenografia (círculo) rosa, cortadas pela borda, como no manual
    forma(ctx, im.formas.sonoplastia, CORES.limao, 330, 120, 300);
    forma(ctx, im.formas.cenografia, CORES.rosa, 360, 330, 230);
    // Direção ("8") azul + Iluminação (arco) laranja no canto inferior
    forma(ctx, im.formas.direcao, CORES.azul, 372, 800, 250);
    forma(ctx, im.formas.iluminacao, CORES.laranja, 392, 905, 190);
  }

  // moldura da foto (sem foto ainda: silhueta)
  ctx.save();
  arredondado(ctx, 40, 130, 310, 380, 28);
  ctx.clip();
  ctx.fillStyle = "#2a2a2a";
  ctx.fillRect(40, 130, 310, 380);
  ctx.fillStyle = "#3d3d3d";
  ctx.beginPath();
  ctx.arc(195, 285, 62, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(195, 490, 118, 128, 0, Math.PI, 0);
  ctx.fill();
  ctx.restore();

  // nome e função (placeholders até haver personalização)
  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = `800 70px ${f.display}`;
  ctx.fillText("Seu", 40, 610);
  ctx.fillText("nome", 40, 680);
  ctx.fillStyle = "rgba(255,255,255,.8)";
  ctx.font = `500 30px ${f.display}`;
  ctx.fillText("Participante", 40, 735);

  // 8 habilidades (onde o manual põe o QR code): cada marcada acende um ponto
  const n = marcadas.filter(Boolean).length;
  for (let i = 0; i < 8; i++) {
    const x = 62 + (i % 4) * 56;
    const y = 850 + Math.floor(i / 4) * 56;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    if (marcadas[i]) {
      ctx.fillStyle = COR_HAB[i];
      ctx.fill();
    } else {
      ctx.setLineDash([5, 6]);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(255,255,255,.4)";
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
  ctx.fillStyle = "#ffffff";
  ctx.font = `800 36px ${f.display}`;
  ctx.fillText(`${n} de 8`, 285, 862);
  ctx.fillStyle = "rgba(255,255,255,.7)";
  ctx.font = `500 20px ${f.display}`;
  ctx.fillText("habilidades", 285, 892);
}

export function desenhaVerso(ctx: CanvasRenderingContext2D, f: Fontes, im: Imgs | null) {
  void f;
  ctx.clearRect(0, 0, CW, CH);
  fundo(ctx);
  if (!im) return;
  const w = 500;
  const h = (w * im.logo.naturalHeight) / im.logo.naturalWidth;
  ctx.drawImage(im.logo, (CW - w) / 2, (CH - h) / 2 + 20, w, h); // proporção original do logo
}
