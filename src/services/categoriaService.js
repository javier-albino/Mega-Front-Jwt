import useAuthStore from './../storage/store';

const getCategorias = async () => {
  try {
    // Obtener el token del store
    const token = useAuthStore.getState().token;

    const response = await fetch('http://localhost:8080/categorias/listar', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Agregar el token en el encabezado
      },
    });
    
    if (!response.ok) throw new Error('Error al obtener las categorías');
    
    return await response.json();
  } catch (error) {
    console.error('Error en getCategorias:', error);
    return [];
  }
};

export { getCategorias };
