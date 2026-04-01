export const GAME_SPEED = 1;
export const MAX_QUEUE_SIZE = 10;
export const FAVOR_PRODUCTION_BASE = 21110; // Favor per hour

export const GODS = {
  'zeus': {
    id: 'zeus' as const,
    name: 'Zeus',
    portrait: '/god_zeus.png',
    color: '#FFD700',
    description: 'Rei dos Deuses, senhor do céu e do trovão.'
  },
  'poseidon': {
    id: 'poseidon' as const,
    name: 'Poseidón',
    portrait: '/god_poseidon.png',
    color: '#0077BE',
    description: 'Senhor dos mares e dos terremotos.'
  },
  'hera': {
    id: 'hera' as const,
    name: 'Hera',
    portrait: '/god_hera.png',
    color: '#DA70D6',
    description: 'Rainha dos Deuses, protetora do matrimônio.'
  },
  'atena': {
    id: 'atena' as const,
    name: 'Atena',
    portrait: '/god_atena.png',
    color: '#D3D3D3',
    description: 'Deusa da sabedoria e da guerra de estratégia.'
  },
  'hades': {
    id: 'hades' as const,
    name: 'Hades',
    portrait: '/god_hades.png',
    color: '#4B0082',
    description: 'Senhor do submundo e das riquezas subterrâneas.'
  }
};

export type GodId = keyof typeof GODS;

