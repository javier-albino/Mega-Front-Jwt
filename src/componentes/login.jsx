// login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from './../services/servicioAuth';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reinicia el estado de error
    try {
      const token = await login(username, password);
      console.log('Token recibido:', token); // Mostrar el token en la consola
      if (token) {
        localStorage.setItem('token', token); // Guarda el token en localStorage
        navigate('/home'); // Navega a /home si el token existe
      }
    } catch (error) {
      console.error('Error en la autenticación:', error);
      setError('Credenciales inválidas. Por favor, intenta nuevamente.');
    }
  };

  return (
    <div style={{ maxWidth: '300px', margin: '0 auto', padding: '1em', textAlign: 'center' }}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1em' }}>
          <label>
            Nombre de Usuario:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: '100%', padding: '0.5em', marginTop: '0.5em' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '1em' }}>
          <label>
            Contraseña:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '0.5em', marginTop: '0.5em' }}
            />
          </label>
        </div>
        {error && (
          <div style={{ color: 'red', marginBottom: '1em' }}>
            {error}
          </div>
        )}
        <button type="submit" style={{ padding: '0.5em 1em', cursor: 'pointer' }}>
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};

export default Login;
