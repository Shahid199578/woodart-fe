import { API_URLS } from './apiConfig';

export const adminService = {
    async getStats() {
        const token = localStorage.getItem('accessToken');
        if (!token) return null;

        const res = await fetch(`${API_URLS.ADMIN}/dashboard/stats/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (res.ok) {
            return res.json();
        }
        return null;
    }
};
