function Footer({ anio = 2026, empresa = 'Veterinaria San Marcos' }) {
  return (
    <footer id="contacto">
      <div className="footer-contenido">
        <p>&copy; {anio} {empresa}. Todos los derechos reservados.</p>
        <p>Ubicación: Av. Principal 1234, Rancagua | Teléfono: +56 9 72 2XX XXXX</p>
      </div>
    </footer>
  );
}

export default Footer;
