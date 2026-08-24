import confetti from 'canvas-confetti';

export const triggerDownloadConfetti = () => {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#0071e3', '#34c759', '#ff9500', '#5856d6', '#af52de', '#5ac8fa'],
      disableForReducedMotion: true
    });
  } catch {
    // Graceful fallback if confetti fails or is disabled
  }
};
