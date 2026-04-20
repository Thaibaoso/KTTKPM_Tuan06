import axios from 'axios';

export const userApi = axios.create({ baseURL: 'http://172.16.62.160:8081' });
export const foodApi = axios.create({ baseURL: 'http://172.16.62.160:8082' });
export const orderApi = axios.create({ baseURL: 'http://172.16.59.6:8083' });
export const paymentApi = axios.create({ baseURL: 'http://172.16.59.6:8084' });
