# Revisão (20/11/2026): lacunas do catálogo, identidade visual e código

> Feita sem o usuário presente. Compara `Catalogo_Bambolina.docx` (23 seções, conferido: 3.604 palavras no docx × 3.476 em `docs/01`, sem seção faltando na transcrição) e `TCC 2026.pdf` com o que o site tem hoje. **Nada de conteúdo novo foi inserido no site**: são decisões suas (ver "Perguntas" no fim).

## 1. Catálogo × site: o que falta

Legenda: ✅ está · 🟡 parcial · ❌ não está.

| # | Seção do catálogo | No site | Observação |
|---|---|---|---|
| 1 | Capa | ✅ Hero | slogan "O teatro é só o começo" em palavra rotativa |
| 2 | O que é a Bambolina? | 🟡 | só o manifesto curto no Roteiro; falta o texto "experiência teatral imersiva e interativa… ferramenta de descoberta pessoal e profissional" |
| 3 | História | ❌ | |
| 4 | O problema (5 desafios) | ❌ | |
| 5 | Por que o teatro? (8 competências) | ❌ | |
| 6 | Teatro × escolha profissional | 🟡 | Habilidades cobre 8 habilidades→profissões; a **tabela de 9 áreas** (habilidades + conexões) não aparece nos cards de Áreas |
| 7 | O que a Bambolina oferece (7 itens) | ❌ | |
| 8 | Áreas (9 estações) | ✅ Áreas + Hero 3D | |
| 9 | Como funciona (5 etapas) | ❌ | |
| 10 | Jornada de 2 h (tabela de 120 min) | ❌ | ótimo candidato a linha do tempo visual |
| 11 | O que os estudantes vivenciam | ❌ | |
| 12 | Desafio criativo | 🟡 | só a frase "Nenhum espetáculo acontece sozinho" |
| 13 | Para quem (9º ano, Médio, técnico, feiras…) | ❌ | **crítico**: o comprador é a escola |
| 14 | Benefícios para os estudantes | ❌ | |
| 15 | Benefícios para a instituição | ❌ | **crítico**: é o argumento de venda |
| 16 | O que está incluído | ✅ Contratação | |
| 17 | Estrutura necessária | ✅ Contratação | |
| 18 | Investimento + como contratar | ✅ Contratação | preço = referência a validar |
| 19 | Como é realizada (7 etapas) | ❌ | |
| 20 | Equipe (5 responsabilidades) | ❌ | só "equipe com 5 profissionais" |
| 21 | O que torna diferente (Conhecer · Experimentar · Descobrir) | ❌ | cabe em 3 cartões |
| 22 | FAQ (9 perguntas) | ✅ FaqMural | as 9 estão |
| 23 | CTA/contato | ✅ | contatos ainda placeholders |
| — | Referências pedagógicas (Oliveira & Loos-Sant'Ana; Oliveira & Stoltz) | ❌ | rodapé |

**Manifesto do TCC:** o Roteiro usa só o começo e 3 notas. Faltam "E se o teatro fosse também um lugar para descobrir quem somos…?" e "Porque o teatro não é feito apenas por quem está no palco…".

**Pendências do docx que continuam abertas:** política de cancelamento/remarcação, preço para grupos >30, deslocamento/área de atendimento, nome e apresentação dos responsáveis, contatos, depoimentos/registros (só quando existirem; nunca inventar). Hoje o site mostra 6 `<Placeholder>` (`src/data/contato.ts`).

**Sugestão de ordem** (o docx recomenda 4 capítulos; o menu já tem 4 links): antes de Contratação, entrar *Por que o teatro* (2–5, condensado) → *A jornada de 2 h* (9–11 + 10 como linha do tempo) → *Para quem e benefícios* (13–15) → *Equipe e realização* (19–21). Seções 13–15 e 20 são as que mais pesam para quem decide a compra.

## 2. Identidade visual: o que poderia ser melhor aplicado

1. **Cor por área** (sinalização, pág. 106–108): Figurino = rosa, Cenografia = azul, Sonoplastia = amarelo. ✅ Sonoplastia corrigida para limão em `areas.ts` (21/11/2026); as outras 6 áreas não têm cor definida no TCC.
2. **Logo em outras cores:** só o rosa é usado. Os SVGs amarelo/azul/laranja já existem em `public/brand/logo/` (reduzida e completa) e a identidade manda trocar conforme a seção. Faltam positivo/negativo e as variações vertical/super horizontal (pedir à Júlia).
3. **Halftone (retícula de pontos):** é textura recorrente nas peças (amarelo/branco) e **não aparece** no site. Entra bem em fundos de seção, no Hero e na faixa dos cards.
4. **Pílulas inclinadas com rótulo** ("Explore", "Experimente", "SPOILER:") e **selos serrilhados**: hoje só as notas do livro fazem isso. Usar nos títulos de seção e CTAs.
5. **Gradientes** preto→amarelo e preto→rosa (folder, credencial): quase não usados fora do crachá/capa.
6. **Recortes de pessoas com contorno colorido + máscaras de teatro** (linguagem fotográfica do manual): o site não tem fotos. Precisa de foto/ilustração própria; sem isso, a colagem das referências não se repete.
7. **Tom de voz:** as peças usam "Que evento é esse? SPOILER:", "Explore os bastidores!", "Vem ver…". O texto do site é o do catálogo (formal). Dá para manter o catálogo no corpo e trazer o tom do TCC nos rótulos e microcopy.
8. **Tipografia:** títulos de impacto dos posts são grotesca extra-bold com contorno branco; o site usa Montserrat 800 sem contorno. O TCC diz só "Open Sauce": confirmar a família (Sans/One/Two). **Swung Note** é versão pessoal: licenciar antes de uso comercial.
9. **Credencial** (feito nesta sessão) e **certificado** (preto + formas): ideia, ao marcar as 8 habilidades, oferecer um certificado/cartão para o aluno (sem dados reais; só layout).
10. **Formas oficiais** (feito): cada forma = uma área; `areas.ts` documenta o mapeamento das 4 áreas sem forma própria.

## 3. Código e performance: o que foi feito

- **Lint zerado** (`npm run lint`: 0 erros, 0 avisos): `Nav.tsx` (setState síncrono em effect) e `EdgeColumns.tsx` (expressão ternária como statement).
- **Removido (sem uso):** `planoTex` (`comum.ts`), campo `peca` e export de tipo em `habilidades.ts` (sobrou da cena antiga), `.faq-todas` (CSS), classe-marcador `cortina-fim`.
- **Crachá:** o WebGL só monta quando a seção chega a 700 px da tela (antes criava um 2º contexto WebGL e baixava o chunk do Three junto com o Hero); o laço **dorme** quando tudo para (~1 s parado) e acorda com ponteiro/teclado/virar; a fita do cordão não aloca objetos por quadro (antes ~50 `Vector3`/quadro).
- **Grão da página:** `mix-blend-mode: overlay` em tela cheia sobre o canvas WebGL era caro; trocado por camada comum em tons de cinza (visual quase igual).
- **Metadados:** `theme-color` e Open Graph (título/descrição, `pt_BR`).
- **Medido:** JS+CSS inicial ≈ 266 KB gzip; o chunk do Three (~598 KB) carrega só sob demanda; texturas do backstage ~300 KB.

**Não feito / sugestões:**
- Swung Note: 235 KB em `.otf`; converter para `.woff2` e subsetar (latin) cai para ~30–40 KB. Precisa de ferramenta (fonttools/Fontsource) que não há aqui.
- `gsap/Draggable` entra no bundle inicial só para desktop em Areas; poderia ser `import()` sob demanda (ganho ~10 KB gzip).
- Hero 3D: nível de qualidade já é adaptativo; falta medir em **GPU real, celular e Safari** (tudo foi testado só em SwiftShader).
- `public/brand/logo/*-amarelo|azul|laranja.svg` não são referenciados hoje (mantidos de propósito para o item 2 acima).
- Não há testes automatizados (o projeto é visual); lógica com ramificação (`jornada.ts`, verlet do crachá) não tem teste unitário.

## 4. Perguntas para você

1. Quais seções do catálogo entram na landing e em que ordem? (sugestão acima: 13–15, 10, 20 primeiro)
2. Posso alinhar a cor por área à sinalização do TCC (Sonoplastia = amarelo, etc.)?
3. Há fotos/ilustrações da Júlia para recortes com contorno e halftone?
4. Nome/função no crachá: digitados pelo visitante ou fixos?
