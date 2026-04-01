export const UNIDADES = {
  'swordsman': {
    id: 'swordsman',
    nome: 'Espadachim',
    descricao: 'Especialistas em defesa contra armas de longo alcance.',
    custos: { madeira: 95, pedra: 0, prata: 85, populacao: 1 },
    tempoBase: 20, // segundos
    retrato: '/units/unit_swordsman.png'
  },
  'slinger': {
    id: 'slinger',
    nome: 'Fundibulário',
    descricao: 'Excelentes no ataque de longo alcance.',
    custos: { madeira: 55, pedra: 100, prata: 40, populacao: 1 },
    tempoBase: 25,
    retrato: '/units/unit_slinger.png'
  },
  'archer': {
    id: 'archer',
    nome: 'Arqueiro',
    descricao: 'Defesa eficaz contra tropas de combate corpo a corpo.',
    custos: { madeira: 120, pedra: 0, prata: 75, populacao: 1 },
    tempoBase: 30,
    retrato: '/units/unit_archer.png'
  },
  'hoplite': {
    id: 'hoplite',
    nome: 'Hoplita',
    descricao: 'Guerreiro grego clássico, bom tanto no ataque quanto na defesa.',
    custos: { madeira: 0, pedra: 75, prata: 150, populacao: 1 },
    tempoBase: 35,
    retrato: '/units/unit_hoplite.png'
  },
  'horseman': {
    id: 'horseman',
    nome: 'Cavaleiro',
    descricao: 'Unidade rápida e poderosa no ataque.',
    custos: { madeira: 240, pedra: 120, prata: 360, populacao: 3 },
    tempoBase: 60,
    retrato: '/units/unit_horseman.png'
  },
  'chariot': {
    id: 'chariot',
    nome: 'Biga',
    descricao: 'Poderosa unidade de elite, rápida e mortal.',
    custos: { madeira: 200, pedra: 440, prata: 320, populacao: 4 },
    tempoBase: 80,
    retrato: '/units/unit_chariot.png'
  },
  'catapult': {
    id: 'catapult',
    nome: 'Catapulta',
    descricao: 'Máquina de guerra usada para destruir as muralhas inimigas.',
    custos: { madeira: 700, pedra: 700, prata: 700, populacao: 15 },
    tempoBase: 300,
    retrato: '/units/unit_catapult.png'
  }
} as const;

export type IdUnidade = keyof typeof UNIDADES;
