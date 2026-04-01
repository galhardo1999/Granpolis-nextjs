"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { TAMANHO_MAXIMO_FILA } from '@/lib/config';
import { UNIDADES, IdUnidade } from '@/lib/unidades';

interface ItemRecrutamento {
  unidade: IdUnidade;
  quantidade: number;
  inicioTempo: number;
  fimTempo: number;
}

interface FilaRecrutamentoProps {
  fila: ItemRecrutamento[];
  aoCancelar: (indice: number) => void;
}

export function FilaRecrutamento({ fila, aoCancelar }: FilaRecrutamentoProps) {
  const [agora, setAgora] = useState(Date.now());

  useEffect(() => {
    const temporizador = setInterval(() => setAgora(Date.now()), 1000);
    return () => clearInterval(temporizador);
  }, []);

  const formatarTempo = (segundos: number) => {
    const h = Math.floor(segundos / 3600);
    const m = Math.floor((segundos % 3600) / 60);
    const s = segundos % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="queue-horizontal-panel">
      <div className="queue-label-vertical" style={{ background: '#4e342e' }}>QUARTEL</div>
      <div className="queue-items-container">
        {fila.map((item, indice) => {
          const unidade = UNIDADES[item.unidade];
          const restante = Math.max(0, Math.ceil((item.fimTempo - agora) / 1000));
          const duracaoTotal = item.fimTempo - item.inicioTempo;
          const progresso = indice === 0 ? Math.min(100, Math.max(0, ((agora - item.inicioTempo) / duracaoTotal) * 100)) : 0;

          return (
            <div key={indice} className={`q-item ${indice === 0 ? 'active' : ''}`}>
              <div className="q-box">
                <Image 
                  src={unidade.retrato} 
                  alt={item.unidade} 
                  width={60} 
                  height={60} 
                  className="q-img"
                />
                <div className="q-level" style={{ color: '#ffcc80' }}>{item.quantidade}</div>
                <button className="q-cancel" onClick={() => aoCancelar(indice)} title="Cancelar recrutamento">×</button>
              </div>
              
              <div className="q-name">{unidade.nome}</div>
              
              {indice === 0 && (
                <div className="q-progress-container">
                  <div className="q-timer">{formatarTempo(restante)}</div>
                  <div className="q-bar-bg">
                    <div className="q-bar-fill" style={{ width: `${progresso}%` }}></div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        
        {/* Slots vazios para preencher a barra visualmente como no jogo */}
        {Array.from({ length: Math.max(0, TAMANHO_MAXIMO_FILA - fila.length) }).map((_, i) => (
          <div key={`vazio-${i}`} className="q-item empty">
            <div className="q-box"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
