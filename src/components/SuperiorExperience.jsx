import React from 'react';
import { Link } from 'react-router-dom';
import '../style/SuperiorExperience.css';

function SuperiorExperience() {
  return (
    <div className="superior-container">
      <header className="superior-header">
        <Link to="/" className="logo">
          <span className="logo-icon">🌐</span>
          <span className="logo-text">omegle.com</span>
        </Link>
        <p className="tagline">Talk to strangers!</p>
      </header>

      <main className="superior-content">
        <section className="hero-section">
          <h1>🚀 Superior Experience — The Future of Real Connections!</h1>
          <p className="hero-description">
            Let's be honest — video chat should be simple, fun, and real. Omegle Web isn't just a replacement; it's an upgrade that takes everything good about old platforms like Ome TV, Monkey, and Omegle — and makes it smoother, safer, and way more human. 😎🔥
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">1</div>
          <h2>💬 Real-Time Global Chat, Reimagined</h2>
          <p>
            Say goodbye to lag, bugs, and awkward freezes! Our platform runs on advanced real-time servers that optimize speed and connection quality, even on low bandwidth. Whether you're chatting from India, Brazil, or Germany — you'll feel like you're talking face-to-face. 🌍⚡
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">2</div>
          <h2>🎯 Friendlier User Interface</h2>
          <p>
            No clutter, no confusion — just clean design and instant connection. Our new UI helps you focus on what matters: meeting people, not fighting with menus. Dark mode, simple controls, and one-click video start make it perfect for everyone. 🖤
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">3</div>
          <h2>🧠 Smart Matchmaking</h2>
          <p>
            Forget random chaos. Our AI-based system pairs you with people who actually share your vibe — interests, language, and preferences included. You decide what kind of experience you want: chill chat, serious talks, or just laughs. 🎲✨
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">4</div>
          <h2>🔒 Privacy and Respect First</h2>
          <p>
            Unlike other platforms that collect user data, we believe in digital freedom. Your conversations stay private and encrypted. We don't store personal data, and every chat session is anonymous by default. 🛡️
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">5</div>
          <h2>🧍 Community-Driven Moderation</h2>
          <p>
            Toxicity ruins fun. That's why we built a smarter, community-led moderation system. Users can report, block, or flag inappropriate behavior in seconds — ensuring everyone feels welcome and safe. 🙌
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">6</div>
          <h2>⚙️ Better Technology = Better Vibes</h2>
          <p>
            We use WebRTC technology, the same standard trusted by major platforms, but optimized for low-latency video and clear audio. Combined with adaptive streaming, it ensures smooth video quality even with weak internet. 🎧🎥
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">7</div>
          <h2>🌈 Inclusive and Accessible for Everyone</h2>
          <p>
            Built by students, inspired by global users. We designed this experience to work for all — no expensive devices needed. Whether you're on desktop, mobile, or tablet, the performance stays top-tier. 💻📱
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">8</div>
          <h2>🧩 Beyond Chat: Experiences That Connect</h2>
          <p>
            Soon you'll see mini-games, themed chat rooms, and "interest hubs" — where people from around the world can talk about what they love most. It's more than chatting — it's a digital hangout that feels alive. 🎮💡
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">9</div>
          <h2>🕹️ Ads, No Distractions</h2>
          <p>
            We keep your space clean. No intrusive ads, no pop-ups breaking your flow. Just pure, uninterrupted connection — like it should be. 🧘
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">10</div>
          <h2>🚀 The Future of Social Discovery</h2>
          <p>
            Omegle Web is not about nostalgia — it's about the next evolution of global interaction. A place where you can meet strangers safely, express yourself freely, and have meaningful moments — all through one click. 🌐❤️
          </p>
        </section>

        <section className="summary-section">
          <h2>In short:</h2>
          <p className="summary-text">
            Omegle Web redefines what online chat should feel like — fast, friendly, private, and futuristic. It's not just "like" Ome TV or Monkey — it's what they should have been.
          </p>
          <p className="summary-cta">
            Join the movement, meet the world, and experience real human connection again — the modern way. ✨💬🔥
          </p>
          <Link to="/" className="cta-button">Start Your Superior Experience Now</Link>
        </section>
      </main>

      <footer className="superior-footer">
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

export default SuperiorExperience;
