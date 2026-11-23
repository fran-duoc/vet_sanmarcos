import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ClienteService from '../services/ClienteService';

const ClienteList = () => {
    const [clientes, setClientes] = useState([]);

    useEffect(() => {
        cargarClientes();
    }, []);

    const cargarClientes = () => {
        ClienteService.obtenerTodos()
            .then(response => {
                const lista = response.data._embedded?.clienteList || [];
                setClientes(lista);
            })
            .catch(error => {
                console.error('Error al obtener clientes:', error);
            });
    };

    const eliminarCliente = (id) => {
        ClienteService.eliminarPorId(id)
            .then(() => {
                cargarClientes();
            })
            .catch(error => {
                console.error('Error al eliminar cliente:', error);
            });
    };

    return (
        <div>
            <h2>Lista de Clientes</h2>
            <Link to="/clientes/nuevo">Agregar Nuevo Cliente</Link>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map(cliente => (
                        <tr key={cliente.id}>
                            <td>{cliente.id}</td>
                            <td>{cliente.nombre}</td>
                            <td>{cliente.email}</td>
                            <td>{cliente.telefono}</td>
                            <td>
                                <Link to={`/clientes/editar/${cliente.id}`}>Editar</Link>
                                <button onClick={() => eliminarCliente(cliente.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ClienteList;