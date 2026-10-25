import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import TarjetaProducto from './TarjetaProducto';
import { CartProvider } from '../context/CartContext';
import imgBadge from '../assets/img/badge.jpg';

describe('TarjetaProducto', () => {
  it('Debe cambiar el texto del botón a "Guardado en favoritos" al hacer click.', () => {
    // Arrange (Preparación)
    const productoMock = {
      id: 1,
      imagen: imgBadge,
      titulo: 'Alimento Perro Adulto',
      descripcion: 'Alimento completo y balanceado',
      precio: '$45.990',
      precioNumero: 45990
    };

    // Act (Acción)
    render(
      <MemoryRouter>
        <CartProvider>
          <TarjetaProducto {...productoMock} />
        </CartProvider>
      </MemoryRouter>
    );

    const botonFavoritos = screen.getByRole('button', { name: /favoritos/i });
    fireEvent.click(botonFavoritos);

    // Assert (Verificación)
    expect(botonFavoritos.textContent).toContain('Guardado en favoritos');
  });

  it('Debe mostrar feedback "¡Agregado al carrito!" al hacer click en agregar', () => {
    // Arrange (Preparación)
    const productoMock = {
      id: 2,
      imagen: imgBadge,
      titulo: 'Pipeta Antiparasitaria Gato',
      descripcion: 'Tratamiento antiparasitario',
      precio: '$11.500',
      precioNumero: 11500
    };

    // Act (Acción)
    render(
      <MemoryRouter>
        <CartProvider>
          <TarjetaProducto {...productoMock} />
        </CartProvider>
      </MemoryRouter>
    );

    const botonAgregar = screen.getByRole('button', { name: /agregar al carrito/i });
    fireEvent.click(botonAgregar);

    // Assert (Verificación)
    expect(botonAgregar.textContent).toContain('¡Agregado al carrito!');
  });
});
