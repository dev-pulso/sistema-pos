import { useAuthStore } from "@/store/auth.store";
import axios from "axios";

import { API_BASE } from "@/lib/endpoint/endpoints";

const api = axios.create({
    baseURL: API_BASE, // Cambia por tu endpoint base
});

// ✅ Interceptor para agregar token automáticamente
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.status === 401) {
            useAuthStore.getState().token === null
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
)

export default api;
