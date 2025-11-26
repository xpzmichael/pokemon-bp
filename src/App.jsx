// src/App.jsx
import React, { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';

// Import Data
import { POKEMON_DB, STANDARD_SEQUENCE, TYPE_TRANSLATIONS, TYPE_COLORS } from './data/constants';
import { DICTIONARY } from './data/dictionary';

// Import Components
import PokemonCard from './components/PokemonCard';
import SetupScreen from './components/SetupScreen';
import DraftHeader from './components/DraftHeader';
import TeamPanel from './components/TeamPanel';

export default function App() {
  const [appState, setAppState] = useState('setup'); // 'setup' | 'draft'
  const [config, setConfig] = useState({ allowMirror: false, sequence: STANDARD_SEQUENCE });
  const [lang, setLang] = useState('en'); // 'en' | 'zh'
  const t = DICTIONARY[lang];

  // Draft State
  const [stepIndex, setStepIndex] = useState(0);
  const [bans, setBans] = useState({ A: [], B: [] });
  const [picks, setPicks] = useState({ A: [], B: [] });
  
  // UI State
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState(null);

  // Derived Logic
  const currentTurn = config.sequence[stepIndex] || { side: null, action: 'complete' };
  const isComplete = stepIndex >= config.sequence.length;
  const activeSide = currentTurn.side; 
  const activeAction = currentTurn.action;

  // Calculate limits for rendering empty slots
  const totalSlots = useMemo(() => {
    return {
      picksA: config.sequence.filter(s => s.side === 'A' && s.action === 'pick').length,
      picksB: config.sequence.filter(s => s.side === 'B' && s.action === 'pick').length,
      bansA: config.sequence.filter(s => s.side === 'A' && s.action === 'ban').length,
      bansB: config.sequence.filter(s => s.side === 'B' && s.action === 'ban').length,
    };
  }, [config.sequence]);

  // Computed Sets for Fast Lookup
  const allBannedIds = useMemo(() => new Set([...bans.A, ...bans.B].map(p => p.id)), [bans]);
  const pickedAIds = useMemo(() => new Set(picks.A.map(p => p.id)), [picks.A]);
  const pickedBIds = useMemo(() => new Set(picks.B.map(p => p.id)), [picks.B]);
  const allPickedIds = useMemo(() => new Set([...picks.A, ...picks.B].map(p => p.id)), [picks]);

  // Handlers
  const handleStartDraft = (newConfig) => {
    setConfig(newConfig);
    // Reset draft state
    setStepIndex(0);
    setBans({ A: [], B: [] });
    setPicks({ A: [], B: [] });
    setSearch('');
    setFilterType(null);
    setAppState('draft');
  };

  const handleReturnToSetup = () => {
    if (window.confirm(t.confirmReset)) {
      setAppState('setup');
    }
  };

  const handleSelect = (pokemon) => {
    if (isComplete) return;

    if (activeAction === 'ban') {
      setBans(prev => ({
        ...prev,
        [activeSide]: [...prev[activeSide], pokemon]
      }));
    } else {
      setPicks(prev => ({
        ...prev,
        [activeSide]: [...prev[activeSide], pokemon]
      }));
    }
    
    setSearch('');
    setStepIndex(prev => prev + 1);
  };

  // Helper: Status of a specific Pokemon
  const getPokemonStatus = (pid) => {
    if (allBannedIds.has(pid)) return 'banned';
    if (pickedAIds.has(pid)) return 'picked-A';
    if (pickedBIds.has(pid)) return 'picked-B';
    return 'available';
  };

  // Helper: Is a Pokemon clickable?
  const isPokemonDisabled = (pid) => {
    if (isComplete) return true;
    const status = getPokemonStatus(pid);
    
    // Always disabled if banned
    if (status === 'banned') return true;
    
    // Logic for Picking
    if (activeAction === 'pick') {
      if (config.allowMirror) {
        // In mirror mode, can pick unless I already have it
        return activeSide === 'A' ? pickedAIds.has(pid) : pickedBIds.has(pid);
      } else {
        // In normal mode, cannot pick if anyone has picked it
        return allPickedIds.has(pid);
      }
    }
    
    // Logic for Banning: Cannot ban if already picked or banned
    return allPickedIds.has(pid); 
  };

  // Filter List
  const POKEMON_TYPES = Object.keys(TYPE_TRANSLATIONS.en);
  
  const filteredPokemon = useMemo(() => {
    return POKEMON_DB.filter(p => {
      const matchesSearch = p.name[lang].toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType ? p.types.includes(filterType) : true;
      return matchesSearch && matchesType;
    });
  }, [search, filterType, lang]);


  // -- RENDER --
  
  if (appState === 'setup') {
    return <SetupScreen onStart={handleStartDraft} initialConfig={config} lang={lang} setLang={setLang} />;
  }

  return (
    <div className="h-screen overflow-hidden bg-gray-50 text-gray-900 font-sans flex flex-col">
      <DraftHeader 
        onReset={handleReturnToSetup} 
        currentTurn={currentTurn} 
        isComplete={isComplete}
        lang={lang}
        setLang={setLang} 
      />

      {/* Main Content Area - Constrained to Viewport Height */}
      <main className="flex-1 max-w-[1600px] mx-auto w-full p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0 overflow-hidden">
        
        {/* Left Team (Blue) - Desktop */}
        <div className="hidden lg:block lg:col-span-3 h-full">
          <TeamPanel 
            side="A" 
            name={t.blueTeam} 
            bans={bans.A} 
            picks={picks.A} 
            active={activeSide === 'A' && !isComplete}
            totalPickSlots={totalSlots.picksA}
            totalBanSlots={totalSlots.bansA}
            lang={lang}
          />
        </div>

        {/* Center Arena */}
        <div className="lg:col-span-6 flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          
          {/* Action Status Bar (Fixed Height) */}
          <div className={`transition-all duration-300 flex flex-col justify-center items-center p-4 shrink-0
            ${isComplete ? 'bg-purple-600 py-6' : activeSide === 'A' ? 'bg-blue-600 py-4' : 'bg-red-600 py-4'}`}>
            
            <div className="text-white text-center">
              {isComplete ? (
                <>
                  <h2 className="text-3xl font-extrabold uppercase tracking-widest animate-bounce">{t.complete}</h2>
                  <p className="opacity-90 mt-1 font-medium">{t.ready}</p>
                </>
              ) : (
                <>
                  <div className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">{t.acting}</div>
                  <div className="text-2xl md:text-3xl font-black uppercase flex items-center justify-center gap-3">
                    {activeSide === 'A' ? t.blueTeam : t.redTeam}
                    <span className="bg-white/20 px-3 py-1 rounded-lg text-lg">
                      {activeAction === 'ban' ? t.bans : t.picks}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Controls (Fixed Height) */}
          <div className="p-4 border-b border-gray-100 space-y-3 bg-white z-10 shadow-sm shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder={t.searchPlaceholder}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-0 transition-all font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            {/* Type Filter */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <button 
                onClick={() => setFilterType(null)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors
                  ${!filterType ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <Filter size={12} /> {t.allTypes}
              </button>
              {POKEMON_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type === filterType ? null : type)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border-2
                    ${filterType === type 
                      ? `${TYPE_COLORS[type]} text-white border-transparent` 
                      : `bg-white text-gray-500 border-gray-100 hover:border-gray-300`}`}
                >
                  {TYPE_TRANSLATIONS[lang][type]}
                </button>
              ))}
            </div>
          </div>

          {/* Grid - Flexible Height & Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 min-h-0">
             {filteredPokemon.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-gray-400">
                 <Search size={48} className="mb-4 opacity-20" />
                 <p className="font-medium">No Pokémon found.</p>
               </div>
             ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 pb-4">
                {filteredPokemon.map(p => (
                  <PokemonCard 
                    key={p.id} 
                    pokemon={p} 
                    status={getPokemonStatus(p.id)}
                    disabled={isPokemonDisabled(p.id)}
                    onClick={handleSelect}
                    lang={lang}
                  />
                ))}
              </div>
             )}
          </div>
        </div>

        {/* Right Team (Red) - Desktop */}
        <div className="hidden lg:block lg:col-span-3 h-full">
           <TeamPanel 
            side="B" 
            name={t.redTeam} 
            bans={bans.B} 
            picks={picks.B}
            active={activeSide === 'B' && !isComplete}
            totalPickSlots={totalSlots.picksB}
            totalBanSlots={totalSlots.bansB}
            lang={lang}
          />
        </div>

        {/* Mobile Team Views */}
        <div className="lg:hidden grid grid-cols-2 gap-4 h-64 shrink-0">
           <TeamPanel 
            side="A" name={t.blueTeam} bans={bans.A} picks={picks.A} 
            active={activeSide === 'A' && !isComplete} 
            totalPickSlots={totalSlots.picksA}
            totalBanSlots={totalSlots.bansA}
            lang={lang}
          />
           <TeamPanel 
            side="B" name={t.redTeam} bans={bans.B} picks={picks.B} 
            active={activeSide === 'B' && !isComplete}
            totalPickSlots={totalSlots.picksB}
            totalBanSlots={totalSlots.bansB}
            lang={lang}
          />
        </div>

      </main>
    </div>
  );
}
