import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

function FormularioContacto() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviado, setEnviado] = useState(false);

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (nombre && correo && mensaje) {
      setEnviado(true);
      setNombre('');
      setCorreo('');
      setMensaje('');
      setTimeout(() => setEnviado(false), 3000);
    }
  };

  return (
    <section id="contacto" className="seccion my-4">
      <h2>Contacto y Consultas Veterinarias</h2>
      <p>¿Tienes dudas o necesitas agendar una consulta médica para tu mascota? Escríbenos:</p>

      {enviado && (
        <Alert variant="success">¡Tu mensaje ha sido enviado con éxito! Nos comunicaremos a la brevedad.</Alert>
      )}

      <Form onSubmit={manejarEnvio}>
        <Form.Group className="mb-3" controlId="formNombre">
          <Form.Label>Nombre:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese su nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formCorreo">
          <Form.Label>Correo:</Form.Label>
          <Form.Control
            type="email"
            placeholder="Ingrese su correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formMensaje">
          <Form.Label>Mensaje:</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Escriba su consulta o pedido veterinario"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            required
          />
        </Form.Group>

        <Button
          type="submit"
          className="w-100"
          style={{
            backgroundColor: '#2a9d8f',
            borderColor: '#2a9d8f',
            fontWeight: 'bold',
            padding: '10px'
          }}
        >
          Enviar mensaje
        </Button>
      </Form>
    </section>
  );
}

export default FormularioContacto;
