import { useEffect, useRef } from 'react';

// Simple background music hook - like normal games
const useBackgroundMusic = (musicFile, volume = 0.3) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (musicFile) {
      // Create audio element
      audioRef.current = new Audio(musicFile);
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
      
      // Try to play (will only work after user interaction)
      const playAudio = () => {
        audioRef.current?.play().catch(error => {
          console.log('Background music will start after user interaction');
        });
      };

      // Auto-play after user clicks anywhere
      const handleUserInteraction = () => {
        playAudio();
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('keydown', handleUserInteraction);
      };

      document.addEventListener('click', handleUserInteraction);
      document.addEventListener('keydown', handleUserInteraction);

      return () => {
        // Cleanup
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('keydown', handleUserInteraction);
      };
    }
  }, [musicFile, volume]);

  return audioRef.current;
};

export default useBackgroundMusic;
