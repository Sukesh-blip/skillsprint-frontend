import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/api';
import toast from 'react-hot-toast';
import { ShieldAlert } from 'lucide-react';
import './Auth.css';

const Login = () => {
  const { state } = useLocation();
  const [formData, setFormData] = useState({ username: '', password: '', role: 'USER', adminKey: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errorHeader, setErrorHeader] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (state?.message) {
      toast.success(state.message);
    }
  }, [state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorHeader('');

    // Prepare payload: only include adminKey if role is ADMIN
    const payload = {
      username: formData.username,
      password: formData.password,
      role: formData.role,
      ...(formData.role === 'ADMIN' ? { adminKey: formData.adminKey } : {})
    };

    try {
      const response = await api.post('/api/auth/login', payload);
      if (response.data && response.data.token) {
        login(response.data.token, response.data.role, response.data.username);
        toast.success(`Welcome back, ${response.data.username || formData.username}!`);
        navigate('/challenges');
      } else {
        toast.error('Invalid response from server');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials and role.';

      // Specifically catch Admin Key errors for the red alert box
      if (errorMessage.toLowerCase().includes('admin key') || errorMessage.toLowerCase().includes('secret admin key')) {
        setErrorHeader(errorMessage);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container fade-in">
      <div className="auth-card glass-panel">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Login to continue your sprint</p>

        {errorHeader && (
          <div className="alert-error fade-in">
            <ShieldAlert size={18} />
            <span>{errorHeader}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              className="form-control"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select
              className="form-control"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {formData.role === 'ADMIN' && (
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
            {isLoading ? 'Authenticating...' : 'Login'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
