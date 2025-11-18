import React, { useState, useEffect } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ControlPanel } from './components/ControlPanel';
import { CaptionList } from './components/CaptionList';
import { Sidebar } from './components/Sidebar';
import { Settings, GeneratedCaption, HistoryItem, CollectionItem } from './types';
import { DEFAULT_SETTINGS } from './constants';
import { generateCaptions } from './services/geminiService';
import { Moon, Sun, History as HistoryIcon, Sparkles } from 'lucide-react';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [captions, setCaptions] = useState<GeneratedCaption[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Data Persistence
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('captionHistory');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [favorites, setFavorites] = useState<CollectionItem[]>(() => {
    const saved = localStorage.getItem('captionFavorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Theme Toggle
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('captionHistory', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('captionFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleGenerate = async () => {
    if (!image) return;
    
    setIsGenerating(true);
    setCaptions([]); // Clear previous
    
    try {
      const results = await generateCaptions(image, settings);
      
      const newCaptions: GeneratedCaption[] = results.map((text, i) => ({
        id: crypto.randomUUID(),
        text,
        isEditing: false
      }));
      
      setCaptions(newCaptions);

      // Add to history
      const historyItem: HistoryItem = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        originalImage: image,
        captions: newCaptions
      };
      
      setHistory(prev => [historyItem, ...prev].slice(0, 10));

    } catch (error) {
      alert("Something went wrong. Please check your API key or try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCaptionUpdate = (id: string, newText: string) => {
    setCaptions(prev => prev.map(c => {
      if (c.id === id) {
        // If we are updating text while isEditing is false, it means we want to TOGGLE edit mode (based on CaptionList implementation assumption)
        // OR if we are actually changing text, we want to update text.
        // Let's refine logic: 
        // If current state is NOT editing, we switch to editing.
        // If current state IS editing, we update text.
        // WAIT: CaptionList textarea calls onUpdate with new value. Save button calls onUpdate with current value.
        // Logic: if text differs, update text. If text is same, toggle editing.
        
        if (c.text === newText) {
           return { ...c, isEditing: !c.isEditing };
        }
        return { ...c, text: newText };
      }
      return c;
    }));
  };

  const handleSaveFavorite = (caption: GeneratedCaption) => {
    if (favorites.some(f => f.text === caption.text)) return;
    const newItem: CollectionItem = {
      id: caption.id,
      text: caption.text,
      timestamp: Date.now(),
      tags: [settings.platform, settings.style]
    };
    setFavorites(prev => [newItem, ...prev]);
  };

  const restoreHistoryItem = (item: HistoryItem) => {
    setImage(item.originalImage);
    setCaptions(item.captions);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white">
                <Sparkles size={18} />
            </div>
            <h1 className="font-bold text-xl tracking-tight">Caption<span className="text-brand-600 dark:text-brand-400">Genius</span></h1>
          </div>
          
          <div className="flex items-center gap-3">
             <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors relative"
             >
                <HistoryIcon size={20} />
                {history.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-brand-500 rounded-full"></span>}
             </button>
             <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
             >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-8rem)] lg:h-auto">
            
            {/* Left Column - Image */}
            <div className="w-full lg:w-[45%] flex-shrink-0 lg:sticky lg:top-24 self-start space-y-4">
                <ImageUploader 
                    currentImage={image} 
                    onImageSelect={setImage} 
                    onClear={() => { setImage(null); setCaptions([]); }} 
                />
                
                {/* Info Cards for Mobile (hidden on lg) or Desktop optional info */}
                {image && (
                   <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-sm text-blue-800 dark:text-blue-200 flex gap-2 items-start">
                      <span className="text-xl">💡</span>
                      <p>Pro Tip: Story mode creates ultra-short captions optimized for overlay text on Instagram Stories or WhatsApp Status.</p>
                   </div>
                )}
            </div>

            {/* Right Column - Controls & Results */}
            <div className="w-full lg:w-[55%] flex flex-col gap-6">
                <ControlPanel 
                    settings={settings} 
                    onSettingsChange={setSettings} 
                    onGenerate={handleGenerate}
                    isGenerating={isGenerating}
                    hasImage={!!image}
                />
                
                <div id="results-section">
                  <CaptionList 
                      captions={captions}
                      onSave={handleSaveFavorite}
                      onUpdate={handleCaptionUpdate}
                      onRegenerate={handleGenerate}
                  />
                </div>
            </div>
        </div>
      </main>

      <Sidebar 
        history={history}
        favorites={favorites}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSelectHistory={restoreHistoryItem}
        onClearHistory={() => setHistory([])}
      />
    </div>
  );
}

export default App;
