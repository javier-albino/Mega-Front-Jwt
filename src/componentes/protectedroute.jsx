// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../storage/store'; // Ajusta la ruta según tu estructura

const ProtectedRoute = ({ children }) => {
  const token = useAuthStore.getState().token;

  if (!token) {
    // Si no hay token, redirige al login
    return <Navigate to="/login" />;
  }

  // Si hay token, renderiza el contenido protegido
  return children;
};

export default ProtectedRoute;