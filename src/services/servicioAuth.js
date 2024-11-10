import useAuthStore from './../storage/store';

const getTokenOrThrow = () => {
  const token = useAuthStore.getState().token;
  if (!token) {
    throw new Error('Token no disponible. Asegúrate de estar autenticado.');
  }
  return token;
};

const login = async (username, password) => {
  try {
    const response = await fetch('http://localhost:8080/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) throw new Error('Error en la autenticación');
    const data = await response.json();
    useAuthStore.getState().setToken(data.token);
    return data.token;
  } catch (error) {
    console.error('Error en login:', error);
    return null;
  }
};

const saveProduct = async (descripcion, nombre) => {
  try {
    const token = getTokenOrThrow();
    const response = await fetch('http://localhost:8080/products/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ descripcion, nombre }),
    });
    if (!response.ok) throw new Error('Error al guardar el producto');
    return await response.json();
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
    if (!response.ok) throw new Error('Error al obtener la lista de productos');
    return await response.json();
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
    if (!response.ok) throw new Error('Error al eliminar el producto');
    return true;
  } catch (error) {
    console.error('Error en deleteProduct:', error);
    return false;
  }
};

const updateProduct = async (productId, descripcion, nombre) => {
  try {
    const token = getTokenOrThrow();
    const response = await fetch(`http://localhost:8080/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ descripcion, nombre }),
    });
    if (!response.ok) throw new Error('Error al actualizar el producto');
    return await response.json();
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
    if (!response.ok) throw new Error('Error al obtener el valor de la UF');
    return await response.json(); // Devuelve el valor de la UF
  } catch (error) {
    console.error('Error en getUf:', error);
    return null;
  }
};

export { login, saveProduct, getProducts, deleteProduct, updateProduct, getUf };
