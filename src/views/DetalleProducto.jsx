import { useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Button, Badge, Alert } from 'react-bootstrap';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { itemsMenu } from '../data/itemsMenu';
import { useCart } from '../context/CartContext';

// Importación de imágenes
import imgBadge from '../assets/img/badge.jpg';
import imgPipeta from '../assets/img/pipeta.jpg';
import imgChampu from '../assets/img/champu-mascota.jpg';
import imgSetDental from '../assets/img/set-dental.jpg';
import imgArena from '../assets/img/arena-gato.jpg';
import imgMultivitaminico from '../assets/img/multivitaminico.jpg';
import imgTucan from '../assets/img/tucan.jpg';
import imgConejo from '../assets/img/comida_conejo.jpg';

// Lista de productos para búsqueda por ID
const listaProductos = [
  {
    id: 1,
    titulo: "Alimento Perro Adulto",
    descripcion: "Alimento completo y balanceado formulado con proteínas de alta calidad e ingredientes naturales que facilitan una digestión saludable en perros adultos.",
    precio: "$45.990",
    categoria: "Alimentos",
    especie: "Perro",
    imagen: imgBadge
  },
  {
    id: 2,
    titulo: "Pipeta Antiparasitaria Gato",
    descripcion: "Tratamiento antiparasitario de aplicación tópica que elimina y previene pulgas, garrapatas y ácaros, brindando protección continua durante 30 días.",
    precio: "$11.500",
    categoria: "Medicamentos",
    especie: "Gato",
    imagen: imgPipeta
  },
  {
    id: 3,
    titulo: "Champú Hipoalergénico",
    descripcion: "Fórmula suave especialmente diseñada para perros y gatos con piel sensible o propensos a irritaciones, libre de parabenos y químicos agresivos.",
    precio: "$8.990",
    categoria: "Higiene",
    especie: "Perro / Gato",
    imagen: imgChampu
  },
  {
    id: 4,
    titulo: "Set Dental Canino y Felino",
    descripcion: "Kit completo de higiene oral que remueve la acumulación de placa bacteriana, previene la formación de sarro y mantiene un aliento fresco.",
    precio: "$3.490",
    categoria: "Higiene",
    especie: "Perro / Gato",
    imagen: imgSetDental
  },
  {
    id: 5,
    titulo: "Arena Sanitaria Aglomerante",
    descripcion: "Arena de alta absorción que forma aglomerados firmes para una limpieza rápida y sencilla, neutralizando eficazmente los malos olores del arenero.",
    precio: "$13.990",
    categoria: "Higiene",
    especie: "Gato",
    imagen: imgArena
  },
  {
    id: 6,
    titulo: "Suplemento Multivitamínico",
    descripcion: "Suplemento nutricional con vitaminas y minerales esenciales diseñado para fortalecer el sistema inmune, la salud articular y mantener un pelaje brillante.",
    precio: "$14.990",
    categoria: "Medicamentos",
    especie: "Perro / Gato",
    imagen: imgMultivitaminico
  },
  {
    id: 7,
    titulo: "Juguete para Mascota Tucán",
    descripcion: "Juguete interactivo de textura resistente con sonido integrado, ideal para estimular el instinto de juego, el ejercicio físico y reducir el estrés.",
    precio: "$13.990",
    categoria: "Accesorios",
    especie: "Perro / Gato",
    imagen: imgTucan
  },
  {
    id: 8,
    titulo: "Alimento para Conejo Purina",
    descripcion: "Mezcla nutritiva rica en fibra cruda y nutrientes esenciales, formulada especialmente para favorecer el desgaste dental y una óptima digestión en conejos.",
    precio: "$27.990",
    categoria: "Alimentos",
    especie: "Conejo",
    imagen: imgConejo
  }
];

