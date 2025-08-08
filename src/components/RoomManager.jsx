import { useState, useEffect } from 'react';
import { socket } from '../App';
import '../css/RoomManager.css';

function RoomManager({ playerName, onBack }) {
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'join'
  const [roomId, setRoomId] = useState('');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  const [createdRoom, setCreatedRoom] = useState(null);
  const [error, setError] = useState('');
  const [joinedPlayer, setJoinedPlayer] = useState(null);
  const [success, setSuccess] = useState('');

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  // Socket event listeners
  useEffect(() => {
    // Listen for player-joined event when someone joins your created room
    socket.on('player-joined', (data) => {
      console.log('🎉 Player joined room - Full data:', data);
      
      // Handle different possible data structures from backend
      let joiningPlayer = null;
      
      if (data.player) {
        // If backend sends { player: { name, id, etc } }
        joiningPlayer = data.player;
      } else if (data.room && data.room.players && data.room.players.length >= 2) {
        // If backend sends { room: { players: [...] } }
        // Find the player who is not the host (most recent joiner)
        joiningPlayer = data.room.players.find(p => !p.isHost);
      } else if (data.name || data.playerName) {
        // If backend sends player data directly
        joiningPlayer = {
          playerName: data.name || data.playerName,
          playerId: data.id || data.playerId || data.socketId
        };
      }
      
      console.log('🎉 Processed joining player:', joiningPlayer);
      
      if (joiningPlayer) {
        // Ensure we have the right property name
        const playerData = {
          playerName: joiningPlayer.playerName || joiningPlayer.name,
          playerId: joiningPlayer.playerId || joiningPlayer.id || joiningPlayer.socketId
        };
        
        setJoinedPlayer(playerData);
        setSuccess(`${playerData.playerName} has joined your room!`);
        console.log('✅ joinedPlayer state set:', playerData);
      } else {
        console.error('❌ Could not extract player data from joined event:', data);
        // Set a fallback if we can't parse the data properly
        setSuccess('A player has joined your room!');
      }
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000);
    });

    // Listen for room creation response
    socket.on('room-created', (data) => {
      setCreatedRoom(data);
      setIsCreatingRoom(false);
      console.log('Room created:', data);
    });

    socket.on('room-creation-error', (errorMsg) => {
      setError(errorMsg);
      setIsCreatingRoom(false);
    });

    // Listen for join response
    socket.on('room-joined', (data) => {
      console.log('Successfully joined room:', data);
      setIsJoiningRoom(false);
      setSuccess(`Successfully joined ${data.roomId}!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
      // Navigate to game or show game setup
      // You can implement navigation logic here
    });

    socket.on('join-room-error', (errorMsg) => {
      setError(errorMsg);
      setIsJoiningRoom(false);
    });

    // Cleanup listeners on component unmount
    return () => {
      socket.off('player-joined');
      socket.off('room-created');
      socket.off('room-creation-error');
      socket.off('room-joined');
      socket.off('join-room-error');
    };
  }, []);

  const handleCreateRoom = () => {
    setIsCreatingRoom(true);
    setError('');
    setSuccess('');
    
    const newRoomId = generateRoomId();
    
    // Emit socket event to create room
    socket.emit('create-room', {
      roomId: newRoomId,
      playerName: playerName,
      playerId: socket.id
    });
  };

  const handleJoinRoom = () => {
    if (!roomId.trim()) {
      setError('Please enter a room ID');
      return;
    }

    setIsJoiningRoom(true);
    setError('');
    setSuccess('');

    // Emit socket event to join room
    socket.emit('join-room', {
      roomId: roomId.toUpperCase(),
      playerName: playerName,
      playerId: socket.id
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
      {/* Debug info - remove in production */}
      <div style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 1000
      }}>
        <div>joinedPlayer: {joinedPlayer ? `${joinedPlayer.playerName || 'Unknown'} (${joinedPlayer.playerId || 'No ID'})` : 'null'}</div>
        <div>createdRoom: {createdRoom ? createdRoom.roomId : 'null'}</div>
        <div>success: {success || 'none'}</div>
      </div>

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

      {success && (
        <div className="success-message">
          <span className="success-icon">✅</span>
          {success}
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
                  {console.log('🔍 Rendering waiting status - joinedPlayer:', joinedPlayer)}
                  {!joinedPlayer ? (
                    <>
                      <div className="waiting-animation">
                        <div className="waiting-dot"></div>
                        <div className="waiting-dot"></div>
                        <div className="waiting-dot"></div>
                      </div>
                      <p>Waiting for opponent to join...</p>
                      <small>Share the room ID or link with your opponent</small>
                    </>
                  ) : (
                    <>
                      <div className="player-joined-notification">
                        <div className="joined-icon">🎉</div>
                        <p className="joined-message">
                          <strong>{joinedPlayer?.playerName || 'Unknown Player'}</strong> has joined the battle!
                        </p>
                        <small>Both players are ready. Starting game setup...</small>
                      </div>
                      <div className="players-list">
                        <div className="player-info">
                          <span className="player-label">Host:</span>
                          <span className="player-name">{playerName}</span>
                        </div>
                        <div className="player-info">
                          <span className="player-label">Opponent:</span>
                          <span className="player-name">{joinedPlayer?.playerName || 'Unknown Player'}</span>
                        </div>
                      </div>
                    </>
                  )}
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
