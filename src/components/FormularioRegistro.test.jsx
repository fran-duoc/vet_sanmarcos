import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import FormularioRegistro from './FormularioRegistro';
import { AuthProvider } from '../context/AuthContext';

describe('FormularioRegistro', () => {
  it('Valida los campos obligatorios de contexto veterinario (¿Tienes mascotas? y cuántas)', () => {
    // Arrange (Preparación)
    render(
      <MemoryRouter>
        <AuthProvider>
          <FormularioRegistro />
        </AuthProvider>
      </MemoryRouter>
    );

    const radioSi = screen.getByLabelText(/^Sí$/i);
    const radioNo = screen.getByLabelText(/^No$/i);
    const inputCantidad = screen.getByLabelText(/¿Cuántas mascotas tienes\?/i);
    const botonEnviar = screen.getByRole('button', { name: /aceptar/i });

    // Assert inicial: el campo de cantidad debe estar deshabilitado inicialmente
    expect(inputCantidad).toBeDisabled();

    // Act 1: Intentar enviar sin seleccionar si tiene mascotas
    fireEvent.click(botonEnviar);

    // Assert 1: Debe requerir indicar si tiene mascotas
    expect(screen.getByText(/Debes indicar si tienes mascotas/i)).toBeInTheDocument();

    // Act 2: Seleccionar que Sí tiene mascotas
    fireEvent.click(radioSi);

    // Assert 2: El campo de cantidad de mascotas debe habilitarse
    expect(inputCantidad).not.toBeDisabled();

    // Act 3: Enviar con cantidad vacía
    fireEvent.click(botonEnviar);

    // Assert 3: Debe exigir ingresar cuántas mascotas tiene
    expect(screen.getByText(/Debes ingresar cuántas mascotas tienes/i)).toBeInTheDocument();

    // Act 4: Ingresar 2 mascotas y cambiar a No
    fireEvent.change(inputCantidad, { target: { value: '2' } });
    expect(inputCantidad.value).toBe('2');

    fireEvent.click(radioNo);
    // Assert 4: Al seleccionar No, debe deshabilitar y fijar en 0
    expect(inputCantidad).toBeDisabled();
    expect(inputCantidad.value).toBe('0');
  });
});
