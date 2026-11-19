import imgBadge from '../assets/img/badge.jpg';
import imgPipeta from '../assets/img/pipeta.jpg';
import imgChampu from '../assets/img/champu-mascota.jpg';
import imgSetDental from '../assets/img/set-dental.jpg';
import imgArena from '../assets/img/arena-gato.jpg';
import imgMultivitaminico from '../assets/img/multivitaminico.jpg';
import imgTucan from '../assets/img/tucan.jpg';
import imgConejo from '../assets/img/comida_conejo.jpg';
import imgDefault from '../assets/img/ecopet.png';
import { productos as productosEstaticos } from '../data/productos';

const API_BASE_URL = 'http://localhost:8081/api/v1/productos';

function obtenerHeadersConAuth() {
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  try {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  } catch {
    // Entornos sin localStorage
  }
  return headers;
}

const IMAGENES_POR_DEFECTO = {
  1: imgBadge,
  2: imgPipeta,
  3: imgChampu,
  4: imgSetDental,
  5: imgArena,
  6: imgMultivitaminico,
  7: imgTucan,
  8: imgConejo,
};

/**
 * Mapea la entidad del backend (Producto) al formato de datos esperado por los componentes React.
 */
export function mapearProductoBackendAFrontend(backendProd) {
  if (!backendProd) return null;

  const estatico = productosEstaticos.find((p) => p.id === backendProd.id);
  const precioNumerico = typeof backendProd.precio === 'number'
    ? backendProd.precio
    : parseInt(String(backendProd.precio || '0').replace(/\D/g, ''), 10) || 0;

  return {
    id: backendProd.id,
    titulo: backendProd.nombre || (estatico ? estatico.titulo : 'Producto'),
    nombre: backendProd.nombre || (estatico ? estatico.titulo : 'Producto'),
    descripcion: backendProd.descripcion ?? (estatico ? estatico.descripcion : ''),
    precioNumero: precioNumerico,
    precio: `$${precioNumerico.toLocaleString('es-CL')}`,
    stock: backendProd.stock ?? 10,
    activo: backendProd.activo ?? true,
    fechaIngreso: backendProd.fechaIngreso || new Date().toISOString().split('T')[0],
    categoria: backendProd.categoria || (estatico ? estatico.categoria : 'Alimentos'),
    especie: backendProd.especie || (estatico ? estatico.especie : 'Perro'),
    receta: backendProd.receta || (estatico ? estatico.receta : 'Libre'),
    rangoEdadPeso: backendProd.rangoEdadPeso || (estatico ? estatico.rangoEdadPeso : 'General'),
    imagen: backendProd.imagen || (estatico ? estatico.imagen : (IMAGENES_POR_DEFECTO[backendProd.id] || imgDefault))
  };
}

/**
 * Mapea los campos del frontend a la entidad Producto esperada por Spring Boot.
 */
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

/**
 * GET: Obtener todos los productos desde Spring Boot
 */
export async function obtenerProductos() {
  try {
    const res = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!res.ok) {
      throw new Error(`Error HTTP ${res.status} al consultar productos`);
    }

    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data.map(mapearProductoBackendAFrontend);
    }
    // Si la BD está vacía, retornar lista estática mapeada
    return productosEstaticos;
  } catch (error) {
    console.warn('Backend Spring Boot no disponible o error al consultar productos. Usando datos locales:', error);
    return productosEstaticos;
  }
}

/**
 * GET: Obtener un producto por ID desde Spring Boot
 */
export async function obtenerProductoPorId(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (!res.ok) {
      throw new Error(`Error HTTP ${res.status} al buscar producto ${id}`);
    }

    const data = await res.json();
    return mapearProductoBackendAFrontend(data);
  } catch (error) {
    console.warn(`Error al consultar producto ${id} en backend:`, error);
    const estatico = productosEstaticos.find((p) => String(p.id) === String(id));
    return estatico || null;
  }
}

/**
 * POST: Crear un nuevo producto en Spring Boot
 */
export async function crearProducto(producto) {
  const payload = mapearProductoFrontendABackend(producto);
  delete payload.id; // Permitir que JPA genere el ID autoincremental

  const res = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: obtenerHeadersConAuth(),
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => '');
    throw new Error(`Error ${res.status} al crear producto en backend: ${errorBody}`);
  }

  const nuevo = await res.json();
  const productoMapeado = mapearProductoBackendAFrontend(nuevo);

  // Preservar metadatos visuales del formulario frontend si se indicaron
  if (producto.categoria) productoMapeado.categoria = producto.categoria;
  if (producto.especie) productoMapeado.especie = producto.especie;
  if (producto.receta) productoMapeado.receta = producto.receta;
  if (producto.rangoEdadPeso) productoMapeado.rangoEdadPeso = producto.rangoEdadPeso;
  if (producto.imagen) productoMapeado.imagen = producto.imagen;

  return productoMapeado;
}

/**
 * PUT/PATCH: Actualizar un producto existente en Spring Boot
 */
export async function actualizarProducto(id, producto) {
  const payload = mapearProductoFrontendABackend(producto);

  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: obtenerHeadersConAuth(),
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => '');
    throw new Error(`Error ${res.status} al actualizar producto ${id}: ${errorBody}`);
  }

  const actualizado = await res.json();
  const productoMapeado = mapearProductoBackendAFrontend(actualizado);

  if (producto.categoria) productoMapeado.categoria = producto.categoria;
  if (producto.especie) productoMapeado.especie = producto.especie;
  if (producto.receta) productoMapeado.receta = producto.receta;
  if (producto.rangoEdadPeso) productoMapeado.rangoEdadPeso = producto.rangoEdadPeso;
  if (producto.imagen) productoMapeado.imagen = producto.imagen;

  return productoMapeado;
}

/**
 * DELETE: Eliminar un producto por ID en Spring Boot
 */
export async function eliminarProducto(id) {
  const headers = {};
  try {
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  } catch {
    // Entornos sin localStorage
  }

  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
    headers
  });

  if (!res.ok && res.status !== 204 && res.status !== 200) {
    throw new Error(`Error ${res.status} al eliminar producto ${id}`);
  }

  return true;
}
