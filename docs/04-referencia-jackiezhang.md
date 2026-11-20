# Referência: jackiezhang.co.za (portfólio de Jackie Zhang)

> Indicada pelo usuário em 19/11/2026 como referência de dinamismo/animação. Analisada por HTML bruto + capturas (não vi movimento, só frames; timings e easings são inferência).
> **Usar só como inspiração de técnica e sensação.** Ilustrações, textos e layout são autorais da designer; não copiar assets.

## Tecnologia (confirmada no HTML)
- **Framer** (site gerado no Framer, React) + **Lenis** (scroll suave). Mesmo conceito da nossa stack (Lenis), só que com Framer Motion por baixo.
- Fontes: Averia Serif Libre, DM Sans, Rubik, IBM Plex Sans, JetBrains Mono, Geist Mono, mais fontes manuscritas/lettering próprias nos menus.
- Cores: fundo grafite texturizado `#1d1d1d`-ish; vermelho-coral `#e35342`; creme `#f2e3cf`/`#f5e1ce`; verde-limão `#83b918` como acento.

## O que o site faz (observado)
1. **Fundo escuro com textura/grão** (não é preto chapado). Dá cara de papel/quadro-negro.
2. **Colunas laterais de "carimbos"/azulejos** em coral, repetidas na vertical nas duas bordas, rolando junto com a página (função de moldura, tipo borda de ingresso/fita de filme).
3. **Hero em "cartão" arredondado** (capa de caderno em coral com folha creme quadriculada dentro). A página parece um livro/caderno aberto; há uma fita de marcador saindo.
4. **Doodles/stickers desenhados à mão** (gato, pássaro, flores, dado, lata) flutuando soltos ao redor do conteúdo, em traço creme.
5. **Colagem "caos organizado" ao rolar:** cards com **borda branca grossa e cantos arredondados**, cada um **girado em ângulo diferente** (±3–8°), espalhados pela tela em **velocidades de parallax diferentes**, com ilustrações entre eles. Parece uma mesa de trabalho com polaroids/telas espalhadas.
6. **Menu manuscrito minimalista** no topo (about / work / connect) com um sorriso desenhado.
7. **Microtexto vivo** (ex.: "Cape Town • GMT +2:00", hora local) e títulos com **troca de peso/estilo de fonte na mesma frase** ("Software should feel *natural*" em serifa condensada + manuscrito).
8. **Mobile:** a própria autora admite que é "work in progress"; o mobile mostra só uma mensagem. **Nós devemos adaptar de verdade**, sem repetir isso.

## Como traduzir para a Bambolina (proposta)
| Técnica do site | Versão Bambolina |
|---|---|
| Fundo texturizado | Grafite `#1D1D1B` + grão leve (noise SVG) e vinheta de luz de palco |
| Colunas laterais de carimbos | **Bordas de "cortina/ingresso"**: colunas verticais em loop com os 5 elementos geométricos + máscaras + logo reduzida, em rosa/amarelo/laranja/azul |
| Hero em cartão/caderno | A **cortina** que já temos; evoluir para cortina 3D com bambolina e abertura ligada ao scroll |
| Doodles soltos | Formas da marca, máscaras de teatro, refletor, post-its, feixe de luz, em parallax (já começamos) |
| Cards girados com borda branca em velocidades distintas | **Cards das 9 áreas** estilo ingresso/polaroid: foto/ilustração + nome da estação ("Luz em Cena"…) + ícone, cada um girado e com `data-speed` próprio; hover endireita e amplia |
| Troca de fonte na frase | Frase-título com Montserrat + **Swung Note** no trecho-chave ("O teatro é só o *começo*") |
| Microtexto vivo | Ex.: "Palco aberto • Curitiba" / contador "Faltam X dias" para agenda, ou relógio de cena |
| Menu manuscrito | Menu enxuto em Swung Note, com a bambolina (franja) como separador |

## Técnicas a implementar (GSAP + Lenis)
- Parallax por `data-speed` com `ScrollTrigger scrub` (já existe no Hero; generalizar num hook/utilitário).
- Cards com rotação inicial + `gsap.to` de rotação/escala em hover; entrada com `stagger` ao entrar na viewport.
- Colunas laterais em loop infinito (CSS animation ou GSAP `repeat:-1`), pausadas em `prefers-reduced-motion`.
- Grão: `feTurbulence` em SVG como `background-image` (sem imagem pesada).
- **Mobile de verdade:** reduzir quantidade de cards/doodles, tirar colunas laterais ou deixá-las finas, parallax mais curto.

