"use client";

import React from 'react';
import Image from 'next/image';
import { BUILDINGS, BuildingId, UNITS, UnitId } from '@/lib/constants';
import { RecruitmentView } from './RecruitmentView';

interface BuildingModalProps {
  isOpen: boolean;
  onClose: () => void;
  buildingId: BuildingId | null;
  currentBuildings: Record<string, number>;
  queue: { building: BuildingId; level: number }[];
  onUpgrade: (id: BuildingId) => void;
  calculateCosts: (id: BuildingId, level: number) => { wood: number; stone: number; silver: number };
  canAfford: (costs: { wood: number; stone: number; silver: number }) => boolean;
  freePopulation: number;
  onRecruit?: (unitId: UnitId, count: number) => { success: boolean; reason?: string };
  calculateRecruitmentTime?: (unitId: UnitId, count: number) => number;
  resources: { wood: number; stone: number; silver: number; population: number };
  units: Record<string, number>;
  recruitmentQueue: { unit: UnitId; count: number; startTime: number; finishTime: number }[];
}

export function BuildingModal({
  isOpen,
  onClose,
  buildingId,
  currentBuildings,
  queue,
  onUpgrade,
  calculateCosts,
  canAfford,
  freePopulation,
  onRecruit,
  calculateRecruitmentTime,
  resources,
  units,
  recruitmentQueue
}: BuildingModalProps) {
  if (!isOpen || !buildingId) return null;

  const renderBuildingCard = (id: BuildingId) => {
    const data = BUILDINGS[id];
    const currentLevel = currentBuildings[id] || 0;
    const pendingCount = queue.filter(q => q.building === id).length;
    const nextLevel = currentLevel + pendingCount + 1;
    const costs = calculateCosts(id, nextLevel);
    const popCost = (data as any).popCost || 0;
    const affordable = canAfford(costs);
    const hasPop = freePopulation >= popCost;

    return (
      <div key={id} className="building-card">
        <div className="building-card-main">
          <div className="building-image-container">
            <Image 
              src={(data as any).image || '/placeholder_building.png'} 
              alt={data.name} 
              width={80} 
              height={80} 
              className="building-card-image"
            />
          </div>
          <div className="info">
            <h4>{data.name} (Nível {currentLevel})</h4>
            <p>{data.description}</p>
            <div className="costs">
              <small>
                <Image src="/icon_wood.png" alt="Wood" width={16} height={16} style={{ verticalAlign: 'middle' }} /> {costs.wood}{' '}
                <Image src="/icon_stone.png" alt="Stone" width={16} height={16} style={{ verticalAlign: 'middle' }} /> {costs.stone}{' '}
                <Image src="/icon_silver.png" alt="Silver" width={16} height={16} style={{ verticalAlign: 'middle' }} /> {costs.silver}{' '}
                {popCost > 0 && (
                  <>
                    <Image src="/icon_pop.png" alt="Pop" width={16} height={16} style={{ verticalAlign: 'middle' }} /> {popCost}
                  </>
                )}
              </small>
            </div>
          </div>
        </div>
        <button 
          className="upgrade-btn" 
          disabled={!affordable || !hasPop} 
          onClick={() => onUpgrade(id)}
        >
          Melhorar para Nv. {nextLevel}
        </button>
      </div>
    );
  };

  return (
    <div id="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div id="modal-container" className={buildingId === 'senate' ? 'senate-wide' : ''}>
        <div id="modal-header">
          <h2 id="modal-title">{buildingId === 'senate' ? 'Senado' : BUILDINGS[buildingId].name}</h2>
          <button id="close-modal" onClick={onClose}>&times;</button>
        </div>
        <div id="modal-body">
          {buildingId === 'senate' ? (
            <div id="senate-tree">
              <div className="senate-node senate-root">
                {renderBuildingCard('senate')}
              </div>
              
              <div className="tree-connector-main"></div>

              <div className="senate-columns">
                {/* Column 1: Wood -> Silver -> Harbor */}
                <div className="senate-column">
                  {renderBuildingCard('timber-camp')}
                  <div className="tree-arrow">▼</div>
                  {renderBuildingCard('silver-mine')}
                  <div className="tree-arrow">▼</div>
                  {renderBuildingCard('harbor')}
                </div>

                {/* Column 2: Farm -> Barracks -> Academy */}
                <div className="senate-column">
                  {renderBuildingCard('farm')}
                  <div className="tree-arrow">▼</div>
                  {renderBuildingCard('barracks')}
                  <div className="tree-arrow">▼</div>
                  {renderBuildingCard('academy')}
                </div>

                {/* Column 3: Stone -> Temple -> Walls */}
                <div className="senate-column">
                  {renderBuildingCard('quarry')}
                  <div className="tree-arrow">▼</div>
                  {renderBuildingCard('temple')}
                  <div className="tree-arrow">▼</div>
                  {renderBuildingCard('walls')}
                </div>

                {/* Column 4: Warehouse -> Market -> Cave */}
                <div className="senate-column">
                  {renderBuildingCard('warehouse')}
                  <div className="tree-arrow">▼</div>
                  {renderBuildingCard('market')}
                  <div className="tree-arrow">▼</div>
                  {renderBuildingCard('cave')}
                </div>
              </div>
            </div>
          ) : buildingId === 'barracks' ? (
            <RecruitmentView 
              units={units}
              queue={recruitmentQueue}
              onRecruit={onRecruit!}
              resources={resources}
              calculateRecruitmentTime={calculateRecruitmentTime!}
            />
          ) : (
            <>
              <p>{BUILDINGS[buildingId].description}</p>
              <br />
              <p><strong>Nível Atual:</strong> {currentBuildings[buildingId] || 0}</p>
              <hr />
              {renderBuildingCard(buildingId)}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