function DetalleProducto() {
  const { id } = useParams();
  const location = useLocation();
  const { agregarAlCarrito } = useCart();

  const [cantidad, setCantidad] = useState(1);
  const [mensajeExito, setMensajeExito] = useState(false);

  // Buscar el producto por id de la URL o usar el estado pasado en la navegación
  const productoState = location.state;
  const productoEncontrado = listaProductos.find((p) => String(p.id) === String(id));
  const producto = productoState || productoEncontrado;

  const handleAgregar = () => {
    if (producto) {
      agregarAlCarrito(producto, cantidad);
      setMensajeExito(true);
      setTimeout(() => setMensajeExito(false), 2500);
    }
  };

  if (!producto) {
    return (
      <div className="vista-contenedor">
        <Header
          titulo="Producto No Encontrado"
          subtitulo="El producto solicitado no existe o fue retirado del catálogo."
          itemsMenu={itemsMenu}
        />
        <main className="d-flex justify-content-center my-5">
          <section className="seccion text-center">
            <h2>Producto No Encontrado</h2>
            <p>No pudimos encontrar el artículo que estás buscando.</p>
            <Link to="/productos" className="btn btn-success">
              Volver al Catálogo
            </Link>
          </section>
        </main>
        <Footer anio={2026} empresa="Veterinaria San Marcos" />
      </div>
    );
  }

  const tituloProducto = producto.titulo || producto.nombre;

  return (
    <div className="vista-contenedor">
      <Header
        titulo="Detalle del Producto"
        subtitulo={tituloProducto}
        itemsMenu={itemsMenu}
      />

      <main className="d-flex justify-content-center">
        <section className="seccion detalle-producto-contenedor text-center my-4">
          <div className="detalle-imagen-wrapper mb-3">
            <img
              src={producto.imagen}
              alt={tituloProducto}
              className="img-fluid rounded"
              style={{ maxHeight: '280px', objectFit: 'contain' }}
            />
          </div>

          <h2>{tituloProducto}</h2>

          <div className="d-flex justify-content-center flex-wrap gap-2 my-2">
            {producto.categoria && (
              <Badge bg="info" className="text-dark">
                Categoría: {producto.categoria}
              </Badge>
            )}
            {producto.especie && (
              <Badge bg="secondary">
                Especie: {producto.especie}
              </Badge>
            )}
            {producto.receta && (
              <Badge bg={producto.receta === 'Retenida' ? 'danger' : 'success'}>
                Receta: {producto.receta}
              </Badge>
            )}
            {producto.rangoEdadPeso && (
              <Badge bg="light" text="dark" className="border">
                {producto.rangoEdadPeso}
              </Badge>
            )}
          </div>

          <p className="my-3 text-start mx-auto" style={{ maxWidth: '550px' }}>
            {producto.descripcion}
          </p>

          <p className="precio fs-3 my-2" style={{ color: '#2a9d8f', fontWeight: 'bold' }}>
            {producto.precio}
          </p>

          {mensajeExito && (
            <Alert variant="success" className="my-3">
              ¡{cantidad} {cantidad === 1 ? 'unidad agregada' : 'unidades agregadas'} al carrito con éxito!
            </Alert>
          )}

          {/* Selector de cantidad y botón agregar */}
          <div className="d-flex justify-content-center align-items-center gap-2 my-3">
            <label htmlFor="cantidad-input" className="fw-bold mb-0">Cantidad:</label>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setCantidad((prev) => Math.max(1, prev - 1))}
            >
              -
            </Button>
            <input
              id="cantidad-input"
              type="number"
              min="1"
              max="99"
              value={cantidad}
              onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value, 10) || 1))}
              style={{ width: '60px', textAlign: 'center', padding: '5px' }}
            />
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setCantidad((prev) => prev + 1)}
            >
              +
            </Button>
          </div>

          <div className="d-flex flex-column flex-sm-row justify-content-center gap-2 mt-4">
            <Button
              onClick={handleAgregar}
              style={{
                backgroundColor: '#2a9d8f',
                borderColor: '#2a9d8f',
                color: '#ffffff',
                fontWeight: 'bold',
                padding: '10px 24px'
              }}
            >
              Agregar al carrito
            </Button>

            <Link to="/productos">
              <Button
                variant="outline-secondary"
                style={{ fontWeight: 'bold', padding: '10px 24px' }}
              >
                Volver a Productos
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer anio={2026} empresa="Veterinaria San Marcos" />
    </div>
  );
}

export default DetalleProducto;