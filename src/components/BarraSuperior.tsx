"use client";

import React from 'react';
import Image from 'next/image';

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
}

export function BarraSuperior({ recursos, renda, nomeCidade, aoAlterarNomeCidade }: BarraSuperiorProps) {
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
      </div>
    </header>
  );
}
