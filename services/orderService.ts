import { API_URLS } from './apiConfig';

export const orderService = {
    async createPaymentIntent(items: { id: number, quantity: number }[], userToken: string) {
        const res = await fetch(`${API_URLS.ORDER}/checkout/create-intent/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify({ items }),
        });
        return res.json();
    },

    async getOrders(token: string) {
        const res = await fetch(`${API_URLS.ORDER}/orders/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!res.ok) return [];
        return res.json();
    },

    async downloadInvoice(orderId: number, token: string) {
        const res = await fetch(`${API_URLS.ORDER}/orders/${orderId}/invoice/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to download invoice');
        return res.blob();
    }
};
