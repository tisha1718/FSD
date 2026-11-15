import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

export default function LoginPage({ setCurrentView }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await api.login({ email, password });
      login(res.token, res.user);
      showToast(`Welcome back, ${res.user.name}!`, 'success');
      if (res.user.role === 'admin') {
        setCurrentView('/admin/dashboard');
      } else {
        setCurrentView('/dashboard');
      }
    } catch (err) {
      showToast(err.message || 'Login failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const quickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-card-header">
          <h2>Welcome Back</h2>
          <p>Sign in to manage your parking passes or explore slots</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="e.g. user@parkify.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-auth-submit" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="quick-fill-section">
          <span>Quick Fill Demo Credentials:</span>
          <div className="quick-fill-buttons">
            <button 
              type="button" 
              className="btn-quick-fill"
              onClick={() => quickFill('user@parkify.com', 'user123')}
            >
              Fill Regular User
            </button>
            <button 
              type="button" 
              className="btn-quick-fill admin"
              onClick={() => quickFill('admin@parkify.com', 'admin123')}
            >
              Fill Admin
            </button>
          </div>
        </div>

        <div className="auth-footer-text">
          Don't have an account yet?{' '}
          <button className="link-button" onClick={() => setCurrentView('register')}>
            Register here
          </button>
        </div>
      </div>
    </div>
  );
}
