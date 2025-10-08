import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/VideoRoom.css';


function VideoChat() {
  const [isSearching, setIsSearching] = useState(true);
  const navigate = useNavigate();

  const handleExit = () => navigate('/chat');
  const handleNewChat = () => setIsSearching(true);

  return (
    <div className="video-chat-room">
      <button onClick={handleExit}>Exit</button>

      <div className="video-section">
        <div className="stranger-video">
          {isSearching ? <div className="loading-spinner"></div> : <video autoPlay />}
        </div>
        <div className="user-video">
          <video autoPlay muted />
        </div>
      </div>

      <button onClick={handleNewChat}>New Chat</button>
    </div>
  );
}

export default VideoChat;