## Análise do vídeo (gravação de tela do usuário, 24 s, 60 fps)

Arquivo: `docs/referencias/WhatsApp Video 2026-11-19 at 20.16.31 (1).mp4`. Gravado com o celular deitado (conteúdo girado 90°; para ver: `ffmpeg ... -vf transpose=2`). ffmpeg está instalado (winget, Gyan.FFmpeg). O usuário disse que gosta de **tudo** no site.

**Linha do tempo observada**
| Tempo | O que acontece |
|---|---|
| 0–5 s | **Menu com micro-interações de hover:** cursor vira **mão apontando desenhada**. `about`: rabisco de rosto + faíscas, **oval desenhada à mão** em volta do link e "in-progress" em vermelho. `work`: um personagenzinho numa moldura/foto com fita. `connect`: **ícones sociais (in, X, GitHub) flutuam para cima**. Tudo traço fino creme, feito à mão, aparece/desaparece com leve rotação. |
| 5–8 s | **Entrada:** a capa do caderno sobe com parallax e escala; **colunas de carimbos** laterais e faixas no topo/rodapé entram; as **bordas da tela ganham um brilho borrado rosa/coral** (como luz de ribalta). |
| 6–11 s | **Hero troca a palavra da frase** (`feel empowering → fun → honest`), com transição de texto. Ao rolar, o **caderno se abre ao meio** (dobra central com fita-marcador) e revela a página 2: "3 things I strongly believe in" com **notas de papel rasgado, coladas com fita**, inclinadas e sobrepostas. |
| 12–14 s | Rolando, as notas **se soltam e saem voando**; entram os **cards de projeto** (borda branca grossa, girados), **cada um com velocidade diferente**, e doodles entre eles (gato, flor, pássaro, dado). |
| 14–18 s | **Quadro com grade tipo planta/blueprint** (eixos numerados 1…17) onde os cards ficam **empilhados e arrastáveis**: dá para pegar um card e movê-lo; o card sobe de z-index. Uma "base" vermelha inclinada aparece atrás. |
| 18–21 s | Polaroid com foto da designer ("About me") ligada por **linha pontilhada**; doodles laterais. |
| 21–24 s | **Card "What I look for" com checklist interativo:** cada checkbox marcado **revela mais um pedaço da ilustração** vermelha na moldura ao lado (gamificado) + botão "let's chat!". Retro-TV com carinha espiando no rodapé. |

**Elementos globais persistentes:** cursor customizado (seta ↔ mão desenhada), carimbos nas bordas, brilho coral nas bordas, grão, doodles em parallax.

## Plano de tradução para a Bambolina (por ordem de entrega)
1. **Shell global:** fundo grafite com grão, **colunas laterais de elementos da marca** (formas + máscaras + logo reduzida) em loop, **brilho rosa/laranja nas bordas** (ribalta), **cursor customizado** (mão/refletor), menu manuscrito em Swung Note com hover de doodle (bonequinho, faíscas, oval desenhada).
2. **Hero:** a cortina abre e revela um **"caderno de direção/roteiro"** que se abre ao meio com o scroll. Frase com **palavra rotativa**: "O teatro é só o começo de… *luz / som / cenário / figurino / futuro*".
3. **Página 2 do roteiro:** **post-its/notas de papel com fita** (já existem no TCC: mural "qual habilidade você gostaria de desenvolver?") com as 3 ideias-chave do manifesto; saem voando ao rolar.
4. **Áreas:** **quadro tipo planta do palco/percurso** (grade com eixos numerados) com os **9 cards das estações**, girados, velocidades distintas e **arrastáveis** (GSAP Draggable). Reaproveita as plantas isométricas das salas do TCC.
5. **Interativo "teatro × profissão":** checklist de habilidades (Comunicação, Criatividade, Colaboração…) onde cada item marcado **revela parte de uma ilustração** e destaca profissões ligadas (tabela da seção 6 do catálogo).
6. **Contratação:** card creme tipo ingresso com preço, o que inclui, FAQ e botão "Solicitar orçamento" (equivalente ao "let's chat!").
7. **Mobile adaptado de verdade:** menos doodles/cards, colunas finas, drag desligado, mesmo storytelling.

Obs. técnica: arrastar = `gsap/Draggable` (plugin gratuito do GSAP). Lenis + ScrollTrigger já estão ligados.
