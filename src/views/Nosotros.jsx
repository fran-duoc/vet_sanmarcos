import Header from '../components/Header';
import Footer from '../components/Footer';
import NosotrosContenido from '../components/Nosotros';
import { itemsMenu } from '../data/itemsMenu';

function Nosotros() {
  return (
    <div className="vista-contenedor">
      <Header
        titulo="Sobre Veterinaria San Marcos"
        subtitulo="Más de 15 años cuidando la salud y bienestar de tus mascotas en Rancagua."
        itemsMenu={itemsMenu}
      />
      <main className="d-flex justify-content-center">
        <NosotrosContenido />
      </main>
      <Footer anio={2026} empresa="Veterinaria San Marcos" />
    </div>
  );
}

export default Nosotros;
