# Projeto BAMBOLINA

Landing page / catálogo digital dinâmico (animações, parallax, scroll storytelling) de uma experiência teatral itinerante para escolas/jovens. Idioma do projeto e do conteúdo: **português (pt-BR)**.

## Leia antes de trabalhar

1. [docs/01-conteudo-catalogo.md](docs/01-conteudo-catalogo.md) — conteúdo textual completo do catálogo (23 seções), preço, pendências, regras de conteúdo.
2. [docs/02-identidade-visual.md](docs/02-identidade-visual.md) — marca, cores (hex), tipografia, logo e regras, elementos gráficos, tom, aplicações, implicações para o site.
3. [docs/03-estrategia-e-pesquisa-tcc.md](docs/03-estrategia-e-pesquisa-tcc.md) — pesquisa, DNA, manifesto, posicionamento, modelo, divergências TCC × docx.
4. [docs/04-referencia-jackiezhang.md](docs/04-referencia-jackiezhang.md) — site de referência de animação do usuário (Framer + Lenis: colagem com parallax, bordas de carimbos, doodles) e como traduzir.
5. [docs/06-componentes-detalhes.md](docs/06-componentes-detalhes.md) — implementação detalhada (Backstage 3D, crachá, galeria); só sob demanda.
6. [docs/referencias/](docs/referencias/) — imagens-chave extraídas do TCC (cores, logo, elementos, posts, folder, sinalização…).

Fontes originais: `docs/Catalogo_Bambolina.docx`, `docs/TCC 2026.pdf` (218 págs, 134 MB; tem a identidade visual e ~143 págs de mockups/renders).

## Resumo rápido da marca

- Tagline do logo: **TEATRO ALÉM DO PALCO**. Slogan: **O teatro é só o começo.** Promessa: **Um palco de possibilidades.**
- Cores: rosa `#FF1EC7`, amarelo-limão `#DDF230` (o PDF tem typo "#DTDF23"), laranja `#FF5938`, azul `#1F6BED`, vinho `#750015`, creme `#F2F1E8`; fundo preto/grafite como "palco".
- Fontes: Swung Note (logo/expressivo), Montserrat (tagline), Open Sauce (texto).
- Elementos gráficos: formas geométricas por área (arco, círculo, "8", meias-luas, "Z"), feixe de luz, halftone, recortes com contorno, pílulas inclinadas.

## Contexto

- Projeto é um **TCC (Projeto de Design VII, 2026) de uso pessoal e sem fins comerciais**. Fontes de uso pessoal (Swung Note) são aceitáveis; se virar comercial, licenciar.
- **Narrativa do site (decidido):** a **escola contrata** a experiência (modelo do catálogo: 2h, até 30 alunos, equipe de 5, R$ 3.500 ref.). O CTA principal é solicitar orçamento/agendar. Do TCC aproveitamos identidade, percurso por áreas/salas e protagonismo dos alunos como linguagem, mas **não** vender como "evento gratuito aberto".
- Stack decidida: **Next.js + Lenis + Three.js + GSAP** (sem Astro). Instalado: Next 16.4.6 (App Router, `src/`), React 19.3, TypeScript, Tailwind 4, `lenis`, `gsap` (ScrollTrigger), `three` + `@types/three`.
- Next 16 tem mudanças vs. o que conheço: **ler `node_modules/next/dist/docs/` antes de escrever código** (ver [AGENTS.md](AGENTS.md)).
- Ambiente: Node 26.13.1 / npm 11.20 instalados via winget em `C:\Program Files\nodejs`. Em novos terminais Bash, se `node` não for achado: `export PATH="$PATH:/c/Program Files/nodejs"`.
- Comandos: `npm run dev` · `npm run build` · `npm run lint`.

## Estado do código (19/11/2026)

