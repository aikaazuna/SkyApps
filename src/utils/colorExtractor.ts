import { useState, useEffect } from 'react';

// In-memory cache to prevent re-extracting colors for the same image URL
const colorCache = new Map<string, { r: number; g: number; b: number }>();

/**
 * Extracts the dominant / most vibrant color from an image URL using HTML5 Canvas.
 */
export function extractDominantColor(imageUrl?: string): Promise<{ r: number; g: number; b: number }> {
  return new Promise((resolve) => {
    if (!imageUrl) {
      return resolve({ r: 0, g: 113, b: 227 }); // Fallback Apple Blue #0071e3
    }

    if (colorCache.has(imageUrl)) {
      return resolve(colorCache.get(imageUrl)!);
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return resolve({ r: 0, g: 113, b: 227 });

        const size = 32;
        canvas.width = size;
        canvas.height = size;
        ctx.drawImage(img, 0, 0, size, size);

        const imgData = ctx.getImageData(0, 0, size, size).data;
        let totalR = 0;
        let totalG = 0;
        let totalB = 0;
        let totalWeight = 0;

        for (let i = 0; i < imgData.length; i += 4) {
          const alpha = imgData[i + 3];
          if (alpha < 100) continue; // Ignore transparent pixels

          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];

          // Calculate saturation and brightness
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const brightness = (max + min) / 2;
          const saturation = max === 0 ? 0 : (max - min) / max;

          // Ignore extreme blacks and extreme whites to pick colorful pixels
          if (brightness < 20 || (brightness > 240 && saturation < 0.1)) {
            continue;
          }

          // Prioritize saturated & vibrant colors
          const weight = saturation > 0.25 ? 4 : 1;

          totalR += r * weight;
          totalG += g * weight;
          totalB += b * weight;
          totalWeight += weight;
        }

        if (totalWeight > 0) {
          const dominant = {
            r: Math.round(totalR / totalWeight),
            g: Math.round(totalG / totalWeight),
            b: Math.round(totalB / totalWeight),
          };
          colorCache.set(imageUrl, dominant);
          resolve(dominant);
        } else {
          // Fallback if image is all monochrome/grayscale
          resolve({ r: 0, g: 113, b: 227 });
        }
      } catch {
        resolve({ r: 0, g: 113, b: 227 });
      }
    };

    img.onerror = () => {
      resolve({ r: 0, g: 113, b: 227 });
    };
  });
}

/**
 * React hook to get dominant RGB color of an image.
 */
export function useDominantColor(imageUrl?: string) {
  const [rgb, setRgb] = useState<{ r: number; g: number; b: number }>({ r: 0, g: 113, b: 227 });

  useEffect(() => {
    let isMounted = true;
    extractDominantColor(imageUrl).then((color) => {
      if (isMounted) {
        setRgb(color);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [imageUrl]);

  return rgb;
}
