// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './componentes/login'; // Asegúrate de que esté en la ruta correcta
import Home from './componentes/home';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal que muestra Login */}
        <Route path="/" element={<Login />} />  
        
        {/* Ruta secundaria para Home */}
        <Route path="/home" element={<Home />} />
        
        {/* Redirección a la página de login si se intenta acceder a una ruta no definida */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
