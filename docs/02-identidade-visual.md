# BAMBOLINA — Identidade visual e direção de design

> Fonte: `TCC 2026.pdf` (Projeto de Design VII, Júlia Morales Vitorino, 03/11/2026), seção **04. Operacional**, páginas 45–218.
> Imagens de apoio em [referencias/](referencias/). Itens ⚠️ são pendências, divergências ou inferências minhas.
> O PDF é a **fonte da verdade visual**. O `Catalogo_Bambolina.docx` usava só vinho/creme em Arial; isso era um rascunho de Word, não a marca.

## 1. Conceito de marca

- **Nome:** *bambolina*. Substantivo comum feminino (bam-bo-li-na). No teatro é o elemento cênico suspenso no alto do palco que esconde equipamentos e estruturas fora da visão do público. A ideia é **"levantar a bambolina" e revelar tudo o que existe por trás do espetáculo**.
- **Assinatura do logo:** *TEATRO ALÉM DO PALCO*
- **Propósito:** *Despertar potenciais que vão muito além do palco.*
- **Promessa:** *Um palco de possibilidades.*
- **Frase de fechamento do manifesto:** *Bambolina, um palco de possibilidades.* (composta na fonte Swung Note)
- **Slogan do catálogo/posts/folder:** *O teatro é só o começo.* ("O Teatro é Só o Começo" no folder)
- **DNA (palavras-guia):** Desbravador · Interativa · Coletiva · Criativa · Sinergia · Empática · Autonomia · Imersiva · Despertar · Explorar · Amplo · Provocativa · Construtiva · Comunicativo · Autoconhecimento · Iniciativo
- **Personalidade:** desbravadora e comunicativa; lúdica, expressiva, dinâmica, "mambembe". Referências de tom: TED-Ed, Airbnb, Duolingo, LEGO, Nat Geo, Pixar, IDEO, Patagonia, Kahoot!, Miro, Dove, Disney Parks.

## 2. Paleta de cores

Cores confirmadas por amostragem de pixel em [referencias/cores.png](referencias/cores.png):

| Nome sugerido | Hex | Observação |
|---|---|---|
| Rosa choque (primária, cor principal do logo) | `#FF1EC7` | o PDF escreve "#FF1EC7" |
| Amarelo-limão | `#DDF230` | ⚠️ o PDF escreve **"#DTDF23"** (typo). Pelos pixels é `#DDF230` |
| Laranja | `#FF5938` | |
| Azul | `#1F6BED` | |
| Vinho | `#750015` | |
| Creme | `#F2F1E8` | |
| Preto/grafite (de facto) | ≈ `#1D1D1B` a `#0F0F0F` | ⚠️ não está na paleta oficial, mas todas as peças usam fundo quase preto; é o "palco" |

**Pares de contraste mostrados na própria paleta** (cor do cartão → cor do ponto):
rosa → amarelo · amarelo → azul · laranja → vinho · azul → creme · vinho → rosa · creme → laranja.

**Aplicações aprovadas do logo:** rosa sobre vinho; azul sobre amarelo; rosa/amarelo/laranja/azul sobre preto; preto sobre branco (positivo); branco sobre preto (negativo).

**Mapeamento observado de cor por área** (sinalização, pág. 106–108): Figurinos = rosa, Cenografia = azul, Sonoplastia = amarelo. ⚠️ O mapeamento completo das 9 áreas não foi definido; podemos propor.

**Texturas/tratamentos recorrentes nas peças:** halftone (retícula de pontos) amarelo-limão ou branco; recortes de fotos com contorno colorido (estilo sticker/colagem); gradiente preto → amarelo ou preto → rosa/roxo; selos com borda serrilhada (estilo ingresso/etiqueta); post-its coloridos; fitas e pílulas coloridas com rótulos inclinados ("Explore", "Experimente", "SPOILER:").

## 3. Tipografia

| Uso | Fonte | Notas |
|---|---|---|
| Logo (base do wordmark) e display expressivo | **Swung Note** | Fonte lúdica "mambembe". Aparece no manifesto ("Bambolina, um palco de possibilidades.") |
| Assinatura do logo (*TEATRO ALÉM DO PALCO*) | **Montserrat** | caixa alta, peso regular/leve |
| Textos e materiais gerais (secundária) | **Open Sauce** | ⚠️ checar licença/disponibilidade web (não está no Google Fonts; é open source, existe no GitHub/Fontsource) |
| Títulos de impacto nos posts | sans pesada tipo grotesca condensada/extra bold com contorno branco | ⚠️ não especificada |

⚠️ A diagramação do próprio PDF usa **Poppins**, mas isso é do template do trabalho acadêmico, não da marca.

**Licenças (pesquisadas em 19/11/2026):**

