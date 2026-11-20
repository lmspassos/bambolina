// DADOS DE CONTATO E CONDIÇÕES COMERCIAIS.
// `null` = ainda não definido: o site mostra um marcador vermelho tracejado "⚠ [...]" no lugar.
// Para publicar, troque cada `null` pelo valor real (e procure `data-placeholder` no site para ver o que sobrou).
export const CONTATO = {
  email: null as string | null, // ex.: "contato@..."
  whatsapp: null as string | null, // somente dígitos com DDI, ex.: "5541999999999"
  whatsappExibicao: null as string | null, // ex.: "(41) 99999-9999"
  site: null as string | null, // ex.: "https://..."
  instagram: null as string | null, // o docx cita "@bambolina", mas NÃO foi confirmado que o perfil é da marca
};

// Preço: R$ 3.500,00 é só a referência do planejamento. Marcar como validado quando for oficial.
export const PRECO = { valor: "R$ 3.500,00", validado: false };

export const CONDICOES = {
  cancelamento: null as string | null, // política de cancelamento e remarcação
  gruposMaiores: null as string | null, // preço/regra para mais de 30 estudantes
  areaAtendimento: null as string | null, // deslocamento e área de atendimento
};