export const BUILDINGS = {
  'senate': {
    id: 'senate',
    name: 'Senado',
    description: 'O centro político da sua cidade. Aumenta a velocidade de construção.',
    image: '/buildings/senate.png',
    baseCost: { wood: 100, stone: 80, silver: 50 },
    costMultiplier: 1.2,
    timeMultiplier: 1.2,
    baseTime: 10,
    popCost: 2
  },
  'timber-camp': {
    id: 'timber-camp',
    name: 'Bosque',
    description: 'Produz madeira bruta para construções e tropas.',
    image: '/buildings/timber-camp.png',
    baseCost: { wood: 50, stone: 30, silver: 20 },
    costMultiplier: 1.1,
    timeMultiplier: 1.1,
    baseTime: 5,
    productionMultiplier: 10,
    popCost: 1
  },
  'quarry': {
    id: 'quarry',
    name: 'Pedreira',
    description: 'Fornece pedras para muralhas e edifícios.',
    image: '/buildings/quarry.png',
    baseCost: { wood: 30, stone: 50, silver: 20 },
    costMultiplier: 1.1,
    timeMultiplier: 1.1,
    baseTime: 5,
    productionMultiplier: 10,
    popCost: 1
  },
  'silver-mine': {
    id: 'silver-mine',
    name: 'Mina de Prata',
    description: 'Extrai minério de prata para comércio e divindades.',
    image: '/buildings/silver-mine.png',
    baseCost: { wood: 40, stone: 40, silver: 50 },
    costMultiplier: 1.1,
    timeMultiplier: 1.1,
    baseTime: 5,
    productionMultiplier: 10,
    popCost: 1
  },
  'farm': {
    id: 'farm',
    name: 'Quinta',
    description: 'Fornece alimento para seus cidadãos e exército. Aumenta a população máxima.',
    image: '/buildings/farm.png',
    baseCost: { wood: 40, stone: 20, silver: 20 },
    costMultiplier: 1.1,
    timeMultiplier: 1.1,
    baseTime: 5,
    popCost: 0
  },
  'warehouse': {
    id: 'warehouse',
    name: 'Armazém',
    description: 'Local onde as matérias-primas são armazenadas. Aumenta a capacidade de recursos.',
    image: '/buildings/warehouse.png',
    baseCost: { wood: 50, stone: 50, silver: 20 },
    costMultiplier: 1.1,
    timeMultiplier: 1.1,
    baseTime: 5,
    popCost: 1
  },
  'barracks': {
    id: 'barracks',
    name: 'Quartel',
    description: 'No quartel, você pode recrutar tanto tropas regulares, como unidades míticas. Quanto maior o nível do quartel, mais rápido será treinado as suas tropas.',
    image: '/buildings/barracks.png',
    baseCost: { wood: 150, stone: 120, silver: 80 },
    costMultiplier: 1.25,
    timeMultiplier: 1.2,
    baseTime: 15,
    popCost: 3
  },
  'temple': {
    id: 'temple',
    name: 'Templo',
    description: 'Local de culto aos Deuses. Aumenta a produção de favores divinos.',
    image: '/buildings/temple.png',
    baseCost: { wood: 120, stone: 120, silver: 120 },
    costMultiplier: 1.2,
    timeMultiplier: 1.2,
    baseTime: 15,
    popCost: 2
  },
  'market': {
    id: 'market',
    name: 'Mercado',
    description: 'Permite trocar recursos com outras cidades ou aldeias bárbaras.',
    image: '/buildings/market.png',
    baseCost: { wood: 80, stone: 80, silver: 80 },
    costMultiplier: 1.15,
    timeMultiplier: 1.15,
    baseTime: 12,
    popCost: 2
  },
  'harbor': {
    id: 'harbor',
    name: 'Porto',
    description: 'Permite a construção de navios e barcos de transporte.',
    image: '/buildings/harbor.png',
    baseCost: { wood: 200, stone: 100, silver: 150 },
    costMultiplier: 1.25,
    timeMultiplier: 1.2,
    baseTime: 20,
    popCost: 5
  },
  'academy': {
    id: 'academy',
    name: 'Academia',
    description: 'Onde novas tecnologias e unidades de elite são pesquisadas.',
    image: '/buildings/senate.png',
    baseCost: { wood: 150, stone: 150, silver: 150 },
    costMultiplier: 1.2,
    timeMultiplier: 1.2,
    baseTime: 25,
    popCost: 3
  },
  'walls': {
    id: 'walls',
    name: 'Muralha',
    description: 'Protege a cidade contra-ataques terrestres.',
    image: '/buildings/quarry.png',
    baseCost: { wood: 50, stone: 150, silver: 50 },
    costMultiplier: 1.2,
    timeMultiplier: 1.2,
    baseTime: 10,
    popCost: 0
  },
  'cave': {
    id: 'cave',
    name: 'Gruta',
    description: 'Permite armazenar prata para espionagem e proteção contra espiões.',
    image: '/buildings/silver-mine.png',
    baseCost: { wood: 50, stone: 50, silver: 200 },
    costMultiplier: 1.1,
    timeMultiplier: 1.1,
    baseTime: 8,
    popCost: 1
  }
} as const;

export type BuildingId = keyof typeof BUILDINGS;

export const UNITS = {
  'swordsman': {
    id: 'swordsman',
    name: 'Espadachim',
    description: 'Especialistas em defesa contra armas de longo alcance.',
    costs: { wood: 95, stone: 0, silver: 85, population: 1 },
    baseTime: 20, // seconds
    portrait: '/units/unit_swordsman.png'
  },
  'slinger': {
    id: 'slinger',
    name: 'Fundibulário',
    description: 'Excelentes no ataque de longo alcance.',
    costs: { wood: 55, stone: 100, silver: 40, population: 1 },
    baseTime: 25,
    portrait: '/units/unit_slinger.png'
  },
  'archer': {
    id: 'archer',
    name: 'Arqueiro',
    description: 'Defesa eficaz contra tropas de combate corpo a corpo.',
    costs: { wood: 120, stone: 0, silver: 75, population: 1 },
    baseTime: 30,
    portrait: '/units/unit_archer.png'
  },
  'hoplite': {
    id: 'hoplite',
    name: 'Hoplita',
    description: 'Guerreiro grego clássico, bom tanto no ataque quanto na defesa.',
    costs: { wood: 0, stone: 75, silver: 150, population: 1 },
    baseTime: 35,
    portrait: '/units/unit_hoplite.png'
  },
  'horseman': {
    id: 'horseman',
    name: 'Cavaleiro',
    description: 'Unidade rápida e poderosa no ataque.',
    costs: { wood: 240, stone: 120, silver: 360, population: 3 },
    baseTime: 60,
    portrait: '/units/unit_horseman.png'
  },
  'chariot': {
    id: 'chariot',
    name: 'Biga',
    description: 'Poderosa unidade de elite, rápida e mortal.',
    costs: { wood: 200, stone: 440, silver: 320, population: 4 },
    baseTime: 80,
    portrait: '/units/unit_chariot.png'
  },
  'catapult': {
    id: 'catapult',
    name: 'Catapulta',
    description: 'Máquina de guerra usada para destruir as muralhas inimigas.',
    costs: { wood: 700, stone: 700, silver: 700, population: 15 },
    baseTime: 300,
    portrait: '/units/unit_catapult.png'
  }
} as const;

