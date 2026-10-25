import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FormularioContacto from './FormularioContacto';

describe('FormularioContacto', () => {
  it('Debe permitir al usuario escribir un texto en el campo "Nombre"', () => {
    // Arrange (Preparación)
    render(<FormularioContacto />);
    const inputNombre = screen.getByLabelText(/Nombre:/i);

    // Act (Acción)
    fireEvent.change(inputNombre, { target: { value: 'Julio' } });

    // Assert (Verificación)
    expect(inputNombre.value).toBe('Julio');
  });
});
