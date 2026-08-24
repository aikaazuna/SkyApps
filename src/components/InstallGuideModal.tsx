import React, { useState } from 'react';
import { X, Smartphone, Monitor, Puzzle, CheckCircle, ShieldAlert, AlertTriangle } from 'lucide-react';
import { AppItem, PlatformType } from '../types/app';

interface InstallGuideModalProps {
  app: AppItem | null;
  initialPlatform?: PlatformType;
  onClose: () => void;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({
  app,
  initialPlatform = 'apk',
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<PlatformType>(initialPlatform);

  if (!app) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-[#1c1c1e] text-gray-900 dark:text-[#f5f5f7] rounded-3xl shadow-2xl overflow-hidden border border-black/10 dark:border-white/15 my-auto z-10 p-6 sm:p-8 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-gray-600 dark:text-gray-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-[#0071e3]/10 text-[#0071e3] dark:bg-[#0071e3]/20 dark:text-[#2997ff]">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Guide d'installation
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Comment installer facilement {app.name} sur votre appareil
            </p>
          </div>
        </div>

        {/* Platform Selection Tabs */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 mb-6">
          <button
            onClick={() => setActiveTab('apk')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'apk'
                ? 'bg-[#0071e3] text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Android (APK)</span>
          </button>
          <button
            onClick={() => setActiveTab('exe')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'exe'
                ? 'bg-[#0071e3] text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Windows (.EXE)</span>
          </button>
          <button
            onClick={() => setActiveTab('extension')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'extension'
                ? 'bg-[#0071e3] text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <Puzzle className="w-4 h-4" />
            <span>Extension</span>
          </button>
        </div>

        {/* Steps Content */}
        {activeTab === 'apk' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <strong>Sécurité garantie :</strong> Les fichiers APK sont compilés directement depuis le code source GitHub sans injecteur ni publicité.
              </div>
            </div>

            <ol className="space-y-3 text-xs text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-3 p-3 rounded-2xl bg-black/5 dark:bg-white/5">
                <span className="w-6 h-6 rounded-full bg-[#0071e3] text-white font-bold flex items-center justify-center shrink-0">1</span>
                <div>
                  <strong>Téléchargez le fichier .apk :</strong> Cliquez sur le bouton "OBTENIR" pour télécharger l'APK sur votre smartphone.
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-2xl bg-black/5 dark:bg-white/5">
                <span className="w-6 h-6 rounded-full bg-[#0071e3] text-white font-bold flex items-center justify-center shrink-0">2</span>
                <div>
                  <strong>Autorisez l'installation :</strong> Si Android affiche un message "Fichier potentiellement dangereux" ou "Sources inconnues", allez dans <em>Paramètres &gt; Sécurité &gt; Installer des applications inconnues</em> et autorisez votre navigateur / gestionnaire de fichiers.
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-2xl bg-black/5 dark:bg-white/5">
                <span className="w-6 h-6 rounded-full bg-[#0071e3] text-white font-bold flex items-center justify-center shrink-0">3</span>
                <div>
                  <strong>Ouvrez et profitez :</strong> Appuyez sur la notification de fin de téléchargement, appuyez sur "Installer", puis lancez l'application !
                </div>
              </li>
            </ol>
          </div>
        )}

        {activeTab === 'exe' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <strong>Avertissement Windows SmartScreen :</strong> Comme les exécutables indépendants ne possèdent pas de certificat payant Microsoft (EV Code Signing), Windows peut afficher une alerte bleue de sécurité au premier lancement.
              </div>
            </div>

            <ol className="space-y-3 text-xs text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-3 p-3 rounded-2xl bg-black/5 dark:bg-white/5">
                <span className="w-6 h-6 rounded-full bg-[#0071e3] text-white font-bold flex items-center justify-center shrink-0">1</span>
                <div>
                  <strong>Téléchargez l'application :</strong> Choisissez la version Installateur (.exe) ou Portable (.zip).
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-2xl bg-black/5 dark:bg-white/5">
                <span className="w-6 h-6 rounded-full bg-[#0071e3] text-white font-bold flex items-center justify-center shrink-0">2</span>
                <div>
                  <strong>Débloquez le lancement :</strong> Si la fenêtre "Windows a protégé votre ordinateur" s'affiche, cliquez sur le lien discret <u>Informations complémentaires</u>, puis sur le bouton <strong>Exécuter quand même</strong>.
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-2xl bg-black/5 dark:bg-white/5">
                <span className="w-6 h-6 rounded-full bg-[#0071e3] text-white font-bold flex items-center justify-center shrink-0">3</span>
                <div>
                  <strong>Lancement :</strong> L'application se lance immédiatement. Vous pouvez vérifier le hash SHA-256 dans les détails si vous souhaitez comparer l'intégrité.
                </div>
              </li>
            </ol>
          </div>
        )}

        {activeTab === 'extension' && (
          <div className="space-y-4">
            <ol className="space-y-3 text-xs text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-3 p-3 rounded-2xl bg-black/5 dark:bg-white/5">
                <span className="w-6 h-6 rounded-full bg-[#0071e3] text-white font-bold flex items-center justify-center shrink-0">1</span>
                <div>
                  <strong>Téléchargez &amp; Décompressez :</strong> Téléchargez l'archive <code>.zip</code> de l'extension et extrayez le dossier sur votre disque dur.
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-2xl bg-black/5 dark:bg-white/5">
                <span className="w-6 h-6 rounded-full bg-[#0071e3] text-white font-bold flex items-center justify-center shrink-0">2</span>
                <div>
                  <strong>Ouvrez la page des extensions :</strong>
                  <div className="mt-1 font-mono text-[11px] bg-black/10 dark:bg-white/10 p-2 rounded-lg">
                    chrome://extensions &nbsp;(Chrome/Edge/Brave) ou about:debugging &nbsp;(Firefox)
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3 p-3 rounded-2xl bg-black/5 dark:bg-white/5">
                <span className="w-6 h-6 rounded-full bg-[#0071e3] text-white font-bold flex items-center justify-center shrink-0">3</span>
                <div>
                  <strong>Activez le Mode développeur :</strong> Cochez l'interrupteur en haut à droite "Mode développeur", puis cliquez sur <strong>"Charger l'extension non empaquetée"</strong> et sélectionnez le dossier extrait.
                </div>
              </li>
            </ol>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-black/5 dark:border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-[#0071e3] hover:bg-[#0077ed] transition-colors"
          >
            J'ai compris
          </button>
        </div>
      </div>
    </div>
  );
};
