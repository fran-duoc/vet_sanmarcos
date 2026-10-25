import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Badge } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Header({
  titulo = 'Veterinaria San Marcos',
  subtitulo = 'Soluciones de salud, cuidado y productos para tus mascotas.',
  itemsMenu = []
}) {
  const [modoOscuro, setModoOscuro] = useState(() => {
    try {
      return localStorage.getItem('tema') === 'oscuro';
    } catch {
      return false;
    }
  });

  // Intentamos obtener contexto de carrito y auth de forma segura
  let totalItems = 0;
  let usuario = null;
  let logout = () => {};

  try {
    const cart = useCart();
    totalItems = cart.totalItems;
  } catch {
    // Fuera de provider (por ejemplo en tests aislados)
  }

  try {
    const auth = useAuth();
    usuario = auth.usuario;
    logout = auth.logout;
  } catch {
    // Fuera de provider
  }

  useEffect(() => {
    try {
      if (modoOscuro) {
        document.body.classList.add('modo-oscuro');
        localStorage.setItem('tema', 'oscuro');
      } else {
        document.body.classList.remove('modo-oscuro');
        localStorage.setItem('tema', 'claro');
      }
    } catch {
      // Ignorar en entornos de prueba sin DOM completo
    }
  }, [modoOscuro]);

  const alternarTema = () => {
    setModoOscuro((prev) => !prev);
  };

  return (
    <header id="encabezado">
      <div className="logo-titulo">
        <h1>{titulo}</h1>
      </div>
      <p>{subtitulo}</p>

      <div className="header-acciones-top">
        <Button
          variant="outline-light"
          size="sm"
          onClick={alternarTema}
          className="btn-toggle-tema"
          aria-label="Alternar tema claro y oscuro"
        >
          {modoOscuro ? 'Modo Claro' : 'Modo Oscuro'}
        </Button>

        {usuario && (
          <span className="saludo-usuario">
            Hola, <strong>{usuario.nombre}</strong> |{' '}
            <button
              onClick={logout}
              className="btn-link-logout"
              type="button"
            >
              Cerrar sesión
            </button>
          </span>
        )}
      </div>

      <nav aria-label="Menú principal">
        <ul>
          {itemsMenu.map((item) => {
            const esCarrito = item.href === '/carrito';
            const esLogin = item.href === '/login';

            // Si está logueado, no mostrar "Iniciar Sesión"
            if (usuario && esLogin) {
              return null;
            }

            return (
              <li key={item.href}>
                <Link to={item.href} className="btn-menu">
                  {item.label}
                  {esCarrito && totalItems > 0 && (
                    <Badge bg="danger" className="ms-1" pill>
                      {totalItems}
                    </Badge>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
