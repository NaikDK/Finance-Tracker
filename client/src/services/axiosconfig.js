import axios from 'axios';

export const authApi = axios.create({
    baseURL: '/auth/api',
    headers: { 'Content-Type': 'application/json' }
});

export const tradeApi = axios.create({
    baseURL: '/journal/api/trades',
    'headers': { 'Content-Type': 'application/json' }
});

tradeApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

tradeApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href('/login');
        }
        return Promise.reject(error);
    }
);