export type UnitId = keyof typeof UNITS;

export const GOD_POWERS = {
  'zeus': [
    { id: 'zeus-sign', name: 'Sinal Divino', description: 'Invoca 1 Biga instantaneamente.', cost: 50, icon: '⚡' },
    { id: 'zeus-bolt', name: 'Relâmpago', description: 'Bônus de 500 de Pedra das montanhas.', cost: 200, icon: '🌩️' }
  ],
  'poseidon': [
    { id: 'poseidon-gift', name: 'Presente do Mar', description: 'As ondas trazem +1000 de Madeira.', cost: 100, icon: '🌊' },
    { id: 'poseidon-call', name: 'Chamado do Oceano', description: 'Oceano concede +500 de Prata.', cost: 150, icon: '🔱' }
  ],
  'hera': [
    { id: 'hera-wedding', name: 'Casamento Real', description: 'Recebe 200 de Madeira, Pedra e Prata.', cost: 30, icon: '💍' },
    { id: 'hera-growth', name: 'Crescimento', description: 'Abençoa com +10 de População Livre.', cost: 150, icon: '🌱' }
  ],
  'atena': [
    { id: 'atena-wisdom', name: 'Sabedoria', description: 'Atena concede +300 de Prata.', cost: 60, icon: '🦉' },
    { id: 'atena-power', name: 'Poder Heroico', description: 'Ganha 5 Hoplitas instantaneamente.', cost: 120, icon: '⚔️' }
  ],
  'hades': [
    { id: 'hades-treasures', name: 'Tesouros', description: 'Abre seus cofres: +800 de Prata.', cost: 150, icon: '💎' },
    { id: 'hades-return', name: 'Retorno das Trevas', description: 'Ganha 5 Espadachins.', cost: 100, icon: '💀' }
  ]
} as const;

export type PowerId = typeof GOD_POWERS[GodId][number]['id'];

export const INITIAL_STATE = {
  resources: {
    wood: 500,
    stone: 500,
    silver: 500,
    population: 20, // Free population
    maxPopulation: 100,
    maxResources: 1500,
    favor: 0,
    maxFavor: 500
  },
  currentGod: 'zeus' as GodId,
  buildings: {
    'senate': 1,
    'timber-camp': 1,
    'quarry': 1,
    'silver-mine': 1,
    'farm': 1,
    'warehouse': 1,
    'barracks': 0,
    'temple': 0,
    'market': 0,
    'harbor': 0,
    'academy': 0,
    'walls': 0,
    'cave': 0
  },
  units: {
    'swordsman': 0,
    'slinger': 0,
    'archer': 0,
    'hoplite': 0,
    'horseman': 0,
    'chariot': 0,
    'catapult': 0
  },
  queue: [] as {
    building: BuildingId;
    startTime: number;
    finishTime: number;
    level: number;
  }[],
  recruitmentQueue: [] as {
    unit: UnitId;
    count: number;
    startTime: number;
    finishTime: number;
  }[],
  lastUpdate: Date.now(),
  cityName: 'Granpolis'
};

export type GameState = typeof INITIAL_STATE;
