import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/ChatInterface.css';

function ChatInterface() {
  const [interests, setInterests] = useState('');
  const navigate = useNavigate();

  const handleStartChat = () => {
    console.log('Starting text chat with interests:', interests);
  };

  const handleVideoChat = () => {
    console.log('Starting video chat with interests:', interests);
  };

  return (
    <div className="chat-interface">
      <header className="header">
        <div className="logo-section">
          <img src="/src/assets/logo.png" alt="Omegle Logo" className="logo-icon" />
          <div className="logo-text">
            <h1 className="site-title">
              <span className="omegle-text">omegle</span>
              <span className="com-text">.com</span>
            </h1>
            <p className="tagline">Talk to strangers!</p>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="info-card card--red">
          <p className="card-text">⚠️ By using Omegle, you accept the terms at the bottom. You must be 18+ or 13+ with parental permission.</p>
        </div>

        <div className="info-card card--blue">
          <p className="card-text">📱 Mobile video chat is an experimental new feature.</p>
          <p className="card-text">📹 Video is monitored, so keep it clean!</p>
          <p className="card-text">Go to <span className="link-text">an adult site</span> instead if that's what you want.</p>
        </div>

        <div className="info-card card--purple">
          <div className="chat-buttons">
            <button className="chat-btn start-chat-btn" onClick={handleStartChat}>
              START A CHAT
            </button>
            <button className="chat-btn video-btn" onClick={handleVideoChat}>
              VIDEO
            </button>
          </div>
        </div>

        <div className="info-card card--green">
          <h3 className="interests-heading">🎯 Meet strangers with your interests!</h3>
          
          <div className="interests-input">
            <button className="add-btn">+</button>
            <input 
              type="text" 
              placeholder="Add your interests (optional)" 
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
            />
          </div>
        </div>

        <div className="info-card">
          <p className="footer-text">
            ✨ Omegle is a great way to meet new friends, even while practicing social distancing. 🌍
          </p>
        </div>
      </main>
    </div>
  );
}

export default ChatInterface;
