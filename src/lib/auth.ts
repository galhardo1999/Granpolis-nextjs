// ============================================================
// AUTENTICAÇÃO — bcryptjs + Cookies httpOnly + Server Actions
// ============================================================

import bcrypt from 'bcryptjs';
import { prisma } from './db';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'granpolis_session';
const SALT_ROUNDS = 12;

// Gerar um token simples como hash da data + userId
function gerarSessionToken(userId: string): string {
  const seed = `${userId}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `${userId}-${Math.abs(hash).toString(36)}-${Date.now().toString(36)}`;
}

export interface AuthSession {
  userId: string;
  username: string;
}

export async function registrarUsuario(
  email: string,
  username: string,
  senha: string,
  nomeCidade?: string,
): Promise<{ sucesso: boolean; erro?: string }> {
  // Validações
  if (!username || username.length < 3) {
    return { sucesso: false, erro: 'Username deve ter pelo menos 3 caracteres' };
  }
  if (!senha || senha.length < 6) {
    return { sucesso: false, erro: 'Senha deve ter pelo menos 6 caracteres' };
  }

  const usernameExistente = await prisma.user.findUnique({ where: { username } });
  if (usernameExistente) return { sucesso: false, erro: 'Username já utilizado' };

  const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);

  // Transação: cria User + Cidade com estado inicial
  try {
    await prisma.$transaction(async (tx: any) => {
      const user = await tx.user.create({
        data: {
          email,
          username,
          password: senhaHash,
        },
      });

      await tx.cidade.create({
        data: {
          userId: user.id,
          nomeCidade: nomeCidade || username,
          madeira: 250,
          pedra: 250,
          prata: 250,
          populacao: 100,
          populacaoMaxima: 100,
          recursosMaximos: 300,
          favor: 0,
          favorMaximo: 500,
          prataNaGruta: 0,
          deusAtual: null,
          edificios: {
            'senate': 1, 'timber-camp': 0, 'quarry': 0, 'silver-mine': 0,
            'farm': 0, 'warehouse': 0, 'barracks': 0, 'temple': 0,
            'market': 0, 'harbor': 0, 'academy': 0, 'walls': 0, 'cave': 0,
          },
          unidades: {
            'swordsman': 0, 'slinger': 0, 'archer': 0, 'hoplite': 0,
            'horseman': 0, 'chariot': 0, 'catapult': 0, 'bireme': 0,
            'transport-ship': 0, 'trireme': 0,
          },
          pesquisasConcluidas: [],
          missoesColetadas: [],
          fila: [],
          filaRecrutamento: [],
          cooldownsAldeias: {},
        },
      });
    });
  } catch {
    return { sucesso: false, erro: 'Erro ao criar conta. Tente novamente.' };
  }

  return { sucesso: true };
}

export async function loginUsuario(
  username: string,
  senha: string,
): Promise<{ sucesso: boolean; erro?: string }> {
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return { sucesso: false, erro: 'Usuário ou senha incorretos' };

  const senhaValida = await bcrypt.compare(senha, user.password);
  if (!senhaValida) return { sucesso: false, erro: 'Usuário ou senha incorretos' };

  const token = gerarSessionToken(user.id);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  return { sucesso: true };
}

export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME);

  if (!token) return null;

  // Extrair userId do token
  const parts = token.value.split('-');
  const userId = parts[0];

  if (!userId) return null;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  return {
    userId: user.id,
    username: user.username,
  };
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}

export async function getCidadeByUserId(userId: string) {
  // ISOLAMENTO: apenas cidade do próprio userId
  return prisma.cidade.findUnique({ where: { userId } });
}

export async function salvarEstadoCidade(userId: string, data: Record<string, unknown>) {
  // ISOLAMENTO: apenas cidade do próprio userId
  const where = { userId };
  const existente = await prisma.cidade.findUnique({ where });
  if (!existente) return null;

  return prisma.cidade.update({
    where,
    data: {
      madeira: (data.madeira as number) ?? existente.madeira,
      pedra: (data.pedra as number) ?? existente.pedra,
      prata: (data.prata as number) ?? existente.prata,
      populacao: (data.populacao as number) ?? existente.populacao,
      populacaoMaxima: (data.populacaoMaxima as number) ?? existente.populacaoMaxima,
      recursosMaximos: (data.recursosMaximos as number) ?? existente.recursosMaximos,
      favor: (data.favor as number) ?? existente.favor,
      favorMaximo: (data.favorMaximo as number) ?? existente.favorMaximo,
      prataNaGruta: (data.prataNaGruta as number) ?? existente.prataNaGruta,
      deusAtual: (data.deusAtual as string | null) ?? existente.deusAtual,
      edificios: (data.edificios as object) ?? existente.edificios,
      unidades: (data.unidades as object) ?? existente.unidades,
      pesquisasConcluidas: (data.pesquisasConcluidas as string[]) ?? existente.pesquisasConcluidas,
      missoesColetadas: (data.missoesColetadas as string[]) ?? existente.missoesColetadas,
      fila: (data.fila as object) ?? existente.fila,
      filaRecrutamento: (data.filaRecrutamento as object) ?? existente.filaRecrutamento,
      cooldownsAldeias: (data.cooldownsAldeias as object) ?? existente.cooldownsAldeias,
      ultimaAtualizacao: new Date(),
    },
  });
}

export async function autenticarOuCidade(
  username: string,
  senha: string,
  nomeCidade?: string,
): Promise<{ sucesso: boolean; erro?: string }> {
  // Tenta login primeiro
  const user = await prisma.user.findUnique({ where: { username } });

  if (user) {
    // Login
    const senhaValida = await bcrypt.compare(senha, user.password);
    if (!senhaValida) return { sucesso: false, erro: 'Usuário ou senha incorretos' };

    const token = gerarSessionToken(user.id);
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
    return { sucesso: true };
  }

  // Registro
  return registrarUsuario('', username, senha, nomeCidade);
}
