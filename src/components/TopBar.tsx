"use client";

import React from 'react';
import Image from 'next/image';

interface TopBarProps {
  resources: {
    wood: number;
    stone: number;
    silver: number;
    population: number;
    maxPopulation: number;
    maxResources: number;
  };
  income: {
    wood: number;
    stone: number;
    silver: number;
  };
  cityName: string;
  onCityNameChange: (name: string) => void;
}

export function TopBar({ resources, income, cityName, onCityNameChange }: TopBarProps) {
  return (
    <header id="top-bar">
      <h1 className="logo">Granpolis</h1>
      
      <div className="city-name-center-wrapper">
        <div className="city-name-container">
          <input 
            id="city-name-input"
            type="text" 
            value={cityName} 
            onChange={(e) => onCityNameChange(e.target.value)}
            maxLength={15}
            title="Nome da Cidade"
          />
        </div>
      </div>

      <div className="resource-container">
        <div className="resource" id="res-wood" title={`Madeira (Capacidade: ${resources.maxResources})`}>
          <Image src="/icon_wood.png" alt="Wood" width={28} height={28} />
          <span className={`value ${resources.wood >= resources.maxResources ? 'full' : ''}`}>
            {Math.floor(resources.wood)} / {resources.maxResources}
          </span>
          <span className="income">+{Math.floor(income.wood)}/h</span>
        </div>

        <div className="resource" id="res-stone" title={`Pedra (Capacidade: ${resources.maxResources})`}>
          <Image src="/icon_stone.png" alt="Stone" width={28} height={28} />
          <span className={`value ${resources.stone >= resources.maxResources ? 'full' : ''}`}>
            {Math.floor(resources.stone)} / {resources.maxResources}
          </span>
          <span className="income">+{Math.floor(income.stone)}/h</span>
        </div>

        <div className="resource" id="res-silver" title={`Prata (Capacidade: ${resources.maxResources})`}>
          <Image src="/icon_silver.png" alt="Silver" width={28} height={28} />
          <span className={`value ${resources.silver >= resources.maxResources ? 'full' : ''}`}>
            {Math.floor(resources.silver)} / {resources.maxResources}
          </span>
          <span className="income">+{Math.floor(income.silver)}/h</span>
        </div>

        <div className="resource" id="res-pop" title="População Livre / Capacidade Total">
          <Image src="/icon_pop.png" alt="Population" width={28} height={28} />
          <span className={`value ${resources.population <= 0 ? 'empty' : ''}`}>
            {resources.population} / {resources.maxPopulation}
          </span>
        </div>
      </div>
    </header>
  );
}
