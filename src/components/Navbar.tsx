import React, { useEffect, useRef } from 'react';
import { Search, Sun, Moon, Plus, X, Sparkles } from 'lucide-react';
import { GithubIcon } from './icons/GithubIcon';
import { Theme } from '../utils/theme';
import { StoreConfig } from '../types/app';

interface NavbarProps {
  config: StoreConfig;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  theme: Theme;
  toggleTheme: () => void;
  onOpenSubmitModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  config,
  searchQuery,
  setSearchQuery,
  theme,
  toggleTheme,
  onOpenSubmitModal
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut (press '/' or 'Ctrl+K' / 'Cmd+K' to focus search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' && document.activeElement !== searchInputRef.current) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full apple-glass-nav border-b border-black/5 dark:border-white/10 transition-colors">
      {/* Announcement banner if enabled */}
      {config.announcement?.enabled && (
        <div className="bg-gradient-to-r from-[#0071e3]/90 via-[#4b0082]/90 to-[#0071e3]/90 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 shadow-sm backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-yellow-300" />
          <span>{config.announcement.text}</span>
          {config.announcement.link && (
            <a 
              href={config.announcement.link} 
              className="underline underline-offset-2 hover:text-white/80 transition-colors font-semibold ml-1"
            >
              {config.announcement.linkText || 'Voir plus →'}
            </a>
          )}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="relative w-10 h-10 rounded-2xl overflow-hidden shadow-apple-card flex items-center justify-center bg-gradient-to-tr from-[#0071e3] to-[#5856d6] p-0.5 group">
            <img 
              src="/logo.svg" 
              alt="Sky Apps Logo" 
              className="w-full h-full object-cover rounded-[14px] transform group-hover:scale-105 transition-transform duration-300" 
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-[#1d1d1f] to-[#424245] dark:from-white dark:to-[#86868b] bg-clip-text text-transparent">
              {config.storeName}
            </span>
            <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium tracking-wide">
              App Store & Catalog
            </span>
          </div>
        </div>

        {/* Search Bar (Apple Style) */}
        <div className="flex-1 max-w-md mx-2 sm:mx-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 group-focus-within:text-[#0071e3] transition-colors">
              <Search className="w-4 h-4" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une application, APK, .exe..."
              className="w-full pl-10 pr-16 py-2 rounded-full text-sm bg-black/5 dark:bg-white/10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-transparent focus:border-[#0071e3]/40 focus:bg-white dark:focus:bg-[#1c1c1e] focus:outline-none focus:ring-4 focus:ring-[#0071e3]/10 transition-all duration-200"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                title="Effacer la recherche"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <div className="hidden sm:flex absolute inset-y-0 right-0 pr-3 items-center pointer-events-none">
                <kbd className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-gray-500 dark:text-gray-400 border border-black/5 dark:border-white/5">
                  /
                </kbd>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Add App Button (Modal Trigger) */}
          <button
            onClick={onOpenSubmitModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#0071e3] to-[#5856d6] hover:from-[#0077ed] hover:to-[#6864e8] shadow-sm hover:shadow-apple-glow transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            title="Générer les informations pour ajouter une nouvelle application"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden md:inline">Ajouter une appli</span>
            <span className="md:hidden">Ajouter</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
            aria-label="Changer le thème"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-gray-700 hover:-rotate-12 transition-transform duration-300" />
            )}
          </button>

          {/* GitHub Profile / Repository Link */}
          {config.githubUserUrl && (
            <a
              href={config.githubUserUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              title="Voir sur GitHub"
              aria-label="GitHub"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </header>
  );
};
