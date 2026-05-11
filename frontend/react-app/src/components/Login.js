import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'password') {
      const user = {
        username,
        loginTime: new Date().toISOString(),
        sessionId: Math.random().toString(36).substr(2, 9)
      };
      login(user);
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <div className="logo-section">
        <div className="logo">
          <span>🏳️</span>
        </div>
        <h1>Gender Management</h1>
        <p>System Login</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        <button type="submit" className="login-btn">🔓 Login</button>

        <div className="error-message" style={{ display: error ? 'block' : 'none' }}>
          {error}
        </div>
      </form>

      <div className="demo-info">
        <p><strong>Demo Credentials:</strong></p>
        <p>Username: <strong>admin</strong></p>
        <p>Password: <strong>password</strong></p>
      </div>
    </div>
  );
};

export default Login;