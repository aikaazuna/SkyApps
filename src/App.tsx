import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSpotlight } from './components/HeroSpotlight';
import { CategoryFilter } from './components/CategoryFilter';
import { AppCard } from './components/AppCard';
import { AppListRow } from './components/AppListRow';
import { AppDetailModal } from './components/AppDetailModal';
import { InstallGuideModal } from './components/InstallGuideModal';
import { AppSubmitModal } from './components/AppSubmitModal';
import { Footer } from './components/Footer';
import { useApps } from './hooks/useApps';
import { getInitialTheme, applyTheme, Theme } from './utils/theme';
import { Flame, SearchX, RefreshCw, Layers } from 'lucide-react';
import { AppItem, PlatformType } from './types/app';

export function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme());
  const {
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
  } = useApps();

  // Apply theme on change
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // URL deep link support (e.g. ?app=sky-clip-pro or ?admin=1)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const appId = params.get('app');
    if (appId) {
      const found = apps.find(a => a.id === appId);
      if (found) {
        setSelectedApp(found);
      }
    }
    if (params.get('admin') === '1' || window.location.hash === '#admin') {
      setIsSubmitModalOpen(true);
    }

    // Keyboard shortcut (Ctrl + Shift + A or Cmd + Shift + A) to open generator
    const handleAdminKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsSubmitModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleAdminKey);
    return () => window.removeEventListener('keydown', handleAdminKey);
  }, [apps, setSelectedApp, setIsSubmitModalOpen]);

  const handleOpenGuide = (app: AppItem, platform: PlatformType) => {
    setInstallGuideApp({ app, platform });
  };

  const isFiltering = searchQuery.trim() !== '' || selectedPlatform !== 'all' || selectedCategory !== 'all';

  return (
    <div className="relative min-h-screen flex flex-col selection:bg-[#0071e3] selection:text-white transition-colors duration-200 overflow-x-hidden">
      {/* Apple Ambient Dynamic Aurora / Glow Background */}
      <div className="apple-bg-aurora">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 apple-bg-grid opacity-60" />
        
        {/* Top-center luminous blue/purple spotlight */}
        <div className="absolute -top-[180px] left-1/2 -translate-x-1/2 w-[700px] h-[550px] bg-gradient-to-b from-[#0071e3]/20 via-[#5856d6]/15 to-transparent rounded-full blur-[120px] pointer-events-none" />
        
        {/* Left ambient glow orb */}
        <div className="absolute top-[25%] -left-[200px] w-[500px] h-[500px] bg-gradient-to-tr from-[#00c0ff]/10 via-[#0071e3]/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
        
        {/* Right ambient glow orb */}
        <div className="absolute top-[45%] -right-[200px] w-[550px] h-[550px] bg-gradient-to-bl from-[#af52de]/15 via-[#5856d6]/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
        
        {/* Bottom ambient glow orb */}
        <div className="absolute bottom-[10%] left-1/3 w-[600px] h-[400px] bg-gradient-to-t from-[#0071e3]/10 to-transparent rounded-full blur-[130px] pointer-events-none" />
      </div>

      {/* Apple blurred Glass Navbar */}
      <Navbar
        config={config}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-16">
        
        {/* If user is NOT searching or applying deep filters, show the Apple Hero Spotlight & Trending sections */}
        {!isFiltering && (
          <>
            {/* Featured Hero Spotlight Carousel */}
            <section aria-label="Applications à la une">
              <HeroSpotlight
                featuredApps={featuredApps}
                onSelectApp={(app) => setSelectedApp(app)}
              />
            </section>

            {/* Trending / Incontournables Section (Apple Top Charts style) */}
            {trendingApps.length > 0 && (
              <section className="mb-12" aria-label="Applications tendances">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-500">
                      <Flame className="w-4 h-4" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                      Les Incontournables
                    </h2>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Les mieux notées par les utilisateurs
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-2 rounded-3xl apple-glass">
                  {trendingApps.map((app, idx) => (
                    <AppListRow
                      key={app.id}
                      app={app}
                      rank={idx + 1}
                      onSelectApp={(a) => setSelectedApp(a)}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Catalog Header & Filters */}
        <section id="apps" className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#0071e3]/15 text-[#0071e3] dark:text-[#2997ff]">
                <Layers className="w-4 h-4" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {isFiltering ? 'Résultats de recherche' : 'Toutes les Applications'}
              </h2>
            </div>

            {isFiltering && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedPlatform('all');
                  setSelectedCategory('all');
                }}
                className="text-xs font-semibold text-[#0071e3] hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Réinitialiser les filtres</span>
              </button>
            )}
          </div>

          {/* Interactive Filters Bar */}
          <CategoryFilter
            selectedPlatform={selectedPlatform}
            setSelectedPlatform={setSelectedPlatform}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
            platformCounts={platformCounts}
            totalFiltered={filteredApps.length}
          />

          {/* Apps Cards Grid */}
          {filteredApps.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mt-6">
              {filteredApps.map(app => (
                <AppCard
                  key={app.id}
                  app={app}
                  onSelectApp={(a) => setSelectedApp(a)}
                  onOpenGuide={handleOpenGuide}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="apple-glass rounded-3xl p-12 text-center my-10 space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mx-auto text-gray-400">
                <SearchX className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Aucune application trouvée
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Aucune application ne correspond à votre recherche "{searchQuery}". Essayez un autre mot-clé ou réinitialisez les filtres.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedPlatform('all');
                  setSelectedCategory('all');
                }}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-[#0071e3] hover:bg-[#0077ed] transition-colors"
              >
                Effacer la recherche
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Modals */}
      <AppDetailModal
        app={selectedApp}
        onClose={() => setSelectedApp(null)}
        onOpenGuide={handleOpenGuide}
      />

      <InstallGuideModal
        app={installGuideApp?.app || null}
        initialPlatform={installGuideApp?.platform || 'apk'}
        onClose={() => setInstallGuideApp(null)}
      />

      <AppSubmitModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />

      {/* Subtle Apple Footer */}
      <Footer
        config={config}
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
      />
    </div>
  );
}

export default App;
