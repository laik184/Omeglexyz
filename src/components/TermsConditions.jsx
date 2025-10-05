import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/TermsConditions.css';

const TermsConditions = () => {
  const navigate = useNavigate();

  return (
    <div className="terms-page">
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

      <div className="terms-container">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Home
        </button>

        <div className="terms-content">
          <h1 className="terms-title">📜 Terms & Conditions</h1>
          
          <p className="intro-text">
            Welcome to Omegle Web. By accessing or using our website, you agree to be bound by these Terms & Conditions. If you do not agree, please stop using our services immediately.
          </p>

          <section className="terms-section">
            <h2>1. Acceptance of Terms</h2>
            <p>By using Omegle Web, you agree to follow these Terms & Conditions, our Privacy Policy, and any other rules posted on the site. We may update these terms at any time, and continued use of the website means you accept any changes.</p>
          </section>

          <section className="terms-section">
            <h2>2. Eligibility</h2>
            <ul>
              <li>You must be at least 18 years old, or the minimum legal age in your country, to use our services.</li>
              <li>Minors may use the site only under parental or guardian supervision.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>3. Our Services</h2>
            <p>Omegle Web offers:</p>
            <ul>
              <li>Random video and text chatting</li>
              <li>Interest-based matching</li>
              <li>Private chat rooms</li>
            </ul>
            <p>We aim to provide a safe and friendly environment, but we are not responsible for the actions or content of other users.</p>
          </section>

          <section className="terms-section">
            <h2>4. User Responsibilities</h2>
            <p>When using Omegle Web, you agree to:</p>
            <ul>
              <li>Not share personal information (address, phone number, passwords, bank details)</li>
              <li>Not engage in illegal activities such as harassment, threats, fraud, or sharing explicit content</li>
              <li>Respect other users and avoid abusive, hateful, or discriminatory behavior</li>
              <li>Not upload or transmit harmful code such as viruses or malware</li>
            </ul>
            <p className="warning"><strong>Failure to follow these rules may result in a permanent ban.</strong></p>
          </section>

          <section className="terms-section">
            <h2>5. Content and Moderation</h2>
            <ul>
              <li>All chats are monitored using AI and human moderators to detect harmful content.</li>
              <li>We may remove, block, or report users who violate these terms.</li>
              <li>We are not liable for user-generated content and do not endorse it.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>6. Disclaimer of Warranties</h2>
            <p>Omegle Web is provided "as is" without warranties of any kind. We do not guarantee uninterrupted service, error-free performance, or that the platform will be free from harmful content.</p>
          </section>

          <section className="terms-section">
            <h2>7. Limitation of Liability</h2>
            <p>To the fullest extent permitted by law, Omegle Web and its team are not responsible for:</p>
            <ul>
              <li>Any damages caused by using our services</li>
              <li>Any loss of data, privacy breaches, or third-party actions</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>8. Third-Party Links and Ads</h2>
            <ul>
              <li>Our website may contain links to third-party sites and display ads from Google AdSense and other networks.</li>
              <li>We are not responsible for the content, privacy practices, or services of third-party websites.</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>9. Termination of Access</h2>
            <p>We reserve the right to:</p>
            <ul>
              <li>Suspend or terminate your access without prior notice if you violate these terms</li>
              <li>Take legal action if necessary</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>10. Changes to These Terms</h2>
            <p>We may modify these Terms & Conditions at any time. Updates will be posted on this page with the new effective date.</p>
          </section>

          <section className="terms-section">
            <h2>11. Governing Law</h2>
            <p>These terms shall be governed by and interpreted according to applicable laws, without regard to conflict of law principles.</p>
          </section>

          <section className="terms-section">
            <h2>12. Contact Us</h2>
            <p>For questions about these Terms & Conditions, please contact:</p>
            <div className="contact-info">
              <p><strong>Omegle Web Support Team</strong></p>
              <p>📧 Email: mmohddaudkahan70@gmail.com</p>
              <p>🌐 Website: omegleonline.xyz</p>
            </div>
          </section>

          <div className="terms-footer">
            <p>Thank you for using Omegle Web responsibly! 🌟</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
