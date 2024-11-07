// Login.js
import React, { useState } from 'react';

const Login = ({ setOwnerEmail }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message

    try {
      const loginResponse = await fetch('https://api.numbersprotocol.io/api/v3/auth/token/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        const authToken = loginData.auth_token;

        // Store token in session storage
        sessionStorage.setItem('authToken', authToken);

        // Retrieve wallet information
        const walletResponse = await fetch('https://api.numbersprotocol.io/api/v3/wallets/asset-wallet/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${authToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (walletResponse.ok) {
          const walletData = await walletResponse.json();
          
          // Store owner email in session storage and update state
          sessionStorage.setItem('ownerEmail', walletData.owner);
          setOwnerEmail(walletData.owner);
        } else {
          setError('Failed to retrieve wallet information.');
        }
      } else {
        setError('Invalid login credentials.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <img 
          src="https://docs.numbersprotocol.io/~gitbook/image?url=https%3A%2F%2F2105393165-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FsJ8b1FUIurgQducTQQ2z%252Ficon%252FGESQrT3sY11SevpMjuNC%252FNumbers_Icon%2520Black.png%3Falt%3Dmedia%26token%3D85a352b2-7a2a-4082-8f74-7e4da830096b&width=32&dpr=2&quality=100&sign=20b1bb67&sv=1"
          alt="Numbers Protocol"
          width="80"
          height="80"
          className="mb-3"
        />
        <h4>Please Sign Up via Numbers Camera</h4>
      </div>
      
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
};

export default Login;
