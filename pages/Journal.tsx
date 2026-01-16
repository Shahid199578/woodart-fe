import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { blogService, BlogPost } from '../services/blogService';

interface JournalPageProps {
  onNavigateToPost: (slug: string) => void;
}

export const JournalPage: React.FC<JournalPageProps> = ({ onNavigateToPost }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await blogService.getPosts();
        setPosts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="pt-32 pb-24 bg-dark min-h-screen animate-reveal">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl md:text-6xl font-serif text-white mb-4 text-center">The Journal</h1>
        <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">Notes from the workbench, care guides, and design inspiration.</p>

        {loading ? (
          <div className="text-center text-gray-500">Loading stories...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {posts.map(article => (
              <article key={article.id} onClick={() => onNavigateToPost(article.slug)} className="group cursor-pointer">
                <div className="overflow-hidden rounded-sm mb-6 relative aspect-video bg-white/5">
                  {article.cover_image && (
                    <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  )}
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 text-gold-400 text-xs font-bold uppercase tracking-wider">
                    {article.category}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-serif text-white group-hover:text-gold-400 transition-colors">{article.title}</h2>
                    <ArrowUpRight className="text-gray-500 group-hover:text-gold-400 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0" />
                  </div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">{new Date(article.created_at).toLocaleDateString()}</p>
                  <p className="text-gray-400 leading-relaxed line-clamp-2">{article.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
