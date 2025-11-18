import React, { useState } from 'react';
import { HistoryItem, CollectionItem } from '../types';
import { Clock, Heart, Download, Trash2, X } from 'lucide-react';

interface SidebarProps {
  history: HistoryItem[];
  favorites: CollectionItem[];
  isOpen: boolean;
  onClose: () => void;
  onSelectHistory: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  history, favorites, isOpen, onClose, onSelectHistory, onClearHistory 
}) => {
  const [tab, setTab] = useState<'history' | 'favorites'>('history');

  const downloadTxt = (text: string, filename: string) => {
    const element = document.createElement("a");
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <div className={`
        fixed top-0 right-0 h-full w-80 bg-white dark:bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-slate-200 dark:border-slate-800
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
             <h2 className="font-bold text-xl text-slate-800 dark:text-white">Library</h2>
             <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
               <X size={24} />
             </button>
          </div>

          {/* Tabs */}
          <div className="flex p-2 gap-2 border-b border-slate-200 dark:border-slate-800">
            <button 
              onClick={() => setTab('history')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${tab === 'history' ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <Clock size={16} /> History
            </button>
            <button 
              onClick={() => setTab('favorites')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${tab === 'favorites' ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              <Heart size={16} /> Favorites
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {tab === 'history' ? (
              <>
                {history.length === 0 ? (
                  <p className="text-center text-slate-400 text-sm mt-10">No history yet.</p>
                ) : (
                  <div className="space-y-4">
                     <button onClick={onClearHistory} className="w-full text-xs text-red-500 hover:text-red-600 flex justify-center items-center gap-1 mb-2">
                        <Trash2 size={12} /> Clear History
                     </button>
                     {history.map((item) => (
                        <div key={item.id} onClick={() => onSelectHistory(item)} className="cursor-pointer group border border-slate-200 dark:border-slate-700 rounded-xl p-3 hover:border-brand-400 transition-all bg-slate-50 dark:bg-slate-800/50">
                            <div className="flex gap-3">
                                <img src={item.originalImage} alt="thumb" className="w-12 h-12 rounded-lg object-cover bg-slate-200" />
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-xs text-slate-400 mb-1">{new Date(item.timestamp).toLocaleDateString()}</p>
                                    <p className="text-sm text-slate-700 dark:text-slate-300 truncate font-medium">
                                        {item.captions[0]?.text || "Empty caption"}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">+{item.captions.length - 1} variants</p>
                                </div>
                            </div>
                        </div>
                     ))}
                  </div>
                )}
              </>
            ) : (
              <>
                {favorites.length === 0 ? (
                    <p className="text-center text-slate-400 text-sm mt-10">No favorites saved.</p>
                ) : (
                    <div className="space-y-3">
                        {favorites.map((fav) => (
                            <div key={fav.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                <p className="text-sm text-slate-700 dark:text-slate-200 mb-3 whitespace-pre-wrap">{fav.text}</p>
                                <div className="flex justify-end gap-2">
                                    <button 
                                        onClick={() => downloadTxt(fav.text, `caption-${fav.id}.txt`)}
                                        className="p-1.5 text-slate-400 hover:text-brand-500 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
                                        title="Download"
                                    >
                                        <Download size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
