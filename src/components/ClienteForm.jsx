import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClienteService from '../services/ClienteService';

const ClienteForm = () => {
    const [rut, setRut] = useState('');
    const [primerNombre, setPrimerNombre] = useState('');
    const [segundoNombre, setSegundoNombre] = useState('');
    const [apellidoPaterno, setApellidoPaterno] = useState('');
    const [apellidoMaterno, setApellidoMaterno] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [fechaNac, setFechaNac] = useState('');
    const [calle, setCalle] = useState('');
    const [numero, setNumero] = useState('');
    const [deptoCasa, setDeptoCasa] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            ClienteService.buscarPorId(id)
                .then(response => {
                    const c = response.data;
                    setRut(c.rut || '');
                    setPrimerNombre(c.primerNombre || '');
                    setSegundoNombre(c.segundoNombre || '');
                    setApellidoPaterno(c.apellidoPaterno || '');
                    setApellidoMaterno(c.apellidoMaterno || '');
                    setTelefono(c.telefono || '');
                    setEmail(c.email || '');
                    setFechaNac(c.fechaNac || '');
                    setCalle(c.calle || '');
                    setNumero(c.numero || '');
                    setDeptoCasa(Boolean(c.deptoCasa));
                })
                .catch(error => console.error('Error al cargar cliente:', error));
        }
    }, [id]);

    const guardarOActualizar = (e) => {
        e.preventDefault();
        const cliente = {
            rut,
            primerNombre,
            segundoNombre: segundoNombre.trim() === '' ? null : segundoNombre,
            apellidoPaterno,
            apellidoMaterno,
            telefono: Number(telefono),
            email,
            fechaNac,
            calle,
            numero: Number(numero),
            deptoCasa
        };

        if (id) {
            ClienteService.actualizar(id, cliente)
                .then(() => navigate('/clientes'))
                .catch(error => console.error('Error al actualizar:', error));
        } else {
            ClienteService.guardar(cliente)
                .then(() => navigate('/clientes'))
                .catch(error => console.error('Error al guardar:', error));
        }
    };

    return (
        <div>
            <h2>{id ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
            <form onSubmit={guardarOActualizar}>
                <div>
                    <label>RUT:</label>
                    <input type="text" value={rut} onChange={(e) => setRut(e.target.value)} maxLength={12} required />
                </div>
                <div>
                    <label>Primer Nombre:</label>
                    <input type="text" value={primerNombre} onChange={(e) => setPrimerNombre(e.target.value)} required />
                </div>
                <div>
                    <label>Segundo Nombre (opcional):</label>
                    <input type="text" value={segundoNombre} onChange={(e) => setSegundoNombre(e.target.value)} />
                </div>
                <div>
                    <label>Apellido Paterno:</label>
                    <input type="text" value={apellidoPaterno} onChange={(e) => setApellidoPaterno(e.target.value)} required />
                </div>
                <div>
                    <label>Apellido Materno:</label>
                    <input type="text" value={apellidoMaterno} onChange={(e) => setApellidoMaterno(e.target.value)} required />
                </div>
                <div>
                    <label>Teléfono:</label>
                    <input type="number" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Fecha de Nacimiento:</label>
                    <input type="date" value={fechaNac} onChange={(e) => setFechaNac(e.target.value)} required />
                </div>
                <div>
                    <label>Calle:</label>
                    <input type="text" value={calle} onChange={(e) => setCalle(e.target.value)} required />
                </div>
                <div>
                    <label>Número:</label>
                    <input type="number" value={numero} onChange={(e) => setNumero(e.target.value)} required />
                </div>
                <div>
                    <label>
                        <input type="checkbox" checked={deptoCasa} onChange={(e) => setDeptoCasa(e.target.checked)} />
                        ¿Es Departamento? (Marcar si es Depto, desmarcar si es Casa)
                    </label>
                </div>
                <button type="submit">{id ? 'Actualizar' : 'Guardar'}</button>
            </form>
        </div>
    );
};

export default ClienteForm;