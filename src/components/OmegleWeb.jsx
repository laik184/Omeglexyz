import React from 'react';
import { Link } from 'react-router-dom';
import '../style/OmegleWeb.css';

const OmegleWeb = () => {
  return (
    <div className="omegle-web">
      {/* Header */}
      <header className="header">
        <div className="logo-section">
          <div className="logo-icon">🌐</div>
          <div className="logo-text">
            <h1 className="logo">omegle.com</h1>
            <p className="tagline">Talk to strangers!</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {/* Main Title */}
          <h1 className="main-title">Talk to strangers!</h1>

          {/* Welcome Cards */}
          <div className="info-card card--orange">
            <h3 className="card-title">👋 Welcome to the New Era! 🚀</h3>
            <p className="card-text">
              Missing Omegle? Same here! When the original Omegle went offline, we felt that loss too. So we decided to build something better!
            </p>
          </div>

          <div className="info-card card--green">
            <h3 className="card-title">✨ Welcome to Omegle Web</h3>
            <p className="card-text">
              A modern, safer, and friendlier alternative to the original Omegle! 😊 Built by students, for everyone.
            </p>
          </div>

          {/* What's the Deal Section */}
          <h2 className="section-title">🌍 What's the Deal? 🤔</h2>

          <div className="info-card card--green">
            <div className="card-content-with-image">
              <div>
                <h4 className="feature-title">🌐 Global Community</h4>
                <p className="card-text">
                  A worldwide community for meeting new people through video and text chat 💬📹.
                </p>
              </div>
            </div>
          </div>

          <div className="info-card card--red">
            <h4 className="feature-title">🔒 Privacy-Focused Design</h4>
            <p className="card-text">
              Your data stays yours! 🛡️ We enforce strict community guidelines and maintain a privacy-first approach.
            </p>
          </div>

          <div className="info-card card--purple">
            <h4 className="feature-title">🌐 No App Needed</h4>
            <p className="card-text">
              Works right in your browser! 💻📱 No downloads, no installations, no hassle. Just open your web browser.
            </p>
          </div>

          <div className="info-card card--yellow">
            <h4 className="feature-title">⚡ Superior Experience</h4>
            <p className="card-text">
              Honestly? Way smoother and friendlier than Ome TV or Monkey (yeah, we said it!) 😎🔥
            </p>
          </div>

          {/* How to Use Section */}
          <div className="how-to-card">
            <h3 className="how-to-title">How to use Omegle?</h3>
            <ol className="how-to-list">
              <li>Go to the website 🌐</li>
              <li>Choose Text chat 💬 or Video chat 📹</li>
              <li>(Optional) Add your interests 🎵📚</li>
              <li>Click Start to match with a stranger 😊</li>
            </ol>
          </div>

          {/* Start Now Button */}
          <div className="cta-section">
            <button className="start-now-btn">START NOW</button>
          </div>

          {/* Talk to Strangers Banner */}
          <div className="banner-card">
            <div className="banner-content">
              <h2 className="banner-title">TALK TO STRANGERS</h2>
              <div className="banner-globe">🌍</div>
            </div>
          </div>

          {/* Ready to Join Section */}
          <div className="info-card card--light">
            <h4 className="feature-title">⚡ Ready to Join?</h4>
            <p className="card-text">
              Let's keep the spirit of spontaneous, respectful conversation alive! Make new friends, share stories, or just explore!
            </p>
            <p className="card-text" style={{ marginTop: '8px' }}>
              It's free, instant, and who knows who you'll meet next? 💚❤️
            </p>
          </div>

          {/* What is Omegle Section */}
          <h2 className="section-title">✏️ What is Omegle? 🖼️🌍</h2>

          <div className="info-card card--blue">
            <h4 className="feature-title">🌐 The Global Connection Platform</h4>
            <p className="card-text">
              Omegle is a unique online chat platform that connects strangers from all over the world.
            </p>
          </div>

          <div className="info-card card--blue">
            <h4 className="feature-title">💝 Why People Love Omegle</h4>
            <div className="feature-tags">
              <span className="tag">🎭 Make new friends</span>
              <span className="tag">🗣️ Practice languages</span>
            </div>
          </div>

          <div className="info-card card--red">
            <h4 className="feature-title">💡 Safety First</h4>
            <p className="card-text">
              Safety is important! Omegle advises users to stay anonymous and not share personal details like phone numbers or addresses.
            </p>
          </div>

          <div className="info-card card--green">
            <h4 className="feature-title">🚀 Your Next Adventure Awaits</h4>
            <p className="card-text">
              Discover amazing conversations and connect with people from around the world!
            </p>
          </div>

          {/* Footer */}
          <footer className="footer">
            <p className="footer-text">
              © 2025 Omegle v2.0. All rights reserved. |
            </p>
            <p className="footer-links">
              Built January 2025 | <Link to="/privacy-policy" className="footer-link">Privacy Policy</Link> | <Link to="/terms-conditions" className="footer-link">Terms & Conditions</Link> | <Link to="/about" className="footer-link">About</Link> | Contact
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default OmegleWeb;