- `src/components/SmoothScroll.tsx`: Lenis conduzido pelo `gsap.ticker` + `ScrollTrigger.update`; desligado com `prefers-reduced-motion`.
- `src/components/Hero.tsx`: cortina abrindo (GSAP timeline), logo, slogan, CTA `#contato`, spotlight que segue o cursor (CSS vars `--mx/--my` via `quickTo`), 4 formas com parallax por `data-speed`. Usa `gsap.matchMedia()` para respeitar movimento reduzido.
- `src/app/globals.css`: tokens da paleta (`bg-rosa`, `text-limao`, `bg-palco`…), classes `.mask-svg` (recolor de SVG por máscara), `.cortina`, `.bambolina`.
- Fontes: Montserrat (`next/font/google`, classe `font-display`), Open Sauce One (`@fontsource`, classe base), **Swung Note Medium** (`next/font/local`, `src/app/fonts/SwungNote.otf`, classe `font-swung`, usada no slogan). A Swung Note é a versão gratuita **de uso pessoal** baixada do anchorfonts.com (OTF genuíno PintassilgoPrints, 568 glifos, acentos ok, `fsType=4` "preview & print", ou seja, o próprio arquivo não autoriza embed web). Ok para TCC local/apresentação; **antes de publicar online ou comercializar, licenciar** (MyFonts/Fontspring/Adobe Fonts).
- **Live Server:** `next.config.ts` usa `output: "export"` (gera `out/`; sem PPR/cacheComponents, incompatíveis). Fluxo: `npm run build` → clicar com o direito em `out/index.html` → "Open with Live Server" (`.vscode/settings.json` já aponta `liveServer.settings.root` para `/out`). Após mudar o código, rodar `npm run build` de novo. Para desenvolvimento com hot reload, preferir `npm run dev` (porta 3000).
- **Shell global** (montado em `layout.tsx`): `EdgeColumns` (colunas laterais de formas em loop + brilho `.ribalta`), `Nav` (menu em Swung Note; oval desenhada + doodle no hover, CSS puro), `Cursor` (anel que segue o ponteiro, só `pointer: fine`), grão em `body::after`.
- `Hero.tsx`: agora com **palavra rotativa** (luz → som → cenário → figurino → futuro; reduzido = "possibilidades").
- **Backstage 3D no Hero** (experimental, reversível): flag `BACKSTAGE_3D` em `src/data/flags.ts` (`false` = Hero original; para remover, apagar `backstage/`, `HeroBackstage.tsx`, `HeroJornada.tsx`, `lib/jornada.ts`, `public/backstage/` e o bloco "Jornada"/"Backstage" do globals.css). Pin do Hero com 9 estações = as 9 áreas de `AREAS`; qualidade adaptativa por fps, cai para o Hero original em PC fraco. `?bd-debug` expõe `window.__bd`. Arquitetura, performance e armadilhas: [docs/06](docs/06-componentes-detalhes.md). Testado só em SwiftShader (sem GPU real, Safari/iOS, celular).
- `Roteiro.tsx`: livro 3D pinado (ScrollTrigger scrub): capa gira −180° em torno da lombada (arte: fundo grafite + 5 formas oficiais espalhadas com gradiente creme, selo rosa "um palco de possibilidades." e logo rosa; posições em `CAPA` no `Roteiro.tsx`) e revela página esquerda (manifesto) e 3 notas com fita. Reduzido = livro já aberto.
- `Areas.tsx` + `src/data/areas.ts`: quadro tipo planta de palco com os 9 cards em formato de ingresso (`.ingresso`, entalhes por `mask-composite`). Desktop ≥768px: posições absolutas, rotação inicial, parallax por card (`data-par`, wrapper) e **arrastar** com `gsap/Draggable` (`data-drag`, interno; ao pegar sobe z-index, endireita e cresce). Mobile: grade de 2 colunas sem drag/parallax. Reduzido: estático. As formas dos cards se repetem (só há 5 elementos para 9 áreas).
- `Habilidades.tsx` + `src/data/habilidades.ts` + `src/components/cracha/`: checklist de 8 habilidades à esquerda, pílulas de profissões à direita (caixa vinho) e **crachá 3D** (Three puro, cordão verlet) flutuando no centro sobre as duas; aviso verde com CTA abaixo, aparece já na 1ª marcação. Arte do cartão segue o manual do TCC; sem foto/QR (não inventar). **Nome do visitante = easter egg:** balão "Suas?" ao passar o mouse em "Minhas" abre o campo; o crachá não pode crescer quando o campo abre (`recuo`). Detalhes e armadilhas: [docs/06](docs/06-componentes-detalhes.md). Verificado só em SwiftShader.
- `Contratacao.tsx` (`#contato`): investimento (ticket R$ 3.500), o que a escola oferece, condições, 6 passos "como contratar", FAQ em `<details>` (9 perguntas do catálogo), bloco de contato e rodapé com crédito da Júlia. **Sem formulário** (não há backend); só canais de contato.
- **Dados pendentes = marcadores `⚠ [...]`:** todos os valores pendentes vivem em `src/data/contato.ts` (`null` ⇒ aparece `<Placeholder>`: borda vermelha tracejada, fundo branco, fonte mono, fora da paleta de propósito, atributo `data-placeholder`). Hoje há 8: WhatsApp, e-mail, Instagram (docx cita `@bambolina`, não confirmado), site, preço oficial a validar, cancelamento/remarcação, grupos >30, área de atendimento. Para publicar: preencher o arquivo e conferir `document.querySelectorAll("[data-placeholder]").length === 0`.
- `Reveal.tsx`: entrada suave (IntersectionObserver + CSS), respeita movimento reduzido.
- **Revisão geral (20/11/2026), no build de produção:** axe-core (WCAG 2.1 A/AA + best-practice) = **0 violações** em desktop e mobile; sem overflow horizontal de 360 a 1920px; sem erros de console; `prefers-reduced-motion` ok (cortina oculta, palavra estática, livro aberto, sem pin); âncoras do menu caem no topo da seção; ordem de Tab coerente. Correções: `h1` no hero (logo), link "Pular para o conteúdo", contraste dos rótulos (campo `ink` em `areas.ts`; laranja sobre creme → vinho), preço responsivo, favicon da marca (`src/app/icon.svg`; removido o ícone padrão do Next). **Não verificado:** Safari/iOS real (usamos `mask-composite`, `backface-visibility`, CSS `rotate`), leitor de tela real, Lighthouse/performance em rede lenta.
- Auditar: `axe.mjs`/`review.mjs` em `scratchpad/tools` (rodar contra `out/` servido com `npx http-server out -p 5510`; mais estável que o dev server).
- Verificação automatizada: `puppeteer-core` + Chrome em `scratchpad/tools` (`drive.mjs`, `mob.mjs`): rola com `page.mouse.wheel` e tira screenshots (inclusive mobile 390px).
- ⚠️ `npm run dev` pode **não recompilar classes novas do globals.css** (cache do Tailwind/Turbopack): se um estilo novo não aparecer, matar o servidor, `rm -rf .next` e subir de novo.
- `page.tsx`: Hero + Roteiro + placeholders `#areas` e `#contato`. Próximas: 01 origem/propósito, 02 experiência (9 áreas + tabela teatro×profissão), 03 realização (jornada de 2h, equipe, estrutura), 04 contratação (preço, FAQ, contato).
- Verificação visual: `npm run build && npm run start -- -p 3100` e captura com `chrome.exe --headless=new --screenshot=... --virtual-time-budget=7000`.

