import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';

describe('Header', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('Renderiza correctamente el título, subtítulo y elementos del menú principal', () => {
    // Arrange (Preparación)
    const itemsMock = [
      { href: '/', label: 'Inicio' },
      { href: '/productos', label: 'Productos' }
    ];

    // Act (Acción)
    render(
      <MemoryRouter>
        <AuthProvider>
          <CartProvider>
            <Header
              titulo="Veterinaria San Marcos"
              subtitulo="Soluciones de salud para tus mascotas."
              itemsMenu={itemsMock}
            />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    // Assert (Verificación)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Veterinaria San Marcos');
    expect(screen.getByText('Soluciones de salud para tus mascotas.')).toBeInTheDocument();
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Productos')).toBeInTheDocument();
  });

  it('Permite alternar entre Modo Claro y Modo Oscuro al pulsar el botón correspondiente', () => {
    // Arrange (Preparación)
    render(
      <MemoryRouter>
        <AuthProvider>
          <CartProvider>
            <Header itemsMenu={[]} />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    const botonTema = screen.getByRole('button', { name: /alternar tema/i });

    // Act (Acción)
    expect(botonTema.textContent).toContain('Modo Oscuro');
    fireEvent.click(botonTema);

    // Assert (Verificación)
    expect(botonTema.textContent).toContain('Modo Claro');
    expect(localStorage.getItem('tema')).toBe('oscuro');
  });
});
