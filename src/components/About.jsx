import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/About.css';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="about-page">
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

      <div className="about-container">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Home
        </button>

        <div className="about-content">
          <h1 className="about-title">About Omegle Web</h1>
          
          <p className="intro-text">
            Welcome to Omegle Web – a modern, safer, and friendlier alternative to the original Omegle.
          </p>

          <p className="intro-text">
            We believe the internet should connect people, not put them at risk. That's why we've built a platform where you can meet new people from around the world in a secure, respectful, and enjoyable environment.
          </p>

          <section className="about-section">
            <h2>👥 Who We Are</h2>
            <p>
              Omegle Web is created and maintained by a team of passionate students and tech enthusiasts who understand the challenges of online chatting. We wanted to bring back the excitement of random connections — but with stronger safety measures, better design, and smarter features.
            </p>
          </section>

          <section className="about-section mission-section">
            <h2>🎯 Our mission is simple:</h2>
            <ul>
              <li>Connect people globally in real-time through text and video chat.</li>
              <li>Promote a respectful community where everyone feels welcome.</li>
              <li>Protect privacy while delivering a smooth, modern chatting experience.</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>🚀 What We Offer</h2>
            <div className="features-grid">
              <div className="feature-box">
                <div className="feature-emoji">📹</div>
                <h3>Random Video Chat</h3>
                <p>Talk face-to-face with strangers instantly.</p>
              </div>
              <div className="feature-box">
                <div className="feature-emoji">💬</div>
                <h3>Random Text Chat</h3>
                <p>Keep it anonymous and focus on conversation.</p>
              </div>
              <div className="feature-box">
                <div className="feature-emoji">🎯</div>
                <h3>Interest-Based Matching</h3>
                <p>Meet people who share your hobbies.</p>
              </div>
              <div className="feature-box">
                <div className="feature-emoji">🔒</div>
                <h3>Private Chat Rooms</h3>
                <p>Invite friends or create safe spaces.</p>
              </div>
            </div>
            <p className="feature-note">
              All of this comes with AI-powered moderation and end-to-end privacy protection.
            </p>
          </section>

          <section className="about-section promise-section">
            <h2>🤝 Our Promise</h2>
            <p>We are committed to:</p>
            <ul>
              <li>Keeping Omegle Web a safe space for users of all ages.</li>
              <li>Responding to feedback quickly and improving our features.</li>
              <li>Following strict community guidelines to prevent harmful behavior.</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>⭐ Why Choose Omegle Web?</h2>
            <ul>
              <li>Modern, mobile-friendly design that works on all devices.</li>
              <li>Faster connections and better matching than outdated chat sites.</li>
              <li>Strong moderation to keep conversations respectful and secure.</li>
            </ul>
            <p>
              Whether you're here to make friends, learn about other cultures, practice a new language, or just have a fun chat, Omegle Web is your safe place on the internet.
            </p>
          </section>

          <section className="cta-section-about">
            <h2>🌟 Ready to Start Chatting?</h2>
            <p>Join thousands of people connecting safely every day!</p>
            <button className="start-chat-btn" onClick={() => navigate('/')}>
              Start Chatting Now
            </button>
          </section>

          <section className="contact-section">
            <h2>📞 Contact Us</h2>
            <h3>Get in Touch</h3>
            <div className="contact-details">
              <p>📧 Email: mmohddaudkahan70@gmail.com</p>
              <p>🌐 Website: Omegleonline.xyz</p>
            </div>
            <p className="contact-note">We'd love to hear your feedback and suggestions!</p>
          </section>

          <div className="about-footer">
            <p>🌟 Thank you for choosing Omegle Web! 🌟</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
