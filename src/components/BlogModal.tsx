import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { BlogPost } from '../constants/blogData';

interface BlogModalProps {
  post: BlogPost | null;
  onClose: () => void;
}

export default function BlogModal({ post, onClose }: BlogModalProps) {
  return (
    <AnimatePresence>
      {post && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-text/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="relative w-full max-w-5xl max-h-[90vh] bg-brand-bg rounded-[3rem] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.3)] flex flex-col"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-brand-text hover:bg-brand-primary hover:text-white transition-all shadow-sm"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="overflow-y-auto custom-scrollbar">
              <div className="p-8 md:p-16">
                <div className="max-w-3xl mx-auto">
                  <p className="text-[11px] font-black uppercase tracking-[0.3em] text-brand-secondary mb-4 italic">BLOG ARTICLE — {post.category}</p>
                  <h2 className="font-serif text-3xl md:text-5xl font-black leading-[1.1] text-brand-text mb-10">
                    {post.title}
                  </h2>
                  
                  <div className="mb-12 rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm">
                    <img 
                      src={post.coverImage} 
                      alt={post.title} 
                      className="w-full h-80 object-cover"
                    />
                  </div>

                  <div className="prose prose-slate max-w-none">
                    {post.body.map((para, i) => (
                      <p key={i} className={`text-lg text-gray-600 leading-relaxed mb-6 font-medium ${i === 0 ? 'text-brand-text border-l-4 border-brand-secondary pl-6 text-xl mb-10 italic' : ''}`}>
                        {para}
                      </p>
                    ))}
                  </div>

                  <div className="mt-16 pt-10 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-brand-secondary/20 flex items-center justify-center text-brand-secondary font-black">US</div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">AUTHOR</p>
                        <p className="text-sm font-bold text-brand-text">{post.author}</p>
                      </div>
                    </div>
                    <button 
                      onClick={onClose}
                      className="btn-luxury px-8 py-3 rounded-full text-xs font-black tracking-widest"
                    >
                      CLOSE ARTICLE
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
