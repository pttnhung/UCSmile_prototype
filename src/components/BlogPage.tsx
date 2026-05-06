
import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Clock, Calendar } from 'lucide-react';
import { blogData, BlogPost } from '../constants/blogData';
import BlogModal from './BlogModal';

export default function BlogPage() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <div className="min-h-screen bg-brand-bg pt-32 pb-24">
      {/* Blog Hero */}
      <section className="px-6 mb-20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 font-bold tracking-[0.2em] uppercase text-sm mb-4">UCSMILE EDITORIAL</p>
          <h1 className="font-serif text-4xl md:text-7xl font-black tracking-tighter text-brand-text mb-6">
            Guides for travel <br />
            & <span className="text-brand-secondary">treatment.</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium italic">
            Practical editorial notes for patients planning dental care in Da Nang.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogData.map((post, idx) => (
            <motion.article
              key={idx}
              whileHover={{ y: -8 }}
              onClick={() => setSelectedPost(post)}
              className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all cursor-pointer group"
            >
              <div className="aspect-[16/10] overflow-hidden relative p-3">
                <img 
                  src={post.coverImage} 
                  alt={post.title}
                  className="w-full h-full object-cover rounded-[2rem] transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black text-gray-500 uppercase tracking-widest border border-gray-100">
                  {post.category}
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-4 text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">
                  <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {post.readTime}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {post.date}</span>
                </div>
                <h3 className="text-2xl font-bold text-brand-text mb-4 leading-tight group-hover:text-brand-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-3 mb-8">
                  {post.subtitle}
                </p>
                <div className="flex items-center justify-between border-t border-gray-50 pt-6">
                  <span className="text-brand-text font-black text-xs uppercase tracking-widest flex items-center gap-2 group-hover:text-brand-primary transition-colors">
                    READ ARTICLE <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Modal / Article View */}
      <BlogModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </div>
  );
}
