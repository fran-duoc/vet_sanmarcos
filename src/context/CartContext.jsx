/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

export const CartContext = createContext(null);

export function limpiarPrecio(valor) {
  if (typeof valor === 'number') return valor;
  if (!valor) return 0;
  const soloNumeros = String(valor).replace(/[^0-9]/g, '');
  return parseInt(soloNumeros, 10) || 0;
}

export function formatearPesosChilenos(numero) {
  return `$${Number(numero || 0).toLocaleString('es-CL')}`;
}

export function CartProvider({ children }) {
  const [itemsCarrito, setItemsCarrito] = useState(() => {
    try {
      const guardado = localStorage.getItem('carrito_sanmarcos');
      return guardado ? JSON.parse(guardado) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('carrito_sanmarcos', JSON.stringify(itemsCarrito));
    } catch {
      // Ignorar error de almacenamiento
    }
  }, [itemsCarrito]);

  const agregarAlCarrito = (producto, cantidad = 1) => {
    const precioNumerico = producto.precioNumero || limpiarPrecio(producto.precio);
    setItemsCarrito((prev) => {
      const index = prev.findIndex((item) => item.id === producto.id);
      if (index >= 0) {
        const copia = [...prev];
        copia[index] = {
          ...copia[index],
          cantidad: copia[index].cantidad + cantidad
        };
        return copia;
      }
      return [
        ...prev,
        {
          id: producto.id,
          imagen: producto.imagen,
          titulo: producto.titulo || producto.nombre,
          precio: producto.precio,
          precioNumero: precioNumerico,
          cantidad: cantidad,
          categoria: producto.categoria || 'General'
        }
      ];
    });
  };

  const eliminarDelCarrito = (id) => {
    setItemsCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(id);
      return;
    }
    setItemsCarrito((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, cantidad: nuevaCantidad } : item
      )
    );
  };

  const vaciarCarrito = () => {
    setItemsCarrito([]);
  };

  const total = itemsCarrito.reduce(
    (acum, item) => acum + item.precioNumero * item.cantidad,
    0
  );

  const totalItems = itemsCarrito.reduce(
    (acum, item) => acum + item.cantidad,
    0
  );

  return (
    <CartContext.Provider
      value={{
        itemsCarrito,
        agregarAlCarrito,
        eliminarDelCarrito,
        actualizarCantidad,
        vaciarCarrito,
        total,
        totalItems,
        formatearPesosChilenos
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser utilizado dentro de un CartProvider');
  }
  return context;
}
