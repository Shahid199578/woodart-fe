import { API_URLS } from './apiConfig';

export const paymentService = {
    async initiatePayment(amount: number, token: string) {
        const res = await fetch(`${API_URLS.PAYMENT}/initiate/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ amount })
        });
        if (!res.ok) throw new Error('Failed to initiate payment');
        return res.json();
    },

    async verifyPayment(data: any, token: string) {
        const res = await fetch(`${API_URLS.PAYMENT}/callback/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Payment verification failed');
        return res.json();
    }
};
