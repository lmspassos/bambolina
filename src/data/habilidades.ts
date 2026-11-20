// Habilidades e conexões profissionais, derivadas da tabela "Teatro e escolha profissional" (catálogo, seção 6).
// Não é teste vocacional: serve para mostrar conexões (aviso reforçado na UI).
export type Habilidade = {
  nome: string;
  areas: string[]; // áreas do teatro que exercitam a habilidade
  profissoes: string[];
  peca: "personagem" | "lua" | "cortinaEsq" | "piso" | "feixe" | "som" | "cortinaDir" | "arco"; // parte da cena que ela revela
};

export const HABILIDADES: Habilidade[] = [
  { nome: "Comunicação", areas: ["Dramaturgia", "Atuação"], profissoes: ["Jornalismo", "Publicidade", "Roteiro", "Produção de conteúdo", "Educação", "Apresentação"], peca: "personagem" },
  { nome: "Criatividade", areas: ["Dramaturgia", "Figurino", "Cenografia"], profissoes: ["Moda", "Design", "Publicidade", "Produção de imagem"], peca: "lua" },
  { nome: "Liderança e decisão", areas: ["Direção"], profissoes: ["Gestão", "Coordenação", "Empreendedorismo"], peca: "cortinaEsq" },
  { nome: "Solução de problemas", areas: ["Cenografia"], profissoes: ["Arquitetura", "Design", "Produção de ambientes"], peca: "piso" },
  { nome: "Atenção aos detalhes", areas: ["Iluminação", "Maquiagem"], profissoes: ["Design de iluminação", "Audiovisual", "Eventos", "Beleza", "Caracterização"], peca: "feixe" },
  { nome: "Percepção e técnica", areas: ["Sonoplastia", "Iluminação"], profissoes: ["Música", "Áudio", "Cinema", "Produção audiovisual"], peca: "som" },
  { nome: "Organização e colaboração", areas: ["Produção"], profissoes: ["Administração", "Gestão de projetos", "Eventos"], peca: "cortinaDir" },
  { nome: "Expressão", areas: ["Atuação"], profissoes: ["Educação", "Comunicação", "Artes", "Apresentação"], peca: "arco" },
];
