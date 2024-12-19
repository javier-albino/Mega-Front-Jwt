// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './componentes/login'; // Ruta correcta del componente Login
import Home from './componentes/home'; // Ruta correcta del componente Home
import ProtectedRoute from './componentes/protectedroute'; // Ruta correcta del ProtectedRoute
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal que muestra el login */}
        <Route path="/" element={<Login />} />

        {/* Ruta protegida para Home */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Ruta para redirigir cualquier URL no definida */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
