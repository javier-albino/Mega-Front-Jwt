import React, { useEffect, useState } from 'react';
import { saveProduct, getProducts, deleteProduct, updateProduct, getUf } from './../services/servicioAuth';
import useAuthStore from './../storage/store';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [editingProductId, setEditingProductId] = useState(null);
  const [ufValue, setUfValue] = useState(null); // Estado para el valor de la UF
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const fetchProducts = async () => {
      if (token) {
        const productList = await getProducts();
        if (productList) {
          setProducts(productList);
        }
      } else {
        console.log('Token no disponible. Asegúrate de estar autenticado.');
      }
    };

    const fetchUfValue = async () => {
      const uf = await getUf();
      setUfValue(uf); // Almacena el valor de la UF en el estado
    };

    fetchProducts();
    fetchUfValue(); // Llamar a la función para obtener el valor de la UF
  }, [token]);

  const handleSaveProduct = async () => {
    if (!token) {
      console.log("Token no disponible. Asegúrate de estar autenticado.");
      return;
    }

    if (nombre && descripcion) {
      if (editingProductId) {
        const updatedProduct = await updateProduct(editingProductId, descripcion, nombre);
        if (updatedProduct) {
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product.id === editingProductId ? updatedProduct : product
            )
          );
          setEditingProductId(null);
          setNombre('');
          setDescripcion('');
        }
      } else {
        const newProduct = await saveProduct(descripcion, nombre);
        if (newProduct) {
          setProducts((prevProducts) => [...prevProducts, newProduct]);
          setNombre('');
          setDescripcion('');
        }
      }
    } else {
      alert('Por favor ingrese el nombre y la descripción del producto.');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product.id);
    setNombre(product.nombre);
    setDescripcion(product.descripcion);
  };

  const handleDeleteProduct = async (productId) => {
    if (!token) {
      console.log("Token no disponible. Asegúrate de estar autenticado.");
      return;
    }

    const success = await deleteProduct(productId);
    if (success) {
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
    }
  };

  return (
    <div>
      <h2>Listar, Guardar, Editar y Eliminar Productos</h2>
      {ufValue !== null && <p>Valor actual de la UF: {ufValue}</p>} {/* Muestra el valor de la UF */}
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.nombre}</td>
              <td>{product.descripcion}</td>
              <td>
                <button onClick={() => handleEditProduct(product)}>Editar</button>
                <button onClick={() => handleDeleteProduct(product.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '1em' }}>
        <label>
          Nombre del Producto:
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            style={{ display: 'block', marginBottom: '1em', padding: '0.5em', width: '100%' }}
          />
        </label>
        <label>
          Descripción del Producto:
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            style={{ display: 'block', marginBottom: '1em', padding: '0.5em', width: '100%' }}
          />
        </label>
        <button onClick={handleSaveProduct} style={{ padding: '0.5em 1em', cursor: 'pointer' }}>
          {editingProductId ? 'Actualizar Producto' : 'Guardar Producto'}
        </button>
      </div>
    </div>
  );
};

export default Home;
