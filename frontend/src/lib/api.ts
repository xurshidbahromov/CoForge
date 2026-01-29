import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Crucial for sending/receiving HttpOnly cookies (JWT)
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Potentially clear local auth state if backend says 401
            // For now, let the component handle it
        }
        return Promise.reject(error);
    }
);
