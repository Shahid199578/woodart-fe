import React, { useState, useEffect } from 'react';
import { Plus, X, Image as ImageIcon, Trash2, Edit2 } from 'lucide-react';
import { blogService, BlogPost } from '../services/blogService';
import { Button } from '../components/Button';
import { ImageUploader } from '../components/ImageUploader';

// Add declaration to avoid TS error if not present globally
// @ts-ignore
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export const AdminBlogPage: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editingSlug, setEditingSlug] = useState<string | null>(null);

    // Template State
    const [savedTemplates, setSavedTemplates] = useState<{ name: string, content: string }[]>([]);
    const [newTemplateName, setNewTemplateName] = useState('');
    const [showTemplateSave, setShowTemplateSave] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        excerpt: '',
        content: '',
        cover_image: '',
        category: 'Design',
        tags: '',
        is_published: true
    });

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
            ['link', 'image'],
            ['clean']
        ],
    };

    const fetchPosts = async () => {
        setLoading(true);
        const data = await blogService.getPosts();
        setPosts(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchPosts();
        const templates = localStorage.getItem('blog_templates');
        if (templates) {
            try {
                setSavedTemplates(JSON.parse(templates));
            } catch (e) {
                console.error("Failed to parse templates", e);
            }
        }
    }, []);

    const saveCurrentAsTemplate = () => {
        if (!newTemplateName.trim()) return alert('Please enter a template name');
        const newTemplate = { name: newTemplateName, content: formData.content };
        const updated = [...savedTemplates, newTemplate];
        setSavedTemplates(updated);
        localStorage.setItem('blog_templates', JSON.stringify(updated));
        setNewTemplateName('');
        setShowTemplateSave(false);
        alert('Template saved!');
    };

    const loadTemplate = (content: string) => {
        if (confirm('This will replace current content. Continue?')) {
            setFormData({ ...formData, content });
        }
    };

    const deleteTemplate = (name: string) => {
        if (!confirm('Delete this template?')) return;
        const updated = savedTemplates.filter(t => t.name !== name);
        setSavedTemplates(updated);
        localStorage.setItem('blog_templates', JSON.stringify(updated));
    };

    const resetForm = () => {
        setFormData({
            title: '',
            excerpt: '',
            content: '',
            cover_image: '',
            category: 'Design',
            tags: '',
            is_published: true
        });
        setEditingSlug(null);
    };

    const handleDelete = async (slug: string) => {
        if (!confirm('Delete this post?')) return;
        const token = localStorage.getItem('accessToken');
        if (!token) return alert('Session expired');

        try {
            await blogService.deletePost(slug, token);
            fetchPosts();
        } catch (e) {
            console.error(e);
            alert('Failed to delete');
        }
    };

    const handleEdit = (post: BlogPost) => {
        setFormData({
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            cover_image: post.cover_image,
            category: post.category,
            tags: post.tags,
            is_published: post.is_published
        });
        setEditingSlug(post.slug);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('accessToken');
        if (!token) return alert('Session expired');

        try {
            if (editingSlug) {
                await blogService.updatePost(editingSlug, formData, token);
            } else {
                await blogService.createPost(formData, token);
            }
            setIsModalOpen(false);
            fetchPosts();
            resetForm();
        } catch (e) {
            console.error(e);
            alert('Operation failed');
        }
    };

    return (
        <div className="max-w-7xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-serif text-white">Journal</h1>
                <Button onClick={() => { resetForm(); setIsModalOpen(true); }}>
                    <span className="flex items-center gap-2">
                        <Plus size={18} /> New Story
                    </span>
                </Button>
            </div>

            {loading ? <div>Loading...</div> : (
                <div className="bg-white/5 border border-white/10 rounded-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-4">Title</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {posts.map(post => (
                                <tr key={post.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-medium text-white">{post.title}</td>
                                    <td className="p-4 text-gray-400">{post.category}</td>
                                    <td className="p-4 text-gray-500">{new Date(post.created_at).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        {post.is_published ? (
                                            <span className="text-green-400 text-xs bg-green-400/10 px-2 py-1 rounded">Published</span>
                                        ) : (
                                            <span className="text-yellow-400 text-xs bg-yellow-400/10 px-2 py-1 rounded">Draft</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right flex justify-end gap-2">
                                        <button onClick={() => handleEdit(post)} className="p-2 text-gray-400 hover:text-white"><Edit2 size={16} /></button>
                                        <button onClick={() => handleDelete(post.slug)} className="p-2 text-gray-400 hover:text-red-400"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-dark border border-white/10 w-full max-w-5xl p-8 rounded-lg shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-serif text-white">{editingSlug ? 'Edit Story' : 'Write New Story'}</h2>

                            {/* Template Controls */}
                            <div className="flex items-center gap-2">
                                <select
                                    className="bg-white/10 border border-white/20 text-white text-sm p-2 rounded"
                                    onChange={(e) => {
                                        if (e.target.value) loadTemplate(e.target.value);
                                        e.target.value = ""; // Reset
                                    }}
                                >
                                    <option value="">Load Template...</option>
                                    {savedTemplates.map((t, i) => (
                                        <option key={i} value={t.content}>{t.name}</option>
                                    ))}
                                </select>

                                {showTemplateSave ? (
                                    <div className="flex gap-2">
                                        <input
                                            className="bg-white/10 border border-white/20 text-white text-sm p-2 rounded w-32"
                                            placeholder="Template Name"
                                            value={newTemplateName}
                                            onChange={e => setNewTemplateName(e.target.value)}
                                        />
                                        <button onClick={saveCurrentAsTemplate} className="text-gold-500 text-xs font-bold uppercase hover:text-white">Save</button>
                                        <button onClick={() => setShowTemplateSave(false)} className="text-gray-400 text-xs uppercase hover:text-white">Cancel</button>
                                    </div>
                                ) : (
                                    <button onClick={() => setShowTemplateSave(true)} className="text-gold-500 hover:text-white text-sm underline">
                                        Save Current as Template
                                    </button>
                                )}
                            </div>

                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-3 gap-6">
                                <div className="col-span-2 space-y-2">
                                    <label className="text-sm text-gray-400">Title</label>
                                    <input className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:border-gold-400 outline-none"
                                        value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400">Category</label>
                                    <input className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:border-gold-400 outline-none"
                                        value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Cover Image</label>
                                <ImageUploader
                                    value={formData.cover_image}
                                    onChange={(url) => setFormData({ ...formData, cover_image: url })}
                                    onUpload={(file) => blogService.uploadImage(file, localStorage.getItem('accessToken') || '')}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Content</label>
                                <div className="bg-white/90 text-black rounded overflow-hidden">
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.content}
                                        onChange={(value) => setFormData({ ...formData, content: value })}
                                        modules={modules}
                                        className="h-96 mb-12"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 pt-4">
                                <label className="text-sm text-gray-400">Excerpt / Short Summary</label>
                                <textarea className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:border-gold-400 outline-none h-20"
                                    value={formData.excerpt} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Tags (comma separated)</label>
                                <input className="w-full bg-white/5 border border-white/10 p-3 rounded text-white focus:border-gold-400 outline-none"
                                    value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} />
                            </div>

                            <div className="flex items-center gap-2 border-t border-white/10 pt-6">
                                <input type="checkbox" checked={formData.is_published} onChange={e => setFormData({ ...formData, is_published: e.target.checked })} className="accent-gold-400" />
                                <label className="text-white">Publish immediately</label>
                            </div>

                            <div className="flex justify-end gap-4">
                                <Button type="submit">Save Story</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
