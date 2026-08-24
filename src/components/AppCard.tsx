import React from 'react';
import { Download, Star, Smartphone, Monitor, Puzzle, Sparkles, HelpCircle } from 'lucide-react';
import { AppItem, PlatformType } from '../types/app';
import { triggerDirectDownload } from '../utils/download';
import { PendingDownload } from './DownloadLicenseModal';

interface AppCardProps {
  app: AppItem;
  onSelectApp: (app: AppItem) => void;
  onOpenGuide?: (app: AppItem, platform: PlatformType) => void;
  onRequestDownload?: (info: PendingDownload) => void;
}

export const AppCard: React.FC<AppCardProps> = ({ app, onSelectApp, onOpenGuide, onRequestDownload }) => {
  const primaryDownload = app.downloads.find(d => d.primary) || app.downloads[0];

  const renderPlatformIcon = (platform: PlatformType) => {
    switch (platform) {
      case 'apk':
        return <Smartphone className="w-3.5 h-3.5 text-emerald-500" />;
      case 'exe':
        return <Monitor className="w-3.5 h-3.5 text-sky-500" />;
      case 'extension':
        return <Puzzle className="w-3.5 h-3.5 text-purple-500" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-blue-500" />;
    }
  };

  const getPlatformLabel = (platform: PlatformType) => {
    switch (platform) {
      case 'apk':
        return 'APK';
      case 'exe':
        return 'EXE';
      case 'extension':
        return 'EXT';
      default:
        return platform.toUpperCase();
    }
  };

  return (
    <div
      onClick={() => onSelectApp(app)}
      className="apple-glass-card shimmer-effect rounded-3xl p-5 flex flex-col justify-between cursor-pointer group select-none relative overflow-hidden transition-all duration-300 hover:shadow-apple-card-hover"
    >
      {/* Top Badge (if any) */}
      {app.badge && (
        <div className="absolute top-3.5 right-3.5 z-10">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0071e3]/10 text-[#0071e3] dark:bg-[#0071e3]/20 dark:text-[#2997ff] border border-[#0071e3]/20 shadow-sm transition-transform group-hover:scale-105">
            {app.badge}
          </span>
        </div>
      )}

      {/* Header with App Icon & Title */}
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <img
            src={app.icon}
            alt={app.name}
            className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover shadow-apple-card group-hover:scale-105 transition-transform duration-300 border border-black/5 dark:border-white/10"
            loading="lazy"
          />
        </div>

        <div className="flex-1 min-w-0 pr-8">
          <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight truncate group-hover:text-[#0071e3] transition-colors">
            {app.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate mt-0.5">
            {app.category}
          </p>

          {/* Ratings & Platforms */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {app.rating && (
              <div className="flex items-center gap-1 text-xs font-semibold text-gray-700 dark:text-gray-300">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>{app.rating}</span>
              </div>
            )}
            <span className="text-gray-300 dark:text-gray-700">•</span>
            <div className="flex items-center gap-1.5">
              {app.platforms.map(p => (
                <span
                  key={p}
                  className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-gray-600 dark:text-gray-300"
                >
                  {renderPlatformIcon(p)}
                  {getPlatformLabel(p)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Description / Tagline */}
      <p className="text-xs text-gray-600 dark:text-gray-400 font-normal line-clamp-2 my-4 leading-relaxed">
        {app.tagline}
      </p>

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-black/5 dark:border-white/5 mt-auto">
        <div className="text-[11px] text-gray-500 dark:text-gray-400">
          <span>v{app.version}</span>
          <span className="mx-1">•</span>
          <span>{app.size}</span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenGuide && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenGuide(app, app.platforms[0]);
              }}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title="Guide d'installation"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
          )}

          {primaryDownload && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const filename = `${app.name}-${primaryDownload.version || app.version}.${primaryDownload.platform === 'apk' ? 'apk' : 'exe'}`;
                if (onRequestDownload) {
                  onRequestDownload({
                    url: primaryDownload.url,
                    filename,
                    appName: app.name,
                    appIcon: app.icon
                  });
                } else {
                  triggerDirectDownload(primaryDownload.url, filename);
                }
              }}
              className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#0071e3] bg-[#0071e3]/10 hover:bg-[#0071e3] hover:text-white dark:bg-white/10 dark:text-white dark:hover:bg-[#0071e3] transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3 h-3 stroke-[2.5]" />
              <span>OBTENIR</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
