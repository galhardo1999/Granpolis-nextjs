"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { TAMANHO_MAXIMO_FILA } from '@/lib/config';
import { EDIFICIOS, IdEdificio } from '@/lib/edificios';

interface ItemFila {
  edificio: IdEdificio;
  inicioTempo: number;
  fimTempo: number;
  nivel: number;
}

interface FilaConstrucaoProps {
  fila: ItemFila[];
  aoCancelar: (indice: number) => void;
}

export function FilaConstrucao({ fila, aoCancelar }: FilaConstrucaoProps) {
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
      <div className="queue-label-vertical">OBRAS</div>
      <div className="queue-items-container">
        {fila.map((item, indice) => {
          const edificio = EDIFICIOS[item.edificio];
          const restante = Math.max(0, Math.ceil((item.fimTempo - agora) / 1000));
          const duracaoTotal = item.fimTempo - item.inicioTempo;
          const progresso = indice === 0 ? Math.min(100, Math.max(0, ((agora - item.inicioTempo) / duracaoTotal) * 100)) : 0;

          return (
            <div key={indice} className={`q-item ${indice === 0 ? 'active' : ''}`}>
              <div className="q-box">
                <Image 
                  src={edificio.imagem} 
                  alt={edificio.nome} 
                  width={60} 
                  height={60} 
                  className="q-img"
                />
                <div className="q-level">▲ {item.nivel}</div>
                <button className="q-cancel" onClick={() => aoCancelar(indice)} title="Cancelar construção">×</button>
              </div>
              
              <div className="q-name">{edificio.nome}</div>
              
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
