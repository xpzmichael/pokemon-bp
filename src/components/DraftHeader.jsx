// src/components/DraftHeader.jsx
import React from 'react';
import { LayoutGrid, Languages } from 'lucide-react';
import { DICTIONARY } from '../data/dictionary';

const DraftHeader = ({ onReset, currentTurn, isComplete, lang, setLang }) => {
  const t = DICTIONARY[lang];
  return (
  <header className="bg-red-600 text-white p-3 md:p-4 shadow-lg shrink-0 z-50 relative">
    <div className="max-w-[1600px] mx-auto flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {/* Added 'relative' here to fix the Pokeball artifact issue */}
        <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full border-4 border-gray-800 flex items-center justify-center overflow-hidden relative">
           <div className="w-full h-1/2 bg-red-500 absolute top-0"></div>
           <div className="w-3 h-3 bg-gray-800 rounded-full z-10"></div>
        </div>
        <h1 className="text-lg md:text-2xl font-bold tracking-tight">{t.title}</h1>
      </div>

      <div className="flex-1 max-w-xl mx-4 hidden md:flex items-center justify-center">
         {!isComplete && (
           <div className="flex items-center gap-4 bg-red-700/50 px-6 py-2 rounded-full border border-red-500/30">
              <span className={`text-sm font-bold uppercase ${currentTurn.side === 'A' ? 'text-blue-200' : 'text-gray-400'}`}>{t.blueTeam}</span>
              <div className="h-2 w-24 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${currentTurn.side === 'A' ? 'bg-blue-400' : 'bg-red-400'}`} 
                  style={{ width: currentTurn.side === 'A' ? '0%' : '100%' }} // Simple visual indicator
                />
              </div>
              <span className={`text-sm font-bold uppercase ${currentTurn.side === 'B' ? 'text-red-200' : 'text-gray-400'}`}>{t.redTeam}</span>
           </div>
         )}
      </div>
      
      <div className="flex items-center gap-2">
        <button onClick={() => setLang(l => l === 'en' ? 'zh' : 'en')} className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2 py-1.5 rounded-lg text-sm font-bold transition-colors border border-white/20">
           <Languages size={16} /> {lang.toUpperCase()}
        </button>
        <button 
          onClick={onReset}
          className="flex items-center space-x-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors border border-white/20"
        >
          <LayoutGrid size={16} />
          <span className="hidden md:inline">{t.config}</span>
        </button>
      </div>
    </div>
  </header>
)};

export default DraftHeader;