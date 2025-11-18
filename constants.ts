import { Platform, Length, Style, Tone } from './types';
import { Instagram, Twitter, Linkedin, Facebook, Smartphone } from 'lucide-react';

export const PLATFORMS: { value: Platform; label: string; icon: any }[] = [
  { value: 'Instagram', label: 'Instagram Post', icon: Instagram },
  { value: 'Twitter/X', label: 'Twitter/X', icon: Twitter },
  { value: 'LinkedIn', label: 'LinkedIn', icon: Linkedin },
  { value: 'Facebook', label: 'Facebook', icon: Facebook },
  { value: 'Story/Status', label: 'Story / Status', icon: Smartphone },
];

export const LENGTHS: { value: Length; label: string }[] = [
  { value: 'Short', label: 'Short (1 line)' },
  { value: 'Medium', label: 'Medium (2-3 lines)' },
  { value: 'Long', label: 'Long (Paragraph)' },
];

export const STYLES: Style[] = [
  'Witty', 'Poetic', 'Professional', 'Casual', 'Motivational', 'Storytelling', 'Minimalist'
];

export const TONES: Tone[] = [
  'Funny', 'Serious', 'Inspirational', 'Mysterious', 'Playful'
];

export const DEFAULT_SETTINGS = {
  platform: 'Instagram' as Platform,
  length: 'Medium' as Length,
  style: 'Casual' as Style,
  tone: 'Playful' as Tone,
  useEmojis: true,
  useHashtags: true,
};
