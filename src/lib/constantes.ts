export const VELOCIDADE_JOGO = 1;
export const TAMANHO_MAXIMO_FILA = 10;
export const PRODUCAO_BASE_FAVOR = 10; // Favor por hora

export const DEUSES = {
  'zeus': {
    id: 'zeus' as const,
    nome: 'Zeus',
    retrato: '/god_zeus.png',
    cor: '#FFD700',
    descricao: 'Rei dos Deuses, senhor do céu e do trovão.'
  },
  'poseidon': {
    id: 'poseidon' as const,
    nome: 'Poseidón',
    retrato: '/god_poseidon.png',
    cor: '#0077BE',
    descricao: 'Senhor dos mares e dos terremotos.'
  },
  'hera': {
    id: 'hera' as const,
    nome: 'Hera',
    retrato: '/god_hera.png',
    cor: '#DA70D6',
    descricao: 'Rainha dos Deuses, protetora do matrimônio.'
  },
  'atena': {
    id: 'atena' as const,
    nome: 'Atena',
    retrato: '/god_atena.png',
    cor: '#D3D3D3',
    descricao: 'Deusa da sabedoria e da guerra de estratégia.'
  },
  'hades': {
    id: 'hades' as const,
    nome: 'Hades',
    retrato: '/god_hades.png',
    cor: '#4B0082',
    descricao: 'Senhor do submundo e das riquezas subterrâneas.'
  }
};

export type IdDeus = keyof typeof DEUSES;

export const EDIFICIOS = {
  'senate': {
    id: 'senate',
    nome: 'Senado',
    descricao: 'O centro político da sua cidade. Aumenta a velocidade de construção.',
    imagem: '/buildings/senate.png',
    custoBase: { madeira: 100, pedra: 80, prata: 50 },
    multiplicadorCusto: 1.05,
    multiplicadorTempo: 1.05,
    tempoBase: 10,
    custoPop: 2
  },
  'timber-camp': {
    id: 'timber-camp',
    nome: 'Bosque',
    descricao: 'Produz madeira bruta para construções e tropas.',
    imagem: '/buildings/timber-camp.png',
    custoBase: { madeira: 50, pedra: 30, prata: 20 },
    multiplicadorCusto: 1.05,
    multiplicadorTempo: 1.05,
    tempoBase: 5,
    multiplicadorProducao: 10,
    custoPop: 1
  },
  'quarry': {
    id: 'quarry',
    nome: 'Pedreira',
    descricao: 'Fornece pedras para muralhas e edifícios.',
    imagem: '/buildings/quarry.png',
    custoBase: { madeira: 30, pedra: 50, prata: 20 },
    multiplicadorCusto: 1.05,
    multiplicadorTempo: 1.05,
    tempoBase: 5,
    multiplicadorProducao: 10,
    custoPop: 1
  },
  'silver-mine': {
    id: 'silver-mine',
    nome: 'Mina de Prata',
    descricao: 'Extrai minério de prata para comércio e divindades.',
    imagem: '/buildings/silver-mine.png',
    custoBase: { madeira: 40, pedra: 40, prata: 50 },
    multiplicadorCusto: 1.05,
    multiplicadorTempo: 1.05,
    tempoBase: 5,
    multiplicadorProducao: 10,
    custoPop: 1
  },
  'farm': {
    id: 'farm',
    nome: 'Quinta',
    descricao: 'Fornece alimento para seus cidadãos e exército. Aumenta a população máxima.',
    imagem: '/buildings/farm.png',
    custoBase: { madeira: 40, pedra: 20, prata: 20 },
    multiplicadorCusto: 1.05,
    multiplicadorTempo: 1.05,
    tempoBase: 5,
    custoPop: 0
  },
  'warehouse': {
    id: 'warehouse',
    nome: 'Armazém',
    descricao: 'Local onde as matérias-primas são armazenadas. Aumenta a capacidade de recursos.',
    imagem: '/buildings/warehouse.png',
    custoBase: { madeira: 50, pedra: 50, prata: 20 },
    multiplicadorCusto: 1.05,
    multiplicadorTempo: 1.05,
    tempoBase: 5,
    custoPop: 1
  },
  'barracks': {
    id: 'barracks',
    nome: 'Quartel',
    descricao: 'No quartel, você pode recrutar tanto tropas regulares, como unidades míticas. Quanto maior o nível do quartel, mais rápido será treinado as suas tropas.',
    imagem: '/buildings/barracks.png',
    custoBase: { madeira: 150, pedra: 120, prata: 80 },
    multiplicadorCusto: 1.05,
    multiplicadorTempo: 1.05,
    tempoBase: 15,
    custoPop: 3
  },
  'temple': {
    id: 'temple',
    nome: 'Templo',
    descricao: 'Local de culto aos Deuses. Aumenta a produção de favores divinos.',
    imagem: '/buildings/temple.png',
    custoBase: { madeira: 120, pedra: 120, prata: 120 },
    multiplicadorCusto: 1.2,
    multiplicadorTempo: 1.2,
    tempoBase: 15,
    custoPop: 2
  },
  'market': {
    id: 'market',
    nome: 'Mercado',
    descricao: 'Permite trocar recursos com outras cidades ou aldeias bárbaras.',
    imagem: '/buildings/market.png',
    custoBase: { madeira: 80, pedra: 80, prata: 80 },
    multiplicadorCusto: 1.05,
    multiplicadorTempo: 1.05,
    tempoBase: 12,
    custoPop: 2
  },
  'harbor': {
    id: 'harbor',
    nome: 'Porto',
    descricao: 'Permite a construção de navios e barcos de transporte.',
    imagem: '/buildings/harbor.png',
    custoBase: { madeira: 200, pedra: 100, prata: 150 },
    multiplicadorCusto: 1.05,
    multiplicadorTempo: 1.05,
    tempoBase: 20,
    custoPop: 5
  },
  'academy': {
    id: 'academy',
    nome: 'Academia',
    descricao: 'Onde novas tecnologias e unidades de elite são pesquisadas.',
    imagem: '/buildings/senate.png',
    custoBase: { madeira: 150, pedra: 150, prata: 150 },
    multiplicadorCusto: 1.05,
    multiplicadorTempo: 1.2,
    tempoBase: 25,
    custoPop: 3
  },
  'walls': {
    id: 'walls',
    nome: 'Muralha',
    descricao: 'Protege a cidade contra-ataques terrestres.',
    imagem: '/buildings/quarry.png',
    custoBase: { madeira: 50, pedra: 150, prata: 50 },
    multiplicadorCusto: 1.05,
    multiplicadorTempo: 1.05,
    tempoBase: 10,
    custoPop: 0
  },
  'cave': {
    id: 'cave',
    nome: 'Gruta',
    descricao: 'Permite armazenar prata para espionagem e proteção contra espiões.',
    imagem: '/buildings/silver-mine.png',
    custoBase: { madeira: 50, pedra: 50, prata: 200 },
    multiplicadorCusto: 1.05,
    multiplicadorTempo: 1.05,
    tempoBase: 8,
    custoPop: 1
  }
} as const;

