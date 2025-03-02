// src/hooks/useApi.ts
import { useState, useCallback } from 'react';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = 'http://localhost:5001/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export function useApi() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    const fetchApi = useCallback(async <T>(
        endpoint: string,
        method: 'get' | 'post' | 'put' | 'delete' = 'get',
        data?: any,
        config?: AxiosRequestConfig
    ): Promise<T> => {
        setLoading(true);
        setError(null);
        setData(null);

        try {
            let response: AxiosResponse<T>;
            switch (method.toLowerCase()) {
                case 'post':
                    response = await api.post<T>(endpoint, data, config);
                    break;
                case 'put':
                    response = await api.put<T>(endpoint, data, config);
                    break;
                case 'delete':
                    response = await api.delete<T>(endpoint, config);
                    break;
                default:
                    response = await api.get<T>(endpoint, config);
            }
            setData(response.data);
            return response.data;
        } catch (err) {
            const error = err as AxiosError;
            const errorMessage =
                (error.response?.data as { message?: string })?.message ||
                error.message ||
                'Đã có lỗi xảy ra';
            setError(errorMessage);
            throw errorMessage;
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, error, data, fetchApi };
}
