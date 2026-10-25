import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Carrito from './Carrito';
import { CartProvider, useCart } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import imgBadge from '../assets/img/badge.jpg';

// Componente auxiliar para probar acciones sobre el carrito
function ComponentePruebaCarrito() {
  const { agregarAlCarrito } = useCart();
  return (
    <div>
      <button
        onClick={() =>
          agregarAlCarrito({
            id: 1,
            titulo: 'Alimento Perro Adulto',
            precio: '$45.990',
            precioNumero: 45990,
            imagen: imgBadge,
            categoria: 'Alimentos'
          })
        }
      >
        Añadir Test
      </button>
      <Carrito />
    </div>
  );
}

describe('Carrito', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('Agregado de un producto al carrito y cálculo correcto del subtotal y total', () => {
    // Arrange (Preparación)
    render(
      <MemoryRouter>
        <AuthProvider>
          <CartProvider>
            <ComponentePruebaCarrito />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    // Inicialmente el carrito está vacío
    expect(screen.getByText(/Tu carrito de compras está actualmente vacío/i)).toBeInTheDocument();

    // Act (Acción): Agregar un producto al carrito
    const botonAdd = screen.getByText('Añadir Test');
    fireEvent.click(botonAdd);

    // Assert (Verificación): Debe mostrar el producto, cantidad 1, subtotal $45.990 y total
    expect(screen.getByText('Alimento Perro Adulto')).toBeInTheDocument();
    expect(screen.getAllByText(/\$45\.990/i).length).toBeGreaterThan(0);

    // Act 2: Aumentar cantidad a 2 con el botón "+"
    const botonMas = screen.getByRole('button', { name: '+' });
    fireEvent.click(botonMas);

    // Assert 2: Subtotal de 2 unidades = $91.980
    expect(screen.getAllByText(/\$91\.980/i).length).toBeGreaterThan(0);
  });

  it('Eliminación de un producto del carrito', () => {
    // Arrange (Preparación)
    render(
      <MemoryRouter>
        <AuthProvider>
          <CartProvider>
            <ComponentePruebaCarrito />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    // Agregar producto
    const botonAdd = screen.getByText('Añadir Test');
    fireEvent.click(botonAdd);
    expect(screen.getByText('Alimento Perro Adulto')).toBeInTheDocument();

    // Act (Acción): Pulsar el botón Eliminar
    const botonEliminar = screen.getByRole('button', { name: /eliminar alimento perro adulto/i });
    fireEvent.click(botonEliminar);

    // Assert (Verificación): El carrito vuelve a estar vacío
    expect(screen.queryByText('Alimento Perro Adulto')).not.toBeInTheDocument();
    expect(screen.getByText(/Tu carrito de compras está actualmente vacío/i)).toBeInTheDocument();
  });
});
