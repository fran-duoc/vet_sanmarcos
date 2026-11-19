import { describe, it, expect } from 'vitest';
import {
  mapearProductoBackendAFrontend,
  mapearProductoFrontendABackend
} from './productoService';

describe('productoService - Mapeo de datos Frontend / Backend', () => {
  it('mapea correctamente un Producto del backend (Spring Boot) al formato del Frontend', () => {
    const backendProd = {
      id: 1,
      nombre: 'Alimento Perro Adulto',
      descripcion: 'Nutrición balanceada',
      precio: 45990,
      stock: 25,
      activo: true,
      fechaIngreso: '2026-01-10'
    };

    const frontendProd = mapearProductoBackendAFrontend(backendProd);

    expect(frontendProd.id).toBe(1);
    expect(frontendProd.titulo).toBe('Alimento Perro Adulto');
    expect(frontendProd.nombre).toBe('Alimento Perro Adulto');
    expect(frontendProd.precioNumero).toBe(45990);
    expect(frontendProd.precio).toContain('45.990');
    expect(frontendProd.stock).toBe(25);
    expect(frontendProd.activo).toBe(true);
  });

  it('mapea correctamente un producto del Frontend a la entidad Producto de Spring Boot', () => {
    const frontendProd = {
      titulo: 'Nuevo Medicamento',
      descripcion: 'Para alergias caninas',
      precio: '$12.500',
      stock: 15,
      categoria: 'Medicamentos'
    };

    const backendProd = mapearProductoFrontendABackend(frontendProd);

    expect(backendProd.nombre).toBe('Nuevo Medicamento');
    expect(backendProd.descripcion).toBe('Para alergias caninas');
    expect(backendProd.precio).toBe(12500);
    expect(backendProd.stock).toBe(15);
    expect(backendProd.activo).toBe(true);
    expect(backendProd.fechaIngreso).toBeDefined();
  });
});
