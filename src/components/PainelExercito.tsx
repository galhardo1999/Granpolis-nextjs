"use client";

import React from 'react';
import Image from 'next/image';
import { UNIDADES, IdUnidade } from '@/lib/unidades';

interface PainelExercitoProps {
  unidades: Record<string, number>;
}

export function PainelExercito({ unidades }: PainelExercitoProps) {
  const todosIdsUnidades = Object.keys(UNIDADES) as IdUnidade[];

  return (
    <div id="army-panel">
      <h3>Tropas na Cidade</h3>
      <div className="army-grid">
        {todosIdsUnidades.map(id => {
          const quantidade = unidades[id] || 0;
          return (
            <div key={id} className={`army-unit-box ${quantidade === 0 ? 'empty' : ''}`} title={UNIDADES[id].nome}>
              <Image 
                src={UNIDADES[id].retrato} 
                alt={UNIDADES[id].nome} 
                width={60} 
                height={60} 
                style={{ filter: quantidade === 0 ? 'grayscale(1) opacity(0.3)' : 'none' }}
              />
              {quantidade > 0 && <div className="unit-count">{quantidade}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
