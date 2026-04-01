"use client";

import React from 'react';
import Image from 'next/image';
import { UNITS, UnitId } from '@/lib/constants';

interface ArmyPanelProps {
  units: Record<string, number>;
}

export function ArmyPanel({ units }: ArmyPanelProps) {
  const allUnitIds = Object.keys(UNITS) as UnitId[];

  return (
    <div id="army-panel">
      <h3>Tropas na Cidade</h3>
      <div className="army-grid">
        {allUnitIds.map(id => {
          const count = units[id] || 0;
          return (
            <div key={id} className={`army-unit-box ${count === 0 ? 'empty' : ''}`} title={UNITS[id].name}>
              <Image 
                src={UNITS[id].portrait} 
                alt={UNITS[id].name} 
                width={60} 
                height={60} 
                style={{ filter: count === 0 ? 'grayscale(1) opacity(0.3)' : 'none' }}
              />
              {count > 0 && <div className="unit-count">{count}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
