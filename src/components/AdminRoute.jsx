import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const AdminRoute = () => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Checking permissions...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    toast.error('Permission Denied: Admin access required.');
    return <Navigate to="/challenges" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
