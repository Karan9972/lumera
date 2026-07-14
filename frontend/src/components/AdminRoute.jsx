import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div class="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-accent"></div>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
