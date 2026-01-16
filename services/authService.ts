import { API_URLS } from './apiConfig';

export const authService = {
    async login(email, password) {
        const res = await fetch(`${API_URLS.AUTH}/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);
            // Decode token to get role? Or trust /me
        }
        return data;
    },

    async register(email, username, password, fullName) {
        const res = await fetch(`${API_URLS.AUTH}/register/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, username, password, full_name: fullName }),
        });
        return res.json();
    },

    async getProfile() {
        const token = localStorage.getItem('accessToken');
        if (!token) return null;
        const res = await fetch(`${API_URLS.AUTH}/me/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return res.ok ? res.json() : null;
    },

    logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }
};
