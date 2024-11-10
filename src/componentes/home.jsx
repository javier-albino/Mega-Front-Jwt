import React, { useEffect, useState } from 'react';
import { saveProduct, getProducts, deleteProduct, updateProduct, getUf } from './../services/servicioAuth';
import { getCategorias } from './../services/categoriaService'; // Importa la función para obtener categorías
import useAuthStore from './../storage/store';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoriaId, setCategoriaId] = useState(''); // Estado para el ID de la categoría seleccionada
  const [categorias, setCategorias] = useState([]); // Estado para almacenar las categorías
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

    const fetchCategorias = async () => {
      const categoriaList = await getCategorias();
      if (categoriaList) {
        setCategorias(categoriaList);
      }
    };

    const fetchUfValue = async () => {
      const uf = await getUf();
      setUfValue(uf); // Almacena el valor de la UF en el estado
    };

    fetchProducts();
    fetchCategorias(); // Llamada para cargar las categorías
    fetchUfValue(); // Llamada para obtener el valor de la UF
  }, [token]);

  const handleSaveProduct = async () => {
    if (!token) {
      console.log("Token no disponible. Asegúrate de estar autenticado.");
      return;
    }

    if (nombre && descripcion && categoriaId) {
      if (editingProductId) {
        const updatedProduct = await updateProduct(editingProductId, descripcion, nombre, categoriaId);
        if (updatedProduct) {
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product.id === editingProductId ? updatedProduct : product
            )
          );
          setEditingProductId(null);
          setNombre('');
          setDescripcion('');
          setCategoriaId('');
        }
      } else {
        const newProduct = await saveProduct(descripcion, nombre, categoriaId);
        if (newProduct) {
          setProducts((prevProducts) => [...prevProducts, newProduct]);
          setNombre('');
          setDescripcion('');
          setCategoriaId('');
        }
      }
    } else {
      alert('Por favor ingrese el nombre, descripción y categoría del producto.');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product.id);
    setNombre(product.nombre);
    setDescripcion(product.descripcion);
    setCategoriaId(product.categoriaId || product.categoria?.id); // Asigna la categoría actual al estado
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
            <th>Categoría</th> {/* Columna para mostrar el nombre de la categoría */}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.nombre}</td>
              <td>{product.descripcion}</td>
              <td>{product.categoriaNombre || 'Sin categoría'}</td> {/* Muestra el nombre de la categoría o "Sin categoría" */}
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
        <label>
          Categoría del Producto:
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            style={{ display: 'block', marginBottom: '1em', padding: '0.5em', width: '100%' }}
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </label>
        <button onClick={handleSaveProduct} style={{ padding: '0.5em 1em', cursor: 'pointer' }}>
          {editingProductId ? 'Actualizar Producto' : 'Guardar Producto'}
        </button>
      </div>
    </div>
  );
};

export default Home;
