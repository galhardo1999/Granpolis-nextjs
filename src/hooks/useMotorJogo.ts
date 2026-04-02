"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  PROD_DE_RECURSOS,
  TEMPO_CONSTRUCAO_EDIFICIOS,
  TEMPO_TREINAMENTO_UNIDADES,
  TAMANHO_MAXIMO_FILA,
  PRODUCAO_BASE_FAVOR
} from '@/lib/config';
import { IdDeus, PODERES_DIVINOS } from '@/lib/deuses';
import { EDIFICIOS, IdEdificio } from '@/lib/edificios';
import { UNIDADES, IdUnidade } from '@/lib/unidades';
import { ESTADO_INICIAL, EstadoJogo } from '@/lib/estadoInicial';
import { PESQUISAS, IdPesquisa } from '@/lib/pesquisas';
import { sanitizarTexto } from '@/lib/utils';
import { simularBatalha, ResultadoBatalha } from '@/lib/combate';

// ============================================================
// CONSTANTE — chave de persitência
// ============================================================
const CHAVE_LOCAL_STORAGE = 'granpolis-estado-v4';
const CHAVE_CHECKSUM = 'granpolis-checksum-v4';
const SALT_CHECKSUM = 'granpolis-2026-aegis';

// SEC-02: Simple checksum to deter casual localStorage tampering
function gerarChecksum(data: string): string {
  let hash = 0;
  const combined = SALT_CHECKSUM + data;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

// ============================================================
// HELPERS PUROS (sem dependência de estado React)
// ============================================================

function criarEstadoDeepClone(estado: EstadoJogo): EstadoJogo {
  return {
    ...estado,
    recursos: { ...estado.recursos },
    edificios: { ...estado.edificios },
    unidades: { ...estado.unidades },
    pesquisasConcluidas: [...estado.pesquisasConcluidas],
    fila: estado.fila.map(item => ({ ...item })),
    filaRecrutamento: estado.filaRecrutamento.map(item => ({ ...item }))
  };
}

function calcularProducaoRecurso(nivel: number, multiplicador: number): number {
  const producaoBase = multiplicador * 6;
  const fatorCrescimento = 1.15;
  if (nivel === 0) return (producaoBase * Math.pow(fatorCrescimento, 1)) / 2;
  return producaoBase * Math.pow(fatorCrescimento, nivel);
}

function calcularCapacidadeArmazem(nivelArmazem: number, temCeramica: boolean): number {
  const base = Math.floor(1000 * Math.pow(1.08, nivelArmazem));
  return temCeramica ? Math.floor(base * 1.10) : base;
}

function calcularPopulacaoMaximaPorFarm(nivelFarm: number, temArado: boolean): number {
  const base = 100 + (nivelFarm - 1) * 20;
  return temArado ? Math.floor(base * 1.10) : base;
}

function calcularProtecaoGruta(nivelGruta: number): number {
  // Cada nível protege 200 de prata de saque
  return nivelGruta * 200;
}

// ============================================================
// HOOK PRINCIPAL
// ============================================================

// Tipo de recurso para troca
type TipoRecurso = 'madeira' | 'pedra' | 'prata';

// Taxas de câmbio base do mercado
const TAXAS_MERCADO: Record<TipoRecurso, Record<TipoRecurso, number>> = {
  madeira: { madeira: 1, pedra: 0.90, prata: 0.60 },
  pedra:   { madeira: 0.90, pedra: 1, prata: 0.60 },
  prata:   { madeira: 1.30, pedra: 1.30, prata: 1 }
};

export interface EventoConclusao {
  tipo: 'edificio' | 'unidade';
  nome: string;
  nivel?: number;
  quantidade?: number;
}

export function useMotorJogo() {
  const [estado, setEstado] = useState<EstadoJogo>(ESTADO_INICIAL);
  const [carregado, setCarregado] = useState(false);
  const [agora, setAgora] = useState<number>(Date.now());
  const [eventosConclusao, setEventosConclusao] = useState<EventoConclusao[]>([]);
  const estadoRef = useRef(estado);

  // Sincroniza ref com estado (para uso no setInterval sem stale closure)
  useEffect(() => {
    estadoRef.current = estado;
  }, [estado]);

  // UX-04: Limpa eventos após leitura
  const limparEventos = useCallback(() => setEventosConclusao([]), []);

  // ─────────────────────────────────────────────────────────
  // BUG-01 FIX: Carregar e persistir no localStorage
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const salvo = localStorage.getItem(CHAVE_LOCAL_STORAGE);
      const checksumSalvo = localStorage.getItem(CHAVE_CHECKSUM);
      if (salvo) {
        // SEC-02: Verificar integridade
        const checksumCalculado = gerarChecksum(salvo);
        if (checksumSalvo && checksumSalvo !== checksumCalculado) {
          console.warn('Save adulterado detectado. Iniciando novo jogo.');
          localStorage.removeItem(CHAVE_LOCAL_STORAGE);
          localStorage.removeItem(CHAVE_CHECKSUM);
          setEstado(ESTADO_INICIAL);
          setCarregado(true);
          return;
        }

        const estadoSalvo = JSON.parse(salvo) as EstadoJogo;
        const estadoMigrado: EstadoJogo = {
          ...ESTADO_INICIAL,
          ...estadoSalvo,
          recursos: {
            ...ESTADO_INICIAL.recursos,
            ...estadoSalvo.recursos
          },
          pesquisasConcluidas: estadoSalvo.pesquisasConcluidas ?? [],
          fila: estadoSalvo.fila ?? [],
          filaRecrutamento: estadoSalvo.filaRecrutamento ?? []
        };
        setEstado(estadoMigrado);
      }
    } catch {
      console.warn('Save corrompido, iniciando novo jogo.');
      setEstado(ESTADO_INICIAL);
    }
    setCarregado(true);
  }, []);

  // Persiste no localStorage 2s após cada mudança de estado (com checksum)
  useEffect(() => {
    if (!carregado) return;
    const timeout = setTimeout(() => {
      try {
        const json = JSON.stringify(estadoRef.current);
        localStorage.setItem(CHAVE_LOCAL_STORAGE, json);
        localStorage.setItem(CHAVE_CHECKSUM, gerarChecksum(json));
      } catch {
        console.warn('Falha ao salvar progresso.');
      }
    }, 2000);
    return () => clearTimeout(timeout);
  }, [estado, carregado]);

  // ─────────────────────────────────────────────────────────
  // HELPERS COM PESQUISAS
  // ─────────────────────────────────────────────────────────
  const temPesquisa = useCallback((id: IdPesquisa): boolean => {
    return estado.pesquisasConcluidas.includes(id);
  }, [estado.pesquisasConcluidas]);

  // ─────────────────────────────────────────────────────────
  // PRODUÇÃO DE RECURSOS
  // ─────────────────────────────────────────────────────────
  const calcularRenda = useCallback((edificios: Record<string, number>) => {
    return {
      madeira: calcularProducaoRecurso(edificios['timber-camp'] || 0, EDIFICIOS['timber-camp'].multiplicadorProducao) * PROD_DE_RECURSOS,
      pedra: calcularProducaoRecurso(edificios['quarry'] || 0, EDIFICIOS['quarry'].multiplicadorProducao) * PROD_DE_RECURSOS,
      prata: calcularProducaoRecurso(edificios['silver-mine'] || 0, EDIFICIOS['silver-mine'].multiplicadorProducao) * PROD_DE_RECURSOS
    };
  }, []);

  // ─────────────────────────────────────────────────────────
  // TEMPO DE CONSTRUÇÃO
  // ─────────────────────────────────────────────────────────
  const calcularTempoConstrucao = useCallback((idEdificio: IdEdificio, proximoNivel: number): number => {
    const edificio = EDIFICIOS[idEdificio];
    const temForja = estado.pesquisasConcluidas.includes('forja');
    const bonusForja = temForja ? 0.85 : 1; // 15% de desconto
    // BUG-03 FIX: clamp para evitar tempo negativo ou zero
    const bonusSenado = Math.max(0.1, 1 - (estado.edificios['senate'] * 0.05));
    const tempo = edificio.tempoBase * Math.pow(edificio.multiplicadorTempo, proximoNivel);
    return (tempo * bonusSenado * bonusForja) / TEMPO_CONSTRUCAO_EDIFICIOS;
  }, [estado.edificios, estado.pesquisasConcluidas]);

  // ─────────────────────────────────────────────────────────
  // PROCESSAMENTO DE FILA (chamado dentro do setInterval)
  // ─────────────────────────────────────────────────────────
  const processarFila = (estadoAtual: EstadoJogo, agoraMs: number): { alterado: boolean; eventos: EventoConclusao[] } => {
    let alterado = false;
    const eventos: EventoConclusao[] = [];
    const temCeramica = estadoAtual.pesquisasConcluidas.includes('ceramica');
    const temArado = estadoAtual.pesquisasConcluidas.includes('arado');

    // Processar Edifícios
    while (estadoAtual.fila.length > 0 && agoraMs >= estadoAtual.fila[0].fimTempo) {
      const tarefa = estadoAtual.fila.shift()!;
      estadoAtual.edificios[tarefa.edificio]++;

      // UX-04: Registrar evento de conclusão
      eventos.push({ tipo: 'edificio', nome: EDIFICIOS[tarefa.edificio].nome, nivel: tarefa.nivel });

      if (tarefa.edificio === 'farm') {
        estadoAtual.recursos.populacaoMaxima = calcularPopulacaoMaximaPorFarm(estadoAtual.edificios.farm, temArado);
        estadoAtual.recursos.populacao += 20;
      } else if (tarefa.edificio === 'warehouse') {
        estadoAtual.recursos.recursosMaximos = calcularCapacidadeArmazem(estadoAtual.edificios.warehouse, temCeramica);
      } else if (tarefa.edificio === 'cave') {
        estadoAtual.recursos.prataNaGruta = calcularProtecaoGruta(estadoAtual.edificios.cave);
      }
      alterado = true;
    }

    // Processar Recrutamento (Unidade por Unidade)
    let unidadesCompletasNesteCiclo = 0;
    let ultimaUnidadeCompletada: IdUnidade | null = null;
    if (estadoAtual.filaRecrutamento.length > 0) {
      let tarefa = estadoAtual.filaRecrutamento[0];
      let tempoPorUnidade = (tarefa.fimTempo - tarefa.inicioTempo) / tarefa.quantidade;

      while (agoraMs >= tarefa.inicioTempo + tempoPorUnidade) {
        estadoAtual.unidades[tarefa.unidade] = (estadoAtual.unidades[tarefa.unidade] || 0) + 1;
        tarefa.quantidade -= 1;
        tarefa.inicioTempo += tempoPorUnidade;
        alterado = true;
        unidadesCompletasNesteCiclo++;
        ultimaUnidadeCompletada = tarefa.unidade;

        if (tarefa.quantidade <= 0) {
          // UX-04: Lote de recrutamento concluiu
          eventos.push({ tipo: 'unidade', nome: UNIDADES[tarefa.unidade].nome, quantidade: unidadesCompletasNesteCiclo });
          unidadesCompletasNesteCiclo = 0;
          estadoAtual.filaRecrutamento.shift();
          if (estadoAtual.filaRecrutamento.length > 0) {
            tarefa = estadoAtual.filaRecrutamento[0];
            tempoPorUnidade = (tarefa.fimTempo - tarefa.inicioTempo) / tarefa.quantidade;
          } else {
            break;
          }
        }
      }
    }

    return { alterado, eventos };
  };

  // ─────────────────────────────────────────────────────────
  // LOOP PRINCIPAL DO JOGO
  // BUG-02 FIX: deep clone. Sem stale closure via estadoRef.
  // PERF: só chama setEstado quando algo realmente mudou.
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!carregado) return;

    const intervalo = setInterval(() => {
      const agoraMs = Date.now();
      setAgora(agoraMs);

      // BUG-02 FIX: deep clone para evitar mutação via referência
      const estadoAtual = criarEstadoDeepClone(estadoRef.current);
      const diferenca = (agoraMs - estadoAtual.ultimaAtualizacao) / 1000;
      const renda = {
        madeira: calcularProducaoRecurso(estadoAtual.edificios['timber-camp'] || 0, EDIFICIOS['timber-camp'].multiplicadorProducao) * PROD_DE_RECURSOS,
        pedra: calcularProducaoRecurso(estadoAtual.edificios['quarry'] || 0, EDIFICIOS['quarry'].multiplicadorProducao) * PROD_DE_RECURSOS,
        prata: calcularProducaoRecurso(estadoAtual.edificios['silver-mine'] || 0, EDIFICIOS['silver-mine'].multiplicadorProducao) * PROD_DE_RECURSOS
      };

      const maxRecursos = estadoAtual.recursos.recursosMaximos;
      const madeira0 = estadoAtual.recursos.madeira;
      const pedra0 = estadoAtual.recursos.pedra;
      const prata0 = estadoAtual.recursos.prata;
      const favor0 = estadoAtual.recursos.favor;

      estadoAtual.recursos.madeira = Math.min(maxRecursos, madeira0 + (renda.madeira / 3600) * diferenca);
      estadoAtual.recursos.pedra = Math.min(maxRecursos, pedra0 + (renda.pedra / 3600) * diferenca);
      estadoAtual.recursos.prata = Math.min(maxRecursos, prata0 + (renda.prata / 3600) * diferenca);

      // Favor divino: templo potencializa produção
      const bonusTemplo = 1 + (estadoAtual.edificios['temple'] * 0.1);
      const rendaFavor = PRODUCAO_BASE_FAVOR * PROD_DE_RECURSOS * bonusTemplo;
      estadoAtual.recursos.favor = Math.min(
        estadoAtual.recursos.favorMaximo,
        favor0 + (rendaFavor / 3600) * diferenca
      );

      // Atualizar proteção da gruta
      estadoAtual.recursos.prataNaGruta = calcularProtecaoGruta(estadoAtual.edificios['cave'] || 0);

      const { alterado: filaAlterada, eventos } = processarFila(estadoAtual, agoraMs);

      // UX-04: Propagar eventos de conclusão para o componente pai
      if (eventos.length > 0) {
        setEventosConclusao(prev => [...prev, ...eventos]);
      }

      // PERF: só atualiza se houve diferença real
      const recursosAlterados =
        Math.floor(estadoAtual.recursos.madeira) !== Math.floor(madeira0) ||
        Math.floor(estadoAtual.recursos.pedra) !== Math.floor(pedra0) ||
        Math.floor(estadoAtual.recursos.prata) !== Math.floor(prata0) ||
        Math.floor(estadoAtual.recursos.favor) !== Math.floor(favor0);

      if (recursosAlterados || filaAlterada) {
        estadoAtual.ultimaAtualizacao = agoraMs;
        setEstado(estadoAtual);
      }
    }, 1000);

    return () => clearInterval(intervalo);
  }, [carregado]);

  // ─────────────────────────────────────────────────────────
  // CUSTOS DE CONSTRUÇÃO
  // ─────────────────────────────────────────────────────────
  const calcularCustos = useCallback((idEdificio: IdEdificio, nivel: number) => {
    const edificio = EDIFICIOS[idEdificio];
    const multiplicador = Math.pow(edificio.multiplicadorCusto, nivel - 1);
    return {
      madeira: Math.floor(edificio.custoBase.madeira * multiplicador),
      pedra: Math.floor(edificio.custoBase.pedra * multiplicador),
      prata: Math.floor(edificio.custoBase.prata * multiplicador)
    };
  }, []);

  const possuiRecursos = useCallback((custos: { madeira: number; pedra: number; prata: number }) => {
    return estado.recursos.madeira >= custos.madeira &&
      estado.recursos.pedra >= custos.pedra &&
      estado.recursos.prata >= custos.prata;
  }, [estado.recursos]);

  // ─────────────────────────────────────────────────────────
  // MELHORAR EDIFÍCIO
  // ─────────────────────────────────────────────────────────
  const melhorarEdificio = useCallback((idEdificio: IdEdificio): { sucesso: boolean; motivo?: string } => {
    const edificio = EDIFICIOS[idEdificio];
    const qtdPendente = estado.fila.filter(f => f.edificio === idEdificio).length;

    // Verificar requisitos
    if ('requisitos' in edificio && edificio.requisitos) {
      const reqs = edificio.requisitos as Record<IdEdificio, number>;
      for (const [idReq, nivelReq] of Object.entries(reqs)) {
        const reqEdificio = idReq as IdEdificio;
        const nivelAtualReq = (estado.edificios[reqEdificio] || 0) + estado.fila.filter(f => f.edificio === reqEdificio).length;
        if (nivelAtualReq < nivelReq) {
          return { sucesso: false, motivo: `Requer ${EDIFICIOS[reqEdificio].nome} Nv. ${nivelReq}` };
        }
      }
    }

    if (estado.fila.length >= TAMANHO_MAXIMO_FILA) {
      return { sucesso: false, motivo: 'Fila de obras cheia (Máximo 10)' };
    }

    const nivelAtual = (estado.edificios[idEdificio] || 0) + qtdPendente;
    if (nivelAtual >= (edificio as any).nivelMaximo) {
      return { sucesso: false, motivo: 'Nível máximo atingido' };
    }

    const proximoNivel = nivelAtual + 1;
    const custos = calcularCustos(idEdificio, proximoNivel);
    const custoPop = (edificio as any).custoPop || 0;

    if (possuiRecursos(custos) && estado.recursos.populacao >= custoPop) {
      const novoEstado = criarEstadoDeepClone(estado);
      novoEstado.recursos.madeira -= custos.madeira;
      novoEstado.recursos.pedra -= custos.pedra;
      novoEstado.recursos.prata -= custos.prata;
      novoEstado.recursos.populacao -= custoPop;

      const tempoFinal = calcularTempoConstrucao(idEdificio, proximoNivel);
      const agoraMs = Date.now();
      const inicioTempo = novoEstado.fila.length > 0
        ? novoEstado.fila[novoEstado.fila.length - 1].fimTempo
        : agoraMs;

      novoEstado.fila.push({
        edificio: idEdificio,
        inicioTempo,
        fimTempo: inicioTempo + (tempoFinal * 1000),
        nivel: proximoNivel
      });

      setEstado(novoEstado);
      return { sucesso: true };
    }

    if (estado.recursos.populacao < custoPop) {
      return { sucesso: false, motivo: 'População insuficiente (Melhore a Quinta)' };
    }

    return { sucesso: false, motivo: 'Recursos insuficientes' };
  }, [estado, calcularCustos, calcularTempoConstrucao, possuiRecursos]);

  // ─────────────────────────────────────────────────────────
  // CANCELAR MELHORIA
  // ─────────────────────────────────────────────────────────
  const cancelarMelhoria = useCallback((indice: number) => {
    const novoEstado = criarEstadoDeepClone(estado);
    const tarefa = novoEstado.fila[indice];
    if (!tarefa) return;

    const edificio = EDIFICIOS[tarefa.edificio];
    const custos = calcularCustos(tarefa.edificio, tarefa.nivel);
    const custoPop = (edificio as any).custoPop || 0;

    novoEstado.recursos.madeira = Math.min(novoEstado.recursos.recursosMaximos, novoEstado.recursos.madeira + custos.madeira);
    novoEstado.recursos.pedra = Math.min(novoEstado.recursos.recursosMaximos, novoEstado.recursos.pedra + custos.pedra);
    novoEstado.recursos.prata = Math.min(novoEstado.recursos.recursosMaximos, novoEstado.recursos.prata + custos.prata);
    novoEstado.recursos.populacao += custoPop;

    novoEstado.fila.splice(indice, 1);

    // Recalcular tempos dos itens subsequentes
    const agoraMs = Date.now();
    for (let i = 0; i < novoEstado.fila.length; i++) {
      const item = novoEstado.fila[i];
      const duracao = item.fimTempo - item.inicioTempo;
      item.inicioTempo = i === 0 ? agoraMs : novoEstado.fila[i - 1].fimTempo;
      item.fimTempo = item.inicioTempo + duracao;
    }

    setEstado(novoEstado);
  }, [estado, calcularCustos]);

  // ─────────────────────────────────────────────────────────
  // RECRUTAMENTO DE UNIDADES
  // ─────────────────────────────────────────────────────────
  const calcularTempoRecrutamento = useCallback((idUnidade: IdUnidade, quantidade: number): number => {
    const unidade = UNIDADES[idUnidade];
    const tempoBase = unidade.tempoBase * quantidade;
    const nivelQuartel = estado.edificios['barracks'] || 0;
    const reducaoQuartel = Math.pow(0.95, nivelQuartel);
    const temEstrategia = estado.pesquisasConcluidas.includes('estrategia');
    const reducaoEstrategia = temEstrategia ? 0.80 : 1;
    return (tempoBase * reducaoQuartel * reducaoEstrategia) / TEMPO_TREINAMENTO_UNIDADES;
  }, [estado.edificios, estado.pesquisasConcluidas]);

  const recrutar = useCallback((idUnidade: IdUnidade, quantidade: number): { sucesso: boolean; motivo?: string } => {
    if (quantidade <= 0) return { sucesso: false, motivo: 'Quantidade inválida' };

    const unidade = UNIDADES[idUnidade];
    const custosTotal = {
      madeira: unidade.custos.madeira * quantidade,
      pedra: unidade.custos.pedra * quantidade,
      prata: unidade.custos.prata * quantidade,
      populacao: unidade.custos.populacao * quantidade
    };

    if (estado.filaRecrutamento.length >= 7) {
      return { sucesso: false, motivo: 'Fila de recrutamento cheia (Máximo 7)' };
    }

    if (possuiRecursos(custosTotal) && estado.recursos.populacao >= custosTotal.populacao) {
      const novoEstado = criarEstadoDeepClone(estado);
      novoEstado.recursos.madeira -= custosTotal.madeira;
      novoEstado.recursos.pedra -= custosTotal.pedra;
      novoEstado.recursos.prata -= custosTotal.prata;
      novoEstado.recursos.populacao -= custosTotal.populacao;

      const tempoFinal = calcularTempoRecrutamento(idUnidade, quantidade);
      const agoraMs = Date.now();
      const inicioTempo = novoEstado.filaRecrutamento.length > 0
        ? novoEstado.filaRecrutamento[novoEstado.filaRecrutamento.length - 1].fimTempo
        : agoraMs;

      novoEstado.filaRecrutamento.push({
        unidade: idUnidade,
        quantidade,
        inicioTempo,
        fimTempo: inicioTempo + (tempoFinal * 1000)
      });

      setEstado(novoEstado);
      return { sucesso: true };
    }

    if (estado.recursos.populacao < custosTotal.populacao) {
      return { sucesso: false, motivo: 'População insuficiente' };
    }

    return { sucesso: false, motivo: 'Recursos insuficientes' };
  }, [estado, possuiRecursos, calcularTempoRecrutamento]);

  const cancelarRecrutamento = useCallback((indice: number) => {
    const novoEstado = criarEstadoDeepClone(estado);
    const tarefa = novoEstado.filaRecrutamento[indice];
    if (!tarefa) return;

    const unidade = UNIDADES[tarefa.unidade];
    novoEstado.recursos.madeira = Math.min(novoEstado.recursos.recursosMaximos, novoEstado.recursos.madeira + unidade.custos.madeira * tarefa.quantidade);
    novoEstado.recursos.pedra = Math.min(novoEstado.recursos.recursosMaximos, novoEstado.recursos.pedra + unidade.custos.pedra * tarefa.quantidade);
    novoEstado.recursos.prata = Math.min(novoEstado.recursos.recursosMaximos, novoEstado.recursos.prata + unidade.custos.prata * tarefa.quantidade);
    novoEstado.recursos.populacao += unidade.custos.populacao * tarefa.quantidade;

    novoEstado.filaRecrutamento.splice(indice, 1);

    const agoraMs = Date.now();
    for (let i = 0; i < novoEstado.filaRecrutamento.length; i++) {
      const item = novoEstado.filaRecrutamento[i];
      const duracao = item.fimTempo - item.inicioTempo;
      item.inicioTempo = i === 0 ? agoraMs : novoEstado.filaRecrutamento[i - 1].fimTempo;
      item.fimTempo = item.inicioTempo + duracao;
    }

    setEstado(novoEstado);
  }, [estado]);

  // ─────────────────────────────────────────────────────────
  // PESQUISAS DA ACADEMIA
  // ─────────────────────────────────────────────────────────
  const pesquisar = useCallback((idPesquisa: IdPesquisa): { sucesso: boolean; motivo?: string } => {
    const pesquisa = PESQUISAS[idPesquisa];
    const nivelAcademia = estado.edificios['academy'] || 0;

    if (estado.pesquisasConcluidas.includes(idPesquisa)) {
      return { sucesso: false, motivo: 'Pesquisa já concluída' };
    }

    if (nivelAcademia < pesquisa.requisitoAcademia) {
      return { sucesso: false, motivo: `Requer Academia Nv. ${pesquisa.requisitoAcademia}` };
    }

    if (estado.recursos.prata < pesquisa.custo.prata) {
      return { sucesso: false, motivo: `Prata insuficiente (${pesquisa.custo.prata} necessário)` };
    }

    const novoEstado = criarEstadoDeepClone(estado);
    novoEstado.recursos.prata -= pesquisa.custo.prata;
    novoEstado.pesquisasConcluidas.push(idPesquisa);

    // Aplicar efeitos imediatos de pesquisas de capacidade
    if (idPesquisa === 'ceramica') {
      novoEstado.recursos.recursosMaximos = calcularCapacidadeArmazem(novoEstado.edificios['warehouse'], true);
    } else if (idPesquisa === 'arado') {
      novoEstado.recursos.populacaoMaxima = calcularPopulacaoMaximaPorFarm(novoEstado.edificios['farm'], true);
    }

    setEstado(novoEstado);
    return { sucesso: true };
  }, [estado]);

  // ─────────────────────────────────────────────────────────
  // SISTEMA DE COMBATE
  // ─────────────────────────────────────────────────────────
  const atacarAldeiaBarbar = useCallback((exercitoEnviado: Record<string, number>): ResultadoBatalha | null => {
    // Simular defesa de aldeia bárbara (defesa genérica escalável)
    const nivelMuralhaInimiga = Math.floor(Math.random() * 5); // aleatório 0-4
    const defensaBarbar: Record<string, number> = {
      'swordsman': 5 + Math.floor(Math.random() * 10),
      'slinger': 3 + Math.floor(Math.random() * 8)
    };
    const recursosBarbar = {
      madeira: 200 + Math.floor(Math.random() * 500),
      pedra: 200 + Math.floor(Math.random() * 500),
      prata: 100 + Math.floor(Math.random() * 300)
    };

    const temMetalurgia = estado.pesquisasConcluidas.includes('metalurgia');
    const temEscudo = estado.pesquisasConcluidas.includes('escudo');

    const resultado = simularBatalha(
      exercitoEnviado,
      defensaBarbar,
      nivelMuralhaInimiga,
      recursosBarbar,
      temMetalurgia ? 1.10 : 1.0,
      temEscudo ? 1.10 : 1.0
    );

    if (resultado.sucesso) {
      const novoEstado = criarEstadoDeepClone(estado);
      // Adicionar recursos saqueados
      novoEstado.recursos.madeira = Math.min(novoEstado.recursos.recursosMaximos, novoEstado.recursos.madeira + resultado.recursosRoubados.madeira);
      novoEstado.recursos.pedra = Math.min(novoEstado.recursos.recursosMaximos, novoEstado.recursos.pedra + resultado.recursosRoubados.pedra);
      novoEstado.recursos.prata = Math.min(novoEstado.recursos.recursosMaximos, novoEstado.recursos.prata + resultado.recursosRoubados.prata);
      // Aplicar baixas
      for (const [id, baixas] of Object.entries(resultado.baixasAtacante)) {
        const uid = id as IdUnidade;
        novoEstado.unidades[uid] = Math.max(0, (novoEstado.unidades[uid] || 0) - baixas);
      }
      setEstado(novoEstado);
    } else {
      // Derrota: aplicar baixas
      const novoEstado = criarEstadoDeepClone(estado);
      for (const [id, baixas] of Object.entries(resultado.baixasAtacante)) {
        const uid2 = id as IdUnidade;
        novoEstado.unidades[uid2] = Math.max(0, (novoEstado.unidades[uid2] || 0) - baixas);
      }
      setEstado(novoEstado);
    }

    return resultado;
  }, [estado]);

  // ─────────────────────────────────────────────────────────
  // PODERES DIVINOS
  // ─────────────────────────────────────────────────────────
  const selecionarDeus = useCallback((idDeus: IdDeus) => {
    setEstado(prev => ({
      ...prev,
      deusAtual: idDeus,
      recursos: { ...prev.recursos, favor: 0 }
    }));
  }, []);

  const lancarPoder = useCallback((idPoder: string): { sucesso: boolean; motivo?: string } => {
    const todosPoderes = Object.values(PODERES_DIVINOS).flat();
    const poder = todosPoderes.find(p => p.id === idPoder);

    if (!poder) return { sucesso: false, motivo: 'Poder não encontrado' };
    if (estado.recursos.favor < poder.custo) return { sucesso: false, motivo: 'Favor insuficiente' };

    const novoEstado = criarEstadoDeepClone(estado);
    novoEstado.recursos.favor -= poder.custo;

    switch (idPoder) {
      case 'zeus-sign':
        novoEstado.unidades['chariot'] = (novoEstado.unidades['chariot'] || 0) + 1;
        break;
      case 'zeus-bolt':
        novoEstado.recursos.pedra = Math.min(novoEstado.recursos.recursosMaximos, novoEstado.recursos.pedra + 500);
        break;
      case 'poseidon-gift':
        novoEstado.recursos.madeira = Math.min(novoEstado.recursos.recursosMaximos, novoEstado.recursos.madeira + 1000);
        break;
      case 'poseidon-call':
        novoEstado.recursos.prata = Math.min(novoEstado.recursos.recursosMaximos, novoEstado.recursos.prata + 500);
        break;
      case 'hera-wedding':
        novoEstado.recursos.madeira = Math.min(novoEstado.recursos.recursosMaximos, novoEstado.recursos.madeira + 200);
        novoEstado.recursos.pedra = Math.min(novoEstado.recursos.recursosMaximos, novoEstado.recursos.pedra + 200);
        novoEstado.recursos.prata = Math.min(novoEstado.recursos.recursosMaximos, novoEstado.recursos.prata + 200);
        break;
      case 'hera-growth':
        novoEstado.recursos.populacao += 10;
        break;
      case 'atena-wisdom':
        novoEstado.recursos.prata = Math.min(novoEstado.recursos.recursosMaximos, novoEstado.recursos.prata + 300);
        break;
      case 'atena-power':
        novoEstado.unidades['hoplite'] = (novoEstado.unidades['hoplite'] || 0) + 5;
        break;
      case 'hades-treasures':
        novoEstado.recursos.prata = Math.min(novoEstado.recursos.recursosMaximos, novoEstado.recursos.prata + 800);
        break;
      case 'hades-return':
        novoEstado.unidades['swordsman'] = (novoEstado.unidades['swordsman'] || 0) + 5;
        break;
    }

    setEstado(novoEstado);
    return { sucesso: true };
  }, [estado]);

  // ─────────────────────────────────────────────────────────
  // TROCA DE RECURSOS (MERCADO)
  // UX-05: Funcionalidade real para o edifício Mercado
  // ─────────────────────────────────────────────────────────
  const trocarRecurso = useCallback((de: TipoRecurso, para: TipoRecurso, quantidade: number): { sucesso: boolean; motivo?: string } => {
    if (de === para) return { sucesso: false, motivo: 'Não é possível trocar o mesmo recurso' };
    if (quantidade <= 0 || quantidade > estado.recursos[de]) return { sucesso: false, motivo: 'Quantidade inválida' };

    const nivelMercado = estado.edificios['market'] || 0;
    if (nivelMercado === 0) return { sucesso: false, motivo: 'Construa o Mercado primeiro' };

    const bonusMercado = 1 + (nivelMercado * 0.02);
    const taxaFinal = TAXAS_MERCADO[de][para] * bonusMercado;
    const quantidadeRecebida = Math.floor(quantidade * taxaFinal);

    if (quantidadeRecebida <= 0) return { sucesso: false, motivo: 'Quantidade muito baixa para conversão' };

    const novoEstado = criarEstadoDeepClone(estado);
    novoEstado.recursos[de] -= quantidade;
    novoEstado.recursos[para] = Math.min(
      novoEstado.recursos.recursosMaximos,
      novoEstado.recursos[para] + quantidadeRecebida
    );

    setEstado(novoEstado);
    return { sucesso: true };
  }, [estado]);

  // ─────────────────────────────────────────────────────────
  // UTILIDADES
  // ─────────────────────────────────────────────────────────

  // SEC-01 FIX: Sanitizar nome da cidade
  const definirNomeCidade = useCallback((nome: string) => {
    const sanitizado = sanitizarTexto(nome, 15);
    setEstado(prev => ({ ...prev, nomeCidade: sanitizado }));
  }, []);

  const resetarJogo = useCallback(() => {
    const novoEstado = { ...ESTADO_INICIAL, ultimaAtualizacao: Date.now() };
    localStorage.removeItem(CHAVE_LOCAL_STORAGE);
    localStorage.removeItem(CHAVE_CHECKSUM);
    setEstado(novoEstado);
  }, []);

  return {
    estado,
    agora,
    carregado,
    eventosConclusao,
    limparEventos,
    melhorarEdificio,
    cancelarMelhoria,
    calcularCustos,
    calcularRenda,
    calcularTempoConstrucao,
    possuiRecursos,
    resetarJogo,
    selecionarDeus,
    recrutar,
    calcularTempoRecrutamento,
    cancelarRecrutamento,
    definirNomeCidade,
    lancarPoder,
    pesquisar,
    temPesquisa,
    atacarAldeiaBarbar,
    trocarRecurso
  };
}
