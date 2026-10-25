import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import { AuthProvider, CREDENCIALES_ADMIN } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';

describe('Login', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('Validación de campos requeridos en Login (error si están vacíos)', () => {
    // Arrange (Preparación)
    render(
      <MemoryRouter>
        <AuthProvider>
          <CartProvider>
            <Login />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    const botonIngresar = screen.getByRole('button', { name: /ingresar/i });

    // Act (Acción)
    fireEvent.click(botonIngresar);

    // Assert (Verificación)
    expect(screen.getByText(/El correo electrónico es obligatorio/i)).toBeInTheDocument();
    expect(screen.getByText(/La contraseña es obligatoria/i)).toBeInTheDocument();
  });

  it('Autenticación exitosa con credenciales correctas guardando datos en localStorage', async () => {
    // Arrange (Preparación)
    render(
      <MemoryRouter>
        <AuthProvider>
          <CartProvider>
            <Login />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    const inputEmail = screen.getByLabelText(/Email:/i);
    const inputPass = screen.getByLabelText(/Contraseña:/i);
    const botonIngresar = screen.getByRole('button', { name: /ingresar/i });

    // Act (Acción)
    fireEvent.change(inputEmail, { target: { value: CREDENCIALES_ADMIN.email } });
    fireEvent.change(inputPass, { target: { value: CREDENCIALES_ADMIN.password } });
    fireEvent.click(botonIngresar);

    // Assert (Verificación)
    await waitFor(() => {
      const authGuardada = localStorage.getItem('usuarioAutenticado');
      expect(authGuardada).not.toBeNull();
      const usuario = JSON.parse(authGuardada);
      expect(usuario.email).toBe(CREDENCIALES_ADMIN.email);
      expect(usuario.rol).toBe('admin');
    });

    expect(screen.getByText(/¡Inicio de sesión exitoso!/i)).toBeInTheDocument();
  });

  it('Fallo de autenticación con credenciales incorrectas', async () => {
    // Arrange (Preparación)
    render(
      <MemoryRouter>
        <AuthProvider>
          <CartProvider>
            <Login />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    const inputEmail = screen.getByLabelText(/Email:/i);
    const inputPass = screen.getByLabelText(/Contraseña:/i);
    const botonIngresar = screen.getByRole('button', { name: /ingresar/i });

    // Act (Acción)
    fireEvent.change(inputEmail, { target: { value: 'usuario_erroneo@gmail.com' } });
    fireEvent.change(inputPass, { target: { value: 'ClaveInvalida123*' } });
    fireEvent.click(botonIngresar);

    // Assert (Verificación)
    await waitFor(() => {
      expect(screen.getByText(/El correo o la contraseña son incorrectos/i)).toBeInTheDocument();
    });
    expect(localStorage.getItem('usuarioAutenticado')).toBeNull();
  });
});
