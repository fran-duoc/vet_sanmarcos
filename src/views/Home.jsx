import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { itemsMenu } from '../data/itemsMenu';
import imgInstalaciones from '../assets/img/IMG_6383.jpeg';
import imgAtencion from '../assets/img/IMG_6381.jpeg';
import imgProductos from '../assets/img/productos.jpeg';
import imgPoster from '../assets/img/atencion.jpeg';

function Home() {
  return (
    <>
      <Header
        titulo="Veterinaria San Marcos"
        subtitulo="Soluciones de salud, cuidado y productos para tus mascotas."
        itemsMenu={itemsMenu}
      />

      <section id="banner">
        <h2>Bienvenido a Clínica San Marcos</h2>
        <p>Cuidamos a los que más quieres con atención profesional, amor y la mejor calidad del mercado.</p>
        <br />
        <Link to="/productos" className="btn-comprar">
          Explora nuestro catálogo...
        </Link>
      </section>

      <section className="presentacion">
        <h2>Nuestra clínica y sus compromisos</h2>
        <p>
          En Veterinaria San Marcos contamos con más de 15 años de experiencia dedicados al cuidado integral de sus mascotas. Nos especializamos en consultas médicas, medicina preventiva, grooming y una tienda abastecida con alimentos de alta gama y accesorios seleccionados.
        </p>

        <div className="galeria">
          <div className="img veterinaria">
            <p className="descripcion imagen">Instalaciones de nuestra sucursal</p>
            <img src={imgInstalaciones} alt="Instalaciones Veterinaria San Marcos" width="447" height="447" />
          </div>
          <div className="img atencion">
            <p className="descripcion imagen">Atención médica</p>
            <img src={imgAtencion} alt="Cuidado de mascotas" width="450" height="338" />
          </div>
          <div className="img productos">
            <p className="descripcion imagen">Nuestros productos</p>
            <img src={imgProductos} alt="Nuestros productos" width="450" height="300" />
          </div>
        </div>
      </section>

      <section className="seccion seccion-video">
        <h2>Conoce nuestra Veterinaria</h2>
        <p>Te invitamos a ver el video de presentación de nuestra Clínica Veterinaria San Marcos.</p>

        <div className="contenedor-video">
          <video width="560" height="315" controls poster={imgPoster}>
            <source src="/video/video.mp4.mp4" type="video/mp4" />
            Tu navegador no soporta la reproducción de videos en HTML5.
          </video>
        </div>
        <br />
        <Link to="/productos" className="btn-comprar">
          Ver todos los productos disponibles
        </Link>
      </section>

      <Footer anio={2026} empresa="Veterinaria San Marcos" />
    </>
  );
}

export default Home;
