import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api/v1/productos';

// Configuración de Axios para enviar el token JWT en formato Bearer si existe en localStorage
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class ProductoService {
  obtenerTodos() {
    return axios.get(BASE_URL);
  }

  buscarPorId(id) {
    return axios.get(`${BASE_URL}/${id}`);
  }

  guardar(producto) {
    return axios.post(BASE_URL, producto);
  }

  actualizar(id, producto) {
    return axios.put(`${BASE_URL}/${id}`, producto);
  }

  eliminarPorId(id) {
    return axios.delete(`${BASE_URL}/${id}`);
  }
}

/**
 * Funciones de mapeo de datos Frontend / Backend
 */
export function mapearProductoBackendAFrontend(backendProd) {
  if (!backendProd) return null;
  const precioNumerico = typeof backendProd.precio === 'number'
    ? backendProd.precio
    : parseInt(String(backendProd.precio || '0').replace(/\D/g, ''), 10) || 0;

  return {
    id: backendProd.id,
    titulo: backendProd.nombre || 'Producto',
    nombre: backendProd.nombre || 'Producto',
    descripcion: backendProd.descripcion || '',
    precioNumero: precioNumerico,
    precio: `$${precioNumerico.toLocaleString('es-CL')}`,
    stock: backendProd.stock ?? 10,
    activo: backendProd.activo ?? true,
    fechaIngreso: backendProd.fechaIngreso || new Date().toISOString().split('T')[0],
    categoria: backendProd.categoria || 'Alimentos',
    especie: backendProd.especie || 'Perro'
  };
}

export function mapearProductoFrontendABackend(frontendProd) {
  if (!frontendProd) return {};
  let precio = 0;
  if (typeof frontendProd.precioNumero === 'number' && !isNaN(frontendProd.precioNumero)) {
    precio = frontendProd.precioNumero;
  } else if (typeof frontendProd.precio === 'number' && !isNaN(frontendProd.precio)) {
    precio = frontendProd.precio;
  } else if (typeof frontendProd.precio === 'string') {
    precio = parseInt(frontendProd.precio.replace(/\D/g, ''), 10) || 0;
  }

  const stock = frontendProd.stock !== undefined && frontendProd.stock !== null && !isNaN(Number(frontendProd.stock))
    ? Number(frontendProd.stock)
    : 10;

  const activo = frontendProd.activo !== undefined && frontendProd.activo !== null
    ? Boolean(frontendProd.activo)
    : true;

  const fechaIngreso = frontendProd.fechaIngreso && String(frontendProd.fechaIngreso).trim() !== ''
    ? String(frontendProd.fechaIngreso)
    : new Date().toISOString().split('T')[0];

  return {
    id: frontendProd.id ? Number(frontendProd.id) : undefined,
    nombre: (frontendProd.titulo || frontendProd.nombre || '').trim(),
    descripcion: (frontendProd.descripcion || '').trim(),
    precio,
    stock,
    activo,
    fechaIngreso
  };
}

export default new ProductoService();
