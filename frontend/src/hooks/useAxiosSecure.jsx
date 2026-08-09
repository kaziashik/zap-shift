import axios from 'axios';
import { useEffect } from 'react';
import useAuth from './useAuth';
import { useNavigate } from 'react-router';
import { API_BASE_URL } from './useAxios';

const axiosSecure = axios.create({
    baseURL: API_BASE_URL,
    timeout: 20000
});

const useAxiosSecure = () => {
    const { user, logOut } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const reqInterceptor = axiosSecure.interceptors.request.use(
            async (config) => {
                if (user) {
                    const token = await user.getIdToken();
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        const resInterceptor = axiosSecure.interceptors.response.use(
            (response) => response,
            async (error) => {
                const statusCode = error.response?.status;
                // Only force logout on clear unauthorized token cases
                if (statusCode === 401) {
                    try {
                        await logOut();
                    } catch {
                        // ignore
                    }
                    navigate('/login');
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosSecure.interceptors.request.eject(reqInterceptor);
            axiosSecure.interceptors.response.eject(resInterceptor);
        };
    }, [user, logOut, navigate]);

    return axiosSecure;
};

export default useAxiosSecure;
