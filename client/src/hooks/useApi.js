import { useState, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api/v1";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export function useApi() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const fetchApi = useCallback(
        async (endpoint, method = "get", requestData = null, config = {}) => {
            setLoading(true);
            setError(null);
            setData(null);

            try {
                let response;
                switch (method.toLowerCase()) {
                    case "post":
                        response = await api.post(
                            endpoint,
                            requestData,
                            config
                        );
                        break;
                    case "put":
                        response = await api.put(endpoint, requestData, config);
                        break;
                    case "delete":
                        response = await api.delete(endpoint, config);
                        break;
                    default:
                        response = await api.get(endpoint, config);
                }

                setData(response.data);
                return response.data;
            } catch (err) {
                const errorMessage =
                    err.response?.data?.message ||
                    err.message ||
                    "Đã có lỗi xảy ra";
                setError(errorMessage);
                throw errorMessage;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return { loading, error, data, fetchApi };
}
