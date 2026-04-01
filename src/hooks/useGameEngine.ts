"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { BUILDINGS, INITIAL_STATE, GameState, BuildingId, GAME_SPEED, MAX_QUEUE_SIZE, FAVOR_PRODUCTION_BASE, GodId, UNITS, UnitId, GOD_POWERS } from '@/lib/constants';

export function useGameEngine() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [isLoaded, setIsLoaded] = useState(false);
  const stateRef = useRef(state);

  // Sync ref with state for the interval
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Set loaded on mount to start client-only logic
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const calculateIncome = (buildings: Record<string, number>) => {
    return {
      wood: (buildings['timber-camp'] || 0) * BUILDINGS['timber-camp'].productionMultiplier * 6,
      stone: (buildings['quarry'] || 0) * BUILDINGS['quarry'].productionMultiplier * 6,
      silver: (buildings['silver-mine'] || 0) * BUILDINGS['silver-mine'].productionMultiplier * 6
    };
  };

  const calculateMaxPopulation = (farmLevel: number) => {
    return 100 + (farmLevel - 1) * 20; // 100 base, +20 per level
  };

  const calculateMaxResources = (warehouseLevel: number) => {
    return 1000 + (warehouseLevel * 500); // 1500 at level 1, +500 per level
  };

  const processQueue = (currentState: GameState, now: number) => {
    let changed = false;
    
    // Process Buildings
    while (currentState.queue.length > 0 && now >= currentState.queue[0].finishTime) {
      const task = currentState.queue.shift()!;
      currentState.buildings[task.building]++;
      
      if (task.building === 'farm') {
        currentState.resources.maxPopulation = calculateMaxPopulation(currentState.buildings.farm);
        currentState.resources.population += 20; 
      } else if (task.building === 'warehouse') {
        currentState.resources.maxResources = calculateMaxResources(currentState.buildings.warehouse);
      }
      changed = true;
    }

    // Process Recruitment
    while (currentState.recruitmentQueue.length > 0 && now >= currentState.recruitmentQueue[0].finishTime) {
      const task = currentState.recruitmentQueue.shift()!;
      currentState.units[task.unit] += task.count;
      changed = true;
    }

    return changed;
  };

  // Game Loop
  useEffect(() => {
    if (!isLoaded) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const currentState = { ...stateRef.current };
      const diff = ((now - currentState.lastUpdate) / 1000) * GAME_SPEED;
      const income = calculateIncome(currentState.buildings);

      // Update resources with cap
      const maxRes = currentState.resources.maxResources;
      currentState.resources.wood = Math.min(maxRes, currentState.resources.wood + (income.wood / 3600) * diff);
      currentState.resources.stone = Math.min(maxRes, currentState.resources.stone + (income.stone / 3600) * diff);
      currentState.resources.silver = Math.min(maxRes, currentState.resources.silver + (income.silver / 3600) * diff);
      
      // Update Divine Favor
      const favorIncome = FAVOR_PRODUCTION_BASE * GAME_SPEED;
      currentState.resources.favor = Math.min(
        currentState.resources.maxFavor,
        currentState.resources.favor + (favorIncome / 3600) * diff
      );

      // Process queue
      const queueChanged = processQueue(currentState, now);

      currentState.lastUpdate = now;
      setState(currentState);
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoaded]);

  const upgradeBuilding = (buildingId: BuildingId) => {
    const building = BUILDINGS[buildingId];
    const pendingCount = state.queue.filter(q => q.building === buildingId).length;
    
    // Check queue limit
    if (state.queue.length >= MAX_QUEUE_SIZE) {
      return { success: false, reason: 'Fila de obras cheia (Máximo 10)' };
    }

    const currentLevel = (state.buildings[buildingId] || 0) + pendingCount;
    const nextLevel = currentLevel + 1;

    const costs = calculateCosts(buildingId, nextLevel);
    const popCost = (building as any).popCost || 0;

    if (canAfford(costs) && state.resources.population >= popCost) {
      const newState = { ...state };
      newState.resources.wood -= costs.wood;
      newState.resources.stone -= costs.stone;
      newState.resources.silver -= costs.silver;
      newState.resources.population -= popCost;

      const baseTime = building.baseTime;
      const time = baseTime * Math.pow(building.timeMultiplier, nextLevel);
      const senateBonus = 1 - (state.buildings['senate'] * 0.05);
      const finalTime = (time * senateBonus) / GAME_SPEED;

      const now = Date.now();
      const startTime = newState.queue.length > 0
        ? newState.queue[newState.queue.length - 1].finishTime
        : now;

      newState.queue.push({
        building: buildingId,
        startTime: startTime,
        finishTime: startTime + (finalTime * 1000),
        level: nextLevel
      });

      setState(newState);
      return { success: true };
    }

    if (state.resources.population < popCost) {
      return { success: false, reason: 'População insuficiente (Melhore a Quinta)' };
    }

    return { success: false, reason: 'Recursos insuficientes' };
  };

  const calculateCosts = (buildingId: BuildingId, level: number) => {
    const building = BUILDINGS[buildingId];
    const multiplier = Math.pow(building.costMultiplier, level - 1);
    return {
      wood: Math.floor(building.baseCost.wood * multiplier),
      stone: Math.floor(building.baseCost.stone * multiplier),
      silver: Math.floor(building.baseCost.silver * multiplier)
    };
  };

  const canAfford = (costs: { wood: number, stone: number, silver: number }) => {
    return state.resources.wood >= costs.wood &&
           state.resources.stone >= costs.stone &&
           state.resources.silver >= costs.silver;
  };

  const calculateRecruitmentTime = (unitId: UnitId, count: number) => {
    const unit = UNITS[unitId];
    const baseTime = unit.baseTime * count;
    const barracksLevel = state.buildings['barracks'] || 0;
    // Each level of barracks reduces time by 5%
    const reduction = Math.pow(0.95, barracksLevel);
    return (baseTime * reduction) / GAME_SPEED;
  };

  const recruitUnits = (unitId: UnitId, count: number) => {
    if (count <= 0) return { success: false, reason: 'Quantidade inválida' };
    
    const unit = UNITS[unitId];
    const totalCosts = {
      wood: unit.costs.wood * count,
      stone: unit.costs.stone * count,
      silver: unit.costs.silver * count,
      population: unit.costs.population * count
    };

    if (state.recruitmentQueue.length >= 7) {
      return { success: false, reason: 'Fila de recrutamento cheia (Máximo 7)' };
    }

    if (canAfford(totalCosts) && state.resources.population >= totalCosts.population) {
      const newState = { ...state };
      newState.resources.wood -= totalCosts.wood;
      newState.resources.stone -= totalCosts.stone;
      newState.resources.silver -= totalCosts.silver;
      newState.resources.population -= totalCosts.population;

      const finalTime = calculateRecruitmentTime(unitId, count);
      const now = Date.now();
      const startTime = newState.recruitmentQueue.length > 0
        ? newState.recruitmentQueue[newState.recruitmentQueue.length - 1].finishTime
        : now;

      newState.recruitmentQueue.push({
        unit: unitId,
        count: count,
        startTime: startTime,
        finishTime: startTime + (finalTime * 1000)
      });

      setState(newState);
      return { success: true };
    }

    if (state.resources.population < totalCosts.population) {
      return { success: false, reason: 'População insuficiente' };
    }

    return { success: false, reason: 'Recursos insuficientes' };
  };

  const resetGame = () => {
    if (confirm("Tem certeza que deseja resetar TODA a sua pólis? Isso apagará seu progresso atual.")) {
      setState(INITIAL_STATE);
    }
  };

  const selectGod = (godId: GodId) => {
    if (confirm(`Deseja selecionar ${godId.toUpperCase()} como seu deus? Seus pontos de favor serão resetados.`)) {
      setState(prev => ({
        ...prev,
        currentGod: godId,
        resources: {
          ...prev.resources,
          favor: 0
        }
      }));
    }
  };
  
  const cancelUpgrade = (index: number) => {
    const newState = { ...state };
    const task = newState.queue[index];
    if (!task) return;

    const building = BUILDINGS[task.building];
    const costs = calculateCosts(task.building, task.level);
    const popCost = (building as any).popCost || 0;

    newState.resources.wood += costs.wood;
    newState.resources.stone += costs.stone;
    newState.resources.silver += costs.silver;
    newState.resources.population += popCost;

    newState.queue.splice(index, 1);

    // Recalculate times
    const now = Date.now();
    for (let i = 0; i < newState.queue.length; i++) {
      const item = newState.queue[i];
      const duration = item.finishTime - item.startTime;
      item.startTime = i === 0 ? now : newState.queue[i - 1].finishTime;
      item.finishTime = item.startTime + duration;
    }

    setState(newState);
  };

  const cancelRecruitment = (index: number) => {
    const newState = { ...state };
    const task = newState.recruitmentQueue[index];
    if (!task) return;

    const unit = UNITS[task.unit];
    newState.resources.wood += unit.costs.wood * task.count;
    newState.resources.stone += unit.costs.stone * task.count;
    newState.resources.silver += unit.costs.silver * task.count;
    newState.resources.population += unit.costs.population * task.count;

    newState.recruitmentQueue.splice(index, 1);

    // Recalculate times
    const now = Date.now();
    for (let i = 0; i < newState.recruitmentQueue.length; i++) {
      const item = newState.recruitmentQueue[i];
      const duration = item.finishTime - item.startTime;
      item.startTime = i === 0 ? now : newState.recruitmentQueue[i - 1].finishTime;
      item.finishTime = item.startTime + duration;
    }

    setState(newState);
  };

  const setCityName = (name: string) => {
    setState(prev => ({
      ...prev,
      cityName: name
    }));
  };

  const castPower = (powerId: string) => {
    const allPowers = Object.values(GOD_POWERS).flat();
    const power = allPowers.find(p => p.id === powerId);
    
    if (!power) return { success: false, reason: 'Poder não encontrado' };
    if (state.resources.favor < power.cost) return { success: false, reason: 'Favor insuficiente' };

    const newState = { ...state };
    newState.resources.favor -= power.cost;

    switch (powerId) {
      case 'zeus-sign':
        newState.units.chariot += 1;
        break;
      case 'zeus-bolt':
        newState.resources.stone = Math.min(newState.resources.maxResources, newState.resources.stone + 500);
        break;
      case 'poseidon-gift':
        newState.resources.wood = Math.min(newState.resources.maxResources, newState.resources.wood + 1000);
        break;
      case 'poseidon-call':
        newState.resources.silver = Math.min(newState.resources.maxResources, newState.resources.silver + 500);
        break;
      case 'hera-wedding':
        newState.resources.wood = Math.min(newState.resources.maxResources, newState.resources.wood + 200);
        newState.resources.stone = Math.min(newState.resources.maxResources, newState.resources.stone + 200);
        newState.resources.silver = Math.min(newState.resources.maxResources, newState.resources.silver + 200);
        break;
      case 'hera-growth':
        newState.resources.population += 10;
        break;
      case 'atena-wisdom':
        newState.resources.silver = Math.min(newState.resources.maxResources, newState.resources.silver + 300);
        break;
      case 'atena-power':
        newState.units.hoplite += 5;
        break;
      case 'hades-treasures':
        newState.resources.silver = Math.min(newState.resources.maxResources, newState.resources.silver + 800);
        break;
      case 'hades-return':
        newState.units.swordsman += 5;
        break;
    }

    setState(newState);
    return { success: true };
  };

  return {
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
  };
};
