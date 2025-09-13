/**
 * Sound notification utility for playing notification sounds
 */

let audioInstance: HTMLAudioElement | null = null;

/**
 * Play notification sound using sound.mp3
 * @param volume - Volume level (0.0 to 1.0), defaults to 0.3
 */
export const playNotificationSound = (volume: number = 0.3): void => {
  try {
    // Check if audio is supported
    if (!isAudioSupported()) {
      return;
    }

    // Check if user has granted audio permission
    if (typeof document !== 'undefined' && document.hidden) {
      return; // Don't play sound if tab is not active
    }

    // Use preloaded instance if available, otherwise create new one
    let audio: HTMLAudioElement;
    
    if (audioInstance && audioInstance.readyState >= 2) {
      // Use preloaded instance for faster playback
      audio = audioInstance.cloneNode() as HTMLAudioElement;
    } else {
      // Create new audio instance
      audio = new Audio('/sound.mp3');
      audio.preload = 'auto';
      audio.crossOrigin = 'anonymous';
    }
    
    audio.volume = Math.max(0, Math.min(1, volume));
    
    // Play immediately with error handling
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        // Silently handle audio play errors (user interaction required, etc.)
        console.debug('Notification sound play failed:', error);
      });
    }
    
  } catch (error) {
    console.debug('Could not play notification sound:', error);
  }
};

/**
 * Preload the notification sound for better performance
 */
export const preloadNotificationSound = (): void => {
  try {
    if (!audioInstance && isAudioSupported()) {
      audioInstance = new Audio('/sound.mp3');
      audioInstance.preload = 'auto';
      audioInstance.volume = 0.3;
      audioInstance.crossOrigin = 'anonymous';
      
      // Load the audio immediately
      audioInstance.load();
    }
  } catch (error) {
    console.debug('Could not preload notification sound:', error);
  }
};

/**
 * Check if audio is supported in the current environment
 */
export const isAudioSupported = (): boolean => {
  try {
    return typeof Audio !== 'undefined' && Audio.prototype.play !== undefined;
  } catch {
    return false;
  }
};
