"use client";

import React, { useState, useEffect } from 'react';
import { useMotorJogo } from '@/hooks/useMotorJogo';
import { BarraSuperior } from '@/components/BarraSuperior';
import { ModalEdificioCidade } from '@/components/ModalEdificioCidade';
import { FilaConstrucao } from '@/components/FilaConstrucao';
import { FilaRecrutamento } from '@/components/FilaRecrutamento';
import { ModalEdificio } from '@/components/ModalEdificio';
import { IdEdificio } from '@/lib/edificios';
import { PoderDivino } from '@/components/PoderesDivinos';
import { PainelExercito } from '@/components/PainelExercito';
import { ModalConfirmacao } from '@/components/ModalConfirmacao';
import { useToast } from '@/components/ToastProvider';

export default function Inicio() {
  const {
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
    selecionarDeus,
    recrutar,
    calcularTempoRecrutamento,
    cancelarRecrutamento,
    definirNomeCidade,
    lancarPoder,
    resetarJogo,
    pesquisar,
    temPesquisa,
    atacarAldeiaBarbar,
    trocarRecurso
  } = useMotorJogo();

  const { mostrarToast } = useToast();
  const [edificioSelecionado, setEdificioSelecionado] = useState<IdEdificio | null>(null);
  const [modalResetAberto, setModalResetAberto] = useState(false);

  // ─────────────────────────────────────────────────────────
  // UX-04: Exibir toast quando construção/recrutamento conclui
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (eventosConclusao.length === 0) return;
    for (const evento of eventosConclusao) {
      if (evento.tipo === 'edificio') {
        mostrarToast(`🏗️ ${evento.nome} Nv.${evento.nivel} concluído!`, 'sucesso', '🏛️');
      } else if (evento.tipo === 'unidade') {
        mostrarToast(`🪖 ${evento.quantidade}x ${evento.nome} prontos!`, 'sucesso', '⚔️');
      }
    }
    limparEventos();
  }, [eventosConclusao, limparEventos, mostrarToast]);

  // Tela de carregamento
  if (!carregado) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#050E1A',
        color: '#D4AF37',
        fontFamily: 'var(--font-cinzel)',
        gap: '20px'
      }}>
        <div style={{ fontSize: '3rem', animation: 'spin 1.5s linear infinite' }}>🏛️</div>
        <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Carregando Pólis...</h1>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const renda = calcularRenda(estado.edificios);

  const handleSelecionarDeus = (idDeus: Parameters<typeof selecionarDeus>[0]) => {
    selecionarDeus(idDeus);
    mostrarToast(`⚡ ${idDeus.toUpperCase()} se torna seu divino protetor!`, 'sucesso');
  };

  const handleLancarPoder = (idPoder: string) => {
    const resultado = lancarPoder(idPoder);
    if (!resultado.sucesso) {
      mostrarToast(resultado.motivo ?? 'Falhou ao lançar poder', 'erro', '❌');
    }
    return resultado;
  };

  const handleCancelarMelhoria = (i: number) => {
    cancelarMelhoria(i);
    mostrarToast('🔨 Construção cancelada. Recursos devolvidos.', 'aviso');
  };

  const handleCancelarRecrutamento = (i: number) => {
    cancelarRecrutamento(i);
    mostrarToast('🪖 Recrutamento cancelado. Recursos devolvidos.', 'aviso');
  };

  return (
    <div id="app" className={edificioSelecionado ? 'modal-open' : ''}>
      <BarraSuperior
        recursos={estado.recursos}
        renda={renda}
        nomeCidade={estado.nomeCidade}
        aoAlterarNomeCidade={definirNomeCidade}
        aoResetar={() => setModalResetAberto(true)}
      />

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex' }}>
        <ModalEdificioCidade
          edificios={estado.edificios}
          aoClicarEdificio={setEdificioSelecionado}
        />

        <div style={{
          position: 'absolute', right: '20px', top: '100px',
          display: 'flex', flexDirection: 'column', gap: '40px', alignItems: 'flex-end'
        }}>
          <PoderDivino
            idDeusAtual={estado.deusAtual}
            favor={estado.recursos.favor}
            favorMaximo={estado.recursos.favorMaximo}
            aoSelecionarDeus={handleSelecionarDeus}
            aoLancarPoder={handleLancarPoder}
          />
          <PainelExercito unidades={estado.unidades} />
        </div>

        {/* Filas inferiores */}
        <div id="bottom-queues">
          <FilaConstrucao
            fila={estado.fila}
            agora={agora}
            aoCancelar={handleCancelarMelhoria}
          />
          <FilaRecrutamento
            fila={estado.filaRecrutamento}
            agora={agora}
            aoCancelar={handleCancelarRecrutamento}
          />
        </div>
      </div>

      {/* Modal de edifício */}
      <ModalEdificio
        aberto={!!edificioSelecionado}
        aoFechar={() => setEdificioSelecionado(null)}
        idEdificio={edificioSelecionado}
        edificiosAtuais={estado.edificios}
        fila={estado.fila}
        aoMelhorar={melhorarEdificio}
        calcularCustos={calcularCustos}
        calcularTempoConstrucao={calcularTempoConstrucao}
        possuiRecursos={possuiRecursos}
        populacaoLivre={estado.recursos.populacao}
        aoRecrutar={recrutar}
        calcularTempoRecrutamento={calcularTempoRecrutamento}
        recursos={estado.recursos as any}
        unidades={estado.unidades}
        filaRecrutamento={estado.filaRecrutamento}
        renda={renda}
        pesquisasConcluidas={estado.pesquisasConcluidas}
        aoPesquisar={pesquisar}
        aoAtacarAldeiaBarbar={atacarAldeiaBarbar}
        aoTrocarRecurso={trocarRecurso}
        agora={agora}
        mostrarToast={mostrarToast}
      />

      {/* Modal de confirmação de reset */}
      <ModalConfirmacao
        aberto={modalResetAberto}
        titulo="Resetar Polis?"
        mensagem="Isso apagará TODO o seu progresso permanentemente — edifícios, tropas, pesquisas e recursos. Esta ação não pode ser desfeita."
        textoBotaoConfirmar="Sim, resetar tudo"
        textoBotaoCancelar="Cancelar"
        tipo="perigo"
        aoConfirmar={() => {
          resetarJogo();
          setModalResetAberto(false);
          mostrarToast('🏛️ Polis reiniciada. Boa sorte!', 'info');
        }}
        aoCancelar={() => setModalResetAberto(false)}
      />
    </div>
  );
}
