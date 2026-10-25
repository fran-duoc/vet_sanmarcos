import { Card, Button, ListGroup, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { itemsMenu } from '../data/itemsMenu';
import { useAuth } from '../context/AuthContext';

function MiPerfil() {
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();

  const handleCerrarSesion = () => {
    logout();
    navigate('/login');
  };

  if (!usuario) {
    return null;
  }

  return (
    <div className="vista-contenedor">
      <Header
        titulo="Mi Perfil"
        subtitulo="Información y datos de tu cuenta en Veterinaria San Marcos."
        itemsMenu={itemsMenu}
      />

      <main className="d-flex justify-content-center">
        <section className="seccion my-4" style={{ maxWidth: '650px' }}>
          <Card className="border-0 shadow-sm text-start">
            <Card.Header as="h5" style={{ backgroundColor: '#2a9d8f', color: '#ffffff' }}>
              Datos del Usuario
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">{usuario.nombre}</h4>
                <Badge bg="success">
                  Usuario Registrado
                </Badge>
              </div>

              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Correo Electrónico:</strong> {usuario.email}
                </ListGroup.Item>
                {usuario.rut && (
                  <ListGroup.Item>
                    <strong>RUT:</strong> {usuario.rut}
                  </ListGroup.Item>
                )}
                {usuario.telefono && (
                  <ListGroup.Item>
                    <strong>Teléfono:</strong> {usuario.telefono}
                  </ListGroup.Item>
                )}
                <ListGroup.Item>
                  <strong>¿Tiene mascotas?:</strong>{' '}
                  <span className="fw-bold text-success">{usuario.tieneMascotas || 'Sí'}</span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Cantidad de mascotas registradas:</strong>{' '}
                  <Badge bg="secondary" pill>
                    {usuario.cantidadMascotas !== undefined ? usuario.cantidadMascotas : 1}
                  </Badge>
                </ListGroup.Item>
              </ListGroup>

              <div className="d-flex justify-content-end mt-4">
                <Button
                  variant="outline-danger"
                  onClick={handleCerrarSesion}
                  style={{ fontWeight: 'bold' }}
                >
                  Cerrar Sesión
                </Button>
              </div>
            </Card.Body>
          </Card>
        </section>
      </main>

      <Footer anio={2026} empresa="Veterinaria San Marcos" />
    </div>
  );
}

export default MiPerfil;
