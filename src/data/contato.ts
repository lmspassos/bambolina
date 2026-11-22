// DADOS DE CONTATO E CONDIÇÕES COMERCIAIS.
// `null` = ainda não definido: o site mostra um marcador vermelho tracejado "⚠ [...]" no lugar.
// Para publicar, troque cada `null` pelo valor real (e procure `data-placeholder` no site para ver o que sobrou).
export const CONTATO = {
  // DADOS DE MARCAÇÃO (fictícios, para o TCC): trocar pelos reais antes de publicar.
  email: "projeto@bambolina.com.br" as string | null,
  whatsapp: "5541999999999" as string | null, // somente dígitos com DDI
  whatsappExibicao: "(41) 99999-9999" as string | null,
  site: "https://bambolina.com.br" as string | null,
  instagram: "@bambolina" as string | null,
};

// Preço oficial da proposta: R$ 3.500,00 (catálogo).
export const PRECO = { valor: "R$ 3.500,00" };

export const CONDICOES = {
  cancelamento: "Cancelamentos e remarcações devem ser comunicados com pelo menos 1 mês de antecedência, para não comprometer as preparações do evento." as string | null,
  gruposMaiores: "Grupos com mais de 30 estudantes serão divididos em seções." as string | null,
};
