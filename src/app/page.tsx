"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useGameEngine } from '@/hooks/useGameEngine';
import { TopBar } from '@/components/TopBar';
import { CityView } from '@/components/CityView';
import { ConstructionQueue } from '@/components/ConstructionQueue';
import { BuildingModal } from '@/components/BuildingModal';
import { BuildingId, GodId, UNITS } from '@/lib/constants';
import { DivinePowers } from '@/components/DivinePowers';
import { ArmyPanel } from '@/components/ArmyPanel';

export default function Home() {
  const { 
    state, 
    isLoaded, 
    upgradeBuilding, 
    calculateCosts, 
    calculateIncome, 
    canAfford,
    resetGame,
    selectGod,
    recruitUnits,
    calculateRecruitmentTime,
    cancelUpgrade,
    cancelRecruitment,
    setCityName,
    castPower
  } = useGameEngine();

  const [selectedBuilding, setSelectedBuilding] = useState<BuildingId | null>(null);
  const [activeTab, setActiveTab] = useState('city');

  if (!isLoaded) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        background: '#050E1A', 
        color: '#D4AF37', 
        fontFamily: 'var(--font-heading)' 
      }}>
        <h1>Carregando Pólis...</h1>
      </div>
    );
  }

  const income = calculateIncome(state.buildings);

  return (
    <div id="app" className={selectedBuilding ? 'modal-open' : ''}>
      <TopBar 
        resources={state.resources} 
        income={income} 
        cityName={state.cityName}
        onCityNameChange={setCityName}
      />

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex' }}>
        <CityView 
          buildings={state.buildings} 
          onBuildingClick={setSelectedBuilding} 
        />

        <ArmyPanel units={state.units} />
        
        <div style={{ position: 'absolute', right: '20px', top: '100px', display: 'flex', flexDirection: 'column', gap: '40px', alignItems: 'flex-end' }}>
          <DivinePowers 
            currentGodId={state.currentGod} 
            favor={state.resources.favor} 
            maxFavor={state.resources.maxFavor} 
            onSelectGod={selectGod} 
            onCastPower={castPower}
          />
        </div>

        {/* BOTTOM QUEUES AREA */}
        <div id="bottom-queues">
          {state.recruitmentQueue.length > 0 && (
            <div id="recruitment-queue-horizontal">
               {state.recruitmentQueue.map((item, index) => (
                  <div key={index} className="rq-item">
                    <Image src={UNITS[item.unit].portrait} alt={item.unit} width={32} height={32} />
                    <span className="rq-count">{item.count}</span>
                    <button className="rq-cancel" onClick={() => cancelRecruitment(index)}>×</button>
                  </div>
               ))}
            </div>
          )}
          <ConstructionQueue queue={state.queue} onCancel={cancelUpgrade} />
        </div>
      </div>

      <BuildingModal 
        isOpen={!!selectedBuilding} 
        onClose={() => setSelectedBuilding(null)} 
        buildingId={selectedBuilding}
        currentBuildings={state.buildings}
        queue={state.queue}
        onUpgrade={upgradeBuilding}
        calculateCosts={calculateCosts}
        canAfford={canAfford}
        freePopulation={state.resources.population}
        onRecruit={recruitUnits}
        calculateRecruitmentTime={calculateRecruitmentTime}
        resources={state.resources}
        units={state.units}
        recruitmentQueue={state.recruitmentQueue}
      />
    </div>
  );
}
