import { triggerDownloadConfetti } from './confetti';

/**
 * Triggers direct download of APK, EXE, ZIP or file assets
 * without navigating away from the App Store page.
 */
export const triggerDirectDownload = (url: string, filename?: string) => {
  try {
    triggerDownloadConfetti();

    // Create a temporary hidden anchor element to force direct download
    const link = document.createElement('a');
    link.href = url;
    if (filename) {
      link.download = filename;
    } else {
      // Extract filename from URL if possible
      const urlParts = url.split('/');
      const lastPart = urlParts[urlParts.length - 1];
      if (lastPart && (lastPart.endsWith('.apk') || lastPart.endsWith('.exe') || lastPart.endsWith('.zip') || lastPart.endsWith('.xpi'))) {
        link.download = lastPart;
      } else {
        link.setAttribute('download', '');
      }
    }
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Download error:', error);
    // Fallback: window.open
    window.open(url, '_blank');
  }
};
