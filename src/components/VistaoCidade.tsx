"use client";

import React from 'react';
import { IdEdificio } from '@/lib/edificios';

interface VistaoCidadeProps {
  edificios: Record<string, number>;
  aoClicarEdificio: (id: IdEdificio) => void;
}

export function VistaoCidade({ edificios, aoClicarEdificio }: VistaoCidadeProps) {
  return (
    <main id="city-view">
      <div id="city-background"></div>
      
      <div className="building-slot senate" id="slot-senate" onClick={() => aoClicarEdificio('senate')}>
        <div className="building-label">Senado (Nv. <span className="level">{edificios.senate || 1}</span>)</div>
      </div>
      
      <div className="building-slot timber-camp" id="slot-timber" onClick={() => aoClicarEdificio('timber-camp')}>
        <div className="building-label">Bosque (Nv. <span className="level">{edificios['timber-camp'] || 1}</span>)</div>
      </div>
      
      <div className="building-slot quarry" id="slot-quarry" onClick={() => aoClicarEdificio('quarry')}>
        <div className="building-label">Pedreira (Nv. <span className="level">{edificios.quarry || 1}</span>)</div>
      </div>
      
      <div className="building-slot silver-mine" id="slot-silver" onClick={() => aoClicarEdificio('silver-mine')}>
        <div className="building-label">Mina de Prata (Nv. <span className="level">{edificios['silver-mine'] || 1}</span>)</div>
      </div>

      <div className="building-slot farm" id="slot-farm" onClick={() => aoClicarEdificio('farm')}>
        <div className="building-label">Quinta (Nv. <span className="level">{edificios.farm || 1}</span>)</div>
      </div>

      <div className="building-slot warehouse" id="slot-warehouse" onClick={() => aoClicarEdificio('warehouse')}>
        <div className="building-label">Armazém (Nv. <span className="level">{edificios.warehouse || 1}</span>)</div>
      </div>

      <div className="building-slot barracks" id="slot-barracks" onClick={() => aoClicarEdificio('barracks')}>
        <div className="building-label">Quartel (Nv. <span className="level">{edificios.barracks || 0}</span>)</div>
      </div>
    </main>
  );
}
