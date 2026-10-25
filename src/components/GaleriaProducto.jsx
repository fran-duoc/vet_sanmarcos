import TarjetaProducto from './TarjetaProducto';

function GaleriaProductos({ productos = [] }) {
  if (!productos || productos.length === 0) {
    return (
      <div className="text-center my-4 p-4 sin-productos">
        <p>No se encontraron productos en este criterio de búsqueda.</p>
      </div>
    );
  }

  return (
    <div className="catalogo-grid">
      {productos.map((producto) => (
        <TarjetaProducto
          key={producto.id}
          id={producto.id}
          imagen={producto.imagen}
          titulo={producto.titulo}
          descripcion={producto.descripcion}
          precio={producto.precio}
          precioNumero={producto.precioNumero}
          categoria={producto.categoria}
          especie={producto.especie}
          receta={producto.receta}
          rangoEdadPeso={producto.rangoEdadPeso}
        />
      ))}
    </div>
  );
}

export default GaleriaProductos;
