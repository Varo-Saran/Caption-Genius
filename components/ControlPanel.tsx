import React from 'react';
import { Settings, Platform, Length, Style, Tone } from '../types';
import { PLATFORMS, LENGTHS, STYLES, TONES } from '../constants';
import { Hash, Smile, Wand2 } from 'lucide-react';

interface ControlPanelProps {
  settings: Settings;
  onSettingsChange: (newSettings: Settings) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  hasImage: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ 
  settings, 
  onSettingsChange, 
  onGenerate,
  isGenerating,
  hasImage
}) => {
  
  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const isStoryMode = settings.platform === 'Story/Status';

  return (
    <div className="space-y-6 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
      
      {/* Platform Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Platform</label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {PLATFORMS.map((p) => (
            <button
              key={p.value}
              onClick={() => updateSetting('platform', p.value)}
              className={`
                flex flex-col items-center justify-center p-3 rounded-xl transition-all
                ${settings.platform === p.value 
                  ? 'bg-brand-600 text-white shadow-md scale-105' 
                  : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600'}
              `}
              title={p.label}
            >
              <p.icon size={20} className="mb-1" />
              <span className="text-[10px] font-medium leading-tight text-center">{p.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Style & Tone */}
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Style</label>
                <select 
                value={settings.style}
                onChange={(e) => updateSetting('style', e.target.value as Style)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 border-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
                >
                {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tone</label>
                <select 
                value={settings.tone}
                onChange={(e) => updateSetting('tone', e.target.value as Tone)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 border-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
                >
                {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>
        </div>

        {/* Length & Toggles */}
        <div className="space-y-4">
            <div className={`transition-opacity duration-300 ${isStoryMode ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Length {isStoryMode && <span className="text-xs text-brand-500 ml-1">(Auto-set for Stories)</span>}
                </label>
                <select 
                value={settings.length}
                onChange={(e) => updateSetting('length', e.target.value as Length)}
                disabled={isStoryMode}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 border-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-white"
                >
                {LENGTHS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
            </div>

            <div className="flex gap-3 pt-1">
                <button
                    onClick={() => updateSetting('useEmojis', !settings.useEmojis)}
                    className={`flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl text-sm font-medium transition-colors ${settings.useEmojis ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}
                >
                    <Smile size={16} /> Emojis
                </button>
                <button
                    onClick={() => updateSetting('useHashtags', !settings.useHashtags)}
                    disabled={isStoryMode}
                    className={`
                        flex-1 flex items-center justify-center gap-2 p-2.5 rounded-xl text-sm font-medium transition-colors
                        ${isStoryMode ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-700' : 
                            settings.useHashtags ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}
                    `}
                >
                    <Hash size={16} /> Hashtags
                </button>
            </div>
        </div>
      </div>

      <button
        onClick={onGenerate}
        disabled={!hasImage || isGenerating}
        className={`
            w-full py-4 px-6 rounded-xl font-bold text-lg text-white shadow-lg flex items-center justify-center gap-3 transition-all
            ${!hasImage 
                ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed' 
                : isGenerating 
                    ? 'bg-brand-500 cursor-wait' 
                    : 'bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-700 hover:to-purple-700 hover:shadow-brand-500/25 hover:scale-[1.01] active:scale-[0.99]'}
        `}
      >
        {isGenerating ? (
            <>
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                Crafting Magic...
            </>
        ) : (
            <>
                <Wand2 size={20} /> Generate Captions
            </>
        )}
      </button>
    </div>
  );
};
