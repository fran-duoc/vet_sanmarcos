import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api/v1/clientes';

class ClienteService {
    obtenerTodos() {
        return axios.get(BASE_URL);
    }

    buscarPorId(id) {
        return axios.get(`${BASE_URL}/${id}`);
    }

    guardar(cliente) {
        return axios.post(BASE_URL, cliente);
    }

    actualizar(id, cliente) {
        return axios.put(`${BASE_URL}/${id}`, cliente);
    }

    eliminarPorId(id) {
        return axios.delete(`${BASE_URL}/${id}`);
    }
}

export default new ClienteService();