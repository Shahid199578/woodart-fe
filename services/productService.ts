import { API_URLS } from './apiConfig';

export const productService = {
    async getProducts() {
        try {
            const res = await fetch(`${API_URLS.PRODUCT}/products/`);
            if (!res.ok) return [];
            const data = await res.json();
            // Ensure price is a number and matches Product interface
            return data.map((p: any) => ({
                ...p,
                price: parseFloat(p.price),
                imageUrl: p.imageUrl || p.image_url // Handle both cases
            }));
        } catch (e) {
            console.error(e);
            return [];
        }
    },

    async getProduct(id: number) {
        const res = await fetch(`${API_URLS.PRODUCT}/products/${id}/`);
        return res.json();
    },

    async createProduct(productData: any, token: string) {
        const res = await fetch(`${API_URLS.PRODUCT}/products/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productData)
        });
        return res.json();
    },

    async updateProduct(id: number, productData: any, token: string) {
        const res = await fetch(`${API_URLS.PRODUCT}/products/${id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productData)
        });
        return res.json();
    },

    async uploadImage(file: File, token: string) {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch(`${API_URLS.PRODUCT}/upload/`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });

        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        // Determine full URL (if backend returns absolute path, good; if relative, prepend BASE URL)
        // Since we are running locally, backend returns e.g. /media/file.jpg. We should absolute it or frontend can use relative if same domain. 
        // But frontend is :3000, backend :8002. So we need absolute.
        // Actually, backend returns whatever default_storage.url returns. For FileSystemStorage, it's just /media/filename.
        // So we need to prepend the API base URL's origin.

        // Easier: Prepend API_URLS.PRODUCT root. (API_URLS.PRODUCT is http://localhost:8002/api/catalog)
        // We need http://localhost:8002.

        const MEDIA_HOST = API_URLS.PRODUCT.replace('/api/catalog', '');
        return `${MEDIA_HOST}${data.url}`;
    },

    async getCategories() {
        try {
            const res = await fetch(`${API_URLS.PRODUCT}/categories/`);
            if (!res.ok) return [];
            return await res.json();
        } catch (e) {
            console.error(e);
            return [];
        }
    },

    async createCategory(data: any, token: string) {
        const res = await fetch(`${API_URLS.PRODUCT}/categories/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed');
        return res.json();
    },

    async getPartners() {
        try {
            const res = await fetch(`${API_URLS.PRODUCT}/partners/`);
            if (!res.ok) return [];
            return await res.json();
        } catch (e) {
            console.error(e);
            return [];
        }
    },

    async createPartner(data: any, token: string) {
        const res = await fetch(`${API_URLS.PRODUCT}/partners/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed');
        return res.json();
    },

    async deletePartner(id: number, token: string) {
        const res = await fetch(`${API_URLS.PRODUCT}/partners/${id}/`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed');
    },

    async deleteCategory(id: number, token: string) {
        const res = await fetch(`${API_URLS.PRODUCT}/categories/${id}/`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed');
    },

    async deleteProduct(id: number, token: string) {
        await fetch(`${API_URLS.PRODUCT}/products/${id}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
};
