import { redirect } from 'next/navigation';
import { getSession, getCidadeByUserId } from '@/lib/auth';
import { GameClient } from './GameClient';
import { EDIFICIOS } from '@/lib/edificios';
import { PROD_DE_RECURSOS, PRODUCAO_BASE_FAVOR } from '@/lib/config';

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

  // Recalcula produção offline desde o último save
  const offline = calcularProducaoOffline({
    edificios: cidade.edificios as Record<string, number>,
    ultimaAtualizacao: cidade.ultimaAtualizacao.getTime(),
    recursosMaximos: cidade.recursosMaximos,
    madeira: cidade.madeira,
    pedra: cidade.pedra,
    prata: cidade.prata,
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
      recursosMaximos: cidade.recursosMaximos,
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
