import { useState } from 'react';
import { socket } from '../App';
import '../css/RoomManager.css';

function RoomManager({ playerName, onBack }) {
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'join'
  const [roomId, setRoomId] = useState('');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  const [createdRoom, setCreatedRoom] = useState(null);
  const [error, setError] = useState('');

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateRoom = () => {
    setIsCreatingRoom(true);
    setError('');
    
    const newRoomId = generateRoomId();
    
    // Emit socket event to create room
    socket.emit('create-room', {
      roomId: newRoomId,
      playerName: playerName,
      playerId: socket.id
    });

    // Listen for room creation response
    socket.on('room-created', (data) => {
      setCreatedRoom(data);
      setIsCreatingRoom(false);
    });

    socket.on('room-creation-error', (errorMsg) => {
      setError(errorMsg);
      setIsCreatingRoom(false);
    });
  };

  const handleJoinRoom = () => {
    if (!roomId.trim()) {
      setError('Please enter a room ID');
      return;
    }

    setIsJoiningRoom(true);
    setError('');

    // Emit socket event to join room
    socket.emit('join-room', {
      roomId: roomId.toUpperCase(),
      playerName: playerName,
      playerId: socket.id
    });

    // Listen for join response
    socket.on('room-joined', (data) => {
      console.log('Joined room:', data);
      setIsJoiningRoom(false);
      // Navigate to game (you'll implement this)
    });

    socket.on('join-room-error', (errorMsg) => {
      setError(errorMsg);
      setIsJoiningRoom(false);
    });
  };

  const copyRoomLink = () => {
    const link = `${window.location.origin}?room=${createdRoom.roomId}`;
    navigator.clipboard.writeText(link).then(() => {
      alert('Room link copied to clipboard!');
    });
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(createdRoom.roomId).then(() => {
      alert('Room ID copied to clipboard!');
    });
  };

  return (
    <div className="room-manager">
      <div className="room-header">
        <h2>Multiplayer Battle</h2>
        <p>Create a room or join an existing battle</p>
      </div>

      <div className="tab-selector">
        <button 
          className={`tab-button ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          🎯 Create Room
        </button>
        <button 
          className={`tab-button ${activeTab === 'join' ? 'active' : ''}`}
          onClick={() => setActiveTab('join')}
        >
          🚢 Join Room
        </button>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {activeTab === 'create' && (
        <div className="create-room-section">
          {!createdRoom ? (
            <div className="create-room-content">
              <div className="create-room-info">
                <div className="info-icon">🏴‍☠️</div>
                <h3>Create Your Battle Room</h3>
                <p>Generate a unique room for your naval battle. Share the room ID or link with your opponent to start the game.</p>
              </div>
              
              <button 
                className="create-room-button"
                onClick={handleCreateRoom}
                disabled={isCreatingRoom}
              >
                {isCreatingRoom ? (
                  <>
                    <div className="button-spinner"></div>
                    Creating Room...
                  </>
                ) : (
                  <>
                    <span className="button-icon">⚓</span>
                    Create Battle Room
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="room-created-content">
              <div className="success-message">
                <span className="success-icon">✅</span>
                Room Created Successfully!
              </div>
              
              <div className="room-details">
                <h3>Your Battle Room</h3>
                <div className="room-id-display">
                  <span className="room-id-label">Room ID:</span>
                  <span className="room-id-value">{createdRoom.roomId}</span>
                  <button className="copy-button" onClick={copyRoomId}>📋</button>
                </div>
                
                <div className="sharing-options">
                  <button className="share-button" onClick={copyRoomLink}>
                    🔗 Copy Room Link
                  </button>
                  <button className="share-button" onClick={copyRoomId}>
                    📋 Copy Room ID
                  </button>
                </div>
                
                <div className="waiting-status">
                  <div className="waiting-animation">
                    <div className="waiting-dot"></div>
                    <div className="waiting-dot"></div>
                    <div className="waiting-dot"></div>
                  </div>
                  <p>Waiting for opponent to join...</p>
                  <small>Share the room ID or link with your opponent</small>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'join' && (
        <div className="join-room-section">
          <div className="join-room-content">
            <div className="join-room-info">
              <div className="info-icon">🎯</div>
              <h3>Join a Battle Room</h3>
              <p>Enter the room ID provided by your opponent to join their naval battle.</p>
            </div>
            
            <div className="join-room-form">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Enter Room ID (e.g. ABC123)"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                  className="room-id-input"
                  maxLength={6}
                />
                <button 
                  className="join-room-button"
                  onClick={handleJoinRoom}
                  disabled={!roomId.trim() || isJoiningRoom}
                >
                  {isJoiningRoom ? (
                    <>
                      <div className="button-spinner"></div>
                      Joining...
                    </>
                  ) : (
                    <>
                      <span className="button-icon">🚢</span>
                      Join Battle
                    </>
                  )}
                </button>
              </div>
              
              <div className="join-tips">
                <h4>Tips:</h4>
                <ul>
                  <li>Room IDs are 6 characters long (e.g., ABC123)</li>
                  <li>Case doesn't matter</li>
                  <li>Ask your opponent for their room ID</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <button 
        className="back-button"
        onClick={onBack}
        disabled={isCreatingRoom || isJoiningRoom}
      >
        ← Back to Menu
      </button>
    </div>
  );
}

export default RoomManager;
