import React from 'react';
import { Link } from 'react-router-dom';
import '../style/ReadyToJoin.css';

function ReadyToJoin() {
  return (
    <div className="ready-container">
      <header className="ready-header">
        <Link to="/" className="logo">
          <span className="logo-icon">🌐</span>
          <span className="logo-text">omegle.com</span>
        </Link>
        <p className="tagline">Talk to strangers!</p>
      </header>

      <main className="ready-content">
        <section className="hero-section">
          <h1>⚡ Ready to Join?</h1>
          <p className="hero-description">
            The world has changed, but our desire to connect hasn't. We still crave real conversations, real laughter, and real people — not endless scrolling or fake filters. That's why Omegle Web exists: to revive the spirit of spontaneous, meaningful, and respectful conversation. 🌐💬
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">1</div>
          <h2>💫 Keep the Spirit Alive</h2>
          <p>
            When the original Omegle went offline, millions felt a void — a place where random strangers could meet and talk freely was gone. But now, we're keeping that spark alive — in a modern, safe, and friendly way. Omegle Web is more than a platform; it's a global community built on respect, curiosity, and connection. 🌎
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">2</div>
          <h2>🤝 Meet People, Not Profiles</h2>
          <p>
            Unlike social apps filled with algorithms and filters, we bring you people, not polished images. No likes, no followers — just raw, authentic conversations with humans across the planet. You might meet someone from another country, culture, or time zone — and still find something in common. That's the magic. 🌍💬
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">3</div>
          <h2>📖 Share Stories That Matter</h2>
          <p>
            Every chat is a new story waiting to be written. Talk about your dreams, music, goals, or random life thoughts — or just listen. A stranger today might be a friend tomorrow. Many people have met lifelong friends, mentors, and even love stories through platforms like this. Who knows what yours will be? 💭✨
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">4</div>
          <h2>⚡ Instant, Free, and Global</h2>
          <p>
            No app. No signup. No limits. Just one click and you're connected to someone new. Whether you're at home, in a café, or bored after class — open your browser, tap "Start," and jump into a conversation that could change your mood or even your perspective. 💻📱
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">5</div>
          <h2>🛡️ Respect at the Core</h2>
          <p>
            We've learned from the past — and we're building a cleaner, safer experience. Omegle Web has strict community rules to protect every user from harassment and misuse. Respect isn't optional here — it's the foundation that keeps conversations healthy and fun. 🧠🤝
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">6</div>
          <h2>🧠 For Everyone, Everywhere</h2>
          <p>
            From students looking to practice a language to professionals taking a short break, everyone's welcome. It's open, inclusive, and designed for the world — no matter where you're from. 🌏
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">7</div>
          <h2>🌈 Why Join Now?</h2>
          <p>
            Because the world needs connection again. Because talking to strangers still teaches us empathy, perspective, and humor. And because sometimes, one short chat can remind you that kindness and curiosity still exist. ❤️
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">8</div>
          <h2>🎯 Simplicity That Works</h2>
          <p>
            No complicated setup, no accounts to manage. Just open, allow camera and mic, and you're ready to meet the world. The focus stays on real-time, real people, and real fun. ⚙️✨
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">9</div>
          <h2>🕊️ Freedom to Explore</h2>
          <p>
            Chat for five minutes or five hours — it's up to you. There are no restrictions or algorithms pushing you in one direction. Just you, your curiosity, and the freedom to explore. 🧭
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">10</div>
          <h2>🔮 A New Era of Connection</h2>
          <p>
            This isn't just another chat site. It's a new era of digital communication — simple, free, and powered by humans, not social media machines. The goal is to reconnect the disconnected, revive the lost magic of random conversations, and remind the internet that it can still feel human. 🌟
          </p>
        </section>

        <section className="cta-section">
          <h2>So… are you ready?</h2>
          <p className="cta-text">
            To laugh with a stranger, share your story, or just see who's out there?
          </p>
          <p className="cta-instruction">
            Click Start Chat, and step into a global space built for you — safe, spontaneous, and full of possibilities. 🌐💬
          </p>
          <Link to="/" className="cta-button">Start Chat Now</Link>
          <p className="final-message">
            Omegle Web — meet the world again. 🌎💚❤️
          </p>
        </section>
      </main>

      <footer className="ready-footer">
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

export default ReadyToJoin;
