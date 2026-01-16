import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Calendar, Tag } from 'lucide-react';
import { blogService, BlogPost } from '../services/blogService';

interface JournalPostPageProps {
    slug: string;
    onBack: () => void;
}

export const JournalPostPage: React.FC<JournalPostPageProps> = ({ slug, onBack }) => {
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await blogService.getPost(slug);
                setPost(data);
            } catch (err) {
                setError('Failed to load story.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (slug) fetchPost();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-dark pt-32 pb-24 flex justify-center items-center">
                <div className="text-gold-500 animate-pulse">Loading story...</div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-dark pt-32 pb-24 text-center px-4">
                <h2 className="text-2xl text-white mb-4">{error || 'Story not found'}</h2>
                <button onClick={onBack} className="text-gold-500 hover:text-white transition-colors flex items-center gap-2 mx-auto">
                    <ArrowLeft size={20} /> Back to Journal
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark pt-32 pb-24 animate-reveal">
            {/* Hero Image */}
            {post.cover_image && (
                <div className="w-full h-[60vh] relative mb-12">
                    <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent z-10" />
                    <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 w-full z-20 p-6 md:p-12 container mx-auto">
                        <button onClick={onBack} className="text-white/80 hover:text-gold-500 mb-6 flex items-center gap-2 transition-colors">
                            <ArrowLeft size={20} /> Back to Journal
                        </button>
                        <div className="inline-block px-3 py-1 bg-gold-500 text-black font-bold text-xs uppercase tracking-wider mb-4">
                            {post.category}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 max-w-4xl leading-tight">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap gap-6 text-gray-300 text-sm tracking-wide">
                            <span className="flex items-center gap-2">
                                <Calendar size={16} className="text-gold-500" />
                                {new Date(post.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                            {post.author_name && (
                                <span className="flex items-center gap-2">
                                    <span className="text-gold-500">By</span> {post.author_name}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Content */}
            <article className="container mx-auto px-6 max-w-3xl">
                {!post.cover_image && (
                    <div className="mb-12">
                        <button onClick={onBack} className="text-white/80 hover:text-gold-500 mb-6 flex items-center gap-2 transition-colors">
                            <ArrowLeft size={20} /> Back to Journal
                        </button>
                        <h1 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">{post.title}</h1>
                        <div className="flex gap-4 text-sm text-gray-400 border-b border-white/10 pb-8">
                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{post.category}</span>
                        </div>
                    </div>
                )}

                <div className="prose prose-invert prose-lg prose-headings:font-serif prose-a:text-gold-500 hover:prose-a:text-white prose-img:rounded-md max-w-none">
                    {/* 
               Warning: Rendering HTML content directly can be dangerous (XSS). 
               Since this is admin-generated content, we assume it's relatively safe, 
               but in a real app, sanitize this or use a markdown renderer.
               We'll use dangerouslySetInnerHTML for now as users likely expect rich text from the editor.
            */}
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>

                {/* Footer / Tags */}
                <div className="mt-16 pt-8 border-t border-white/10">
                    {post.tags && (
                        <div className="flex flex-wrap gap-2">
                            {post.tags.split(',').map((tag, i) => (
                                <span key={i} className="flex items-center gap-1 text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full">
                                    <Tag size={14} /> {tag.trim()}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </article>
        </div>
    );
};
