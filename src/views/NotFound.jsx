import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { itemsMenu } from '../data/itemsMenu';

function NotFound() {
  return (
    <div className="vista-contenedor">
      <Header
        titulo="Página No Encontrada"
        subtitulo="Error 404: Lo sentimos, la página que buscas no existe o ha sido movida."
        itemsMenu={itemsMenu}
      />

      <main className="d-flex justify-content-center my-5">
        <section className="seccion text-center p-5">
          <div className="icono-404 mb-3" style={{ fontSize: '4rem', fontWeight: 'bold', color: '#2a9d8f' }}>
            404
          </div>
          <h2>Página No Encontrada</h2>
          <p className="text-muted my-3">
            Parece que la dirección ingresada no coincide con ninguna sección de Veterinaria San Marcos.
          </p>
          <Link to="/" className="btn-comprar mt-2">
            Volver al Inicio
          </Link>
        </section>
      </main>

      <Footer anio={2026} empresa="Veterinaria San Marcos" />
    </div>
  );
}

export default NotFound;
