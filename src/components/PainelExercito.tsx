"use client";

import React, { memo } from 'react';
import Image from 'next/image';
import { UNIDADES, IdUnidade } from '@/lib/unidades';

// PERF-01 FIX: React.memo — só re-renderiza quando unidades mudam

interface PainelExercitoProps {
  unidades: Record<string, number>;
}

export const PainelExercito = memo(function PainelExercito({ unidades }: PainelExercitoProps) {
  const todosIdsUnidades = Object.keys(UNIDADES) as IdUnidade[];

  return (
    <div id="army-panel">
      <h3>Tropas na Cidade</h3>
      <div className="army-grid">
        {todosIdsUnidades.map(id => {
          const quantidade = unidades[id] || 0;
          const u = UNIDADES[id];
          return (
            <div
              key={id}
              className={`army-unit-box ${quantidade === 0 ? 'empty' : ''}`}
              title={`${u.nome}\n⚔️ ATQ: ${u.ataque} | 🛡️ DEF: ${u.defesa}\n🚀 VEL: ${u.velocidade}\nQuantidade: ${quantidade}`}
            >
              <Image
                src={u.retrato}
                alt={u.nome}
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
});
