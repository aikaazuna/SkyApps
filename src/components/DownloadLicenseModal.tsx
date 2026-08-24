import React, { useState, useEffect } from 'react';
import { ShieldCheck, Download, X, Scale, CheckCircle2, AlertTriangle, FileCode } from 'lucide-react';
import { triggerDownloadConfetti } from '../utils/confetti';

export interface PendingDownload {
  url: string;
  filename?: string;
  appName: string;
  appIcon?: string;
}

interface DownloadLicenseModalProps {
  pendingDownload: PendingDownload | null;
  onClose: () => void;
}

const STORAGE_KEY = 'sky_apps_skip_license_warning';

export const DownloadLicenseModal: React.FC<DownloadLicenseModalProps> = ({
  pendingDownload,
  onClose
}) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (pendingDownload) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pendingDownload, onClose]);

  if (!pendingDownload) return null;

  const handleProceed = () => {
    if (dontShowAgain) {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
    
    // Trigger download
    try {
      triggerDownloadConfetti();
      const link = document.createElement('a');
      link.href = pendingDownload.url;
      if (pendingDownload.filename) {
        link.download = pendingDownload.filename;
      } else {
        link.setAttribute('download', '');
      }
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      window.open(pendingDownload.url, '_blank');
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div 
        className="relative w-full max-w-xl bg-white dark:bg-[#1c1c1e] text-gray-900 dark:text-[#f5f5f7] rounded-3xl shadow-2xl overflow-hidden border border-black/10 dark:border-white/15 my-auto z-10 p-6 sm:p-8 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-gray-600 dark:text-gray-300 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with App Icon & License Icon */}
        <div className="flex items-center gap-4 mb-5">
          {pendingDownload.appIcon ? (
            <img 
              src={pendingDownload.appIcon} 
              alt={pendingDownload.appName} 
              className="w-14 h-14 rounded-2xl object-cover shadow-apple-card border border-black/10 dark:border-white/10 shrink-0" 
            />
          ) : (
            <div className="p-3.5 rounded-2xl bg-[#0071e3]/10 text-[#0071e3] dark:bg-[#0071e3]/20 dark:text-[#2997ff] shrink-0">
              <Scale className="w-6 h-6" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Licence Libre MIT
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white mt-1">
              Télécharger {pendingDownload.appName}
            </h2>
          </div>
        </div>

        {/* What is MIT License info box */}
        <div className="space-y-4 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
          <p>
            Cette application est distribuée sous la <strong>Licence Open-Source MIT</strong>. C'est l'une des licences libres les plus permissives et respectueuses au monde :
          </p>

          <div className="space-y-2.5 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong>100% Libre &amp; Gratuite :</strong> Vous pouvez utiliser, étudier, modifier et redistribuer cette application gratuitement, sans aucune restriction d'usage.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#0071e3] shrink-0 mt-0.5" />
              <div>
                <strong>Respect de votre vie privée :</strong> Sans publicité intrusive, sans spyware et sans traçage commercial.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong>Clause « En l'état » (As-Is) :</strong> Le logiciel est fourni sans garantie d'aucune sorte. L'auteur ne peut être tenu responsable en cas d'éventuel dysfonctionnement.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400 pt-1">
            <FileCode className="w-3.5 h-3.5" />
            <span>Fichier ciblé : <code className="font-mono font-semibold text-gray-700 dark:text-gray-200">{pendingDownload.filename || 'Application'}</code></span>
          </div>
        </div>

        {/* Checkbox "Don't show again" */}
        <div className="mt-5 pt-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between flex-wrap gap-3">
          <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="rounded text-[#0071e3] focus:ring-[#0071e3] w-4 h-4 cursor-pointer"
            />
            <span>Ne plus afficher cet avertissement</span>
          </label>

          {/* Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleProceed}
              className="flex items-center gap-1.5 px-6 py-2 rounded-full text-xs font-bold text-white bg-[#0071e3] hover:bg-[#0077ed] transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Accepter &amp; Télécharger</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
