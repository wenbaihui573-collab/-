
export type Screen = 'LANDING' | 'CAPTURE' | 'CHAT' | 'ADMIN';

export interface Marker {
  id: string;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  label: string;
  type: FeatureType;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string; // Base64 or URL
  isThinking?: boolean;
}

export interface SiteData {
  image: string | null; // Base64
  markers: Marker[];
  description: string;
}

export enum FeatureType {
  RETAIN = 'retain',
  REMOVE = 'remove',
  MODIFY = 'modify',
  ISSUE = 'issue'
}
