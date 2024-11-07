import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ onLogout }) => {
  const [ownerEmail, setOwnerEmail] = useState('');
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  useEffect(() => {
    const email = sessionStorage.getItem('ownerEmail');
    if (email) {
      setOwnerEmail(email);
    }

    // Mendapatkan lokasi pengguna
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error fetching location:", error);
          setLocation({ latitude: "Unavailable", longitude: "Unavailable" });
        }
      );
    } else {
      setLocation({ latitude: "Unavailable", longitude: "Unavailable" });
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('ownerEmail');
    setOwnerEmail('');
    onLogout();
  };

  return (
    <header className="bg-light p-3 d-flex justify-content-between align-items-center">
      <h1 className="me-3">Jurdil</h1>
      <nav> 
         <Link to="/" className="btn btn-link text-decoration-none">Home</Link>
         <Link to="/submit-form" className="btn btn-link text-decoration-none">Submit Formulir</Link></nav>
      {ownerEmail && (
        <nav className="d-flex align-items-center">
          <div className="ms-4">
            <p className="mb-0">Account: {ownerEmail}</p>
          </div>
          <button className="btn btn-secondary ms-3" onClick={handleLogout}>Logout</button>
        </nav>
      )}
    </header>
  );
};

export default Header;
