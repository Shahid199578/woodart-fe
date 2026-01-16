import { API_URLS } from './apiConfig';

export const userService = {
    async getUsers(token: string) {
        const res = await fetch(`${API_URLS.AUTH}/users/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!res.ok) return [];
        return res.json();
    },

    async updateProfile(data: any, token: string) {
        const res = await fetch(`${API_URLS.AUTH}/me/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        return res.json();
    }
};
