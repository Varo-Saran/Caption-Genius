import React, { useCallback, useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploaderProps {
  currentImage: string | null;
  onImageSelect: (base64: string) => void;
  onClear: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ currentImage, onImageSelect, onClear }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onImageSelect(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Paste handler
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) processFile(file);
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onImageSelect]);

  if (currentImage) {
    return (
      <div className="relative group w-full h-64 md:h-full min-h-[300px] bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center border-2 border-slate-200 dark:border-slate-700">
        <img 
          src={currentImage} 
          alt="Preview" 
          className="w-full h-full object-contain" 
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
          <button 
            onClick={onClear}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-medium flex items-center gap-2 transform hover:scale-105 transition-all"
          >
            <X size={18} /> Remove Image
          </button>
           <p className="text-white/80 text-sm">or paste a new image to replace</p>
        </div>
      </div>
    );
  }

  return (
    <label 
      className={`
        flex flex-col items-center justify-center w-full h-64 md:h-full min-h-[300px]
        rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200
        ${isDragging 
          ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' 
          : 'border-slate-300 dark:border-slate-700 hover:border-brand-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
        <div className={`p-4 rounded-full mb-4 ${isDragging ? 'bg-brand-200' : 'bg-slate-100 dark:bg-slate-800'}`}>
          <Upload className={`w-10 h-10 ${isDragging ? 'text-brand-600' : 'text-slate-400'}`} />
        </div>
        <p className="mb-2 text-lg font-semibold text-slate-700 dark:text-slate-200">
          Click to upload or drag and drop
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          SVG, PNG, JPG or GIF (max. 800x400px)
        </p>
        <div className="inline-flex items-center gap-2 text-xs text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 px-3 py-1 rounded-full">
          <ImageIcon size={14} /> Supports Clipboard Paste
        </div>
      </div>
      <input type="file" className="hidden" onChange={handleFileInput} accept="image/*" />
    </label>
  );
};
