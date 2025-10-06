import React from 'react';
import { Link } from 'react-router-dom';
import '../style/YourNextAdventure.css';

function YourNextAdventure() {
  return (
    <div className="adventure-container">
      <header className="adventure-header">
        <Link to="/" className="logo">
          <span className="logo-icon">🌐</span>
          <span className="logo-text">omegle.com</span>
        </Link>
        <p className="tagline">Talk to strangers!</p>
      </header>

      <main className="adventure-content">
        <section className="hero-section">
          <h1>🌍 Your Next Adventure Awaits — Discover the World Through Conversation! ✨💬</h1>
          <p className="hero-description">
            Every great story begins with a single hello. 🌟 Omegle Web turns ordinary moments into global adventures — one chat at a time.
          </p>
          <p className="hero-subtext">
            You never know who you'll meet, what you'll learn, or how one random conversation might inspire your next big idea. The world is waiting, and your next adventure starts right here. 🚀
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">1</div>
          <h2>🌈 Explore the World Without Leaving Home</h2>
          <p>
            Why wait for travel when the world can come to you? 🌍 With Omegle Web, you can meet people from every continent — learn about cultures, music, food, and lifestyles straight from locals. Every chat is like opening a window to a new world. 💫
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">2</div>
          <h2>🗣️ Meaningful Conversations, Endless Possibilities</h2>
          <p>
            Some chats will make you laugh. Some will make you think. Some might even change how you see the world. From deep talks about dreams to light-hearted fun, Omegle Web connects you to every kind of story imaginable. 💭💬
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">3</div>
          <h2>🌐 Instant Global Connection</h2>
          <p>
            No signups. No waiting. Just click "Start Chat," and you're connected with someone somewhere new — instantly. Whether it's morning in Tokyo or midnight in Paris, someone out there is ready to talk. ⚡
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">4</div>
          <h2>🧠 Learn, Share, and Grow</h2>
          <p>
            Your next chat could be a free lesson in culture, language, or perspective. Many users practice English, share hobbies, or exchange creative ideas. Every connection adds to your knowledge and confidence. 📘🌏
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">5</div>
          <h2>❤️ Humans, Not Algorithms</h2>
          <p>
            Tired of social media feeds and fake profiles? Omegle Web keeps it real — no likes, no follows, no filters. Just pure human interaction, free from online noise. You talk, listen, and connect — naturally. 🤝
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">6</div>
          <h2>🔮 Every Chat = A New Journey</h2>
          <p>
            No two conversations are ever the same. You might meet a traveler, a student, a musician, or a coder. Some will make you laugh; others will teach you something new. That unpredictability is what makes Omegle Web an adventure. 🎲🌟
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">7</div>
          <h2>💬 From Curiosity to Connection</h2>
          <p>
            Sometimes, all it takes is curiosity — a single click to step outside your bubble. Each stranger represents a chance to learn, to inspire, or to be inspired. 🪄💫
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">8</div>
          <h2>🛡️ Safe Exploration</h2>
          <p>
            Adventure doesn't mean risk. Omegle Web's privacy-first system keeps you safe and anonymous while you explore the world of conversations. Your data stays private, and you stay in control. 🔒🌍
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">9</div>
          <h2>🚀 Break Routine, Meet New Energy</h2>
          <p>
            Feeling bored or stuck in routine? Omegle Web breaks the monotony. Talking to someone new brings fresh ideas, laughter, and perspective — reminding you how big and vibrant the world really is. 🔥🌈
          </p>
        </section>

        <section className="feature-section">
          <div className="feature-number">10</div>
          <h2>🌏 The Adventure Never Ends</h2>
          <p>
            Omegle Web isn't just an app — it's a journey that keeps evolving. Every time you connect, you unlock a new world, a new culture, or maybe even a new friend. And the best part? You can do it all for free, anytime, anywhere. 💻📱
          </p>
        </section>

        <section className="summary-section">
          <h2>In short:</h2>
          <p className="summary-text">
            The world is full of stories waiting to be told — and you're just one click away from hearing them. 🌍✨
          </p>
          <p className="summary-highlight">Your next adventure begins now.</p>
          <p className="summary-cta">
            Meet the world. Share your story. Discover what happens when strangers connect — and magic happens. 💬❤️🌐
          </p>
          <Link to="/" className="cta-button">Start Your Adventure</Link>
        </section>
      </main>

      <footer className="adventure-footer">
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

export default YourNextAdventure;
