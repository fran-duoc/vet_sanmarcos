import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { itemsMenu } from '../data/itemsMenu';
import { useAuth } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errores, setErrores] = useState({});
  const [mensajeAlerta, setMensajeAlerta] = useState(null);

  const validar = () => {
    const nuevosErrores = {};

    if (!correo.trim()) {
      nuevosErrores.correo = 'El correo electrónico es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
      nuevosErrores.correo = 'Ingrese un formato de correo válido.';
    }

    if (!contrasena) {
      nuevosErrores.contrasena = 'La contraseña es obligatoria.';
    }

    return nuevosErrores;
  };

  const manejarSubmit = (e) => {
    e.preventDefault();
    setMensajeAlerta(null);

    const fallas = validar();
    if (Object.keys(fallas).length > 0) {
      setErrores(fallas);
      return;
    }

    const resultado = login(correo.trim(), contrasena);

    if (resultado.exito) {
      setMensajeAlerta({ tipo: 'success', texto: '¡Inicio de sesión exitoso! Redirigiendo...' });
      setTimeout(() => {
        navigate('/perfil');
      }, 1000);
    } else {
      setMensajeAlerta({ tipo: 'danger', texto: resultado.mensaje });
    }
  };

  return (
    <div className="vista-contenedor">
      <Header
        titulo="Iniciar Sesión"
        subtitulo="Accede a tu cuenta de Veterinaria San Marcos para gestionar compras y mascotas."
        itemsMenu={itemsMenu}
      />

      <main className="d-flex justify-content-center">
        <section id="contacto" className="formulario-login-contenedor">
          {mensajeAlerta && (
            <Alert variant={mensajeAlerta.tipo} dismissible onClose={() => setMensajeAlerta(null)}>
              {mensajeAlerta.texto}
            </Alert>
          )}

          <Form id="formulario-login" onSubmit={manejarSubmit} noValidate>
            <fieldset>
              <legend>Iniciar Sesión:</legend>

              <div className="p-2 mb-3 bg-light rounded text-start small border">
                <strong>Credenciales de prueba:</strong>
                <br />
                Email: <code>admin@vetsanmarcos.cl</code>
                <br />
                Contraseña: <code>Admin123*</code>
              </div>

              <Form.Group className="mb-3" controlId="correo">
                <Form.Label>Email:</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="@gmail.com, @duocuc.cl o @outlook.com"
                  value={correo}
                  onChange={(e) => {
                    setCorreo(e.target.value);
                    if (errores.correo) setErrores((prev) => ({ ...prev, correo: null }));
                  }}
                  isInvalid={!!errores.correo}
                />
                <Form.Control.Feedback type="invalid">
                  {errores.correo}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="contrasena">
                <Form.Label>Contraseña:</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Ingrese su contraseña"
                  value={contrasena}
                  onChange={(e) => {
                    setContrasena(e.target.value);
                    if (errores.contrasena) setErrores((prev) => ({ ...prev, contrasena: null }));
                  }}
                  isInvalid={!!errores.contrasena}
                />
                <Form.Control.Feedback type="invalid">
                  {errores.contrasena}
                </Form.Control.Feedback>
              </Form.Group>

              <Button
                type="submit"
                className="w-100 mb-2"
                style={{
                  backgroundColor: '#2a9d8f',
                  borderColor: '#2a9d8f',
                  fontWeight: 'bold',
                  padding: '10px'
                }}
              >
                INGRESAR
              </Button>

              <Link to="/registro" className="d-block text-center mb-2 small text-decoration-none">
                ¿No tienes cuenta? Regístrate aquí
              </Link>

              <Link to="/" className="btn-inicio">
                Volver al Inicio
              </Link>
            </fieldset>
          </Form>
        </section>
      </main>

      <Footer anio={2026} empresa="Veterinaria San Marcos" />
    </div>
  );
}

export default Login;
