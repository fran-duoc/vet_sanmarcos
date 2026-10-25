import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function FormularioRegistro() {
  const navigate = useNavigate();
  let registrarEnContexto = null;
  try {
    const auth = useAuth();
    registrarEnContexto = auth.registrarUsuario;
  } catch {
    // Si se usa fuera de AuthProvider (por ejemplo en tests aislados)
  }

  const [formData, setFormData] = useState({
    nombre: '',
    rut: '',
    correo: '',
    telefono: '',
    fenac: '',
    password: '',
    confirmPassword: '',
    tieneMascotas: '', // 'Sí' o 'No'
    cantidadMascotas: ''
  });

  const [errores, setErrores] = useState({});
  const [mensajeExito, setMensajeExito] = useState('');

  const esMayorDeEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return false;
    const fecha = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fecha.getFullYear();
    const mes = hoy.getMonth() - fecha.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
      edad--;
    }
    return edad >= 18;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const actual = { ...prev, [name]: value };
      if (name === 'tieneMascotas' && value === 'No') {
        actual.cantidadMascotas = '0';
      }
      return actual;
    });

    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validar = () => {
    const nuevosErrores = {};

    // Nombre: solo letras y espacios
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre completo es obligatorio.';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.nombre.trim())) {
      nuevosErrores.nombre = 'El nombre debe contener solo letras.';
    }

    // RUT: formato chileno
    if (!formData.rut.trim()) {
      nuevosErrores.rut = 'El RUT es obligatorio.';
    } else if (!/^[0-9]{1,2}\.?[0-9]{3}\.?[0-9]{3}-[0-9kK]$/.test(formData.rut.trim())) {
      nuevosErrores.rut = 'El RUT debe tener el formato 12.345.678-9';
    }

    // Email
    if (!formData.correo.trim()) {
      nuevosErrores.correo = 'El correo electrónico es obligatorio.';
    } else if (!/^[a-zA-Z0-9._%+-]+@(duocuc\.cl|gmail\.com|outlook\.com|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(formData.correo.trim())) {
      nuevosErrores.correo = 'Solo se aceptan correos válidos (@gmail.com, @duocuc.cl o @outlook.com).';
    }

    // Teléfono: +569 seguido de 8 dígitos
    if (!formData.telefono.trim()) {
      nuevosErrores.telefono = 'El teléfono es obligatorio.';
    } else if (!/^\+?569[0-9]{8}$/.test(formData.telefono.trim())) {
      nuevosErrores.telefono = 'El teléfono debe contener +569 seguido de 8 números.';
    }

    // Fecha de nacimiento: mayor de 18
    if (!formData.fenac) {
      nuevosErrores.fenac = 'La fecha de nacimiento es obligatoria.';
    } else if (!esMayorDeEdad(formData.fenac)) {
      nuevosErrores.fenac = 'Debes ser mayor de 18 años para registrarte.';
    }

    // Contraseña: al menos 8 caracteres, 1 mayúscula, 1 minúscula, 1 número
    if (!formData.password) {
      nuevosErrores.password = 'La contraseña es obligatoria.';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(formData.password)) {
      nuevosErrores.password = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.';
    }

    // Confirmar contraseña
    if (!formData.confirmPassword) {
      nuevosErrores.confirmPassword = 'Debes confirmar la contraseña.';
    } else if (formData.password !== formData.confirmPassword) {
      nuevosErrores.confirmPassword = 'Las contraseñas no coinciden.';
    }

    // Requisito Veterinario Crítico: ¿Tiene mascotas?
    if (!formData.tieneMascotas) {
      nuevosErrores.tieneMascotas = 'Debes indicar si tienes mascotas (Sí o No).';
    } else if (formData.tieneMascotas === 'Sí') {
      const cantidad = parseInt(formData.cantidadMascotas, 10);
      if (!formData.cantidadMascotas || isNaN(cantidad) || cantidad < 1) {
        nuevosErrores.cantidadMascotas = 'Debes ingresar cuántas mascotas tienes (mínimo 1).';
      }
    }

    return nuevosErrores;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevosErrores = validar();

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    // Guardar en localStorage
    localStorage.setItem('correoGuardado', formData.correo);
    localStorage.setItem('contrasenaGuardada', formData.password);
    localStorage.setItem(
      'perfilGuardado',
      JSON.stringify({
        nombre: formData.nombre,
        rut: formData.rut,
        email: formData.correo,
        telefono: formData.telefono,
        fenac: formData.fenac,
        tieneMascotas: formData.tieneMascotas,
        cantidadMascotas: formData.tieneMascotas === 'Sí' ? Number(formData.cantidadMascotas) : 0
      })
    );

    if (registrarEnContexto) {
      registrarEnContexto({
        email: formData.correo,
        password: formData.password,
        nombre: formData.nombre,
        rut: formData.rut,
        telefono: formData.telefono,
        fenac: formData.fenac,
        tieneMascotas: formData.tieneMascotas,
        cantidadMascotas: formData.tieneMascotas === 'Sí' ? Number(formData.cantidadMascotas) : 0
      });
    }

    setMensajeExito('¡Registro exitoso! Redirigiendo al inicio de sesión...');
    setTimeout(() => {
      navigate('/login');
    }, 1500);
  };

  return (
    <section id="contacto" className="formulario-veterinario-contenedor">
      {mensajeExito && <Alert variant="success">{mensajeExito}</Alert>}

      <Form id="form-registro" onSubmit={handleSubmit} noValidate>
        <fieldset>
          <legend>Registro de Usuario - Veterinaria San Marcos</legend>
          <p className="subtitulo-form text-muted">
            Crea tu cuenta para comprar y registrar a tus mascotas en nuestra clínica.
          </p>

          {/* Nombre completo */}
          <Form.Group className="mb-3" controlId="formNombre">
            <Form.Label>Nombre completo:</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              placeholder="Ingrese su nombre completo"
              value={formData.nombre}
              onChange={handleChange}
              isInvalid={!!errores.nombre}
            />
            <Form.Control.Feedback type="invalid">
              {errores.nombre}
            </Form.Control.Feedback>
          </Form.Group>

          {/* RUT */}
          <Form.Group className="mb-3" controlId="formRut">
            <Form.Label>RUT:</Form.Label>
            <Form.Control
              type="text"
              name="rut"
              placeholder="Formato 12.345.678-9"
              value={formData.rut}
              onChange={handleChange}
              isInvalid={!!errores.rut}
            />
            <Form.Control.Feedback type="invalid">
              {errores.rut}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Email */}
          <Form.Group className="mb-3" controlId="formCorreo">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              name="correo"
              placeholder="@gmail.com, @duocuc.cl o @outlook.com"
              value={formData.correo}
              onChange={handleChange}
              isInvalid={!!errores.correo}
            />
            <Form.Control.Feedback type="invalid">
              {errores.correo}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Teléfono */}
          <Form.Group className="mb-3" controlId="formTelefono">
            <Form.Label>Teléfono:</Form.Label>
            <Form.Control
              type="tel"
              name="telefono"
              placeholder="+56912345678"
              value={formData.telefono}
              onChange={handleChange}
              isInvalid={!!errores.telefono}
            />
            <Form.Control.Feedback type="invalid">
              {errores.telefono}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Fecha de nacimiento */}
          <Form.Group className="mb-3" controlId="formFenac">
            <Form.Label>Fecha de nacimiento:</Form.Label>
            <Form.Control
              type="date"
              name="fenac"
              value={formData.fenac}
              onChange={handleChange}
              isInvalid={!!errores.fenac}
            />
            <Form.Control.Feedback type="invalid">
              {errores.fenac}
            </Form.Control.Feedback>
          </Form.Group>

          {/* CAMPOS CRÍTICOS DE CONTEXTO VETERINARIO */}
          <div className="seccion-veterinaria-registro p-3 mb-3 border rounded">
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">¿Tienes mascotas?</Form.Label>
              <div className="d-flex gap-4">
                <Form.Check
                  type="radio"
                  id="mascota-si"
                  name="tieneMascotas"
                  label="Sí"
                  value="Sí"
                  checked={formData.tieneMascotas === 'Sí'}
                  onChange={handleChange}
                  isInvalid={!!errores.tieneMascotas}
                />
                <Form.Check
                  type="radio"
                  id="mascota-no"
                  name="tieneMascotas"
                  label="No"
                  value="No"
                  checked={formData.tieneMascotas === 'No'}
                  onChange={handleChange}
                  isInvalid={!!errores.tieneMascotas}
                />
              </div>
              {errores.tieneMascotas && (
                <div className="text-danger small mt-1">{errores.tieneMascotas}</div>
              )}
            </Form.Group>

            <Form.Group className="mb-2" controlId="formCantidadMascotas">
              <Form.Label>¿Cuántas mascotas tienes?</Form.Label>
              <Form.Control
                type="number"
                name="cantidadMascotas"
                min="0"
                placeholder={formData.tieneMascotas === 'Sí' ? 'Indique cantidad' : 'Deshabilitado (no tienes mascotas)'}
                value={formData.tieneMascotas === 'No' ? '0' : formData.cantidadMascotas}
                onChange={handleChange}
                disabled={formData.tieneMascotas !== 'Sí'}
                isInvalid={!!errores.cantidadMascotas}
              />
              <Form.Control.Feedback type="invalid">
                {errores.cantidadMascotas}
              </Form.Control.Feedback>
            </Form.Group>
          </div>

          {/* Contraseña */}
          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Contraseña:</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Mínimo 8 caracteres, 1 mayúscula, 1 minúscula y 1 número"
              value={formData.password}
              onChange={handleChange}
              isInvalid={!!errores.password}
            />
            <Form.Control.Feedback type="invalid">
              {errores.password}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Confirmar Contraseña */}
          <Form.Group className="mb-3" controlId="formConfirmPassword">
            <Form.Label>Confirmar Contraseña:</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              placeholder="Repite tu contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              isInvalid={!!errores.confirmPassword}
            />
            <Form.Control.Feedback type="invalid">
              {errores.confirmPassword}
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
            ACEPTAR
          </Button>

          <Link to="/" className="btn-inicio">
            Volver al Inicio
          </Link>
        </fieldset>
      </Form>
    </section>
  );
}

export default FormularioRegistro;