export type IdEdificio = keyof typeof EDIFICIOS;

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

export const PODERES_DIVINOS = {
  'zeus': [
    { id: 'zeus-sign', nome: 'Sinal Divino', descricao: 'Invoca 1 Biga instantaneamente.', custo: 50, icone: '⚡' },
    { id: 'zeus-bolt', nome: 'Relâmpago', descricao: 'Bônus de 500 de Pedra das montanhas.', custo: 200, icone: '🌩️' }
  ],
  'poseidon': [
    { id: 'poseidon-gift', nome: 'Presente do Mar', descricao: 'As ondas trazem +1000 de Madeira.', custo: 100, icone: '🌊' },
    { id: 'poseidon-call', nome: 'Chamado do Oceano', descricao: 'Oceano concede +500 de Prata.', custo: 150, icone: '🔱' }
  ],
  'hera': [
    { id: 'hera-wedding', nome: 'Casamento Real', descricao: 'Recebe 200 de Madeira, Pedra e Prata.', custo: 30, icone: '💍' },
    { id: 'hera-growth', nome: 'Crescimento', descricao: 'Abençoa com +10 de População Livre.', custo: 150, icone: '🌱' }
  ],
  'atena': [
    { id: 'atena-wisdom', nome: 'Sabedoria', descricao: 'Atena concede +300 de Prata.', custo: 60, icone: '🦉' },
    { id: 'atena-power', nome: 'Poder Heroico', descricao: 'Ganha 5 Hoplitas instantaneamente.', custo: 120, icone: '⚔️' }
  ],
  'hades': [
    { id: 'hades-treasures', nome: 'Tesouros', descricao: 'Abre seus cofres: +800 de Prata.', custo: 150, icone: '💎' },
    { id: 'hades-return', nome: 'Retorno das Trevas', descricao: 'Ganha 5 Espadachins.', custo: 100, icone: '💀' }
  ]
} as const;

export type IdPoder = typeof PODERES_DIVINOS[IdDeus][number]['id'];

export const ESTADO_INICIAL = {
  recursos: {
    madeira: 50000,
    pedra: 50000,
    prata: 50000,
    populacao: 2000, // População livre
    populacaoMaxima: 10000,
    recursosMaximos: 150000,
    favor: 0,
    favorMaximo: 50000
  },
  deusAtual: 'zeus' as IdDeus,
  edificios: {
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
  unidades: {
    'swordsman': 0,
    'slinger': 0,
    'archer': 0,
    'hoplite': 0,
    'horseman': 0,
    'chariot': 0,
    'catapult': 0
  },
  fila: [] as {
    edificio: IdEdificio;
    inicioTempo: number;
    fimTempo: number;
    nivel: number;
  }[],
  filaRecrutamento: [] as {
    unidade: IdUnidade;
    quantidade: number;
    inicioTempo: number;
    fimTempo: number;
  }[],
  ultimaAtualizacao: Date.now(),
  nomeCidade: 'Granpolis'
};

export type EstadoJogo = typeof ESTADO_INICIAL;
