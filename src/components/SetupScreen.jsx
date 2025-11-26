import React, { useState } from 'react';
import { Settings, Play, Trash2, Languages } from 'lucide-react';
import { STANDARD_SEQUENCE } from '../data/constants';
import { DICTIONARY } from '../data/dictionary';

const SetupScreen = ({ onStart, initialConfig, lang, setLang }) => {
  const t = DICTIONARY[lang];
  const [config, setConfig] = useState(initialConfig || {
    allowMirror: false,
    sequence: [...STANDARD_SEQUENCE] // Default to standard
  });

  const [activeTab, setActiveTab] = useState('preset'); // 'preset' | 'custom'
  const [selectedPreset, setSelectedPreset] = useState('standard');

  const totalBluePicks = config.sequence.filter(s => s.side === 'A' && s.action === 'pick').length;
  const totalRedPicks = config.sequence.filter(s => s.side === 'B' && s.action === 'pick').length;

  const addStep = (side, action) => {
    setConfig(prev => ({ ...prev, sequence: [...prev.sequence, { side, action }] }));
    setSelectedPreset('custom');
  };

  const removeStep = (index) => {
    setConfig(prev => ({ ...prev, sequence: prev.sequence.filter((_, i) => i !== index) }));
    setSelectedPreset('custom');
  };

  const loadPreset = (type) => {
    setSelectedPreset(type);
    let seq = [];
    if (type === 'standard') seq = [...STANDARD_SEQUENCE];
    if (type === 'short') {
      seq = [
        {action: 'ban', side: 'A'}, {action: 'ban', side: 'B'},
        {action: 'pick', side: 'A'}, {action: 'pick', side: 'B'},
        {action: 'pick', side: 'B'}, {action: 'pick', side: 'A'},
        {action: 'pick', side: 'A'}, {action: 'pick', side: 'B'},
      ];
    }
    if (type === 'ban_heavy') {
      seq = Array(6).fill({action: 'ban', side: 'A'})
        .flatMap((x, i) => [{action: 'ban', side: 'A'}, {action: 'ban', side: 'B'}])
        .concat(STANDARD_SEQUENCE.slice(4));
    }
    setConfig(prev => ({ ...prev, sequence: seq }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white max-w-4xl w-full rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-red-600 p-6 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
             <Settings size={28} />
             <h1 className="text-2xl font-bold">{t.title}</h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex gap-4 text-sm font-medium opacity-90">
               <span>{t.blueTeam}: {totalBluePicks}</span>
               <span>{t.redTeam}: {totalRedPicks}</span>
             </div>
             <button onClick={() => setLang(l => l === 'en' ? 'zh' : 'en')} className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm font-bold transition-colors">
               <Languages size={16} /> {lang.toUpperCase()}
             </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* Global Settings */}
          <div className="mb-8 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">{t.settings}</h3>
            <div className="flex items-center justify-between">
               <div>
                  <div className="font-semibold text-gray-800">{t.mirrorMatch}</div>
                  <div className="text-sm text-gray-500">{t.mirrorDesc}</div>
               </div>
               <button 
                  onClick={() => setConfig(prev => ({ ...prev, allowMirror: !prev.allowMirror }))}
                  className={`w-14 h-8 rounded-full p-1 transition-colors ${config.allowMirror ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <div className={`w-6 h-6 rounded-full bg-white shadow-sm transition-transform ${config.allowMirror ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
            </div>
          </div>

          {/* Sequence Editor */}
          <div>
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t.draftSeq}</h3>
               <div className="flex bg-gray-100 rounded-lg p-1">
                 <button 
                  onClick={() => setActiveTab('preset')}
                  className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'preset' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
                 >{t.presets}</button>
                 <button 
                  onClick={() => setActiveTab('custom')}
                  className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'custom' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
                 >{t.custom}</button>
               </div>
            </div>

            {activeTab === 'preset' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => loadPreset('standard')} 
                  className={`p-4 border-2 rounded-xl text-left transition-all ${selectedPreset === 'standard' ? 'border-red-500 bg-red-50 ring-2 ring-red-200 ring-offset-1' : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'}`}
                >
                  <div className="font-bold text-gray-800">{t.presetStandard}</div>
                  <div className="text-xs text-gray-500 mt-1">{t.presetStandardDesc}</div>
                </button>
                <button 
                  onClick={() => loadPreset('short')} 
                  className={`p-4 border-2 rounded-xl text-left transition-all ${selectedPreset === 'short' ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200 ring-offset-1' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
                >
                  <div className="font-bold text-gray-800">{t.presetShort}</div>
                  <div className="text-xs text-gray-500 mt-1">{t.presetShortDesc}</div>
                </button>
                <button 
                  onClick={() => loadPreset('ban_heavy')} 
                  className={`p-4 border-2 rounded-xl text-left transition-all ${selectedPreset === 'ban_heavy' ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200 ring-offset-1' : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'}`}
                >
                  <div className="font-bold text-gray-800">{t.presetChaos}</div>
                  <div className="text-xs text-gray-500 mt-1">{t.presetChaosDesc}</div>
                </button>
              </div>
            )}

            {activeTab === 'custom' && (
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                <div className="flex gap-2 mb-4 justify-center flex-wrap">
                   <button onClick={() => addStep('A', 'ban')} className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-xs font-bold uppercase text-gray-600 flex items-center gap-1">+ {t.blueBan}</button>
                   <button onClick={() => addStep('B', 'ban')} className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-xs font-bold uppercase text-gray-600 flex items-center gap-1">+ {t.redBan}</button>
                   <div className="w-px bg-gray-300 mx-2 hidden md:block"></div>
                   <button onClick={() => addStep('A', 'pick')} className="px-3 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-xs font-bold uppercase text-blue-700 flex items-center gap-1">+ {t.bluePick}</button>
                   <button onClick={() => addStep('B', 'pick')} className="px-3 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-xs font-bold uppercase text-red-700 flex items-center gap-1">+ {t.redPick}</button>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                  {config.sequence.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-200 shadow-sm animate-in fade-in slide-in-from-left-2 duration-200">
                      <span className="text-xs font-mono text-gray-400 w-6">#{idx + 1}</span>
                      <div className={`px-2 py-1 rounded text-xs font-bold uppercase w-16 text-center ${step.side === 'A' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                        {step.side === 'A' ? t.blueTeam : t.redTeam}
                      </div>
                      <div className={`flex-1 font-semibold text-sm ${step.action === 'ban' ? 'text-gray-500' : 'text-gray-900'}`}>
                        {step.action === 'ban' ? t.banPhase : t.pickPhase}
                      </div>
                      <button onClick={() => removeStep(idx)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {config.sequence.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm italic">No steps defined. Add some above!</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end shrink-0">
           <button 
            disabled={config.sequence.length === 0}
            onClick={() => onStart(config)}
            className="flex items-center gap-2 bg-red-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-red-500/30"
           >
             {t.start} <Play size={20} fill="currentColor" />
           </button>
        </div>
      </div>
    </div>
  );
};

export default SetupScreen;