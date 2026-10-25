import { useState } from 'react';
import { Table, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { itemsMenu } from '../data/itemsMenu';
import { useCart } from '../context/CartContext';

function Carrito() {
  const {
    itemsCarrito,
    eliminarDelCarrito,
    actualizarCantidad,
    vaciarCarrito,
    total,
    formatearPesosChilenos
  } = useCart();

  const [ordenFinalizada, setOrdenFinalizada] = useState(false);
  const [numeroOrden, setNumeroOrden] = useState('');

  const simularCheckout = () => {
    const orden = `VET-${Math.floor(100000 + Math.random() * 900000)}`;
    setNumeroOrden(orden);
    setOrdenFinalizada(true);
    vaciarCarrito();
  };

  return (
    <div className="vista-contenedor">
      <Header
        titulo="Carrito de Compras"
        subtitulo="Revisa tus productos seleccionados y simula tu pedido."
        itemsMenu={itemsMenu}
      />

      <main className="d-flex flex-column align-items-center">
        <section className="seccion my-4 w-100" style={{ maxWidth: '950px' }}>
          <h2>Resumen de tu Compra</h2>

          {ordenFinalizada && (
            <Alert variant="success" className="text-center my-3">
              <h4>¡Felicitaciones! Tu compra ha sido simulada exitosamente.</h4>
              <p>
                Número de orden de pedido: <strong>{numeroOrden}</strong>
              </p>
              <p>Recibirás un comprobante de confirmación para retirar tus productos en clínica o envío a domicilio.</p>
              <Link to="/productos">
                <Button variant="success">Volver a la Tienda</Button>
              </Link>
            </Alert>
          )}

          {itemsCarrito.length === 0 && !ordenFinalizada ? (
            <div className="text-center py-5">
              <p className="fs-5 text-muted">Tu carrito de compras está actualmente vacío.</p>
              <p>Explora nuestro catálogo para añadir alimentos, medicamentos o accesorios veterinarios.</p>
              <Link to="/productos" className="btn-comprar">
                Explorar Catálogo
              </Link>
            </div>
          ) : itemsCarrito.length > 0 ? (
            <>
              <div className="table-responsive my-3">
                <Table striped bordered hover className="align-middle text-center">
                  <thead className="table-dark">
                    <tr>
                      <th>Producto</th>
                      <th>Precio Unitario</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemsCarrito.map((item) => {
                      const subtotalItem = item.precioNumero * item.cantidad;
                      return (
                        <tr key={item.id}>
                          <td className="text-start d-flex align-items-center gap-3">
                            <img
                              src={item.imagen}
                              alt={item.titulo}
                              style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                              className="rounded border"
                            />
                            <div>
                              <strong className="d-block">{item.titulo}</strong>
                              <small className="text-muted">{item.categoria}</small>
                            </div>
                          </td>
                          <td className="fw-bold">{formatearPesosChilenos(item.precioNumero)}</td>
                          <td>
                            <div className="d-flex justify-content-center align-items-center gap-1">
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                              >
                                -
                              </Button>
                              <span className="px-2 fw-bold">{item.cantidad}</span>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                              >
                                +
                              </Button>
                            </div>
                          </td>
                          <td className="fw-bold" style={{ color: '#2a9d8f' }}>
                            {formatearPesosChilenos(subtotalItem)}
                          </td>
                          <td>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => eliminarDelCarrito(item.id)}
                              aria-label={`Eliminar ${item.titulo}`}
                            >
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>

              {/* Resumen Total y Acciones */}
              <Card className="bg-light p-3 border-0 shadow-sm mt-3">
                <Row className="align-items-center">
                  <Col md={6} className="text-center text-md-start">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={vaciarCarrito}
                      className="me-2"
                    >
                      Vaciar Carrito
                    </Button>
                    <Link to="/productos">
                      <Button variant="outline-success" size="sm">
                        Seguir Comprando
                      </Button>
                    </Link>
                  </Col>
                  <Col md={6} className="text-center text-md-end mt-3 mt-md-0">
                    <h4 className="mb-2">
                      Total a Pagar:{' '}
                      <span style={{ color: '#2a9d8f', fontWeight: 'bold' }}>
                        {formatearPesosChilenos(total)}
                      </span>
                    </h4>
                    <Button
                      onClick={simularCheckout}
                      style={{
                        backgroundColor: '#2a9d8f',
                        borderColor: '#2a9d8f',
                        fontWeight: 'bold',
                        padding: '10px 24px'
                      }}
                    >
                      Finalizar Compra / Simular Checkout
                    </Button>
                  </Col>
                </Row>
              </Card>
            </>
          ) : null}
        </section>
      </main>

      <Footer anio={2026} empresa="Veterinaria San Marcos" />
    </div>
  );
}

export default Carrito;
