import React from 'react';
import { Smartphone, Monitor, Puzzle, Sparkles, LayoutGrid, ArrowUpDown, Filter } from 'lucide-react';
import { PlatformType, AppCategory } from '../types/app';
import { SortOption } from '../hooks/useApps';

interface CategoryFilterProps {
  selectedPlatform: PlatformType | 'all';
  setSelectedPlatform: (platform: PlatformType | 'all') => void;
  selectedCategory: AppCategory | 'all';
  setSelectedCategory: (category: AppCategory | 'all') => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  platformCounts: Record<string, number>;
  totalFiltered: number;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedPlatform,
  setSelectedPlatform,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  platformCounts,
  totalFiltered,
}) => {
  const platformButtons: { id: PlatformType | 'all'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'Toutes les applis', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'apk', label: 'Android (APK)', icon: <Smartphone className="w-4 h-4" /> },
    { id: 'exe', label: 'Windows (.EXE)', icon: <Monitor className="w-4 h-4" /> },
    { id: 'extension', label: 'Extensions Web', icon: <Puzzle className="w-4 h-4" /> },
    { id: 'web', label: 'Outils & Web', icon: <Sparkles className="w-4 h-4" /> },
  ];

  const categories: (AppCategory | 'all')[] = [
    'all',
    'Productivité',
    'Utilitaires',
    'Multimédia',
    'Outils IA',
    'Jeux',
    'Développement'
  ];

  return (
    <div className="w-full space-y-4 my-6">
      {/* Top Platform Switcher Pills (iOS Style) */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-black/5 dark:border-white/10">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {platformButtons.map(p => {
            const isActive = selectedPlatform === p.id;
            const count = platformCounts[p.id] ?? 0;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPlatform(p.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 select-none cursor-pointer ${
                  isActive
                    ? 'bg-[#0071e3] text-white shadow-md ring-2 ring-[#0071e3]/30 scale-[1.03]'
                    : 'bg-black/5 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {p.icon}
                <span>{p.label}</span>
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-black/10 dark:bg-white/10 text-gray-500 dark:text-gray-400'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sort selector & Counter */}
        <div className="flex items-center gap-3 ml-auto text-xs">
          <span className="text-gray-500 dark:text-gray-400 hidden sm:inline">
            <span className="font-semibold text-gray-900 dark:text-white">{totalFiltered}</span> résultat{totalFiltered > 1 ? 's' : ''}
          </span>
          <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-full border border-black/5 dark:border-white/10 text-gray-700 dark:text-gray-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-transparent text-xs font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="recommended" className="dark:bg-[#1c1c1e] text-gray-900 dark:text-white">Recommandés</option>
              <option value="newest" className="dark:bg-[#1c1c1e] text-gray-900 dark:text-white">Plus récents</option>
              <option value="name" className="dark:bg-[#1c1c1e] text-gray-900 dark:text-white">Nom (A - Z)</option>
              <option value="size" className="dark:bg-[#1c1c1e] text-gray-900 dark:text-white">Taille (croissante)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Secondary Category Filter tags */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 mr-1 select-none">
          <Filter className="w-3 h-3" />
          <span>Genre :</span>
        </div>
        {categories.map(cat => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-black/15 dark:bg-white/20 text-gray-900 dark:text-white font-semibold underline underline-offset-4 decoration-[#0071e3] decoration-2'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {cat === 'all' ? 'Tous les genres' : cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
