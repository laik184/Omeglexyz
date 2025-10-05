import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/PrivacyPolicy.css';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="privacy-policy-page">
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

      <div className="privacy-container">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Home
        </button>

        <div className="privacy-content">
          <h1 className="privacy-title">🔒 Privacy Policy</h1>
          <p className="effective-date"><strong>Effective Date: January 2025</strong></p>
          
          <p className="intro-text">
            At Omegle Web, accessible from our website, your privacy is extremely important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our website and services.
          </p>

          <p className="intro-text">
            By using Omegle Web, you agree to the practices described in this policy. If you do not agree, please discontinue using our site.
          </p>

          <section className="policy-section">
            <h2>1. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            
            <h3>1. Personal Information (Optional)</h3>
            <ul>
              <li>If you voluntarily provide it during sign-up or contact (such as name, email address).</li>
              <li>We do not require personal details for using the random chat feature.</li>
            </ul>

            <h3>2. Non-Personal Information</h3>
            <ul>
              <li>Your browser type, device type, IP address, and operating system.</li>
              <li>Pages visited, time spent on our site, and referral links.</li>
            </ul>

            <h3>3. Cookies and Tracking Technologies</h3>
            <ul>
              <li>We use cookies to improve user experience, personalize content, and show relevant ads (including Google Ads).</li>
              <li>Third-party vendors, including Google, use cookies to serve ads based on your previous visits to our site or other sites.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>2. How We Use Your Information</h2>
            <p>We use the information collected for purposes such as:</p>
            <ul>
              <li>Providing and improving our services.</li>
              <li>Moderating chat rooms and ensuring user safety.</li>
              <li>Displaying personalized ads via Google AdSense.</li>
              <li>Analyzing website traffic and performance.</li>
              <li>Preventing fraud and protecting users.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>3. Google AdSense and Third-Party Advertising</h2>
            <ul>
              <li>Omegle Web uses Google AdSense to display relevant advertisements.</li>
              <li>Google AdSense uses cookies and web beacons to collect information about your visit to personalize ads.</li>
              <li>We do not have access to or control over the cookies used by Google AdSense.</li>
              <li>You can opt out of personalized advertising by visiting: <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ad Settings</a></li>
              <li>For more information about Google's privacy practices, visit: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
              <li>Third-party ad networks may also use cookies and tracking technologies to measure ad effectiveness and serve relevant ads.</li>
            </ul>
            <p className="note"><strong>Note:</strong> We are a participant in the Google AdSense program designed to provide a means for sites to earn advertising fees by advertising and linking to advertiser websites.</p>
          </section>

          <section className="policy-section">
            <h2>4. Data Sharing and Disclosure</h2>
            <p>We do not sell, rent, or trade your personal information to third parties. However, we may share information in the following cases:</p>
            <ul>
              <li><strong>Legal Requirements</strong> – If required by law, court order, or government authority.</li>
              <li><strong>Service Providers</strong> – With trusted partners who help us operate the website (e.g., hosting providers, analytics tools).</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>5. Data Security</h2>
            <p>We take reasonable measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, please note that no method of online transmission is 100% secure.</p>
          </section>

          <section className="policy-section">
            <h2>6. Children's Privacy</h2>
            <p>Our website is not directed toward children under the age of 13 (or the minimum legal age in your country). We do not knowingly collect personal information from minors. If we discover that a child has provided us with personal data, we will delete it immediately.</p>
          </section>

          <section className="policy-section">
            <h2>7. Links to Other Websites</h2>
            <p>Omegle Web may contain links to external websites. We are not responsible for the privacy practices or content of third-party websites.</p>
          </section>

          <section className="policy-section">
            <h2>8. User Safety in Chat Rooms</h2>
            <ul>
              <li>Do not share personal information such as your address, phone number, or passwords in chat.</li>
              <li>We use AI-powered and human moderation to detect inappropriate behavior.</li>
              <li>Any user violating our Community Guidelines may be banned.</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>9. Your Privacy Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul>
              <li>Access the personal data we have about you.</li>
              <li>Request correction or deletion of your data.</li>
              <li>Opt out of certain data processing activities.</li>
            </ul>
            <p>To exercise your rights, please contact us at our support email.</p>
          </section>

          <section className="policy-section">
            <h2>10. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with the updated effective date.</p>
          </section>

          <section className="policy-section">
            <h2>11. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
            <div className="contact-info">
              <p><strong>Omegle Web Support Team</strong></p>
              <p>📧 Email: mmohddaudkahan70@gmail.com</p>
              <p>🌐 Website: omegleonline.xyz</p>
            </div>
          </section>

          <div className="privacy-footer">
            <p>🔒 Your privacy is our priority 🔒</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
