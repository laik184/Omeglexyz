import React from 'react';
import { Link } from 'react-router-dom';
import '../style/SafetyFirst.css';

function SafetyFirst() {
  return (
    <div className="safety-container">
      <header className="safety-header">
        <Link to="/" className="logo">
          <span className="logo-icon">🌐</span>
          <span className="logo-text">omegle.com</span>
        </Link>
        <p className="tagline">Talk to strangers!</p>
      </header>

      <main className="safety-content">
        <section className="hero-section">
          <h1>🛡️ Safety First — Because Your Privacy Matters Most! 🔐</h1>
          <p className="hero-description">
            In the digital world, safety isn't optional — it's essential. Omegle Web is built with a strong privacy-first foundation to make sure every user feels secure while connecting with the world. Whether you're chatting for fun, learning, or friendship, your safety always comes first. 💬🌍
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">1</div>
          <h2>⚠️ Stay Anonymous, Stay Protected</h2>
          <p>
            Your identity belongs to you — and only you. Omegle Web never asks for personal details like phone numbers, addresses, or real names. Every chat starts anonymously, so you can enjoy open conversation without revealing who you are. 🕵️‍♂️
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">2</div>
          <h2>🔒 No Signups, No Tracking</h2>
          <p>
            Unlike many social platforms that collect user data, Omegle Web keeps things private. There are no mandatory logins, no data selling, and no hidden analytics watching your every move. Your chats vanish when your session ends — leaving no trace. 🧭💻
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">3</div>
          <h2>🚫 Never Share Personal Information</h2>
          <p>
            It's simple: don't share private details. Avoid giving your phone number, email, address, school, or workplace. Even small clues can reveal more than you think. The safest chat is the one where your personal life stays offline. 📵
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">4</div>
          <h2>🧠 Smart Moderation System</h2>
          <p>
            To maintain a respectful environment, Omegle Web uses AI-powered filters and human moderation to detect harmful or inappropriate behavior. Suspicious users are automatically flagged or banned to keep everyone safe. ⚙️🚨
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">5</div>
          <h2>🧍 Community Guidelines That Protect You</h2>
          <p>
            Every user agrees to basic respect rules: no bullying, no threats, no hate speech, and no explicit content. Violating these leads to instant removal. These clear boundaries create a safer, friendlier chat space for all. 🤝🌈
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">6</div>
          <h2>📸 Control Your Camera and Microphone</h2>
          <p>
            You decide when to turn on your camera or microphone. With one click, you can disconnect instantly — no pressure, no intrusion. Your device permissions always stay in your hands. 🎥🎧
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">7</div>
          <h2>🧩 Privacy by Design</h2>
          <p>
            From the ground up, Omegle Web was built with security in mind. Data encryption, anonymous sessions, and no permanent logs ensure your conversations stay private. Every technical layer prioritizes user safety over convenience. 🔐🧱
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">8</div>
          <h2>💡 Protect Yourself, Protect Others</h2>
          <p>
            If someone behaves badly, use the report or block buttons. Every report helps improve community quality and protect future users. Responsible users make a safer world for everyone. 🛑🌍
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">9</div>
          <h2>🕵️ Remember: Not Everyone Is Who They Say</h2>
          <p>
            Online conversations are fun, but stay alert. Never trust anyone who pressures you for personal info, asks for money, or sends suspicious links. Trust your instincts and disconnect immediately if something feels off. ⚠️
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">10</div>
          <h2>🧘 Safer Internet, Better Experience</h2>
          <p>
            Omegle Web's mission is to bring back the joy of random chats — minus the risks. By staying anonymous, respectful, and aware, you help create a space where everyone can feel comfortable meeting the world. 🌐💬
          </p>
        </section>

        <section className="summary-section">
          <h2>In short:</h2>
          <p className="summary-text">
            Safety comes before everything. Stay anonymous, stay respectful, and never share private details. Omegle Web gives you the tools — you provide the awareness. Together, we keep the spirit of global connection secure and strong. 💚🛡️
          </p>
          <p className="summary-cta">
            Be smart. Be kind. Be safe. 🌍🔒
          </p>
          <Link to="/" className="cta-button">Start Chatting Safely</Link>
        </section>
      </main>

      <footer className="safety-footer">
        <div className="footer-links">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-conditions">Terms & Conditions</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <p>&copy; 2024 Omegle Web. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default SafetyFirst;
