import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.100.33:8000',
});

api.interceptors.request.use((config) => {
  const storedData = sessionStorage.getItem('userData');
  const token = JSON.parse(storedData)
  if (token) {
    config.headers['Authorization'] = `Bearer ${token.access_token}`;
  } else {
    delete config.headers['Authorization'];
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;