## Assets de marca (vetoriais, extraídos do PDF)

Em `public/brand/`, como SVG limpo (`viewBox` em pt do PDF):
- `logo/completa*.svg` (com tagline) e `logo/reduzida*.svg` (só BAMBOLINA). Sufixos `-rosa|-amarelo|-laranja|-azul` já têm a cor; os sem sufixo usam `fill="currentColor"` (recolorir por CSS).
- `elementos/elemento-{iluminacao,cenografia,direcao,sonoplastia,contrarregragem}.svg` (`currentColor`).
- A tagline do logo "completa" é feita com `<use>` de glifos Montserrat; funciona em `<img>` e inline. Para extrusão em Three.js usar `SVGLoader` (contornos de letra estão em `<path>`).
- Falta: logo positivo/negativo (usar `currentColor` preto/branco), variações vertical/super horizontal/super vertical (reposicionar tagline).

## Economia de tokens: Ponytail (essencial, vale em toda conversa)

Fonte: plugin [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) (MIT). Postura: "escreva só o que a tarefa precisa". Aplicar sempre:

1. Antes de codar, ler o código que a mudança toca e traçar o fluxo real. Escolher a solução mais simples, nesta ordem: precisa mesmo existir? → já existe no projeto? → biblioteca padrão / recurso nativo do navegador/CSS → dependência já instalada → implementação mínima.
2. **Nunca cortar** validação, tratamento de erro, segurança nem **acessibilidade** (`prefers-reduced-motion`, foco, contraste, alt/aria). Animação pesada precisa de fallback reduzido.
3. Lógica com ramificação, parser, dinheiro ou segurança ganha um teste pequeno. Não criar testes para layout/animação puramente visual.
4. Atalhos conscientes ficam marcados com comentário `shortcut:`; ao final de cada resposta, dizer em 1 linha o que foi pulado ou não verificado.
5. Respostas curtas; não reler arquivos nem repetir contexto que já está aqui. Docs grandes ficam em `docs/` e são lidos **sob demanda** (este arquivo só aponta). Manter este CLAUDE.md enxuto.
6. Intensidade padrão: **full**. Exceção legítima: o escopo visual deste projeto (parallax, Three.js, GSAP) é intencionalmente rico; "mínimo" vale para a **implementação**, não para cortar o efeito pedido.

Instalar o plugin de verdade (comandos slash, o usuário digita no Claude Code): `/plugin marketplace add DietrichGebert/ponytail` e depois `/plugin install ponytail@ponytail`. Úteis: `/ponytail [lite|full|ultra|off]`, `/ponytail-review`, `/ponytail-debt`.
Obs.: testes independentes mostram economia real de ~10–26% de custo (não os "94%" de marketing); `/clear` entre tarefas não relacionadas e sessões curtas economizam mais.

