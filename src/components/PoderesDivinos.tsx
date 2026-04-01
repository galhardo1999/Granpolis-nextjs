"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { DEUSES, IdDeus, PODERES_DIVINOS } from '@/lib/deuses';

interface PoderDivinoProps {
  idDeusAtual: IdDeus;
  favor: number;
  favorMaximo: number;
  aoSelecionarDeus: (idDeus: IdDeus) => void;
  aoLancarPoder: (idPoder: string) => { sucesso: boolean; motivo?: string };
}

export function PoderDivino({ idDeusAtual, favor, favorMaximo, aoSelecionarDeus, aoLancarPoder }: PoderDivinoProps) {
  const [seletorAberto, setSeletorAberto] = useState(false);
  const [menuPoderAberto, setMenuPoderAberto] = useState(false);
  const deusAtual = DEUSES[idDeusAtual];
  const poderes = PODERES_DIVINOS[idDeusAtual];

  const handleSelecionar = (id: IdDeus) => {
    if (id !== idDeusAtual) {
      aoSelecionarDeus(id);
    }
    setSeletorAberto(false);
  };

  const handleLancar = (idPoder: string) => {
    const resultado = aoLancarPoder(idPoder);
    if (resultado.sucesso) {
      setMenuPoderAberto(false);
    } else {
      alert(resultado.motivo);
    }
  };

  return (
    <>
      <div className="divine-powers-container">
        <div className="god-portrait-wrapper">
          <div className="portrait-frame" onClick={() => setSeletorAberto(true)} title="Trocar de Deus">
            <span className="alterar-label">Alterar</span>
          </div>
          <Image
            src={deusAtual.retrato}
            alt={deusAtual.nome}
            width={110}
            height={110}
            className="portrait-img"
          />
          <div className="favor-meter" onClick={() => setMenuPoderAberto(!menuPoderAberto)} title="Poderes Divinos">
            <span className="bolt-icon">⚡</span>
            <span className="value">{Math.floor(favor)}</span>
          </div>

          {menuPoderAberto && (
            <div className="powers-popover">
              <h3>Poderes de {deusAtual.nome}</h3>
              <div className="powers-list">
                {poderes.map((p) => {
                  const possuiFavor = favor >= p.custo;
                  return (
                    <div key={p.id} className={`power-item ${!possuiFavor ? 'disabled' : ''}`}>
                      <div className="power-icon">{p.icone}</div>
                      <div className="power-info">
                        <div className="power-header">
                          <span className="power-name">{p.nome}</span>
                          <span className="power-cost">⚡ {p.custo}</span>
                        </div>
                        <p className="power-desc">{p.descricao}</p>
                        <button 
                          className="cast-btn" 
                          disabled={!possuiFavor}
                          onClick={() => handleLancar(p.id)}
                        >
                          Lançar Poder
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {seletorAberto && (
        <div className="god-selector-overlay" onClick={() => setSeletorAberto(false)}>
          <div className="god-grid" onClick={(e) => e.stopPropagation()}>
            {(Object.keys(DEUSES) as IdDeus[]).map((id) => {
              const deus = DEUSES[id];
              return (
                <div
                  key={id}
                  className={`god-card ${id === idDeusAtual ? 'active' : ''}`}
                  onClick={() => handleSelecionar(id)}
                >
                  <Image src={deus.retrato} alt={deus.nome} width={100} height={100} />
                  <h4>{deus.nome}</h4>
                  <p>{deus.descricao}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
