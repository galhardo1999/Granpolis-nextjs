import { redirect } from 'next/navigation';
import { getSession, getCidadeByUserId } from '@/lib/auth';
import { GameClient } from './GameClient';
import { EDIFICIOS } from '@/lib/edificios';
import { PROD_DE_RECURSOS, PRODUCAO_BASE_FAVOR } from '@/lib/config';

// Tabela de capacidade do armazém por nível (mesma do gameStore)
const CAPACIDADE_ARMAZEM_POR_NIVEL = [
  300, 300, 711, 1185, 1706, 2267, 2862, 3487, 4140, 4818, 5518, 6241, 6984, 7746,
  8526, 9324, 10138, 10969, 11815, 12675, 13550, 14439, 15341, 16257, 17185, 18125,
  19077, 20041, 21016, 22003, 23000, 24008, 25026, 26055, 27093, 28100
];

function calcularCapacidadeArmazem(nivelArmazem: number, temCeramica: boolean): number {
  const indice = Math.max(0, Math.min(nivelArmazem, CAPACIDADE_ARMAZEM_POR_NIVEL.length - 1));
  const base = CAPACIDADE_ARMAZEM_POR_NIVEL[indice];
  return temCeramica ? Math.floor(base * 1.10) : base;
}

// ============================================================
// SERVER-SIDE: recalcula recursos com base no tempo decorrido
// desde o último save até o carregamento desta página.
// ============================================================
function calcularProducaoOffline(params: {
  edificios: Record<string, number>;
  ultimaAtualizacao: number;
  recursosMaximos: number;
  madeira: number;
  pedra: number;
  prata: number;
  populacao: number;
  populacaoMaxima: number;
  favor: number;
  favorMaximo: number;
  deusAtual: string | null;
}) {
  const fator = 1.15;

  function produzirRecurso(nivel: number, multiplicador: number): number {
    const base = multiplicador * 10;
    if (nivel === 0) return (base * Math.pow(fator, 1)) / 2;
    return base * Math.pow(fator, nivel);
  }

  const e = params.edificios || {};

  const madeiraPorHora = produzirRecurso(e['timber-camp'] || 0, EDIFICIOS['timber-camp'].multiplicadorProducao) * PROD_DE_RECURSOS;
  const pedraPorHora = produzirRecurso(e['quarry'] || 0, EDIFICIOS['quarry'].multiplicadorProducao) * PROD_DE_RECURSOS;
  const prataPorHora = produzirRecurso(e['silver-mine'] || 0, EDIFICIOS['silver-mine'].multiplicadorProducao) * PROD_DE_RECURSOS;

  const bonusTemplo = 1 + ((e['temple'] || 0) * 0.1);
  const favorHora = params.deusAtual ? PRODUCAO_BASE_FAVOR * PROD_DE_RECURSOS * bonusTemplo : 0;

  const deltaSegundos = Math.max(0, (Date.now() - params.ultimaAtualizacao) / 1000);

  return {
    madeira: Math.min(params.recursosMaximos, params.madeira + (madeiraPorHora / 3600) * deltaSegundos),
    pedra: Math.min(params.recursosMaximos, params.pedra + (pedraPorHora / 3600) * deltaSegundos),
    prata: Math.min(params.recursosMaximos, params.prata + (prataPorHora / 3600) * deltaSegundos),
    populacao: Math.min(params.populacaoMaxima, params.populacao + (1 / 3600) * deltaSegundos),
    favor: Math.min(params.favorMaximo, params.favor + (favorHora / 3600) * deltaSegundos),
    ultimaAtualizacao: Date.now(),
  };
}

export default async function GamePage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  const cidade = await getCidadeByUserId(session.userId);

  if (!cidade) {
    redirect('/registro');
  }

  // Recalcula capacidade do armazém com base no nível atual (não do DB, que pode estar desatualizado)
  const edificios = cidade.edificios as Record<string, number>;
  const pesquisas = cidade.pesquisasConcluidas as string[];
  const temCeramica = pesquisas.includes('ceramica');
  const recursosMaximosReais = calcularCapacidadeArmazem(edificios['warehouse'] || 0, temCeramica);

  // Se recursos salvos estão acima da capacidade real do armazém, cap no máximo
  const madeira = Math.min(recursosMaximosReais, cidade.madeira);
  const pedra = Math.min(recursosMaximosReais, cidade.pedra);
  const prata = Math.min(recursosMaximosReais, cidade.prata);

  // Recalcula produção offline desde o último save — agora com capacidade correta
  const offline = calcularProducaoOffline({
    edificios,
    ultimaAtualizacao: cidade.ultimaAtualizacao.getTime(),
    recursosMaximos: recursosMaximosReais,
    madeira,
    pedra,
    prata,
    populacao: cidade.populacao,
    populacaoMaxima: cidade.populacaoMaxima,
    favor: cidade.favor,
    favorMaximo: cidade.favorMaximo,
    deusAtual: cidade.deusAtual,
  });

  const estadoInicial = {
    recursos: {
      madeira: offline.madeira,
      pedra: offline.pedra,
      prata: offline.prata,
      populacao: offline.populacao,
      populacaoMaxima: cidade.populacaoMaxima,
      recursosMaximos: recursosMaximosReais,
      favor: offline.favor,
      favorMaximo: cidade.favorMaximo,
      prataNaGruta: cidade.prataNaGruta,
    },
    deusAtual: cidade.deusAtual,
    edificios: cidade.edificios as Record<string, number>,
    unidades: cidade.unidades as Record<string, number>,
    pesquisasConcluidas: cidade.pesquisasConcluidas,
    missoesColetadas: cidade.missoesColetadas,
    fila: cidade.fila as any[],
    filaRecrutamento: cidade.filaRecrutamento as any[],
    cooldownsAldeias: cidade.cooldownsAldeias as Record<string, number>,
    ultimaAtualizacao: offline.ultimaAtualizacao,
    nomeCidade: cidade.nomeCidade,
  };

  return <GameClient estadoInicial={estadoInicial} usuario={session} />;
}
