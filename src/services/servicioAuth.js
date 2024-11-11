import useAuthStore from './../storage/store';

const getTokenOrThrow = () => {
  const token = useAuthStore.getState().token;
  if (!token) {
    throw new Error('Token no disponible. Asegúrate de estar autenticado.');
  }
  return token;
};

// Función para manejar las respuestas HTTP
const handleResponse = async (response) => {
  if (!response.ok) {
    if (response.status === 404 || response.status === 204) {
      throw new Error(`Error ${response.status}: El recurso no fue encontrado.`);
    }
    const error = await response.json();
    throw new Error(error.message || 'Error en la solicitud');
  }
  return response.status === 204 ? null : await response.json();
};

const login = async (username, password) => {
  try {
    const response = await fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await handleResponse(response);
    useAuthStore.getState().setToken(data.token);
    return data.token;
  } catch (error) {
    console.error('Error en login:', error);
    return null;
  }
};

const saveProduct = async (descripcion, nombre, categoriaId) => {
  try {
    const token = getTokenOrThrow();
    const response = await fetch('http://localhost:8080/products/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ descripcion, nombre, categoriaId }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error en saveProduct:', error);
    return null;
  }
};

const getProducts = async () => {
  try {
    const token = getTokenOrThrow();
    const response = await fetch('http://localhost:8080/products/listar', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error en getProducts:', error);
    return null;
  }
};

const deleteProduct = async (productId) => {
  try {
    const token = getTokenOrThrow();
    const response = await fetch(`http://localhost:8080/products/${productId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    await handleResponse(response);
    return true;
  } catch (error) {
    console.error('Error en deleteProduct:', error);
    return false;
  }
};

const updateProduct = async (productId, descripcion, nombre, categoriaId) => {
  try {
    const token = getTokenOrThrow();
    const response = await fetch(`http://localhost:8080/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ descripcion, nombre, categoriaId }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error en updateProduct:', error);
    return null;
  }
};

const getUf = async () => {
  try {
    const response = await fetch('http://localhost:8080/products/uf', {
      method: 'GET',
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error en getUf:', error);
    return null;
  }
};

export { login, saveProduct, getProducts, deleteProduct, updateProduct, getUf };
