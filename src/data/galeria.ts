import { AREAS } from "./areas";

// 20 imagens ilustrativas da experiência (public/galeria/NN-m.webp 640 px e NN-g.webp 1280 px; originais em /fotos, fora do git).
// Legendas só reaproveitam textos do catálogo (áreas, etapas da jornada de 2 h, seção 9/11); nada é inventado.
// Cada foto aponta para a área cuja forma oficial a representa; as etapas da jornada não têm forma.
export type Foto = {
  n: number;
  alt: string;
  tag: string; // área ou etapa
  titulo: string;
  texto: string;
  shape?: (typeof AREAS)[number]["shape"];
};

const area = (nome: string) => {
  const a = AREAS.find((x) => x.area === nome)!;
  return { tag: a.area, titulo: a.estacao, texto: a.desc, shape: a.shape };
};
const etapa = (tag: string, titulo: string, texto: string) => ({ tag, titulo, texto });

export const FOTOS: Foto[] = [
  { n: 1, alt: "Entrada decorada com flores e tecidos; uma criança vestida de fada conversa com visitantes.", ...etapa("Jornada", "Recepção", "Acolhimento e apresentação inicial.") },
  { n: 2, alt: "Mesa de som em um estúdio improvisado; um jovem mostra o equipamento a um grupo.", ...area("Sonoplastia") },
  { n: 3, alt: "Estudantes e adultos escolhendo figurinos em um ateliê com araras e tecidos.", ...area("Figurino") },
  { n: 4, alt: "Cenário de floresta com árvores e luzes por onde os visitantes circulam.", ...area("Cenografia") },
  { n: 5, alt: "Uma mulher fala de pé em um palco para uma plateia de estudantes.", ...etapa("Jornada", "Abertura", "Introdução à Bambolina e ao propósito da experiência.") },
  { n: 6, alt: "Um homem apresenta algo diante de uma projeção para uma plateia.", ...etapa("Jornada", "Universo teatral", "Apresentação dos bastidores e das diferentes profissões.") },
  { n: 7, alt: "Cena de teatro: dois atores em figurino de época contracenam no palco.", ...area("Atuação") },
  { n: 8, alt: "Atores em trajes de época interagem com crianças e adultos em um corredor.", ...etapa("Jornada", "Exploração", "Demonstrações e atividades práticas nas áreas teatrais.") },
  { n: 9, alt: "Duas jovens conversam, uma com microfone de lapela, entre obras coloridas.", ...etapa("Jornada", "Compartilhamento", "Troca de experiências e descobertas.") },
  { n: 10, alt: "Vista aérea de uma grande praça com barracas, tecidos coloridos e muita gente.", ...etapa("Na escola", "A Bambolina vai até a sua escola", "A equipe leva os materiais, organiza o espaço e conduz as atividades dentro da escola.") },
  { n: 11, alt: "Sala com tecidos luminosos e almofadas; crianças tocam os tecidos.", ...area("Iluminação") },
  { n: 12, alt: "Espaço com globos, planetas e maquetes; uma jovem guia os visitantes.", ...etapa("Jornada", "Desafio criativo", "Atividade coletiva que estimula criação e colaboração.") },
  { n: 13, alt: "Camarim com espelhos: uma estudante é maquiada e outras ajudam com o figurino.", ...area("Maquiagem") },
  { n: 14, alt: "Conversa em um palco, com três pessoas sentadas diante da plateia.", ...area("Direção") },
  { n: 15, alt: "Crianças fantasiadas posam sob um arco de flores enquanto familiares fotografam.", ...etapa("Vivência", "Criar personagens", "Os estudantes podem criar personagens e pequenas narrativas.") },
  { n: 16, alt: "Jovens e adultos percorrem um corredor com cenário colorido, apontando detalhes.", ...area("Produção") },
  { n: 17, alt: "Estudantes produzem efeitos sonoros com microfones e objetos diversos.", ...etapa("Sonoplastia", "Efeitos sonoros", "Experimentar a criação de efeitos sonoros."), shape: "sonoplastia" },
  { n: 18, alt: "Praça iluminada à noite com visitantes e crianças fantasiadas.", ...etapa("Jornada", "Vivência", "Recepção dos estudantes, exploração das áreas teatrais e realização das atividades práticas.") },
  { n: 19, alt: "Um ator de capa em um cenário de biblioteca azulada, diante do público.", ...area("Dramaturgia") },
  { n: 20, alt: "O elenco completo no palco recebe aplausos sob confete.", ...etapa("Jornada", "Encerramento", "Reflexão final e despedida.") },
];

export const src = (n: number, g = false) => `/galeria/${String(n).padStart(2, "0")}-${g ? "g" : "m"}.webp`;
