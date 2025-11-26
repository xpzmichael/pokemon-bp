import React from 'react';
import { Swords, ShieldBan, X } from 'lucide-react';
import { TYPE_COLORS, getSpriteUrl } from '../data/constants';
import { DICTIONARY } from '../data/dictionary';

const TeamPanel = ({ side, name, bans, picks, active, totalPickSlots, totalBanSlots, lang }) => {
  const t = DICTIONARY[lang];
  const isBlue = side === 'A';
  const borderColor = isBlue ? 'border-blue-500' : 'border-red-500';
  const bgColor = isBlue ? 'bg-blue-50' : 'bg-red-50';
  const headerColor = isBlue ? 'bg-blue-600' : 'bg-red-600';

  return (
    <div className={`flex flex-col h-full rounded-2xl overflow-hidden border-2 transition-all duration-300 ${active ? `${borderColor} shadow-xl scale-[1.01]` : 'border-gray-200 opacity-90'}`}>
      <div className={`${headerColor} p-4 text-white flex justify-between items-center shrink-0`}>
        <h2 className="text-xl font-bold uppercase tracking-wider">{name}</h2>
        {active && <div className="animate-pulse flex items-center gap-1 text-xs font-bold bg-white/20 px-2 py-1 rounded-full"><div className="w-2 h-2 bg-green-400 rounded-full"></div> {t.acting}</div>}
      </div>

      <div className={`flex-1 ${bgColor} p-4 flex flex-col min-h-0`}>
        {/* Picks Area - Scrollable */}
        <div className="flex-1 overflow-y-auto mb-4 pr-1">
          <div className="flex items-center gap-2 mb-3 text-gray-600 font-bold text-sm uppercase sticky top-0 bg-inherit py-1 z-10">
            <Swords size={16} /> {t.picks} ({picks.length}/{totalPickSlots})
          </div>
          <div className="space-y-2">
            {[...Array(Math.max(picks.length + 1, totalPickSlots))].slice(0, totalPickSlots).map((_, i) => {
              const p = picks[i];
              return (
                <div key={i} className="h-14 bg-white rounded-lg border border-gray-200 flex items-center px-2 shadow-sm transition-all">
                  {p ? (
                    <>
                      <img src={getSpriteUrl(p.id)} alt={p.name[lang]} className="w-12 h-12 object-contain" />
                      <div className="ml-2 min-w-0">
                        <div className="font-bold text-gray-800 text-sm truncate">{p.name[lang]}</div>
                        <div className="flex gap-1">
                          {p.types.map(t => (
                            <div key={t} className={`w-2 h-2 rounded-full ${TYPE_COLORS[t]}`} />
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full text-center text-gray-300 text-xs font-bold">
                      {i === picks.length && active ? (
                        <span className="animate-pulse text-gray-400">{t.picking}</span>
                      ) : (
                        `${t.emptySlot} ${i + 1}`
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bans Area - Fixed at bottom with full visibility of slots */}
        <div className="mt-auto pt-4 border-t border-gray-200/50 shrink-0">
           <div className="flex items-center gap-2 mb-3 text-gray-500 font-bold text-sm uppercase">
            <ShieldBan size={16} /> {t.bans}
          </div>
          <div className="grid grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {[...Array(Math.max(bans.length + 1, totalBanSlots))].slice(0, totalBanSlots).map((_, i) => {
               const b = bans[i];
               return (
                <div key={i} className={`aspect-square rounded-lg flex items-center justify-center relative overflow-hidden shadow-sm transition-all
                  ${b ? 'bg-white border border-gray-200' : 'bg-gray-200/50 border-2 border-dashed border-gray-300'}`}
                  title={b ? b.name[lang] : ''}
                >
                  {b ? (
                    <>
                      <img src={getSpriteUrl(b.id)} alt={b.name[lang]} className="w-full h-full object-contain grayscale opacity-70" />
                      <X className="absolute text-red-500/80 w-6 h-6" />
                    </>
                  ) : (
                    <div className={`text-[10px] font-bold text-center leading-tight px-1 ${i === bans.length && active ? 'text-red-400 animate-pulse' : 'text-gray-400'}`}>
                      {i === bans.length && active ? t.banning : t.emptyBan}
                    </div>
                  )}
                </div>
               )
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamPanel;