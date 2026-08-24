import React, { useState, useEffect } from 'react';
import { 
  X, Download, Star, ExternalLink, Share2, 
  Check, Copy, HelpCircle, ShieldCheck, ChevronDown, 
  Sparkles, Smartphone, Monitor, Puzzle, 
  CheckCircle2, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { GithubIcon } from './icons/GithubIcon';
import { AppItem, PlatformType } from '../types/app';
import { triggerDirectDownload } from '../utils/download';
import { PendingDownload } from './DownloadLicenseModal';

interface AppDetailModalProps {
  app: AppItem | null;
  onClose: () => void;
  onOpenGuide: (app: AppItem, platform: PlatformType) => void;
  onRequestDownload?: (info: PendingDownload) => void;
}

export const AppDetailModal: React.FC<AppDetailModalProps> = ({
  app,
  onClose,
  onOpenGuide,
  onRequestDownload
}) => {
  const [selectedScreenshot, setSelectedScreenshot] = useState<number>(0);
  const [copiedSha, setCopiedSha] = useState<string | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);
  const [showDownloadsDropdown, setShowDownloadsDropdown] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isLightboxOpen) {
          setIsLightboxOpen(false);
        } else {
          onClose();
        }
      }
    };
    if (app) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [app, onClose, isLightboxOpen]);

  if (!app) return null;

  const primaryDownload = app.downloads.find(d => d.primary) || app.downloads[0];

  const handleCopySha = (sha: string) => {
    navigator.clipboard.writeText(sha);
    setCopiedSha(sha);
    setTimeout(() => setCopiedSha(null), 2500);
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?app=${app.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${app.name} sur Sky Apps Store`,
          text: app.tagline,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    navigator.clipboard.writeText(shareUrl);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const renderPlatformBadge = (platform: PlatformType) => {
    switch (platform) {
      case 'apk':
        return (
          <span key={platform} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Smartphone className="w-3.5 h-3.5" /> Android APK
          </span>
        );
      case 'exe':
        return (
          <span key={platform} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            <Monitor className="w-3.5 h-3.5" /> Windows .EXE
          </span>
        );
      case 'extension':
        return (
          <span key={platform} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <Puzzle className="w-3.5 h-3.5" /> Extension de navigateur
          </span>
        );
      default:
        return (
          <span key={platform} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" /> {platform.toUpperCase()}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 overflow-y-auto animate-fade-in">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Container (Apple Sheet style) */}
      <div 
        className="relative w-full max-w-4xl bg-[#ffffff] dark:bg-[#1c1c1e] text-gray-900 dark:text-[#f5f5f7] rounded-3xl shadow-2xl overflow-hidden border border-black/10 dark:border-white/15 my-auto z-10 max-h-[90vh] flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-gray-600 dark:text-gray-300 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-2">
            <img
              src={app.icon}
              alt={app.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover shadow-apple-card border border-black/10 dark:border-white/15 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                  {app.name}
                </h1>
                {app.badge && (
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#0071e3]/15 text-[#0071e3] dark:text-[#2997ff]">
                    {app.badge}
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {app.tagline}
              </p>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {app.platforms.map(p => renderPlatformBadge(p))}
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                  {app.category}
                </span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-3 flex-wrap pt-2 pb-4 border-b border-black/5 dark:border-white/10">
            {/* Primary Download with dropdown option */}
            <div className="relative inline-flex rounded-full shadow-md">
              {primaryDownload && (
                <button
                  type="button"
                  onClick={() => {
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
                  className="flex items-center gap-2 px-6 py-2.5 rounded-l-full font-bold text-sm text-white bg-[#0071e3] hover:bg-[#0077ed] transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>{primaryDownload.label}</span>
                </button>
              )}
              {app.downloads.length > 1 ? (
                <button
                  onClick={() => setShowDownloadsDropdown(!showDownloadsDropdown)}
                  className="px-3 py-2.5 rounded-r-full text-white bg-[#0060c2] hover:bg-[#0051a8] border-l border-white/20 transition-colors cursor-pointer"
                  title="Autres versions et miroirs"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${showDownloadsDropdown ? 'rotate-180' : ''}`} />
                </button>
              ) : primaryDownload ? (
                <div className="rounded-r-full bg-[#0071e3] w-2" />
              ) : null}

              {/* Multiple Downloads Dropdown Menu */}
              {showDownloadsDropdown && app.downloads.length > 1 && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-[#2c2c2e] rounded-2xl shadow-2xl border border-black/10 dark:border-white/15 p-2 z-30 animate-fade-in">
                  <div className="text-[11px] font-bold text-gray-400 px-3 py-1 uppercase tracking-wider">
                    Options de téléchargement direct
                  </div>
                  {app.downloads.map(d => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => {
                        setShowDownloadsDropdown(false);
                        const filename = `${app.name}-${d.version || app.version}.${d.platform === 'apk' ? 'apk' : 'exe'}`;
                        if (onRequestDownload) {
                          onRequestDownload({
                            url: d.url,
                            filename,
                            appName: app.name,
                            appIcon: app.icon
                          });
                        } else {
                          triggerDirectDownload(d.url, filename);
                        }
                      }}
                      className="w-full text-left flex items-center justify-between p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-xs cursor-pointer"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 dark:text-white">{d.label}</span>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400">
                          {d.version ? `v${d.version}` : ''} {d.size ? `• ${d.size}` : ''}
                        </span>
                      </div>
                      <Download className="w-3.5 h-3.5 text-[#0071e3]" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Install Guide Button */}
            <button
              onClick={() => onOpenGuide(app, app.platforms[0])}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-emerald-500" />
              <span>Guide d'installation</span>
            </button>

            {/* GitHub Repo Button */}
            {app.githubRepo && (
              <a
                href={app.githubRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200 transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
                <span>Code source</span>
              </a>
            )}

            {/* Website Link */}
            {app.website && (
              <a
                href={app.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Site web</span>
              </a>
            )}

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="p-2.5 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200 transition-colors ml-auto"
              title="Partager l'application"
            >
              {copiedShare ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Metrics Ribbon (Apple style) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-center">
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Note</span>
              <div className="flex items-center gap-1 text-sm font-bold text-gray-900 dark:text-white mt-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{app.rating || '5.0'}</span>
              </div>
            </div>
            <div className="flex flex-col items-center border-l border-black/10 dark:border-white/10">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Version</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white mt-1">v{app.version}</span>
            </div>
            <div className="flex flex-col items-center border-l border-black/10 dark:border-white/10">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Taille</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white mt-1">{app.size}</span>
            </div>
            <div className="flex flex-col items-center border-l border-black/10 dark:border-white/10">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Développeur</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white mt-1 truncate max-w-[120px]">{app.author.name}</span>
            </div>
          </div>

          {/* "What's New" / Changelog Section */}
          {app.changelog && app.changelog.length > 0 && (
            <div className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Nouveautés (Version {app.changelog[0].version})
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {app.changelog[0].date}
                </span>
              </div>
              <ul className="space-y-1.5 pt-2">
                {app.changelog[0].notes.map((note, idx) => (
                  <li key={idx} className="text-xs text-gray-600 dark:text-gray-300 flex items-start gap-2">
                    <span className="text-[#0071e3] font-bold">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Screenshots Gallery */}
          {app.screenshots && app.screenshots.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Aperçu
              </h3>
              {/* Main Active Screenshot */}
              <div 
                className="relative rounded-2xl overflow-hidden shadow-lg border border-black/10 dark:border-white/15 bg-black/20 aspect-video cursor-zoom-in group"
                onClick={() => setIsLightboxOpen(true)}
              >
                <img
                  src={app.screenshots[selectedScreenshot]}
                  alt={`Screenshot ${selectedScreenshot + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                />
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/60 text-white text-xs backdrop-blur-md">
                  Agrandir ({selectedScreenshot + 1} / {app.screenshots.length})
                </div>
              </div>

              {/* Thumbnails */}
              {app.screenshots.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
                  {app.screenshots.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedScreenshot(idx)}
                      className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        selectedScreenshot === idx
                          ? 'border-[#0071e3] scale-105 shadow-md'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={s} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Description & Key Features */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Description
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {app.description}
            </p>

            {app.features && app.features.length > 0 && (
              <div className="pt-2 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Fonctionnalités principales
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {app.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-700 dark:text-gray-300 p-2.5 rounded-xl bg-black/5 dark:bg-white/5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* System Requirements */}
          {app.requirements && Object.keys(app.requirements).length > 0 && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Configuration requise
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {Object.entries(app.requirements).map(([key, val]) => (
                  <div key={key} className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                    <span className="font-semibold text-gray-500 block mb-0.5">{key}</span>
                    <span className="text-gray-900 dark:text-white font-medium">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technical Info & Checksums */}
          <div className="space-y-3 pt-4 border-t border-black/5 dark:border-white/10">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Informations complémentaires
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                <span className="font-medium text-gray-500">Dernière mise à jour</span>
                <span className="font-semibold text-gray-900 dark:text-white">{app.lastUpdated || app.releaseDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                <span className="font-medium text-gray-500">Date de sortie</span>
                <span className="font-semibold text-gray-900 dark:text-white">{app.releaseDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                <span className="font-medium text-gray-500">Licence</span>
                <span className="font-semibold text-gray-900 dark:text-white">Gratuit / Open-Source</span>
              </div>
              <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                <span className="font-medium text-gray-500">Sécurité & Tracking</span>
                <span className="font-semibold text-emerald-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Vérifié & Sans pub
                </span>
              </div>
            </div>

            {/* SHA256 Checksums */}
            {primaryDownload?.sha256 && (
              <div className="mt-4 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">
                    Empreinte SHA-256 (Sécurité du fichier)
                  </span>
                  <code className="text-[11px] font-mono text-gray-800 dark:text-gray-300 truncate block mt-0.5">
                    {primaryDownload.sha256}
                  </code>
                </div>
                <button
                  onClick={() => handleCopySha(primaryDownload.sha256!)}
                  className="p-2 rounded-lg bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200 transition-colors shrink-0"
                  title="Copier le hash SHA-256"
                >
                  {copiedSha === primaryDownload.sha256 ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox for screenshots */}
      {isLightboxOpen && app.screenshots && (
        <div 
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          {app.screenshots.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedScreenshot((prev) => (prev === 0 ? app.screenshots.length - 1 : prev - 1));
                }}
                className="absolute left-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedScreenshot((prev) => (prev + 1) % app.screenshots.length);
                }}
                className="absolute right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <img
            src={app.screenshots[selectedScreenshot]}
            alt={`Screenshot ${selectedScreenshot + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};
