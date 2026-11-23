import { useState } from 'react';
import { Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function TarjetaProducto({
  id = 1,
  imagen,
  titulo,
  descripcion,
  precio,
  precioNumero,
  categoria,
  especie,
  receta,
  rangoEdadPeso
}) {
  const [meGusta, setMeGusta] = useState(false);
  const [agregadoReciente, setAgregadoReciente] = useState(false);

  let agregarAlCarritoGlobal = null;
  try {
    const cart = useCart();
    agregarAlCarritoGlobal = cart.agregarAlCarrito;
  } catch {
    // Si se usa fuera del CartProvider (ej. en ciertos tests)
  }

  const alternarFavorito = () => {
    setMeGusta((prev) => !prev);
  };

  const manejarAgregarCarrito = () => {
    if (agregarAlCarritoGlobal) {
      agregarAlCarritoGlobal({
        id,
        imagen,
        titulo,
        descripcion,
        precio,
        precioNumero,
        categoria,
        especie,
        receta,
        rangoEdadPeso
      });
    }
    setAgregadoReciente(true);
    setTimeout(() => {
      setAgregadoReciente(false);
    }, 1800);
  };

  return (
    <article className="tarjeta-producto">
      <div className="espacio-imagen">
        <img src={imagen} alt={titulo} />
      </div>

      <div className="etiquetas-veterinarias mb-2">
        {categoria && (
          <Badge bg="info" className="me-1 text-dark">
            {categoria}
          </Badge>
        )}
        {especie && (
          <Badge bg="secondary" className="me-1">
            {especie}
          </Badge>
        )}
        {receta === 'Retenida' && (
          <Badge bg="danger">Receta Retenida</Badge>
        )}
      </div>

      <h3>{titulo}</h3>
      <p className="descripcion">{descripcion}</p>
      <p className="precio">{precio}</p>

      <div className="botones-tarjeta d-flex flex-column gap-2 mt-auto">
        <Link
          to={`/producto/${id}`}
          state={{ id, imagen, titulo, descripcion, precio, precioNumero, categoria, especie, receta, rangoEdadPeso }}
          className="text-decoration-none"
        >
          <Button
            className="w-100"
            style={{
              backgroundColor: '#2a9d8f',
              borderColor: '#2a9d8f',
              color: '#ffffff',
              fontWeight: 'bold'
            }}
          >
            Ver detalle
          </Button>
        </Link>

        <Button
          onClick={alternarFavorito}
          style={{
            backgroundColor: meGusta ? '#264653' : '#2a9d8f',
            borderColor: meGusta ? '#264653' : '#2a9d8f',
            color: '#ffffff',
            fontWeight: 'bold'
          }}
        >
          {meGusta ? 'Guardado en favoritos' : 'Agregar en favoritos'}
        </Button>

        <Button
          onClick={manejarAgregarCarrito}
          style={{
            backgroundColor: agregadoReciente ? '#e76f51' : '#2a9d8f',
            borderColor: agregadoReciente ? '#e76f51' : '#2a9d8f',
            color: '#ffffff',
            fontWeight: 'bold'
          }}
        >
          {agregadoReciente ? '¡Agregado al carrito!' : 'Agregar al carrito'}
        </Button>
      </div>
    </article>
  );
}

export default TarjetaProducto;
