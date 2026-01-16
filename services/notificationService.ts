import { API_URLS } from './apiConfig';

export interface Notification {
    id: number;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    is_read: boolean;
    created_at: string;
}

export const notificationService = {
    async getNotifications(token: string) {
        try {
            const res = await fetch(`${API_URLS.NOTIFICATION}/notifications/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) return [];
            return await res.json();
        } catch (e) {
            console.error(e);
            return [];
        }
    },

    async markAsRead(id: number, token: string) {
        try {
            await fetch(`${API_URLS.NOTIFICATION}/notifications/${id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ is_read: true })
            });
        } catch (e) {
            console.error(e);
        }
    }
};
