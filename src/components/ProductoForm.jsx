import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import Header from './Header';
import Footer from './Footer';
import { itemsMenu } from '../data/itemsMenu';
import ProductoService from '../services/ProductoService';
import { useAuth } from '../context/AuthContext';

const ProductoForm = () => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState('');
    const [stock, setStock] = useState('');
    const [activo, setActivo] = useState(true);
    const [fechaIngreso, setFechaIngreso] = useState(new Date().toISOString().split('T')[0]);
    const [mensaje, setMensaje] = useState(null);

    const { id } = useParams();
    const navigate = useNavigate();
    const { estaAutenticado } = useAuth();

    useEffect(() => {
        if (id) {
            ProductoService.buscarPorId(id)
                .then(response => {
                    const prod = response.data;
                    setNombre(prod.nombre || '');
                    setDescripcion(prod.descripcion || '');
                    setPrecio(prod.precio || '');
                    setStock(prod.stock || '');
                    setActivo(prod.activo !== undefined ? prod.activo : true);
                    setFechaIngreso(prod.fechaIngreso || new Date().toISOString().split('T')[0]);
                })
                .catch(error => {
                    console.error('Error al cargar producto:', error);
                    setMensaje({ tipo: 'danger', texto: 'Error al cargar los datos del producto.' });
                });
        }
    }, [id]);

    const guardarOActualizar = (e) => {
        e.preventDefault();
        const producto = {
            nombre,
            descripcion,
            precio: Number(precio),
            stock: Number(stock),
            activo,
            fechaIngreso
        };

        if (id) {
            ProductoService.actualizar(id, producto)
                .then(() => {
                    navigate('/productos');
                })
                .catch(error => {
                    console.error('Error al actualizar producto:', error);
                    setMensaje({
                        tipo: 'danger',
                        texto: error.response?.status === 403
                            ? 'Permiso denegado: solo ADMIN puede actualizar productos.'
                            : 'Error al actualizar el producto.'
                    });
                });
        } else {
            ProductoService.guardar(producto)
                .then(() => {
                    navigate('/productos');
                })
                .catch(error => {
                    console.error('Error al guardar producto:', error);
                    setMensaje({
                        tipo: 'danger',
                        texto: error.response?.status === 403
                            ? 'Permiso denegado: solo ADMIN puede crear productos.'
                            : 'Error al guardar el producto.'
                    });
                });
        }
    };

    return (
        <div className="vista-contenedor">
            <Header
                titulo={id ? 'Editar Producto' : 'Nuevo Producto'}
                subtitulo="Gestión de inventario para Administradores de Veterinaria San Marcos"
                itemsMenu={itemsMenu}
            />

            <main className="d-flex justify-content-center my-4">
                <Card style={{ width: '100%', maxWidth: '600px' }} className="p-4 shadow-sm border-0">
                    <Card.Body>
                        <h2 className="mb-4 text-center">{id ? 'Editar Producto' : 'Crear Nuevo Producto'}</h2>

                        {mensaje && (
                            <Alert variant={mensaje.tipo} dismissible onClose={() => setMensaje(null)}>
                                {mensaje.texto}
                            </Alert>
                        )}

                        {!estaAutenticado && (
                            <Alert variant="warning">
                                Debes <Link to="/login">iniciar sesión</Link> como Administrador para realizar esta acción.
                            </Alert>
                        )}

                        <Form onSubmit={guardarOActualizar}>
                            <Form.Group className="mb-3" controlId="formNombre">
                                <Form.Label>Nombre del Producto:</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    placeholder="Ej: Alimento Canino Adulto 15kg"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formDescripcion">
                                <Form.Label>Descripción:</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    placeholder="Detalles del producto..."
                                />
                            </Form.Group>

                            <div className="row">
                                <div className="col-md-6">
                                    <Form.Group className="mb-3" controlId="formPrecio">
                                        <Form.Label>Precio ($ CLP):</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={precio}
                                            onChange={(e) => setPrecio(e.target.value)}
                                            placeholder="45990"
                                            required
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">
                                    <Form.Group className="mb-3" controlId="formStock">
                                        <Form.Label>Stock:</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={stock}
                                            onChange={(e) => setStock(e.target.value)}
                                            placeholder="20"
                                            required
                                        />
                                    </Form.Group>
                                </div>
                            </div>

                            <Form.Group className="mb-3" controlId="formFecha">
                                <Form.Label>Fecha de Ingreso:</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={fechaIngreso}
                                    onChange={(e) => setFechaIngreso(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formActivo">
                                <Form.Check
                                    type="checkbox"
                                    label="Producto Activo"
                                    checked={activo}
                                    onChange={(e) => setActivo(e.target.checked)}
                                />
                            </Form.Group>

                            <div className="d-flex justify-content-between mt-4">
                                <Link to="/productos" className="btn btn-outline-secondary">
                                    Cancelar
                                </Link>
                                <Button
                                    type="submit"
                                    style={{
                                        backgroundColor: '#2a9d8f',
                                        borderColor: '#2a9d8f',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {id ? 'Actualizar Producto' : 'Guardar Producto'}
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </main>

            <Footer anio={2026} empresa="Veterinaria San Marcos" />
        </div>
    );
};

export default ProductoForm;
