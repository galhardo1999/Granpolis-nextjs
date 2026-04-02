"use client";

import React, { memo } from 'react';
import Image from 'next/image';

// PERF-01 FIX: React.memo — só re-renderiza se recursos mudam de inteiro

interface BarraSuperiorProps {
  recursos: {
    madeira: number;
    pedra: number;
    prata: number;
    populacao: number;
    populacaoMaxima: number;
    recursosMaximos: number;
  };
  renda: {
    madeira: number;
    pedra: number;
    prata: number;
  };
  nomeCidade: string;
  aoAlterarNomeCidade: (nome: string) => void;
  aoResetar?: () => void;
}

export const BarraSuperior = memo(function BarraSuperior({
  recursos,
  renda,
  nomeCidade,
  aoAlterarNomeCidade,
  aoResetar
}: BarraSuperiorProps) {
  return (
    <header id="top-bar">
      <h1 className="logo">Granpolis</h1>

      <div className="city-name-center-wrapper">
        <div className="city-name-container">
          <input
            id="city-name-input"
            type="text"
            value={nomeCidade}
            onChange={(e) => aoAlterarNomeCidade(e.target.value)}
            maxLength={15}
            title="Nome da Cidade"
          />
        </div>
      </div>

      <div className="resource-container">
        <div className="resource" id="res-wood" title={`Madeira (Capacidade: ${recursos.recursosMaximos})`}>
          <Image src="/icon_wood.png" alt="Madeira" width={28} height={28} />
          <span className={`value ${recursos.madeira >= recursos.recursosMaximos ? 'full' : ''}`}>
            {Math.floor(recursos.madeira)}
          </span>
          <span className="income">+{Math.floor(renda.madeira)}/h</span>
        </div>

        <div className="resource" id="res-stone" title={`Pedra (Capacidade: ${recursos.recursosMaximos})`}>
          <Image src="/icon_stone.png" alt="Pedra" width={28} height={28} />
          <span className={`value ${recursos.pedra >= recursos.recursosMaximos ? 'full' : ''}`}>
            {Math.floor(recursos.pedra)}
          </span>
          <span className="income">+{Math.floor(renda.pedra)}/h</span>
        </div>

        <div className="resource" id="res-silver" title={`Prata (Capacidade: ${recursos.recursosMaximos})`}>
          <Image src="/icon_silver.png" alt="Prata" width={28} height={28} />
          <span className={`value ${recursos.prata >= recursos.recursosMaximos ? 'full' : ''}`}>
            {Math.floor(recursos.prata)}
          </span>
          <span className="income">+{Math.floor(renda.prata)}/h</span>
        </div>

        <div className="resource" id="res-pop" title="População Livre / Capacidade Total">
          <Image src="/icon_pop.png" alt="População" width={28} height={28} />
          <span className={`value ${recursos.populacao <= 0 ? 'empty' : ''}`}>
            {recursos.populacao} / {recursos.populacaoMaxima}
          </span>
        </div>

        {aoResetar && (
          <button
            id="btn-reset"
            onClick={aoResetar}
            title="Resetar Jogo"
            style={{
              background: 'rgba(127,29,29,0.5)',
              border: '1px solid #7f1d1d',
              color: '#fca5a5',
              borderRadius: '6px',
              padding: '4px 10px',
              cursor: 'pointer',
              fontSize: '0.75rem',
              marginLeft: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(185,28,28,0.7)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(127,29,29,0.5)')}
          >
            ↺ Reset
          </button>
        )}
      </div>
    </header>
  );
}, (prev, next) => {
  // Comparação otimizada — só re-renderiza quando inteiros mudam
  return (
    Math.floor(prev.recursos.madeira) === Math.floor(next.recursos.madeira) &&
    Math.floor(prev.recursos.pedra) === Math.floor(next.recursos.pedra) &&
    Math.floor(prev.recursos.prata) === Math.floor(next.recursos.prata) &&
    prev.recursos.populacao === next.recursos.populacao &&
    prev.recursos.populacaoMaxima === next.recursos.populacaoMaxima &&
    prev.recursos.recursosMaximos === next.recursos.recursosMaximos &&
    Math.floor(prev.renda.madeira) === Math.floor(next.renda.madeira) &&
    prev.nomeCidade === next.nomeCidade
  );
});
