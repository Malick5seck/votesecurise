import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true 
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
        // On ajoute le Token dans les headers (en-têtes) de la requête
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;