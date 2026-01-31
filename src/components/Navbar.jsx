import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Terminal, Shield, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <div className="navbar-left">
          <Link to="/" className="logo">
            <Terminal size={24} />
            <span>SkillSprint</span>
          </Link>
        </div>

        <div className="nav-links">
          {user ? (
            <>
              {isAdmin && (
                <div className="admin-badge">
                  <Shield size={14} />
                  <span>Admin Mode</span>
                </div>
              )}
              <Link to="/challenges" className="nav-link">Challenges</Link>

              <div className="user-profile-nav">
                <div className="avatar-circle">
                  <User size={14} />
                </div>
                <span className="welcome-text">Hi, {user.username}</span>
              </div>

              <button onClick={handleLogout} className="logout-btn" title="Logout">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
