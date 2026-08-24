import React from 'react';
import { Download, Star, Smartphone, Monitor, Puzzle, Sparkles } from 'lucide-react';
import { AppItem, PlatformType } from '../types/app';
import { triggerDirectDownload } from '../utils/download';
import { PendingDownload } from './DownloadLicenseModal';

interface AppListRowProps {
  app: AppItem;
  rank: number;
  onSelectApp: (app: AppItem) => void;
  onRequestDownload?: (info: PendingDownload) => void;
}

export const AppListRow: React.FC<AppListRowProps> = ({ app, rank, onSelectApp, onRequestDownload }) => {
  const primaryDownload = app.downloads.find(d => d.primary) || app.downloads[0];

  const renderPlatformBadge = (platform: PlatformType) => {
    switch (platform) {
      case 'apk':
        return <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5"><Smartphone className="w-2.5 h-2.5" /> APK</span>;
      case 'exe':
        return <span className="text-[10px] text-sky-500 font-bold flex items-center gap-0.5"><Monitor className="w-2.5 h-2.5" /> EXE</span>;
      case 'extension':
        return <span className="text-[10px] text-purple-500 font-bold flex items-center gap-0.5"><Puzzle className="w-2.5 h-2.5" /> EXT</span>;
      default:
        return <span className="text-[10px] text-blue-500 font-bold flex items-center gap-0.5"><Sparkles className="w-2.5 h-2.5" /> WEB</span>;
    }
  };

  return (
    <div
      onClick={() => onSelectApp(app)}
      className="flex items-center justify-between p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200 cursor-pointer group select-none"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Rank Number */}
        <span className="w-5 text-sm font-bold text-gray-400 dark:text-gray-500 font-mono text-center">
          {rank < 10 ? `0${rank}` : rank}
        </span>

        {/* Icon */}
        <div className="relative shrink-0">
          <img
            src={app.icon}
            alt={app.name}
            className="w-12 h-12 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform duration-200 border border-black/5 dark:border-white/10"
          />
        </div>

        {/* Info */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight truncate group-hover:text-[#0071e3] transition-colors">
              {app.name}
            </h4>
            {app.badge && (
              <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-[#0071e3]/15 text-[#0071e3] dark:text-[#2997ff]">
                {app.badge}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            <span>{app.category}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              {app.platforms.map(p => (
                <React.Fragment key={p}>
                  {renderPlatformBadge(p)}
                </React.Fragment>
              ))}
            </div>
            {app.rating && (
              <>
                <span>•</span>
                <span className="flex items-center gap-0.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
                  <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                  {app.rating}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="ml-3 shrink-0">
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
            className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#0071e3] bg-black/5 hover:bg-[#0071e3] hover:text-white dark:bg-white/10 dark:text-white dark:hover:bg-[#0071e3] transition-all duration-200 flex items-center gap-1 cursor-pointer"
          >
            <Download className="w-3 h-3 stroke-[2.5]" />
            <span>OBTENIR</span>
          </button>
        )}
      </div>
    </div>
  );
};
