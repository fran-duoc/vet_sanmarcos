import Header from '../components/Header';
import Footer from '../components/Footer';
import FormularioRegistro from '../components/FormularioRegistro';
import { itemsMenu } from '../data/itemsMenu';

function Registro() {
  return (
    <div className="vista-contenedor">
      <Header
        titulo="Registro de Usuario"
        subtitulo="Únete a la comunidad de Veterinaria San Marcos y cuida de tus mascotas."
        itemsMenu={itemsMenu}
      />

      <main className="d-flex justify-content-center">
        <FormularioRegistro />
      </main>

      <Footer anio={2026} empresa="Veterinaria San Marcos" />
    </div>
  );
}

export default Registro;
