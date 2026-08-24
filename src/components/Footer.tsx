import React from 'react';
import { StoreConfig } from '../types/app';
import { Heart, Shield, Sparkles } from 'lucide-react';
import { GithubIcon } from './icons/GithubIcon';

interface FooterProps {
  config: StoreConfig;
  onOpenSubmitModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ config, onOpenSubmitModal }) => {
  return (
    <footer className="w-full mt-20 border-t border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-xs text-gray-500 dark:text-gray-400 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-black/5 dark:border-white/5">
          <div className="space-y-2 max-w-md">
            <div className="flex items-center gap-2.5">
              <img src="/logo.svg" alt="Sky Apps" className="w-6 h-6 rounded-lg" />
              <span className="font-bold text-sm text-gray-900 dark:text-white tracking-tight">
                {config.storeName}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              {config.storeTagline} Hébergé avec amour, prêt pour Vercel et alimenté directement par GitHub.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={onOpenSubmitModal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 text-gray-700 dark:text-gray-200 font-semibold transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0071e3]" />
              <span>Générateur JSON d'application</span>
            </button>

            {config.githubUserUrl && (
              <a
                href={config.githubUserUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 text-gray-700 dark:text-gray-200 font-semibold transition-colors"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400 dark:text-gray-500">
          <div className="flex items-center gap-2 flex-wrap">
            <span>© {new Date().getFullYear()} {config.authorName}. Tous droits réservés.</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-500" /> Sécurisé &amp; Sans traqueurs
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Fait avec <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" /> pour la communauté
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
