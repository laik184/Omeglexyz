import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import '../style/VideoRoom.css';

function VideoChat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isSearching, setIsSearching] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [reportReason, setReportReason] = useState('');
  const navigate = useNavigate();
  const userVideoRef = useRef(null);
  const userPreviewRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: false 
        });
        
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
        }
        if (userPreviewRef.current) {
          userPreviewRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    startCamera();

    return () => {
      if (userVideoRef.current?.srcObject) {
        userVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const socket = io({
      transports: ['websocket', 'polling']
    });
    socketRef.current = socket;

    socket.emit('join-room', 'video');

    socket.on('user-count', (count) => {
      setOnlineCount(count);
    });

    socket.on('searching', () => {
      setIsSearching(true);
      setIsConnected(false);
    });

    socket.on('matched', () => {
      setIsSearching(false);
      setIsConnected(true);
    });

    socket.on('receive-message', (data) => {
      setMessages(prev => [...prev, { text: data.text, sender: 'stranger' }]);
    });

    socket.on('stranger-disconnected', () => {
      setMessages(prev => [...prev, { text: 'Stranger has disconnected.', sender: 'system' }]);
      setIsConnected(false);
      setIsSearching(false);
    });

    socket.on('you-disconnected', () => {
      setMessages(prev => [...prev, { text: 'You have disconnected.', sender: 'system' }]);
      setIsConnected(false);
      setIsSearching(false);
    });

    socket.on('blocked', (data) => {
      alert(data.message);
      navigate('/chat');
    });

    socket.on('report-success', (data) => {
      alert(data.message);
    });

    socket.on('report-failed', (data) => {
      alert(data.message);
    });

    socket.emit('start-matching');

    return () => {
      socket.emit('leave-room', 'video');
      socket.disconnect();
    };
  }, [navigate]);

  const handleExit = () => navigate('/chat');
  
  const handleSendMessage = () => {
    if (message.trim() && isConnected && socketRef.current) {
      setMessages(prev => [...prev, { text: message, sender: 'you' }]);
      socketRef.current.emit('send-message', { message });
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewOrSkip = () => {
    if (isConnected && socketRef.current) {
      socketRef.current.emit('skip-stranger');
      setMessages([]);
      setIsSearching(true);
      setIsConnected(false);
    } else {
      setMessages([]);
      setIsSearching(true);
      setIsConnected(false);
      if (socketRef.current) {
        socketRef.current.emit('start-matching');
      }
    }
  };

  const handleFeedbackSubmit = () => {
    if (feedback.trim() && socketRef.current) {
      socketRef.current.emit('submit-feedback', { feedback });
      setFeedback('');
      setShowFeedbackModal(false);
      alert('Thank you for your feedback!');
    }
  };

  const handleReportSubmit = () => {
    if (reportReason.trim() && isConnected && socketRef.current) {
      socketRef.current.emit('report-user', { reportReason });
      setReportReason('');
      setShowReportModal(false);
      alert('Report submitted. Thank you for keeping our community safe.');
    }
  };

  return (
    <div className="video-chat-room">
      <header className="video-header">
        <div className="header-left">
          <button className="exit-btn" onClick={handleExit}>
            ← Exit
          </button>
          <div className="menu-container">
            <button className="menu-btn" onClick={() => setShowMenu(!showMenu)}>
              ⋮
            </button>
            {showMenu && (
              <div className="dropdown-menu">
                <button className="menu-item" onClick={() => { setShowFeedbackModal(true); setShowMenu(false); }}>
                  📝 Feedback
                </button>
                <button className="menu-item" onClick={() => { setShowReportModal(true); setShowMenu(false); }}>
                  🚩 Report
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="header-center">
          <img src="/assets/logo.png" alt="Logo" className="header-logo" />
          <div className="header-info">
            <h1 className="header-title">omegle.com</h1>
            <p className="header-tagline">Talk to strangers!</p>
          </div>
        </div>
        <div className="online-status">
          <span className="eye-icon">👁</span> {onlineCount} online
        </div>
      </header>

      <div className="video-section">
        <div className="stranger-video">
          <div className="video-placeholder">
            {isSearching && <div className="loading-spinner"></div>}
          </div>
          <div className="video-label">Stranger</div>
        </div>
        
        <div className="user-video">
          <video 
            ref={userVideoRef}
            autoPlay 
            muted 
            playsInline
            className="user-video-element"
          />
          <div className="video-label">You</div>
        </div>

        <div className="user-preview">
          <video 
            ref={userPreviewRef}
            autoPlay 
            muted 
            playsInline
            className="preview-video-element"
          />
        </div>
      </div>

      <div className="video-chat-bottom">
        {isSearching && (
          <div className="searching-messages">
            <div className="searching-message">Looking for people online</div>
            <div className="searching-message">Looking for people online</div>
          </div>
        )}

        {!isSearching && messages.length > 0 && (
          <div className="video-messages-container">
            {messages.map((msg, idx) => (
              <div key={idx} className={`video-message ${msg.sender}`}>
                {msg.sender === 'stranger' && <strong>Stranger: </strong>}
                {msg.sender === 'you' && <strong>You: </strong>}
                {msg.text}
              </div>
            ))}
          </div>
        )}
        
        <div className="video-input-section">
          <input
            type="text"
            className="video-message-input"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="video-send-btn" onClick={handleSendMessage} disabled={!isConnected}>
            ➤
          </button>
          <button className="video-new-btn" onClick={handleNewOrSkip}>
            {isConnected ? '⏭ Skip' : '● New'}
          </button>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="modal-overlay" onClick={() => setShowFeedbackModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">📝 Send Feedback</h2>
            <div className="modal-body">
              <textarea
                className="feedback-textarea"
                placeholder="Share your thoughts, suggestions, or report bugs..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows="6"
              />
            </div>
            <div className="modal-footer">
              <button className="modal-btn cancel-btn" onClick={() => setShowFeedbackModal(false)}>
                Cancel
              </button>
              <button className="modal-btn submit-btn" onClick={handleFeedbackSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">🚩 Report User</h2>
            <div className="modal-body">
              <p className="modal-text">Why are you reporting this user?</p>
              <select 
                className="report-select"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
              >
                <option value="">Select a reason...</option>
                <option value="Inappropriate content">Inappropriate content</option>
                <option value="Harassment">Harassment</option>
                <option value="Spam">Spam</option>
                <option value="Underage user">Underage user</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="modal-footer">
              <button className="modal-btn cancel-btn" onClick={() => setShowReportModal(false)}>
                Cancel
              </button>
              <button className="modal-btn submit-btn" onClick={handleReportSubmit} disabled={!reportReason}>
                Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoChat;
