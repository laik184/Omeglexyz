import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OmegleWeb from './components/OmegleWeb.jsx';
import PrivacyPolicy from './components/PrivacyPolicy.jsx';
import TermsConditions from './components/TermsConditions.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import NewEra from './components/NewEra.jsx';
import WelcomeToOmegleWeb from './components/WelcomeToOmegleWeb.jsx';
import GlobalCommunity from './components/GlobalCommunity.jsx';
import PrivacyFocusedDesign from './components/PrivacyFocusedDesign.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OmegleWeb />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/new-era" element={<NewEra />} />
        <Route path="/welcome" element={<WelcomeToOmegleWeb />} />
        <Route path="/global-community" element={<GlobalCommunity />} />
        <Route path="/privacy-design" element={<PrivacyFocusedDesign />} />
      </Routes>
    </Router>
  );
}

export default App;
