import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--admin-bg)' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(79, 70, 229, 0.2)', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // If they are admin but try to access something else, or if they are employee but try to access admin stuff
    if (currentUser.role === 'COMPANY_ADMIN' || currentUser.role === 'SUPER_ADMIN') {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/home" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
