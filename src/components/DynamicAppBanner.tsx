import React from 'react';
import { AppItem } from '../types/app';
import { useDominantColor } from '../utils/colorExtractor';

interface DynamicAppBannerProps {
  app: AppItem;
  className?: string;
}

export const DynamicAppBanner: React.FC<DynamicAppBannerProps> = ({ app, className = '' }) => {
  const { r, g, b } = useDominantColor(app.icon);

  if (app.banner) {
    return (
      <div className={`relative w-full h-full overflow-hidden bg-gray-900 ${className}`}>
        <img
          src={app.banner}
          alt={app.name}
          className="w-full h-full object-cover object-center filter brightness-75 scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out"
        />
        {/* Gradients overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>
    );
  }

  // Generative Dynamic Gradient matching dominant icon color + theme
  const primaryColor = `rgb(${r}, ${g}, ${b})`;
  const primaryColorTranslucent = `rgba(${r}, ${g}, ${b}, 0.25)`;
  const primaryColorSubtle = `rgba(${r}, ${g}, ${b}, 0.12)`;

  return (
    <div 
      className={`relative w-full h-full overflow-hidden transition-colors duration-500 bg-[#f5f5f7] dark:bg-[#0a0a0c] ${className}`}
      style={{
        background: `
          radial-gradient(ellipse 80% 80% at 75% 25%, ${primaryColorTranslucent} 0%, transparent 60%),
          radial-gradient(ellipse 60% 60% at 20% 80%, ${primaryColorSubtle} 0%, transparent 60%)
        `
      }}
    >
      {/* Background Grid Pattern Overlay */}
      <div className="absolute inset-0 apple-bg-grid opacity-50" />

      {/* Floating large ambient luminous glow orb */}
      <div 
        className="absolute top-1/4 right-1/6 w-80 h-80 sm:w-96 sm:h-96 rounded-full blur-[100px] pointer-events-none transform -translate-y-1/4 translate-x-1/4 transition-all duration-700 opacity-60 dark:opacity-40"
        style={{
          background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`
        }}
      />

      {/* Large Watermark of the app icon in the background */}
      <div className="absolute -right-10 -bottom-10 sm:right-6 sm:bottom-6 w-56 h-56 sm:w-72 sm:h-72 opacity-15 dark:opacity-20 pointer-events-none transform rotate-12 filter blur-[2px] transition-transform duration-700 group-hover:scale-105 group-hover:rotate-6">
        <img
          src={app.icon}
          alt=""
          className="w-full h-full object-cover rounded-[48px] shadow-2xl"
        />
      </div>

      {/* Gradient vignette for contrast with foreground text */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent dark:from-black/90 dark:via-black/50" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent dark:from-black/80 dark:via-black/40" />
    </div>
  );
};
