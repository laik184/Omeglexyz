import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OmegleWeb from './components/OmegleWeb.jsx';
import PrivacyPolicy from './components/PrivacyPolicy.jsx';
import TermsConditions from './components/TermsConditions.jsx';
import About from './components/About.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OmegleWeb />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