| Fonte | Licença | Situação |
|---|---|---|
| Montserrat | SIL OFL 1.1 (Google Fonts) | ✅ Livre, uso comercial e self-host (via `next/font/google`) |
| Open Sauce (Sans/One/Two) | SIL OFL 1.1 ([GitHub marcologous/Open-Sauce-Fonts](https://github.com/marcologous/Open-Sauce-Fonts), [Fontsource](https://fontsource.org/fonts/open-sauce-one/about)) | ✅ Livre, uso comercial, sem atribuição obrigatória. ⚠️ O TCC diz só "Open Sauce"; confirmar com a Júlia qual das 3 famílias (Sans, One ou Two) |
| Swung Note | ✅ **Baixada e instalada** em `src/app/fonts/SwungNote.otf` (versão de uso pessoal). **Comercial** (PintassilgoPrints, vendida na Creative Market/MyFonts; também em [Adobe Fonts](https://fonts.adobe.com/fonts/swung-note)) | ⚠️ Não é livre para uso comercial, mas existe versão gratuita **para uso pessoal**. **Como o projeto é um TCC pessoal, sem fins comerciais, a versão de uso pessoal serve.** Se o projeto virar comercial (a escola pagando de verdade, por exemplo), será preciso licenciar. Conferir a licença/arquivo que a Júlia usou, e se possível usar o mesmo arquivo dela |

Dica: o logo é desenhado (outlines), então **não precisa da fonte instalada**. A Swung Note só é necessária para títulos expressivos e frases tipo "Bambolina, um palco de possibilidades." Se a licença for só desktop, essas frases podem virar SVG.

## 4. Logo

- **Totalmente tipográfico**, letras irregulares/"tortas" inspiradas no teatro mambembe, com **intervenções que lembram efeitos de luz da iluminação teatral** (o "A" de BAM tem um corte/degrau, o "N" fica com cantos inclinados, a base do B se prolonga em uma "aba" que lembra a bambolina/cortina). Ver [referencias/logo.png](referencias/logo.png).
- **Variações previstas** (págs. 54–60):
  - Completa vertical · completa horizontal · completa horizontal variação (tagline acima) · **reduzida** (só BAMBOLINA) · super horizontal (tagline ao lado) · super vertical.
  - Cores permitidas: rosa, amarelo, laranja, azul; positivo (preto) e negativo (branco).
- **Área de segurança:** definida por um "L" invertido / marcas de canto equivalentes à altura de uma letra (pág. 63).
- **Nunca:** incorporar elementos na área de segurança (ex.: máscaras de teatro sobre o logo) · distorcer/glitchar · girar · alterar proporções entre palavra e tagline · usar paletas fora da oficial (ex.: verde/roxo) · aplicar sobre fundos que prejudiquem a legibilidade (fotos ocupadas). Ver [referencias/logo-usos-proibidos.png](referencias/logo-usos-proibidos.png).
- ⚠️ **Arquivos originais do logo (SVG/AI/PNG) NÃO estão na pasta.** Só existe o PDF (imagem). Para o site precisamos do vetor. Opções: (a) pedir os arquivos à autora; (b) vetorizar a partir do PDF, mas a fidelidade fica abaixo.

## 5. Elementos gráficos abstratos

Formas geométricas simples, em creme sobre preto no manual, usadas em cores da paleta nas peças ([referencias/elementos-graficos.png](referencias/elementos-graficos.png)). Cada uma representa uma área:

| Elemento | Forma |
|---|---|
| Iluminação | arco / semicírculo vazado (um "refletor" ou arco-íris) |
| Cenografia | círculo cheio |
| Direção | forma em "8" assimétrico, topo reto e curvas côncavas |
| Sonoplastia | três meios-círculos/meias-luas em sequência (ondas sonoras) |
| Contrarregragem | forma em "Z/2" arredondada, com recortes |

Uso nas peças: padrão espalhado como "confete" (ver certificado, bolsa, camiseta), mascote de seção, ícone em capa de folder, **forma 3D extrudada** em estande (págs. 124–149), **feixe de luz amarelo** com mancha rosa no chão (cenário de iluminação).
⚠️ São 5 elementos para 9 áreas; faltam figurino, maquiagem, dramaturgia, produção e atuação. Podemos propor novos mantendo a linguagem (formas simples, sólidas, arredondadas).

## 6. Linguagem fotográfica e de ilustração

- **Painel conceitual** ([referencias/painel-conceitual.png](referencias/painel-conceitual.png)): palcos e plateias vazias (vermelho-teatro), luz de palco com fumaça/azul-esverdeado, bastidores industriais, jovens reais em grupo (diversos), formatura, ensaio.
- **Painel de referência gráfica** ([referencias/painel-referencia.png](referencias/painel-referencia.png)): colagem editorial, silhuetas recortadas com cor chapada sobre foto P&B, feixe de luz amarelo de projetor, tipografia expressiva, cortina vermelha, cartazes de teatro, tipografia em grade.
- **Tratamento das fotos de pessoas** nas peças: recorte com contorno de cor chapada (azul ou rosa), fundo gradiente escuro, halftone, máscaras de teatro (usadas em fotos e posts, **não** no logo).

## 7. Tom de comunicação

"De forma descontraída e acessível, com linguagem dinâmica que estimula a curiosidade e convida à participação."

Exemplos reais de copy das peças (usáveis como direção, não como texto final):
- "Que evento é esse? SPOILER: uma experiência imersiva para descobrir o teatro por trás das cortinas."
- "Coisas que eu estou obcecado"
- "O teatro pode transformar seu futuro profissional?"
- "6 carreiras em que ter experiência com teatro pode ser um diferencial" (parte um/dois)
- "Vem ver tudo o que rolou no [colégio]"
- "Explore os bastidores!" · "Siga conectado!" · "O que é a Bambolina?"
- Slogans: "O Teatro é Só o Começo", "Explore / Experimente" (pílulas), "um palco de possibilidades."
- YouTube: "Por trás das cortinas do teatro" · "O teatro vai muito além do palco" · "Quantas profissões existem dentro do teatro?" · hashtags #Bambolina #TeatroAlémDoPalco #BastidoresDoTeatro

## 8. Peças e aplicações já desenhadas (págs. 67–217)

| Peça | Descrição |
|---|---|
| Posts Instagram | Feed com fundo preto/halftone amarelo, tipografia pesada, logo em rosa/amarelo. Referências: [posts 1](referencias/comunicacao-posts-1.png), [posts 2](referencias/comunicacao-posts-2.png) |
| Stories / Reels | Mockups de celular com foto + logo rosa |
| Perfil Instagram | Avatar rosa com logo, grid mesclando posts e fotos |
| Canal YouTube | Banner rosa com logo amarelo, thumbnails ("NINGUÉM FALA SOBRE ISSO!") — [referencia](referencias/aplicacao-youtube.png) |
| Site (mockup) | Laptop em branco com QR code (⚠️ a landing ainda não foi desenhada) |
| Folder trifold | Preto com gradiente amarelo, elementos azul/rosa/vermelho, halftone — [referencia](referencias/aplicacao-folder.png) |
| Pasta/kit | Pasta preta com laranja, bloco de notas, caneta amarelo-limão |
| Certificado | Preto com formas coloridas (azul, amarelo, rosa) |
| Credencial (crachá) | Preto, foto + nome + papel (Palestrante/Ator/Aluno) + QR + formas — [referencia](referencias/aplicacao-credencial.png) |
| Camiseta / ecobag | Preta com logo rosa e frase "um palco de possibilidades." |
| Sinalização | Placas coloridas por área com ícone + seta + logo; fita no chão em rosa/azul/amarelo — [referencia](referencias/aplicacao-sinalizacao.png) |
| Mural de post-its | Cenário com parede preta, post-its coloridos, pergunta "qual habilidade você gostaria de desenvolver para o seu futuro?" e logo no chão |
| Estandes 3D | Cenários do evento: parede azul com feixe de luz amarelo e mancha rosa (Iluminação); formas 3D gigantes (Sonoplastia/Direção); letreiro 3D rosa "BAMBOLINA" |
| Túnel de som | Túnel de tecido azul-marinho com arcos e luz rosa (Sonoplastia): "pra que serve o som numa peça?" |
| Sala Figurino | Guarda-roupa de histórias, manequins, parede vinho com croquis: "quem é esse personagem? vista uma possibilidade" |
| Sala Cenografia | Teatrinho/maquete, cortina vermelha, "4 · abra os bastidores", "chuva de ideias" |

⚠️ **Tudo isso é mockup acadêmico.** Nomes, datas e números nas peças (Colégio Aurora/Integralista, "27 de novembro, sábado 9h–13h", contato@bambolina.com.br, "500.000 subscribers", views, assinatura da certificação) **são fictícios**. Não usar como dados reais.

## 9. Implicações para o site (proposta inicial, a validar)

1. **Fundo preto/grafite como "palco"**, com cores vibrantes explodindo como luz. Vinho e creme como neutros quentes de apoio e para dar respiro.
2. **Logo rosa** como padrão; trocar para amarelo/azul/laranja conforme a seção (cada área/estação pode ter sua cor).
3. **Formas geométricas** (arco, círculo, "8", meias-luas, "Z") como personagens do scroll: entram, giram, se encaixam, viram ícones de cada estação.
4. **Feixe de luz/spotlight** que segue o scroll ou o cursor, revelando conteúdo (liga com "iluminação" e "levantar a bambolina").
5. **Cortina/bambolina** abrindo na entrada, e uma "aba" (a do logo) como elemento recorrente de revelação.
6. **Halftone, recortes com contorno, pílulas inclinadas e selos serrilhados** nos cards e CTAs.
7. **Tipografia:** Swung Note nos momentos expressivos, Montserrat em microcopy/etiquetas, Open Sauce no corpo (ou fallback).
8. Manter as **regras de uso do logo** (área de segurança, sem rotação/distorção, só paletas oficiais).
