import { useState, useMemo } from 'react';
import initialApps from '../data/apps.json';
import storeConfig from '../data/config.json';
import { AppItem, PlatformType, AppCategory, StoreConfig } from '../types/app';

export type SortOption = 'recommended' | 'name' | 'newest' | 'size';

export function useApps() {
  const [apps] = useState<AppItem[]>(initialApps as unknown as AppItem[]);
  const [config] = useState<StoreConfig>(storeConfig as unknown as StoreConfig);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<AppCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [installGuideApp, setInstallGuideApp] = useState<{ app: AppItem; platform: PlatformType } | null>(null);

  // Featured Apps (for the top hero carousel)
  const featuredApps = useMemo(() => {
    return apps.filter(app => app.featured);
  }, [apps]);

  // Top / Trending Apps (for the compact iOS top chart list)
  const trendingApps = useMemo(() => {
    return apps.slice(0, 4);
  }, [apps]);

  // Filtered and Sorted catalog
  const filteredApps = useMemo(() => {
    return apps
      .filter(app => {
        // Filter by platform
        if (selectedPlatform !== 'all' && !app.platforms.includes(selectedPlatform)) {
          return false;
        }
        // Filter by category
        if (selectedCategory !== 'all' && app.category !== selectedCategory) {
          return false;
        }
        // Filter by search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchName = app.name.toLowerCase().includes(query);
          const matchTagline = app.tagline.toLowerCase().includes(query);
          const matchDesc = app.description.toLowerCase().includes(query);
          const matchCategory = app.category.toLowerCase().includes(query);
          const matchPlatforms = app.platforms.some(p => p.toLowerCase().includes(query));
          const matchFeatures = app.features?.some(f => f.toLowerCase().includes(query));
          return matchName || matchTagline || matchDesc || matchCategory || matchPlatforms || matchFeatures;
        }
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'newest':
            return new Date(b.lastUpdated || b.releaseDate).getTime() - new Date(a.lastUpdated || a.releaseDate).getTime();
          case 'size':
            return parseFloat(a.size) - parseFloat(b.size);
          case 'recommended':
          default:
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return 0;
        }
      });
  }, [apps, selectedPlatform, selectedCategory, searchQuery, sortBy]);

  // Stats count per platform
  const platformCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: apps.length,
      apk: 0,
      exe: 0,
      extension: 0,
      web: 0
    };
    apps.forEach(app => {
      app.platforms.forEach(p => {
        if (counts[p] !== undefined) {
          counts[p]++;
        }
      });
    });
    return counts;
  }, [apps]);

  return {
    apps,
    config,
    featuredApps,
    trendingApps,
    filteredApps,
    platformCounts,
    searchQuery,
    setSearchQuery,
    selectedPlatform,
    setSelectedPlatform,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    selectedApp,
    setSelectedApp,
    isSubmitModalOpen,
    setIsSubmitModalOpen,
    installGuideApp,
    setInstallGuideApp
  };
}
