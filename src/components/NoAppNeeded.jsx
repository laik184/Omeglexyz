import React from 'react';
import { Link } from 'react-router-dom';
import '../style/NoAppNeeded.css';

function NoAppNeeded() {
  return (
    <div className="no-app-container">
      <header className="no-app-header">
        <Link to="/" className="logo">
          <span className="logo-icon">🌐</span>
          <span className="logo-text">omegle.com</span>
        </Link>
        <p className="tagline">Talk to strangers!</p>
      </header>

      <main className="no-app-content">
        <section className="hero-section">
          <h1>🌐 No App Needed</h1>
          <p className="hero-subtitle">
            No downloads. No sign-ups. No waiting.<br />
            Just open your browser and start connecting instantly. 💻📱
          </p>
          <p className="hero-description">
            This is how online communication should be — fast, simple, and friction-free.
          </p>
        </section>

        <section className="content-section">
          <h2>⚡ Instant Access, Zero Barriers</h2>
          <p>
            Technology should bring people closer, not make them wait behind loading screens and app stores.
            That's why Omegle Web and Global Community are built to run directly in your browser.
          </p>
          <p className="highlight">
            One click. One connection. No setup.<br />
            It's pure interaction, stripped of unnecessary steps.
          </p>
        </section>

        <section className="content-section">
          <h2>💡 Why "No App" Is the Future</h2>
          <p>
            Traditional social platforms trap users in downloads, updates, and storage limits.
            We chose a different path — a web-first experience that lives anywhere the internet does.
          </p>
          <p className="highlight">
            You don't need to install. You don't need to update.<br />
            You just connect. 🌍
          </p>
        </section>

        <section className="content-section">
          <h2>🧠 Powered by Progressive Web Technology</h2>
          <p>Our platform uses modern PWA (Progressive Web App) architecture. That means:</p>
          <ul>
            <li>Fast loading even on slow networks ⚙️</li>
            <li>Smooth video and text chat right inside the browser</li>
            <li>Optional offline caching for consistent performance</li>
          </ul>
          <p className="highlight">It feels like an app but behaves like the open web.</p>
        </section>

        <section className="content-section">
          <h2>💬 Works on Every Device</h2>
          <p>
            Whether you're on a phone, tablet, or desktop — the experience stays seamless.
            No compatibility issues, no device restrictions. 📱💻🖥️
          </p>
          <ul className="device-list">
            <li>Android ✅</li>
            <li>iPhone ✅</li>
            <li>Windows ✅</li>
            <li>macOS ✅</li>
          </ul>
          <p className="highlight">If it has a browser, it has access.</p>
        </section>

        <section className="content-section">
          <h2>🧩 No Installation = More Freedom</h2>
          <p>
            Every download creates friction.<br />
            Every installation demands permissions.<br />
            We removed both.
          </p>
          <p>
            Omegle Web runs inside a secure browser sandbox — no background processes, no hidden files.
            You can leave anytime, and everything disappears with the tab.
          </p>
          <p className="highlight">That's digital freedom at its simplest. 🔓</p>
        </section>

        <section className="content-section">
          <h2>🧱 Lightweight and Fast</h2>
          <p>Apps consume storage and battery. Browsers don't.</p>
          <p>Our system is built for speed:</p>
          <ul>
            <li>Loads in seconds</li>
            <li>Optimized scripts</li>
            <li>Compressed media for low data use</li>
          </ul>
          <p className="highlight">Even low-end devices perform smoothly. ⚡</p>
        </section>

        <section className="content-section">
          <h2>🔐 Security Built Into the Browser</h2>
          <p>
            By operating in-browser, we inherit native protections like HTTPS encryption, sandbox isolation, and permission control.
            This makes sessions safer by default — no extra installations that could carry risk.
          </p>
          <p className="highlight">
            You stay in control of what your browser allows: camera, mic, and notifications. 🛡️
          </p>
        </section>

        <section className="content-section">
          <h2>🧠 Auto Updates, Always Fresh</h2>
          <p>
            No app means no manual updates.
            Every time you open the site, you get the latest version — instantly.
          </p>
          <p>
            New features, bug fixes, and security patches deploy silently in the background. 🔄
            You never have to click "update" again.
          </p>
        </section>

        <section className="content-section">
          <h2>🪶 Low Bandwidth Mode</h2>
          <p>
            Even users with weak internet connections deserve smooth conversations.
            Our browser-based design includes a low-bandwidth optimization layer that adjusts video quality automatically.
          </p>
          <p className="highlight">You stay connected — even on 3G or public Wi-Fi. 🌐</p>
        </section>

        <section className="content-section">
          <h2>🧍‍♂️ Accessibility for Everyone</h2>
          <p>
            Installing apps often excludes users with limited devices or restricted permissions.
            The browser breaks that wall.
          </p>
          <p>
            Anyone, anywhere, can join a chat without special hardware or admin rights.
            That makes Omegle Web truly universal. 🌏
          </p>
        </section>

        <section className="content-section">
          <h2>🎯 No Hidden Costs</h2>
          <p>
            App stores often come with commissions, tracking SDKs, and region-based restrictions.
            Browser access eliminates all of that.
          </p>
          <p className="highlight">You're not the product — you're the participant. 💬</p>
        </section>

        <section className="content-section">
          <h2>💬 Easy Sharing</h2>
          <p>Want to invite a friend? Just send a link. 🔗</p>
          <p>
            No need to explain download steps or app versions.
            One click opens the room instantly on any device.
          </p>
          <p>The simplicity fuels organic growth and viral reach.</p>
        </section>

        <section className="content-section">
          <h2>⚙️ Optimized for Privacy</h2>
          <p>
            Every browser tab is an isolated space.
            When you close it, the session is gone — no residual data, no traces left behind.
          </p>
          <p>That's cleaner and safer than most installed apps, which continue to run background services.</p>
        </section>

        <section className="content-section">
          <h2>🧠 Browser Technology = Future Flexibility</h2>
          <p>
            Building on the open web means adaptability.
            We can integrate AI, AR filters, or live-translation engines instantly without forcing users to reinstall.
          </p>
          <p className="highlight">It's a living ecosystem — always evolving, never static. 🌱</p>
        </section>

        <section className="content-section">
          <h2>🌎 Global Reach Without App Stores</h2>
          <p>
            App stores are region-locked, regulated, and often limited by policies.
            The web isn't.
          </p>
          <p>
            By going browser-only, we ensure worldwide accessibility from the start.
            One platform, every country. 🌍
          </p>
        </section>

        <section className="content-section">
          <h2>🔋 Energy Efficient by Design</h2>
          <p>
            Our lightweight architecture consumes less power compared to heavy app processes.
            That means longer battery life and smoother multitasking — especially on mobile. 🔋
          </p>
        </section>

        <section className="content-section philosophy">
          <h2>🧭 Our Philosophy: Simplicity Wins</h2>
          <p>
            We believe the best technology disappears into the background.
            The user shouldn't have to think about installations, permissions, or updates — only about the conversation happening right now.
          </p>
          <p>
            "No app needed" isn't just a tagline.<br />
            It's a statement of intent:
          </p>
          <p className="highlight large">The web itself is enough.</p>
        </section>

        <section className="cta-section">
          <h2>🌟 Experience the Freedom</h2>
          <p>
            Open your browser.<br />
            Tap "Start Chat."<br />
            You're in — no clutter, no complexity, no commitment. 💬
          </p>
          <p className="highlight">That's the power of browser-based connection.</p>
          <p>
            The world doesn't need another app.<br />
            It needs a faster way to talk.
          </p>
          <p className="final-message">
            Welcome to the No-App Era — where communication is instant, private, and universal. 🌐💻📱
          </p>
          <Link to="/" className="cta-button">Start Chatting Now</Link>
        </section>
      </main>

      <footer className="no-app-footer">
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

export default NoAppNeeded;
