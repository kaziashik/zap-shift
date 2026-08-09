import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 20000
});

const useAxios = () => axiosInstance;

export default useAxios;
