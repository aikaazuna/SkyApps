export type PlatformType = 'apk' | 'exe' | 'extension' | 'web' | 'macos' | 'linux' | 'other';

export type AppCategory = 
  | 'Productivité' 
  | 'Utilitaires' 
  | 'Jeux' 
  | 'Développement' 
  | 'Multimédia' 
  | 'Sécurité' 
  | 'Personnalisation'
  | 'Outils IA'
  | 'Autre';

export interface DownloadOption {
  id: string;
  label: string;
  platform: PlatformType;
  url: string;
  size?: string;
  version?: string;
  primary?: boolean;
  sha256?: string;
  isExternalStore?: boolean; // e.g. Chrome Web Store link
}

export interface AppChangelogEntry {
  version: string;
  date: string;
  notes: string[];
}

export interface AppItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  banner?: string;
  category: AppCategory;
  platforms: PlatformType[];
  featured?: boolean;
  badge?: string; // "Nouveau", "Populaire", "Coup de cœur", "v2.0"
  rating?: number;
  author: {
    name: string;
    url?: string;
    avatar?: string;
  };
  version: string;
  size: string;
  releaseDate: string;
  lastUpdated: string;
  screenshots: string[];
  features: string[];
  requirements?: Record<string, string>;
  changelog?: AppChangelogEntry[];
  downloads: DownloadOption[];
  githubRepo?: string;
  website?: string;
}

export interface StoreConfig {
  storeName: string;
  storeTagline: string;
  authorName: string;
  githubUserUrl?: string;
  contactEmail?: string;
  announcement?: {
    enabled: boolean;
    text: string;
    link?: string;
    linkText?: string;
  };
}
