"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { UNITS, UnitId } from '@/lib/constants';

interface RecruitmentViewProps {
  units: Record<string, number>;
  queue: { unit: UnitId; count: number; startTime: number; finishTime: number }[];
  onRecruit: (unitId: UnitId, count: number) => { success: boolean; reason?: string };
  resources: { wood: number; stone: number; silver: number; population: number };
  calculateRecruitmentTime: (unitId: UnitId, count: number) => number;
}

export function RecruitmentView({
  units,
  queue,
  onRecruit,
  resources,
  calculateRecruitmentTime
}: RecruitmentViewProps) {
  const [now, setNow] = useState(Date.now());
  const [quantities, setQuantities] = useState<Record<string, number>>({
    swordsman: 1,
    slinger: 1,
    archer: 1,
    hoplite: 1,
    horseman: 1,
    chariot: 1,
    catapult: 1
  });

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleQuantityChange = (unitId: string, val: string) => {
    const num = parseInt(val) || 0;
    setQuantities(prev => ({ ...prev, [unitId]: Math.max(0, num) }));
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const renderUnitCard = (unitId: UnitId) => {
    const unit = UNITS[unitId];
    const qty = quantities[unitId] || 0;
    const time = calculateRecruitmentTime(unitId, qty);
    
    const canAfford = 
      resources.wood >= unit.costs.wood * qty &&
      resources.stone >= unit.costs.stone * qty &&
      resources.silver >= unit.costs.silver * qty &&
      resources.population >= unit.costs.population * qty;

    return (
      <div key={unitId} className="unit-card">
        <div className="unit-header">
          <Image 
            src={unit.portrait} 
            alt={unit.name} 
            width={60} 
            height={60} 
            className="unit-portrait" 
          />
          <div className="unit-info">
            <h4>{unit.name}</h4>
            <p>{unit.description}</p>
            <p><strong>Em estoque:</strong> {units[unitId] || 0}</p>
          </div>
        </div>
        
        <div className="unit-costs">
          <small><Image src="/icon_wood.png" alt="W" width={14} height={14} /> {unit.costs.wood * qty}</small>
          <small><Image src="/icon_stone.png" alt="S" width={14} height={14} /> {unit.costs.stone * qty}</small>
          <small><Image src="/icon_silver.png" alt="Si" width={14} height={14} /> {unit.costs.silver * qty}</small>
          <small><Image src="/icon_pop.png" alt="P" width={14} height={14} /> {unit.costs.population * qty}</small>
          <small>⏱ {formatTime(time)}</small>
        </div>

        <div className="unit-action">
          <input 
            type="number" 
            className="unit-input" 
            value={qty} 
            min="1"
            onChange={(e) => handleQuantityChange(unitId, e.target.value)}
          />
          <button 
            className="recruit-btn"
            disabled={!canAfford || qty <= 0}
            onClick={() => onRecruit(unitId, qty)}
          >
            Recrutar
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="recruitment-container">
      <div className="unit-grid">
        {(Object.keys(UNITS) as UnitId[]).map(id => renderUnitCard(id))}
      </div>

      <div className="recruitment-queue-section">
        <h3>Fila de Recrutamento ({queue.length}/7)</h3>
        <div className="recruitment-queue-list">
          {queue.length === 0 ? (
            <p style={{ opacity: 0.5, fontStyle: 'italic' }}>Nenhuma tropa sendo treinada.</p>
          ) : (
            queue.map((item, index) => {
              const remaining = Math.max(0, Math.ceil((item.finishTime - now) / 1000));
              const unit = UNITS[item.unit];
              return (
                <div key={index} className="recruitment-queue-item">
                  <div className="queue-item-left">
                    <Image 
                      src={unit.portrait} 
                      alt={unit.name} 
                      width={32} 
                      height={32} 
                      className="queue-unit-img"
                    />
                    <div className="queue-text">
                      <span className="unit-name">{unit.name}</span>
                      <span className="count"> (x{item.count})</span>
                    </div>
                  </div>
                  <span className="timer">{formatTime(remaining)}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
