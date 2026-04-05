export interface AuthSession {
  userId: string;
  email: string;
  username: string;
}

export interface EstadoJogo {
  recursos: {
    madeira: number;
    pedra: number;
    prata: number;
    populacao: number;
    populacaoMaxima: number;
    recursosMaximos: number;
    favor: number;
    favorMaximo: number;
    prataNaGruta: number;
  };
  deusAtual: string | null;
  edificios: Record<string, number>;
  unidades: Record<string, number>;
  pesquisasConcluidas: string[];
  missoesColetadas: string[];
  fila: Array<{
    edificio: string;
    inicioTempo: number;
    fimTempo: number;
    nivel: number;
  }>;
  filaRecrutamento: Array<{
    unidade: string;
    quantidade: number;
    inicioTempo: number;
    fimTempo: number;
  }>;
  cooldownsAldeias: Record<string, number>;
  ultimaAtualizacao: number;
  nomeCidade: string;
}
