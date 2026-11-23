import axios from 'axios';

const AUTH_URL = 'http://localhost:8081/api/auth';

class AuthService {
  login(username, password) {
    return axios.post(`${AUTH_URL}/login`, { username, password });
  }

  registro(datos) {
    return axios.post(`${AUTH_URL}/register`, datos);
  }
}

export default new AuthService();
