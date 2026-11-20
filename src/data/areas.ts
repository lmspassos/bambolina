// As 9 áreas do catálogo (seção 8). Nomes de estação e descrições vêm do docx.
// `shape` reutiliza os 5 elementos da marca (só 5 existem para 9 áreas; ver docs/02).
export type Area = {
  area: string;
  estacao: string;
  desc: string;
  shape: "iluminacao" | "cenografia" | "direcao" | "sonoplastia" | "contrarregragem";
  bg: string; // cor da faixa do card
  fg: string; // cor da forma
  ink: string; // cor do rótulo "Estação NN" (contraste ≥ 4.5:1 com `bg`)
};

const DARK = "var(--color-palco)";
const LIGHT = "var(--color-creme)";

export const AREAS: Area[] = [
  { area: "Iluminação", estacao: "Luz em Cena", desc: "Descubra como a luz transforma ambientes, cria atmosferas e direciona o olhar do público.", shape: "iluminacao", bg: "var(--color-limao)", fg: "var(--color-azul)", ink: DARK },
  { area: "Sonoplastia", estacao: "Som da Cena", desc: "Explore os sons, efeitos e trilhas que ajudam a construir emoções e contar histórias.", shape: "sonoplastia", bg: "var(--color-laranja)", fg: "var(--color-vinho)", ink: DARK },
  { area: "Cenografia", estacao: "Mundo em Cena", desc: "Conheça como espaços, objetos e elementos visuais dão forma ao universo de uma apresentação.", shape: "cenografia", bg: "var(--color-azul)", fg: "var(--color-creme)", ink: "#ffffff" },
  { area: "Figurino", estacao: "Vestindo Personagens", desc: "Descubra como roupas, cores e materiais ajudam a construir a identidade de personagens.", shape: "contrarregragem", bg: "var(--color-rosa)", fg: "var(--color-palco)", ink: DARK },
  { area: "Maquiagem", estacao: "Cara de Personagem", desc: "Experimente como a maquiagem pode transformar aparências e contribuir para a caracterização.", shape: "direcao", bg: "var(--color-creme)", fg: "var(--color-rosa)", ink: DARK },
  { area: "Dramaturgia", estacao: "Entre Linhas", desc: "Conheça o processo de criação de histórias, personagens, diálogos e narrativas.", shape: "cenografia", bg: "var(--color-vinho)", fg: "var(--color-limao)", ink: LIGHT },
  { area: "Direção", estacao: "No Comando", desc: "Entenda como as ideias são organizadas e como diferentes profissionais trabalham em conjunto.", shape: "direcao", bg: "var(--color-limao)", fg: "var(--color-vinho)", ink: DARK },
  { area: "Produção", estacao: "Todo Mundo em Cena", desc: "Descubra quem organiza, planeja e coordena os processos necessários para que tudo aconteça.", shape: "contrarregragem", bg: "var(--color-rosa)", fg: "var(--color-limao)", ink: DARK },
  { area: "Atuação", estacao: "Em Cena", desc: "Experimente a expressão corporal, a interpretação e a construção de personagens.", shape: "iluminacao", bg: "var(--color-laranja)", fg: "var(--color-creme)", ink: DARK },
];
