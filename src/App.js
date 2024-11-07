// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Header';
import Login from './Login';
import PollSummary from './PollSummary'; // Import the new component
import SubmitForm from './SubmitForm';
import FullscreenCaptureViewer from './FullscreenCaptureViewer';
import AssetDetail from './AssetDetail';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const authToken = sessionStorage.getItem('authToken');
    setIsLoggedIn(!!authToken);
  }, []);

  const handleLoginSuccess = (ownerEmail) => {
    setIsLoggedIn(true);
    sessionStorage.setItem('ownerEmail', ownerEmail);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('authToken');
  };

  return (
    <Router>
      <Header onLogout={handleLogout} />
      <div className="container mt-5">
        {isLoggedIn ? (
          <Routes>
            <Route path="/" element={<PollSummary />} /> {/* Direct to PollSummary on Home */}
            <Route path="/submit-form" element={<SubmitForm />} />
            <Route path="/asset-detail/:nid" element={<AssetDetail />} />
            <Route path="/fullscreen-viewer/:nid" element={<FullscreenCaptureViewer />} />
          </Routes>
        ) : (
          <Login setOwnerEmail={handleLoginSuccess} />
        )}
      </div>
    </Router>
  );
};

export default App;
