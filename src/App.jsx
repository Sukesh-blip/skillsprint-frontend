import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Challenges from './pages/Challenges';
import ChallengeDetail from './pages/ChallengeDetail';
import SubmissionHistory from './pages/SubmissionHistory';
import AdminCreateChallenge from './pages/AdminCreateChallenge';
import AdminUpdateChallenge from './pages/AdminUpdateChallenge';
import { AuthProvider } from './context/AuthContext.jsx';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)'
          },
        }}
      />
      <Router>
        <div className="app-container">
          <Navbar />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Private Routes (All Users) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/challenges" element={<Challenges />} />
                <Route path="/challenges/:id" element={<ChallengeDetail />} />
                <Route path="/challenges/:id/submissions" element={<SubmissionHistory />} />
              </Route>

              {/* Admin-Only Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin/create-challenge" element={<AdminCreateChallenge />} />
                <Route path="/admin/update-challenge/:id" element={<AdminUpdateChallenge />} />
              </Route>

              {/* Redirects */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
