"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { GODS, GodId, GOD_POWERS } from '@/lib/constants';

interface DivinePowersProps {
  currentGodId: GodId;
  favor: number;
  maxFavor: number;
  onSelectGod: (godId: GodId) => void;
  onCastPower: (powerId: string) => { success: boolean; reason?: string };
}

export function DivinePowers({ currentGodId, favor, maxFavor, onSelectGod, onCastPower }: DivinePowersProps) {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isPowerMenuOpen, setIsPowerMenuOpen] = useState(false);
  const currentGod = GODS[currentGodId];
  const powers = GOD_POWERS[currentGodId];

  const handleSelect = (id: GodId) => {
    if (id !== currentGodId) {
      onSelectGod(id);
    }
    setIsSelectorOpen(false);
  };

  const handleCast = (powerId: string) => {
    const result = onCastPower(powerId);
    if (result.success) {
      // Could add a toast here
      setIsPowerMenuOpen(false);
    } else {
      alert(result.reason);
    }
  };

  return (
    <>
      <div className="divine-powers-container">
        <div className="god-portrait-wrapper">
          <div className="portrait-frame" onClick={() => setIsSelectorOpen(true)} title="Trocar de Deus">
            <span className="alterar-label">Alterar</span>
          </div>
          <Image
            src={currentGod.portrait}
            alt={currentGod.name}
            width={110}
            height={110}
            className="portrait-img"
          />
          <div className="favor-meter" onClick={() => setIsPowerMenuOpen(!isPowerMenuOpen)} title="Poderes Divinos">
            <span className="bolt-icon">⚡</span>
            <span className="value">{Math.floor(favor)}</span>
          </div>

          {isPowerMenuOpen && (
            <div className="powers-popover">
              <h3>Poderes de {currentGod.name}</h3>
              <div className="powers-list">
                {powers.map((p) => {
                  const canAfford = favor >= p.cost;
                  return (
                    <div key={p.id} className={`power-item ${!canAfford ? 'disabled' : ''}`}>
                      <div className="power-icon">{p.icon}</div>
                      <div className="power-info">
                        <div className="power-header">
                          <span className="power-name">{p.name}</span>
                          <span className="power-cost">⚡ {p.cost}</span>
                        </div>
                        <p className="power-desc">{p.description}</p>
                        <button 
                          className="cast-btn" 
                          disabled={!canAfford}
                          onClick={() => handleCast(p.id)}
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

      {isSelectorOpen && (
        <div className="god-selector-overlay" onClick={() => setIsSelectorOpen(false)}>
          <div className="god-grid" onClick={(e) => e.stopPropagation()}>
            {(Object.keys(GODS) as GodId[]).map((id) => {
              const god = GODS[id];
              return (
                <div
                  key={id}
                  className={`god-card ${id === currentGodId ? 'active' : ''}`}
                  onClick={() => handleSelect(id)}
                >
                  <Image src={god.portrait} alt={god.name} width={100} height={100} />
                  <h4>{god.name}</h4>
                  <p>{god.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
