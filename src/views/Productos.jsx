import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GaleriaProductos from '../components/GaleriaProducto';
import { itemsMenu } from '../data/itemsMenu';
import { Form, Button, InputGroup, Alert, Table } from 'react-bootstrap';
import ProductoService from '../services/ProductoService';
import { useAuth } from '../context/AuthContext';

import arena from '../assets/img/arena-gato.jpg';
import champu from '../assets/img/champu-mascota.jpg';
import com_conejo from '../assets/img/comida_conejo.jpg';
import ecopet from '../assets/img/ecopet.png';
import multivitaminico from '../assets/img/multivitaminico.jpg';
import pipeta from '../assets/img/pipeta.jpg';
import dental from '../assets/img/set-dental.jpg';
import tucan from '../assets/img/tucan.jpg';

const listaProductosDefault = [
  {
    id: 1,
    titulo: "Alimento Canino Premium 15kg",
    nombre: "Alimento Canino Premium 15kg",
    descripcion: "Alimento balanceado para perros adultos",
    precio: "$45.990",
    precioNumero: 45990,
    categoria: "Alimentos",
    especie: "Perro",
    imagen: ecopet
  },
  {
    id: 2,
    titulo: "Antiparasitario Pipeta Felino",
    nombre: "Antiparasitario Pipeta Felino",
    descripcion: "Tratamiento contra pulgas y garrapatas para gatos",
    precio: "$8.990",
    precioNumero: 8990,
    categoria: "Medicamentos",
    especie: "Gato",
    imagen: pipeta
  },
  {
    id: 3,
    titulo: "Shampoo Antipulgas Canino 500ml",
    nombre: "Shampoo Antipulgas Canino 500ml",
    descripcion: "Shampoo medicado para higiene canina",
    precio: "$6.500",
    precioNumero: 6500,
    categoria: "Higiene",
    especie: "Perro Gato",
    imagen: champu
  }
];

const CATEGORIAS = ['Todas', 'Alimentos', 'Medicamentos', 'Accesorios', 'Higiene'];

