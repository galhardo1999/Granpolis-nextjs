// ============================================================
// UNIDADES DE COMBATE
// Inclui estatísticas completas: ataque, defesa, transporte
// ============================================================

export const UNIDADES = {
  'swordsman': {
    id: 'swordsman',
    nome: 'Espadachim',
    descricao: 'Especialistas em defesa contra armas de longo alcance.',
    custos: { madeira: 95, pedra: 0, prata: 85, populacao: 1 },
    tempoBase: 20,
    retrato: '/units/unit_swordsman.png',
    ataque: 30,
    defesa: 65,
    velocidade: 16,
    capacidadeTransporte: 15
  },
  'slinger': {
    id: 'slinger',
    nome: 'Fundibulário',
    descricao: 'Excelentes no ataque de longo alcance.',
    custos: { madeira: 55, pedra: 100, prata: 40, populacao: 1 },
    tempoBase: 25,
    retrato: '/units/unit_slinger.png',
    ataque: 55,
    defesa: 15,
    velocidade: 17,
    capacidadeTransporte: 20
  },
  'archer': {
    id: 'archer',
    nome: 'Arqueiro',
    descricao: 'Defesa eficaz contra tropas de combate corpo a corpo.',
    custos: { madeira: 120, pedra: 0, prata: 75, populacao: 1 },
    tempoBase: 30,
    retrato: '/units/unit_archer.png',
    ataque: 30,
    defesa: 55,
    velocidade: 14,
    capacidadeTransporte: 10
  },
  'hoplite': {
    id: 'hoplite',
    nome: 'Hoplita',
    descricao: 'Guerreiro grego clássico, bom tanto no ataque quanto na defesa.',
    custos: { madeira: 0, pedra: 75, prata: 150, populacao: 1 },
    tempoBase: 35,
    retrato: '/units/unit_hoplite.png',
    ataque: 70,
    defesa: 70,
    velocidade: 9,
    capacidadeTransporte: 20
  },
  'horseman': {
    id: 'horseman',
    nome: 'Cavaleiro',
    descricao: 'Unidade rápida e poderosa no ataque.',
    custos: { madeira: 240, pedra: 120, prata: 360, populacao: 3 },
    tempoBase: 60,
    retrato: '/units/unit_horseman.png',
    ataque: 120,
    defesa: 40,
    velocidade: 28,
    capacidadeTransporte: 60
  },
  'chariot': {
    id: 'chariot',
    nome: 'Biga',
    descricao: 'Poderosa unidade de elite, rápida e mortal.',
    custos: { madeira: 200, pedra: 440, prata: 320, populacao: 4 },
    tempoBase: 80,
    retrato: '/units/unit_chariot.png',
    ataque: 180,
    defesa: 60,
    velocidade: 23,
    capacidadeTransporte: 100
  },
  'catapult': {
    id: 'catapult',
    nome: 'Catapulta',
    descricao: 'Máquina de guerra usada para destruir as muralhas inimigas.',
    custos: { madeira: 700, pedra: 700, prata: 700, populacao: 15 },
    tempoBase: 300,
    retrato: '/units/unit_catapult.png',
    ataque: 350,
    defesa: 20,
    velocidade: 4,
    capacidadeTransporte: 0
  }
} as const;

export type IdUnidade = keyof typeof UNIDADES;
