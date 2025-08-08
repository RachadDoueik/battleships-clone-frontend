import { useState, useEffect, useRef } from 'react';
import '../css/MusicPlayer.css';

function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [showControls, setShowControls] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Add your own music files to public/audio/ folder
  // For demo purposes, these are placeholder - replace with your actual audio files
  const tracks = [
    {
      name: "Ocean Ambient",
      url: "/audio/ocean-ambient.mp3", // Add this file to public/audio/
      description: "Peaceful ocean waves"
    },
    {
      name: "Naval Battle",
      url: "/audio/naval-theme.mp3", // Add this file to public/audio/
      description: "Epic naval battle music"
    },
    {
      name: "Silent Mode",
      url: "", // Fallback for no audio
      description: "No background music"
    }
  ];

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
      audio.loop = true;
      
      const handleCanPlay = () => setIsLoaded(true);
      const handleError = () => {
        console.log('Audio failed to load, using fallback');
        setIsLoaded(false);
      };

      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('error', handleError);

      return () => {
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('error', handleError);
      };
    }
  }, [volume, currentTrack]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        // Most browsers require user interaction before playing audio
        audio.play().catch(error => {
          console.log('Audio playback failed:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const switchTrack = (index) => {
    const audio = audioRef.current;
    const wasPlaying = isPlaying;
    
    if (audio && wasPlaying) {
      audio.pause();
    }
    
    setCurrentTrack(index);
    setIsPlaying(false);
    
    // Auto-play new track if previous was playing
    setTimeout(() => {
      if (wasPlaying && audioRef.current) {
        audioRef.current.play().catch(console.log);
        setIsPlaying(true);
      }
    }, 100);
  };

  return (
    <div className="music-player">
      <audio
        ref={audioRef}
        src={tracks[currentTrack]?.url}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
      
      <div 
        className="music-toggle"
        onClick={() => setShowControls(!showControls)}
        title="Music Controls"
      >
        <div className={`music-icon ${isPlaying ? 'playing' : ''}`}>
          🎵
        </div>
        <div className="music-waves">
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
        </div>
      </div>

      {showControls && (
        <div className="music-controls">
          <div className="controls-header">
            <h4>Ambient Music</h4>
            <button 
              className="close-controls"
              onClick={() => setShowControls(false)}
            >
              ×
            </button>
          </div>

          <div className="track-info">
            <span className="track-name">{tracks[currentTrack]?.name}</span>
            <span className="track-description">{tracks[currentTrack]?.description}</span>
          </div>

          <div className="control-buttons">
            <button 
              className="play-button"
              onClick={togglePlay}
              disabled={!isLoaded}
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            
            <div className="volume-control">
              <span className="volume-icon">🔊</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
            </div>
          </div>

          <div className="track-selector">
            <span className="selector-label">Track:</span>
            <div className="track-buttons">
              {tracks.map((track, index) => (
                <button
                  key={index}
                  className={`track-button ${currentTrack === index ? 'active' : ''}`}
                  onClick={() => switchTrack(index)}
                >
                  {track.name}
                </button>
              ))}
            </div>
          </div>

          <div className="music-disclaimer">
            <small>🎧 Best experienced with headphones</small>
          </div>
        </div>
      )}
    </div>
  );
}

export default MusicPlayer;
