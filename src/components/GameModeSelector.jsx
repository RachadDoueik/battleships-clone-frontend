import { useState } from 'react';
import RoomManager from './RoomManager';
import '../css/GameModeSelector.css';

function GameModeSelector({ playerName, onBack }) {
  const [selectedMode, setSelectedMode] = useState(null);
  const [showRoomManager, setShowRoomManager] = useState(false);

  const gameModes = [
    {
      id: 'multiplayer',
      title: 'Multiplayer Battle',
      description: 'Create or join a room to battle other players',
      icon: '⚔️',
      difficulty: 'Player vs Player',
      time: '~15 min'
    },
    {
      id: 'ai',
      title: 'VS Computer',
      description: 'Practice against AI opponents',
      icon: '🤖',
      difficulty: 'Adjustable',
      time: '~8 min'
    }
  ];

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
    
    if (mode.id === 'multiplayer') {
      setShowRoomManager(true);
    } else if (mode.id === 'ai') {
      // Handle AI game start
      console.log(`Starting AI game as ${playerName}`);
      // You can add AI game logic here
    }
  };

  const handleBackFromRoom = () => {
    setShowRoomManager(false);
    setSelectedMode(null);
  };

  if (showRoomManager) {
    return <RoomManager playerName={playerName} onBack={handleBackFromRoom} />;
  }

  return (
    <div className="game-mode-selector">
      <div className="selector-header">
        <h2>Choose Your Battle, <span className="player-name">{playerName}</span></h2>
        <p>Select a game mode to begin your naval conquest</p>
      </div>

      <div className="game-modes-grid">
        {gameModes.map((mode) => (
          <div
            key={mode.id}
            className={`game-mode-card ${selectedMode?.id === mode.id ? 'selected' : ''}`}
            onClick={() => handleModeSelect(mode)}
          >
            <div className="mode-icon">{mode.icon}</div>
            <div className="mode-content">
              <h3>{mode.title}</h3>
              <p>{mode.description}</p>
              <div className="mode-details">
                <span className="difficulty">
                  <span className="label">Type:</span>
                  {mode.difficulty}
                </span>
                <span className="time">
                  <span className="label">Time:</span>
                  {mode.time}
                </span>
              </div>
            </div>
            
            <div className="card-glow"></div>
          </div>
        ))}
      </div>

      <button 
        className="back-button"
        onClick={onBack}
      >
        ← Change Name
      </button>
    </div>
  );
}

export default GameModeSelector;
