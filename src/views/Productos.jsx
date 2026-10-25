import { useState, useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GaleriaProductos from '../components/GaleriaProducto';
import { itemsMenu } from '../data/itemsMenu';
import { Form, Button, InputGroup } from 'react-bootstrap';


import arena from '../assets/img/arena-gato.jpg';
import champu from '../assets/img/champu-mascota.jpg';
import com_conejo from '../assets/img/comida_conejo.jpg';
import ecopet from '../assets/img/ecopet.png';
import multivitaminico from '../assets/img/multivitaminico.jpg';
import pipeta from '../assets/img/pipeta.jpg';
import dental from '../assets/img/set-dental.jpg';
import tucan from '../assets/img/tucan.jpg';

const listaProductos = [
  {
    id: 1,
    titulo: "Alimento Perro Adulto",
    descripcion: "Alimento completo y balanceado formulado con proteínas de alta calidad e ingredientes naturales que facilitan una digestión saludable en perros adultos.",
    precio: "$45.990",
    categoria: "Alimentos",
    especie: "Perro",
    imagen: ecopet
  },
  {
    id: 2,
    titulo: "Pipeta Antiparasitaria Gato",
    descripcion: "Tratamiento antiparasitario de aplicación tópica que elimina y previene pulgas, garrapatas y ácaros, brindando protección continua durante 30 días.",
    precio: "$11.500",
    categoria: "Medicamentos",
    especie: "Gato",
    imagen: pipeta
  },
  {
    id: 3,
    titulo: "Champú Hipoalergénico",
    descripcion: "Fórmula suave especialmente diseñada para perros y gatos con piel sensible o propensos a irritaciones, libre de parabenos y químicos agresivos.",
    precio: "$8.990",
    categoria: "Higiene",
    especie: "Perro Gato",
    imagen: champu
  },
  {
    id: 4,
    titulo: "Set Dental Canino y Felino",
    descripcion: "Kit completo de higiene oral que remueve la acumulación de placa bacteriana, previene la formación de sarro y mantiene un aliento fresco.",
    precio: "$3.490",
    categoria: "Higiene",
    especie: "Perro Gato",
    imagen: dental
  },
  {
    id: 5,
    titulo: "Arena Sanitaria Aglomerante",
    descripcion: "Arena de alta absorción que forma aglomerados firmes para una limpieza rápida y sencilla, neutralizando eficazmente los malos olores del arenero.",
    precio: "$13.990",
    categoria: "Higiene",
    especie: "Gato",
    imagen: arena
  },
  {
    id: 6,
    titulo: "Suplemento Multivitamínico",
    descripcion: "Suplemento nutricional con vitaminas y minerales esenciales diseñado para fortalecer el sistema inmune, la salud articular y mantener un pelaje brillante.",
    precio: "$14.990",
    categoria: "Medicamentos",
    especie: "Perro Gato",
    imagen: multivitaminico
  },
  {
    id: 7,
    titulo: "Juguete para Mascota Tucán",
    descripcion: "Juguete interactivo de textura resistente con sonido integrado, ideal para estimular el instinto de juego, el ejercicio físico y reducir el estrés.",
    precio: "$13.990",
    categoria: "Accesorios",
    especie: "Perro Gato",
    imagen: tucan
  },
  {
    id: 8,
    titulo: "Alimento para Conejo Purina",
    descripcion: "Mezcla nutritiva rica en fibra cruda y nutrientes esenciales, formulada especialmente para favorecer el desgaste dental y una óptima digestión en conejos.",
    precio: "$27.990",
    categoria: "Alimentos",
    especie: "Conejo",
    imagen: com_conejo
  }
];

const CATEGORIAS = ['Todas', 'Alimentos', 'Medicamentos', 'Accesorios', 'Higiene'];

function Productos() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  const productosFiltrados = useMemo(() => {
    return listaProductos.filter((prod) => {
      const coincideCategoria =
        categoriaSeleccionada === 'Todas' ||
        (prod.categoria && prod.categoria.toLowerCase() === categoriaSeleccionada.toLowerCase());

      const textoBusqueda = terminoBusqueda.trim().toLowerCase();
      const coincideTexto =
        textoBusqueda === '' ||
        prod.titulo.toLowerCase().includes(textoBusqueda) ||
        prod.descripcion.toLowerCase().includes(textoBusqueda) ||
        (prod.especie && prod.especie.toLowerCase().includes(textoBusqueda));

      return coincideCategoria && coincideTexto;
    });
  }, [categoriaSeleccionada, terminoBusqueda]);

  return (
    <div className="vista-contenedor">
      <Header
        titulo="Catálogo de Productos"
        subtitulo="Encuentra los mejores productos y medicamentos para el cuidado de tu mascota."
        itemsMenu={itemsMenu}
      />

      <main className="d-flex flex-column align-items-center">
        <section id="banner-oferta" className="w-100 text-center">
          <h2>¡Lo mejor para tu mascota!</h2>
          <p>Encuentra alimento premium, accesorios y productos de salud al mejor precio.</p>
        </section>

        <section id="productos" className="seccion my-4 w-100">
          <h2>Catálogo de la Tienda</h2>
          <p className="text-center">Utiliza los filtros de categoría o el buscador para encontrar lo que necesitas:</p>

          {/* Barra de Búsqueda y Filtros */}
          <div className="filtros-contenedor mb-4">
            <InputGroup className="mb-3">
              <Form.Control
                type="search"
                placeholder="Buscar por nombre, descripción o especie (ej. perro, pipeta)..."
                aria-label="Buscar productos"
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
              />
              {terminoBusqueda && (
                <Button
                  variant="outline-secondary"
                  onClick={() => setTerminoBusqueda('')}
                >
                  Limpiar
                </Button>
              )}
            </InputGroup>

            {/* Botones de Categorías */}
            <div className="d-flex flex-wrap justify-content-center gap-2">
              {CATEGORIAS.map((cat) => (
                <Button
                  key={cat}
                  variant={categoriaSeleccionada === cat ? 'success' : 'outline-success'}
                  size="sm"
                  onClick={() => setCategoriaSeleccionada(cat)}
                  style={{
                    backgroundColor: categoriaSeleccionada === cat ? '#2a9d8f' : 'transparent',
                    borderColor: '#2a9d8f',
                    color: categoriaSeleccionada === cat ? '#ffffff' : '#2a9d8f',
                    fontWeight: 'bold'
                  }}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          <div className="text-muted small text-center mb-3">
            Mostrando {productosFiltrados.length} de {listaProductos.length} productos
          </div>

          {/* Galería de Productos */}
          <GaleriaProductos productos={productosFiltrados} />
        </section>
      </main>

      <Footer anio={2026} empresa="Veterinaria San Marcos" />
    </div>
  );
}

export default Productos;