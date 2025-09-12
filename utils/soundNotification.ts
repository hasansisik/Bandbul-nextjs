/**
 * Sound notification utility for playing notification sounds
 */

let audioInstance: HTMLAudioElement | null = null;

/**
 * Play notification sound using sound.mp3
 * @param volume - Volume level (0.0 to 1.0), defaults to 0.5
 */
export const playNotificationSound = (volume: number = 0.5): void => {
  try {
    console.log('Attempting to play notification sound...');
    
    // Check if audio is supported
    if (!isAudioSupported()) {
      console.log('Audio not supported in this environment');
      return;
    }

    // Create new audio instance for each play to avoid conflicts
    const audio = new Audio('/sound.mp3');
    audio.volume = Math.max(0, Math.min(1, volume));
    
    // Play immediately
    audio.play().then(() => {
      console.log('Notification sound played successfully');
    }).catch((error) => {
      console.log('Could not play notification sound:', error);
    });
    
  } catch (error) {
    console.log('Could not play notification sound:', error);
  }
};

/**
 * Preload the notification sound for better performance
 */
export const preloadNotificationSound = (): void => {
  try {
    if (!audioInstance) {
      audioInstance = new Audio('/sound.mp3');
      audioInstance.preload = 'auto';
      audioInstance.volume = 0.5;
    }
  } catch (error) {
    console.log('Could not preload notification sound:', error);
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
