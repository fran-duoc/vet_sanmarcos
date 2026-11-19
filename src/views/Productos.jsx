import { useState, useMemo, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GaleriaProductos from '../components/GaleriaProducto';
import { itemsMenu } from '../data/itemsMenu';
import { Form, Button, InputGroup, Modal, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../services/productoService';

const CATEGORIAS = ['Todas', 'Alimentos', 'Medicamentos', 'Accesorios', 'Higiene'];

function Productos() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [listaProductos, setListaProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Verificación de credenciales de Administrador
  let usuario = null;
  try {
    const auth = useAuth();
    usuario = auth?.usuario;
  } catch {
    usuario = null;
  }
  const esAdmin = Boolean(usuario && usuario.rol === 'admin');

  // Estado para el modal de Crear / Editar producto
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoAEditar, setProductoAEditar] = useState(null);
  const [formulario, setFormulario] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: 10,
    categoria: 'Alimentos',
    especie: 'Perro'
  });

  // Cargar productos desde Spring Boot al montar la vista
  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setCargando(true);
      const data = await obtenerProductos();
      setListaProductos(data);
    } catch (err) {
      console.error('Error al cargar productos desde backend:', err);
    } finally {
      setCargando(false);
    }
  };

  const handleAbrirCrear = () => {
    if (!esAdmin) {
      alert('Acceso restringido: Debes iniciar sesión como administrador para crear productos.');
      return;
    }
    setProductoAEditar(null);
    setFormulario({
      nombre: '',
      descripcion: '',
      precio: '',
      stock: 10,
      categoria: 'Alimentos',
      especie: 'Perro'
    });
    setModalAbierto(true);
  };

  const handleAbrirEditar = (producto) => {
    if (!esAdmin) {
      alert('Acceso restringido: Debes iniciar sesión como administrador para editar productos.');
      return;
    }
    setProductoAEditar(producto);
    setFormulario({
      nombre: producto.titulo || producto.nombre || '',
      descripcion: producto.descripcion || '',
      precio: producto.precioNumero ?? (parseInt(String(producto.precio || '').replace(/\D/g, ''), 10) || ''),
      stock: producto.stock ?? 10,
      categoria: producto.categoria || 'Alimentos',
      especie: producto.especie || 'Perro'
    });
    setModalAbierto(true);
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!esAdmin) {
      alert('Acceso restringido: Debes tener rol de administrador para guardar cambios.');
      return;
    }

    try {
      if (productoAEditar) {
        // Operación PUT / PATCH hacia el backend
        const datosActualizados = {
          ...productoAEditar,
          titulo: formulario.nombre,
          nombre: formulario.nombre,
          descripcion: formulario.descripcion,
          precioNumero: Number(formulario.precio),
          stock: Number(formulario.stock),
          categoria: formulario.categoria,
          especie: formulario.especie
        };
        const actualizado = await actualizarProducto(productoAEditar.id, datosActualizados);
        setListaProductos((prev) =>
          prev.map((p) => (p.id === actualizado.id ? actualizado : p))
        );
      } else {
        // Operación POST hacia el backend
        const nuevo = await crearProducto({
          titulo: formulario.nombre,
          nombre: formulario.nombre,
          descripcion: formulario.descripcion,
          precioNumero: Number(formulario.precio),
          stock: Number(formulario.stock),
          categoria: formulario.categoria,
          especie: formulario.especie
        });
        setListaProductos((prev) => [...prev, nuevo]);
      }
      setModalAbierto(false);
    } catch (err) {
      console.error('Error al guardar producto:', err);
      alert('Hubo un error al comunicar la operación con el backend Spring Boot.');
    }
  };

  const handleEliminar = async (id, titulo) => {
    if (!esAdmin) {
      alert('Acceso restringido: Debes tener rol de administrador para eliminar productos.');
      return;
    }

    const confirmar = window.confirm(`¿Deseas eliminar el producto "${titulo || id}" del catálogo?`);
    if (!confirmar) return;

    try {
      // Operación DELETE hacia el backend
      await eliminarProducto(id);
      setListaProductos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Error al eliminar producto:', err);
      alert('Hubo un error al eliminar el producto en el backend Spring Boot.');
    }
  };

  const productosFiltrados = useMemo(() => {
    return listaProductos.filter((prod) => {
      const coincideCategoria =
        categoriaSeleccionada === 'Todas' ||
        (prod.categoria && prod.categoria.toLowerCase() === categoriaSeleccionada.toLowerCase());

      const textoBusqueda = terminoBusqueda.trim().toLowerCase();
      const coincideTexto =
        textoBusqueda === '' ||
        (prod.titulo && prod.titulo.toLowerCase().includes(textoBusqueda)) ||
        (prod.nombre && prod.nombre.toLowerCase().includes(textoBusqueda)) ||
        (prod.descripcion && prod.descripcion.toLowerCase().includes(textoBusqueda)) ||
        (prod.especie && prod.especie.toLowerCase().includes(textoBusqueda));

      return coincideCategoria && coincideTexto;
    });
  }, [listaProductos, categoriaSeleccionada, terminoBusqueda]);

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

          {/* Panel de administración: visible SOLO cuando el usuario autenticado es Administrador */}
          {esAdmin && (
            <div className="d-flex justify-content-center align-items-center gap-3 mb-4">
              <Badge bg="success" className="px-3 py-2 fs-6">
                Modo Administrador
              </Badge>
              <Button
                onClick={handleAbrirCrear}
                style={{
                  backgroundColor: '#2a9d8f',
                  borderColor: '#2a9d8f',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  padding: '8px 20px'
                }}
              >
                + Agregar Nuevo Producto
              </Button>
            </div>
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
            {cargando ? (
              <span>Cargando productos desde el servidor...</span>
            ) : (
              <span>Mostrando {productosFiltrados.length} de {listaProductos.length} productos</span>
            )}
          </div>

          {/* Galería de Productos: botones Editar y Eliminar condicionados a esAdmin */}
          <GaleriaProductos
            productos={productosFiltrados}
            onEditar={esAdmin ? handleAbrirEditar : null}
            onEliminar={esAdmin ? handleEliminar : null}
          />
        </section>
      </main>

      {/* Modal para Crear y Editar Producto (Solo Administrador) */}
      <Modal show={modalAbierto} onHide={() => setModalAbierto(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#2a9d8f', color: '#ffffff' }}>
          <Modal.Title style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
            {productoAEditar ? 'Editar Producto (Admin)' : 'Nuevo Producto (Admin)'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleGuardar}>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="formNombreProducto">
              <Form.Label className="fw-bold">Nombre del Producto</Form.Label>
              <Form.Control
                type="text"
                required
                maxLength={100}
                placeholder="Ej. Alimento Premium Cachorro"
                value={formulario.nombre}
                onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDescripcionProducto">
              <Form.Label className="fw-bold">Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                maxLength={255}
                placeholder="Descripción veterinaria del producto"
                value={formulario.descripcion}
                onChange={(e) => setFormulario({ ...formulario, descripcion: e.target.value })}
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="formPrecioProducto">
                  <Form.Label className="fw-bold">Precio ($ CLP)</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    min={0}
                    placeholder="Ej. 19990"
                    value={formulario.precio}
                    onChange={(e) => setFormulario({ ...formulario, precio: e.target.value })}
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="formStockProducto">
                  <Form.Label className="fw-bold">Stock</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    min={0}
                    placeholder="Ej. 20"
                    value={formulario.stock}
                    onChange={(e) => setFormulario({ ...formulario, stock: e.target.value })}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="formCategoriaProducto">
                  <Form.Label className="fw-bold">Categoría</Form.Label>
                  <Form.Select
                    value={formulario.categoria}
                    onChange={(e) => setFormulario({ ...formulario, categoria: e.target.value })}
                  >
                    <option value="Alimentos">Alimentos</option>
                    <option value="Medicamentos">Medicamentos</option>
                    <option value="Higiene">Higiene</option>
                    <option value="Accesorios">Accesorios</option>
                  </Form.Select>
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group className="mb-3" controlId="formEspecieProducto">
                  <Form.Label className="fw-bold">Especie</Form.Label>
                  <Form.Select
                    value={formulario.especie}
                    onChange={(e) => setFormulario({ ...formulario, especie: e.target.value })}
                  >
                    <option value="Perro">Perro</option>
                    <option value="Gato">Gato</option>
                    <option value="Conejo">Conejo</option>
                    <option value="Exóticos">Exóticos</option>
                    <option value="Perro Gato">Perro Gato</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModalAbierto(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              style={{
                backgroundColor: '#2a9d8f',
                borderColor: '#2a9d8f',
                color: '#ffffff',
                fontWeight: 'bold'
              }}
            >
              {productoAEditar ? 'Guardar Cambios' : 'Crear Producto'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Footer anio={2026} empresa="Veterinaria San Marcos" />
    </div>
  );
}

export default Productos;
