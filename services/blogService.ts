import { API_URLS } from './apiConfig';

export interface BlogPost {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    cover_image: string;
    author_name: string;
    category: string;
    tags: string;
    is_published: boolean;
    created_at: string;
}

export const blogService = {
    async getPosts() {
        try {
            const res = await fetch(`${API_URLS.BLOG}/posts/`);
            if (!res.ok) return [];
            const data = await res.json();
            return Array.isArray(data) ? data : (data.results || []);
        } catch (e) {
            console.error(e);
            return [];
        }
    },

    async getPost(slug: string) {
        const res = await fetch(`${API_URLS.BLOG}/posts/${slug}/`);
        if (!res.ok) throw new Error('Post not found');
        return res.json();
    },

    async createPost(data: any, token: string) {
        const res = await fetch(`${API_URLS.BLOG}/posts/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to create post');
        return res.json();
    },

    async updatePost(slug: string, data: any, token: string) {
        const res = await fetch(`${API_URLS.BLOG}/posts/${slug}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to update post');
        return res.json();
    },

    async deletePost(slug: string, token: string) {
        const res = await fetch(`${API_URLS.BLOG}/posts/${slug}/`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to delete post');
    },

    async uploadImage(file: File, token: string) {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch(`${API_URLS.BLOG}/upload/`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });

        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        const MEDIA_HOST = API_URLS.BLOG.replace('/api', '');
        return `${MEDIA_HOST}${data.url}`;
    }
};
