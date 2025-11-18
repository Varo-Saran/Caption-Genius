export type Platform = 'Instagram' | 'Twitter/X' | 'LinkedIn' | 'Facebook' | 'Story/Status';
export type Length = 'Short' | 'Medium' | 'Long';
export type Style = 'Witty' | 'Poetic' | 'Professional' | 'Casual' | 'Motivational' | 'Storytelling' | 'Minimalist';
export type Tone = 'Funny' | 'Serious' | 'Inspirational' | 'Mysterious' | 'Playful';

export interface GeneratedCaption {
  id: string;
  text: string;
  isEditing: boolean;
}

export interface GenerationResult {
  timestamp: number;
  originalImage: string; // base64
  captions: GeneratedCaption[];
}

export interface Settings {
  platform: Platform;
  length: Length;
  style: Style;
  tone: Tone;
  useEmojis: boolean;
  useHashtags: boolean;
}

export interface HistoryItem extends GenerationResult {
  id: string;
}

export interface CollectionItem {
  id: string;
  text: string;
  timestamp: number;
  tags: string[];
}
