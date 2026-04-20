import axios from 'axios';

export const userApi = axios.create({ baseURL: 'http://localhost:8081' });
export const foodApi = axios.create({ baseURL: 'http://localhost:8082' });
export const orderApi = axios.create({ baseURL: 'http://localhost:8083' });
export const paymentApi = axios.create({ baseURL: 'http://localhost:8084' });
