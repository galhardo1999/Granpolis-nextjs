//PRODUCAO DE RECURSOS
export const PROD_DE_RECURSOS = 130; //Recursos por hora

//PRODUCAO DE FAVORES
export const PRODUCAO_BASE_FAVOR = 1; // Favor por hora

//TEMPO DE CONSTRUCAO DE EDIFICIOS E TREINAMENTO DE UNIDADES
export const TEMPO_CONSTRUCAO_EDIFICIOS = 111;
export const TEMPO_TREINAMENTO_UNIDADES = 111;

//TAMANHO MAXIMO DE FILA DE OBRAS E RECRUTAMENTO
export const TAMANHO_MAXIMO_FILA_OBRAS = 7;
export const TAMANHO_MAXIMO_FILA_RECRUTAMENTO = 3;

export type TipoRecurso = 'madeira' | 'pedra' | 'prata';
//Taxas de câmbio do mercado (base, sem bônus de nível)
export const TAXAS_MERCADO: Record<TipoRecurso, Record<TipoRecurso, number>> = {
  madeira: { madeira: 1, pedra: 0.90, prata: 0.60 },
  pedra: { madeira: 0.90, pedra: 1, prata: 0.60 },
  prata: { madeira: 1.30, pedra: 1.30, prata: 1 }
};
