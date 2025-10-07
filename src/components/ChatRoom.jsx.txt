import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/ChatRoom.css

function TextChat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, message]);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleExit = () => navigate('/chat');

  return (
    <div className="text-chat-room">
      <button onClick={handleExit}>Exit</button>
      <div className="messages-container">
        {messages.map((msg, idx) => <div key={idx}>{msg}</div>)}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}

export default TextChat;
