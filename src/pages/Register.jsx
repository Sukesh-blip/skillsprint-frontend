import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import toast from 'react-hot-toast';
import { ShieldAlert } from 'lucide-react';
import './Auth.css';

const Register = () => {
  const [showAdminFields, setShowAdminFields] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'USER',
    adminKey: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Filter out admin fields if not showing them to keep payload clean for public users
    const payload = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      ...(showAdminFields ? { role: 'ADMIN', adminKey: formData.adminKey } : {})
    };

    try {
      await api.post('/api/auth/register', payload);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container fade-in">
      <div className="auth-card glass-panel">
        <h2>{showAdminFields ? 'Admin Registration' : 'Create Account'}</h2>
        <p className="auth-subtitle">
          {showAdminFields ? 'Secure administrator access' : 'Join the SkillSprint community'}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              className="form-control"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              placeholder="Pick a username"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="you@example.com"
            />
          </div>

          {showAdminFields && (
            <div className="form-group admin-fade-in">
              <label>Admin Secret Key</label>
              <div className="input-with-icon">
                <input
                  type="password"
                  className="form-control admin-input"
                  value={formData.adminKey}
                  onChange={(e) => setFormData({ ...formData, adminKey: e.target.value })}
                  required
                  placeholder="Enter administrator key"
                />
                <ShieldAlert className="input-icon-right text-primary" size={18} />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
            {isLoading ? 'Processing...' : (showAdminFields ? 'Initialize Admin' : 'Register')}
          </button>
        </form>

        <div className="auth-footer-container">
          <p className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </p>
          <button
            type="button"
            className="admin-toggle-link"
            onClick={() => setShowAdminFields(!showAdminFields)}
          >
            {showAdminFields ? 'Switch to Regular User' : 'Register as Admin?'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
