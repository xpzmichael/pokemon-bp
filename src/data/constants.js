// src/data/constants.js

export const TYPE_COLORS = {
  Normal: 'bg-gray-400', Fire: 'bg-red-500', Water: 'bg-blue-500', Grass: 'bg-green-500',
  Electric: 'bg-yellow-400', Ice: 'bg-cyan-300', Fighting: 'bg-red-700', Poison: 'bg-purple-500',
  Ground: 'bg-yellow-600', Flying: 'bg-indigo-300', Psychic: 'bg-pink-500', Bug: 'bg-lime-500',
  Rock: 'bg-yellow-800', Ghost: 'bg-purple-800', Dragon: 'bg-indigo-600', Steel: 'bg-gray-400',
  Fairy: 'bg-pink-300'
};

export const TYPE_TRANSLATIONS = {
  en: {
    Normal: 'Normal', Fire: 'Fire', Water: 'Water', Grass: 'Grass', Electric: 'Electric', 
    Ice: 'Ice', Fighting: 'Fighting', Poison: 'Poison', Ground: 'Ground', Flying: 'Flying', 
    Psychic: 'Psychic', Bug: 'Bug', Rock: 'Rock', Ghost: 'Ghost', Dragon: 'Dragon', 
    Steel: 'Steel', Fairy: 'Fairy'
  },
  zh: {
    Normal: '一般', Fire: '火', Water: '水', Grass: '草', Electric: '电', 
    Ice: '冰', Fighting: '格斗', Poison: '毒', Ground: '地面', Flying: '飞行', 
    Psychic: '超能力', Bug: '虫', Rock: '岩石', Ghost: '幽灵', Dragon: '龙', 
    Steel: '钢', Fairy: '妖精'
  }
};

export const STANDARD_SEQUENCE = [
  { action: 'ban', side: 'A' }, { action: 'ban', side: 'B' },
  { action: 'ban', side: 'A' }, { action: 'ban', side: 'B' },
  { action: 'pick', side: 'A' }, { action: 'pick', side: 'B' },
  { action: 'pick', side: 'B' }, { action: 'pick', side: 'A' },
  { action: 'pick', side: 'A' }, { action: 'pick', side: 'B' },
  { action: 'pick', side: 'B' }, { action: 'pick', side: 'A' },
  { action: 'pick', side: 'A' }, { action: 'pick', side: 'B' },
  { action: 'pick', side: 'B' }, { action: 'pick', side: 'A' },
];

export const getSpriteUrl = (id) => 
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
