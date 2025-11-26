// src/components/PokemonCard.jsx
import React from 'react';
import { ShieldBan } from 'lucide-react';
import { TYPE_COLORS, TYPE_TRANSLATIONS} from '../data/constants';
import { getSpriteUrl } from '../utils/spriteHelper';

const PokemonCard = ({ pokemon, status, onClick, disabled, lang }) => {
  const isBanned = status === 'banned';
  const isPicked = status && status.startsWith('picked');
  const pickedBy = status === 'picked-A' ? 'A' : status === 'picked-B' ? 'B' : null;
  const isBoth = status === 'picked-both';

  let cardClass = "relative group cursor-pointer transition-all duration-200 rounded-xl p-2 flex flex-col items-center border-2 ";
  
  if (isBanned) {
    cardClass += "bg-gray-200 border-gray-300 opacity-60 grayscale cursor-not-allowed";
  } else if (isBoth) {
    // Visual style for "Picked by Both"
    cardClass += "bg-gradient-to-r from-blue-100 to-red-100 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]";
  } else if (isPicked) {
    cardClass += pickedBy === 'A' 
      ? "bg-blue-100 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
      : "bg-red-100 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]";
  } else if (disabled) {
    cardClass += "bg-white border-gray-100 opacity-40 cursor-not-allowed";
  } else {
    cardClass += "bg-white border-transparent hover:border-gray-300 hover:shadow-lg hover:-translate-y-1";
  }

  return (
    <div 
      onClick={() => !disabled && !isBanned && onClick(pokemon)} 
      className={cardClass}
    >
      <div className="text-xs font-bold text-gray-400 absolute top-1 left-2">#{String(pokemon.id).padStart(3, '0')}</div>
      {isBanned && <ShieldBan className="absolute text-gray-500 w-8 h-8 z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}
      
      <img 
        src={getSpriteUrl(pokemon.id)} 
        alt={pokemon.name[lang]}
        className="w-16 h-16 md:w-20 md:h-20 object-contain z-0"
        loading="lazy"
      />
      
      <div className="text-sm font-bold text-gray-700 mb-1 text-center leading-tight truncate w-full">
        {pokemon.name[lang]}
      </div>
      <div className="flex gap-1 justify-center flex-wrap w-full">
        {pokemon.types.map(t => (
          <span key={t} className={`text-[9px] text-white px-1.5 py-0.5 rounded-full ${TYPE_COLORS[t] || 'bg-gray-400'}`}>
            {TYPE_TRANSLATIONS[lang][t]}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PokemonCard;