- **Revisão de lacunas (20/11/2026):** ver [docs/05-revisao-lacunas-e-melhorias.md](docs/05-revisao-lacunas-e-melhorias.md) (seções do catálogo que ainda faltam no site, melhorias de identidade, o que foi otimizado). Crachá: WebGL só monta perto da tela e o laço dorme quando parado; grão da página sem `mix-blend-mode`.

- **Galeria (antes de Contratação; título "A experiência por dentro."):** `Galeria.tsx` + `src/data/galeria.ts` + 20 WebP em `public/galeria/` (originais em `/fotos`, ignorados pelo git). **Decisões do usuário:** carrossel em colagem que anda sozinho, 3 fotos visíveis no desktop; a foto do centro é sempre a em foco e o hover de outra assume o foco; clicar numa lateral a leva ao centro e abre; cursor `grab`; setas laterais e segurar e puxar; botão "Ver galeria" abre grade com as 20 (animada); a foto grande voa da miniatura e volta ao lugar exato dela (na grade, ela continua montada, sem reanimar); **sem fade** na foto grande; troca por seta desliza; moldura creme abraça a foto (borda igual). Imagens parecem **geradas por IA**; aviso de "ilustrativas" REMOVIDO a pedido: nunca apresentar como eventos realizados nem inventar depoimentos; legendas só reaproveitam o catálogo. Implementação (FLIP, carrossel, grade): [docs/06](docs/06-componentes-detalhes.md).

## Regras

- **Cada forma da marca = uma área específica** (arco=Iluminação, círculo=Cenografia, "8"=Direção, meias-luas=Sonoplastia, "Z"=Contrarregragem; docs/02 §5). Nunca associar uma forma a outra área ou usá-la com texto de outra. Áreas sem forma própria usam a de significado mais próximo (mapa e justificativa em `src/data/areas.ts`). O hover das colunas laterais (`EdgeColumns.tsx`) mostra sempre o nome da própria forma.
- Não inventar depoimentos, números de resultado ou histórico de eventos realizados.
- Nomes, datas, e-mail, views e inscritos que aparecem nas peças do TCC (Colégio Aurora, 27 de novembro, contato@bambolina.com.br, 500 mil inscritos) são **mockups fictícios**; não usar como dados reais.
- Placeholders (e-mail, WhatsApp, site) seguem pendentes até o usuário informar.
- Preço R$ 3.500 é referência a validar. Custos/margem/ponto de equilíbrio são **internos**, nunca vão para o site.
- Respeitar as regras do logo: sem rotação, distorção, alteração de proporções, paletas fora da oficial, fundos que atrapalhem legibilidade, nada na área de segurança.
- Arquivos vetoriais do logo ainda **não** estão no projeto (só imagem no PDF); pedir ao usuário.
- Sem Python; há `pdftotext`. Para ler o TCC.pdf (134 MB, acima do limite do Read) usar `mupdf` (npm) numa pasta temporária fora do projeto, ou as imagens em `docs/referencias/`.

## Atualizações de UI (20/11/2026)

- **FAQ = mural de abas** (`FaqMural.tsx` + bloco "FAQ: mural de abas" no globals.css; referência: jogo "abra os bastidores"): 9 cartões; cada aba é um `<button aria-expanded>` com dobradiça no topo (`rotateX(108deg)`, verso vinho); a resposta fica `visibility:hidden` enquanto coberta; só UMA aberta por vez (estado `aberta: number|null`); fecha clicando na aba levantada, no papel ou em "baixar aba". Movimento reduzido: a aba some em vez de girar.
- **Âncoras animadas:** `SmoothScroll.tsx` intercepta qualquer `a[href^="#"]` (menu, CTA, "pular") e rola com Lenis (duração 0,9–2,8 s conforme a distância), atualiza o hash e foca a seção. Sem Lenis (movimento reduzido) vale o salto nativo.
- **Doodles do menu** aparecem ABAIXO do link (acima eram cortados pela borda da tela).
- Recarregar a página sempre começa no topo (`scrollRestoration = "manual"` em `SmoothScroll.tsx`), a menos que a URL tenha `#âncora`.
- **Rolagem programática (`lib/jornada.ts`):** `rolarPara()` (Lenis) liga `jornada.navegando`, que desliga o encaixe nas estações (em PC lento ele sequestrava a rolagem). A jornada tem `total = 9 + 0,7` passos: o trecho final fecha a cortina (`--fecha` na seção, painéis em `HeroBackstage.tsx`); o encaixe vai a 9 (aberta) ou ao total (fechada). "Pular" salta ao palco 9 e rola suave (cortina fecha) até `ScrollTrigger.getById("livro").start`. Livro: pin id `"livro"`, clique/Enter abre; aberto, página esquerda fecha e direita vai a `#areas`. Menu "experiência" = `#inicio` → topo absoluto (Hero pinado). Armadilha: `return` antes da cadeia `tl.fromTo` do Roteiro deixa a animação inalcançável.
