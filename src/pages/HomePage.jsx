import { useState, useEffect } from 'react';
import { socket } from '../App';
import AnimatedBackground from '../components/AnimatedBackground';
import GameModeSelector from '../components/GameModeSelector';
import useBackgroundMusic from '../hooks/useBackgroundMusic';
import '../css/HomePage.css';

function HomePage() {
  const [playerName, setPlayerName] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [showGameModes, setShowGameModes] = useState(false);
  const [animateTitle, setAnimateTitle] = useState(false);

  // Simple background music - add your music file to public/audio/
  useBackgroundMusic('/audio/main-menu-theme.mp3', 0.3);

  useEffect(() => {
    setAnimateTitle(true);
    
    // Check if there's a room ID in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('room');
    if (roomId) {
      // Auto-show game modes if there's a room to join
      console.log('Room ID found in URL:', roomId);
      // You can store this for auto-joining later
    }
    
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server:', socket.id);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  const handleStartGame = () => {
    if (playerName.trim()) {
      setShowGameModes(true);
    }
  };

  const handleBackToHome = () => {
    setShowGameModes(false);
    setPlayerName('');
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    handleStartGame();
  };

  return (
    <div className="home-page">
      <AnimatedBackground />
      
      <div className="home-content">
        <header className="game-header">
          <h1 className={`game-title ${animateTitle ? 'animate' : ''}`}>
            <span className="title-battle">BATTLE</span>
            <span className="title-ships">SHIPS</span>
          </h1>
          <div className="connection-status">
            <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}></div>
            <span>{isConnected ? 'Connected' : 'Connecting...'}</span>
          </div>
        </header>

        <main className="main-content">
          {!showGameModes ? (
            <div className="welcome-section">
              <div className="welcome-card">
                <h2>Welcome Admiral!</h2>
                <p>Prepare for naval combat in the ultimate battleship experience</p>
                
                <form onSubmit={handleNameSubmit} className="player-form">
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Enter your captain name"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      className="player-input"
                      maxLength={20}
                      required
                    />
                    <button 
                      type="submit" 
                      className="start-button"
                      disabled={!playerName.trim() || !isConnected}
                    >
                      <span>Set Sail</span>
                      <div className="button-wave"></div>
                    </button>
                  </div>
                </form>

                <div className="game-features">
                  <div className="feature">
                    <div className="feature-icon">⚓</div>
                    <span>Real-time Multiplayer</span>
                  </div>
                  <div className="feature">
                    <div className="feature-icon">🎯</div>
                    <span>Strategic Combat</span>
                  </div>
                  <div className="feature">
                    <div className="feature-icon">🏆</div>
                    <span>Competitive Rankings</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <GameModeSelector playerName={playerName} onBack={handleBackToHome} />
          )}
        </main>
      </div>
    </div>
  );
}

export default HomePage;
