import { NextRequest, NextResponse } from 'next/server';
import { getSession, salvarEstadoCidade } from '@/lib/auth';
import { getCidadeByUserId } from '@/lib/auth';

// GET: retorna o estado atual da cidade do usuário
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ erro: 'Não autenticado' }, { status: 401 });

  const cidade = await getCidadeByUserId(session.userId);
  if (!cidade) return NextResponse.json({ erro: 'Cidade não encontrada' }, { status: 404 });

  return NextResponse.json({
    recursos: {
      madeira: cidade.madeira,
      pedra: cidade.pedra,
      prata: cidade.prata,
      populacao: cidade.populacao,
      populacaoMaxima: cidade.populacaoMaxima,
      recursosMaximos: cidade.recursosMaximos,
      favor: cidade.favor,
      favorMaximo: cidade.favorMaximo,
      prataNaGruta: cidade.prataNaGruta,
    },
    edificios: cidade.edificios,
    unidades: cidade.unidades,
    pesquisasConcluidas: cidade.pesquisasConcluidas,
    missoesColetadas: cidade.missoesColetadas,
    fila: cidade.fila,
    filaRecrutamento: cidade.filaRecrutamento,
    cooldownsAldeias: cidade.cooldownsAldeias,
    ultimaAtualizacao: cidade.ultimaAtualizacao.getTime(),
    nomeCidade: cidade.nomeCidade,
    deusAtual: cidade.deusAtual,
  });
}

// POST: salva o estado modificado (trigger de persistência)
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ erro: 'Não autenticado' }, { status: 401 });

  try {
    const body = await req.json();
    const resultado = await salvarEstadoCidade(session.userId, body);
    if (!resultado) {
      return NextResponse.json({ erro: 'Cidade não encontrada' }, { status: 404 });
    }
    return NextResponse.json({ sucesso: true });
  } catch {
    return NextResponse.json({ erro: 'Erro ao salvar' }, { status: 500 });
  }
}
