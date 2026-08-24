import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Download, ExternalLink, Sparkles, Smartphone, Monitor, Puzzle } from 'lucide-react';
import { AppItem, PlatformType } from '../types/app';
import { triggerDirectDownload } from '../utils/download';
import { PendingDownload } from './DownloadLicenseModal';
import { DynamicAppBanner } from './DynamicAppBanner';

interface HeroSpotlightProps {
  featuredApps: AppItem[];
  onSelectApp: (app: AppItem) => void;
  onRequestDownload?: (info: PendingDownload) => void;
}

export const HeroSpotlight: React.FC<HeroSpotlightProps> = ({
  featuredApps,
  onSelectApp,
  onRequestDownload
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto slide every 6 seconds unless user hovers
  useEffect(() => {
    if (featuredApps.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredApps.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [featuredApps.length, isPaused]);

  if (!featuredApps.length) return null;

  const currentApp = featuredApps[currentIndex] || featuredApps[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + featuredApps.length) % featuredApps.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % featuredApps.length);
  };

  const renderPlatformBadge = (platform: PlatformType) => {
    switch (platform) {
      case 'apk':
        return (
          <span key={platform} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Smartphone className="w-3 h-3" /> Android APK
          </span>
        );
      case 'exe':
        return (
          <span key={platform} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
            <Monitor className="w-3 h-3" /> Windows .EXE
          </span>
        );
      case 'extension':
        return (
          <span key={platform} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <Puzzle className="w-3 h-3" /> Extension Web
          </span>
        );
      default:
        return (
          <span key={platform} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <Sparkles className="w-3 h-3" /> {platform.toUpperCase()}
          </span>
        );
    }
  };

  const primaryDownload = currentApp.downloads.find(d => d.primary) || currentApp.downloads[0];

  return (
    <div 
      className="relative w-full rounded-3xl overflow-hidden shadow-2xl mb-10 group select-none border border-black/10 dark:border-white/15"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Banner (Dynamic Gradient or Image) */}
      <div className="relative h-[420px] sm:h-[460px] md:h-[480px] w-full overflow-hidden bg-gray-900">
        <DynamicAppBanner app={currentApp} />

        {/* Content Container */}
        <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-end max-w-3xl">
          {/* Header pill */}
          <div className="flex items-center gap-2 mb-3">
            <span className="uppercase tracking-widest text-[11px] font-bold text-[#0071e3] bg-white/15 backdrop-blur-md px-3 py-1 rounded-full">
              À LA UNE • {currentApp.badge || 'Sélection du Store'}
            </span>
            <div className="flex items-center gap-1.5">
              {currentApp.platforms.map(p => renderPlatformBadge(p))}
            </div>
          </div>

          {/* App Title & Slogan */}
          <div className="flex items-center gap-4 mb-3">
            <img
              src={currentApp.icon}
              alt={currentApp.name}
              className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl shadow-xl object-cover border-2 border-white/20"
            />
            <div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {currentApp.name}
              </h2>
              <p className="text-gray-300 text-xs sm:text-sm font-medium line-clamp-1 mt-0.5">
                {currentApp.category} • Par {currentApp.author.name} • v{currentApp.version} ({currentApp.size})
              </p>
            </div>
          </div>

          {/* Tagline / Subtitle */}
          <p className="text-gray-200 text-sm sm:text-base font-normal line-clamp-2 max-w-2xl mb-6">
            {currentApp.tagline}
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-3 flex-wrap">
            {primaryDownload && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const filename = `${currentApp.name}-${primaryDownload.version || currentApp.version}.${primaryDownload.platform === 'apk' ? 'apk' : 'exe'}`;
                  if (onRequestDownload) {
                    onRequestDownload({
                      url: primaryDownload.url,
                      filename,
                      appName: currentApp.name,
                      appIcon: currentApp.icon
                    });
                  } else {
                    triggerDirectDownload(primaryDownload.url, filename);
                  }
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white bg-[#0071e3] hover:bg-[#0077ed] shadow-lg hover:shadow-apple-glow transform hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 cursor-pointer"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>OBTENIR ({primaryDownload.size || currentApp.size})</span>
              </button>
            )}

            <button
              onClick={() => onSelectApp(currentApp)}
              className="flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-sm text-white bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <span>En savoir plus</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide Navigation Controls & Dots (Grouped cleanly at bottom right, never overlaps text) */}
      {featuredApps.length > 1 && (
        <div className="absolute bottom-6 right-6 flex items-center gap-3 z-20">
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            className="p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all duration-200 hover:scale-110 border border-white/10 active:scale-95 shadow-md"
            aria-label="Application précédente"
            title="Précédent"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
            {featuredApps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Aller au slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition-all duration-200 hover:scale-110 border border-white/10 active:scale-95 shadow-md"
            aria-label="Application suivante"
            title="Suivant"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