function Productos() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [listaProductos, setListaProductos] = useState([]);
  const [mensaje, setMensaje] = useState(null);

  const { esAdmin, estaAutenticado, usuario } = useAuth();

  const cargarProductos = () => {
    ProductoService.obtenerTodos()
      .then((response) => {
        const rawList = response.data._embedded?.productoList || (Array.isArray(response.data) ? response.data : []);
        const imagenesDisponibles = [ecopet, pipeta, champu, dental, arena, multivitaminico, tucan, com_conejo];

        const mapeados = rawList.map((item, idx) => {
          const imgElegida = imagenesDisponibles[idx % imagenesDisponibles.length];
          return {
            id: item.id,
            titulo: item.nombre,
            nombre: item.nombre,
            descripcion: item.descripcion || '',
            precio: typeof item.precio === 'number' ? `$${item.precio.toLocaleString('es-CL')}` : item.precio,
            precioNumero: typeof item.precio === 'number' ? item.precio : parseInt(String(item.precio).replace(/\D/g, ''), 10) || 0,
            stock: item.stock,
            activo: item.activo,
            categoria: item.categoria || 'Alimentos',
            especie: item.especie || 'Perro Gato',
            imagen: item.imagen || imgElegida
          };
        });

        setListaProductos(mapeados);
      })
      .catch((error) => {
        console.error('Error al cargar productos desde backend:', error);
        setListaProductos(listaProductosDefault);
      });
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const eliminarProducto = (id) => {
    if (window.confirm('¿Está seguro de eliminar este producto?')) {
      ProductoService.eliminarPorId(id)
        .then(() => {
          setMensaje({ tipo: 'success', texto: 'Producto eliminado exitosamente.' });
          cargarProductos();
        })
        .catch((error) => {
          console.error('Error al eliminar producto:', error);
          setMensaje({
            tipo: 'danger',
            texto: error.response?.status === 403
              ? 'Permiso denegado: solo ADMIN puede eliminar productos.'
              : 'Error al eliminar el producto.'
          });
        });
    }
  };

  const productosFiltrados = useMemo(() => {
    return listaProductos.filter((prod) => {
      const coincideCategoria =
        categoriaSeleccionada === 'Todas' ||
        (prod.categoria && prod.categoria.toLowerCase() === categoriaSeleccionada.toLowerCase());

      const textoBusqueda = terminoBusqueda.trim().toLowerCase();
      const tituloStr = (prod.titulo || prod.nombre || '').toLowerCase();
      const descStr = (prod.descripcion || '').toLowerCase();
      const espStr = (prod.especie || '').toLowerCase();

      const coincideTexto =
        textoBusqueda === '' ||
        tituloStr.includes(textoBusqueda) ||
        descStr.includes(textoBusqueda) ||
        espStr.includes(textoBusqueda);

      return coincideCategoria && coincideTexto;
    });
  }, [categoriaSeleccionada, terminoBusqueda, listaProductos]);

  return (
    <div className="vista-contenedor">
      <Header
        titulo="Catálogo de Productos"
        subtitulo="Encuentra los mejores productos y medicamentos para el cuidado de tu mascota."
        itemsMenu={itemsMenu}
      />

      <main className="d-flex flex-column align-items-center">
        <section id="banner-oferta" className="w-100 text-center">
          <h2>¡Lo mejor para tu mascota!</h2>
          <p>Encuentra alimento premium, accesorios y productos de salud al mejor precio.</p>
        </section>

        <section id="productos" className="seccion my-4 w-100">
          <h2>Catálogo de la Tienda</h2>
          <p className="text-center">Utiliza los filtros de categoría o el buscador para encontrar lo que necesitas:</p>

          {mensaje && (
            <Alert variant={mensaje.tipo} dismissible onClose={() => setMensaje(null)} className="mx-auto" style={{ maxWidth: '800px' }}>
              {mensaje.texto}
            </Alert>
          )}

          {/* Panel de administración CRUD visible exclusivamente para rol ADMIN */}
          {esAdmin && (
            <div className="admin-panel my-4 p-3 border rounded bg-light mx-auto" style={{ maxWidth: '950px' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0 text-success fw-bold">Panel de Gestión CRUD (Rol ADMIN)</h4>
                <Link to="/productos/nuevo" className="btn btn-success btn-sm fw-bold">
                  + Agregar Nuevo Producto
                </Link>
              </div>
              <Table bordered hover responsive className="bg-white align-middle small">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th style={{ width: '160px' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {listaProductos.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td><strong>{p.titulo || p.nombre}</strong></td>
                      <td>{p.descripcion}</td>
                      <td>{p.precio}</td>
                      <td>{p.stock}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <Link to={`/productos/editar/${p.id}`} className="btn btn-warning btn-sm">
                            Editar
                          </Link>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => eliminarProducto(p.id)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          {/* Mensaje informativo para rol USER */}
          {estaAutenticado && !esAdmin && (
            <Alert variant="info" className="mx-auto text-center" style={{ maxWidth: '800px' }}>
              Sesión iniciada como <strong>USER</strong> ({usuario?.nombre}). Tienes permisos para consultar el catálogo.
            </Alert>
          )}

          {/* Barra de Búsqueda y Filtros */}
          <div className="filtros-contenedor mb-4">
            <InputGroup className="mb-3">
              <Form.Control
                type="search"
                placeholder="Buscar por nombre, descripción o especie (ej. perro, pipeta)..."
                aria-label="Buscar productos"
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
              />
              {terminoBusqueda && (
                <Button
                  variant="outline-secondary"
                  onClick={() => setTerminoBusqueda('')}
                >
                  Limpiar
                </Button>
              )}
            </InputGroup>

            {/* Botones de Categorías */}
            <div className="d-flex flex-wrap justify-content-center gap-2">
              {CATEGORIAS.map((cat) => (
                <Button
                  key={cat}
                  variant={categoriaSeleccionada === cat ? 'success' : 'outline-success'}
                  size="sm"
                  onClick={() => setCategoriaSeleccionada(cat)}
                  style={{
                    backgroundColor: categoriaSeleccionada === cat ? '#2a9d8f' : 'transparent',
                    borderColor: '#2a9d8f',
                    color: categoriaSeleccionada === cat ? '#ffffff' : '#2a9d8f',
                    fontWeight: 'bold'
                  }}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          <div className="text-muted small text-center mb-3">
            Mostrando {productosFiltrados.length} de {listaProductos.length} productos
          </div>

          {/* Galería de Productos */}
          <GaleriaProductos productos={productosFiltrados} />
        </section>
      </main>

      <Footer anio={2026} empresa="Veterinaria San Marcos" />
    </div>
  );
}

export default Productos;
