import { useEffect } from 'react';
import { ArrowLeft, Calendar, Tag, BookOpen } from 'lucide-react';
import ReactMarkdown from "react-markdown";

export default function BlogPost({ post, onBack }) {

  // SEO dynamique par article
  useEffect(() => {
    if (!post) return;
    document.title = `${post.title} — SmartBay Blog`;
    // Meta description
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', post.excerpt || post.title);

    // Open Graph
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', `${post.title} — SmartBay`);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', post.excerpt || post.title);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `https://getsmartbay.vercel.app/blog/${post.slug}`;

    // Restore au départ
    return () => {
      document.title = 'SmartBay';
    };
  }, [post]);

  if (!post) return null;

  // Formate la date
  const formatDate = (date) => {
    if (!date) return '';
    const d = date instanceof Date ? date : date.toDate?.();
    if (!d) return '';
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Header */}
      <div className="bg-gradient-to-br from-accent to-accent-dark px-6 pt-12 pb-16">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Retour au blog</span>
          </button>

          {/* Catégorie + date */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            {post.category && (
              <span className="flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                <Tag size={11} />
                {post.category}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-white/70 text-xs">
              <Calendar size={11} />
              {formatDate(post.createdAt)}
            </span>
          </div>

          {/* Titre */}
          <h1 className="text-white text-2xl md:text-3xl font-bold leading-snug">
            {post.title}
          </h1>

          {/* Extrait */}
          {post.excerpt && (
            <p className="text-white/70 text-base mt-4 leading-relaxed">
              {post.excerpt}
            </p>
          )}
        </div>
      </div>

      {/* Contenu article */}
      <div className="max-w-3xl mx-auto px-5 -mt-6 pb-16">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 md:p-10">

          {/* Contenu Markdown */}
          <div className="blog-content">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          {/* CTA SmartBay */}
          <div className="mt-10 bg-gradient-to-br from-accent/10 to-accent-dark/10 border border-accent/20 rounded-2xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <BookOpen size={18} className="text-accent" />
              </div>
              <div>
                <p className="font-bold text-gray-800 dark:text-white">
                  Gérez vos locataires avec SmartBay
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Suivez vos baux, générez des reçus PDF et recevez des alertes automatiques.
                </p>
              </div>
            </div>
            
            <a
              href="https://getsmartbay.vercel.app"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-accent to-accent-dark text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              Essayer SmartBay
              <ArrowLeft size={15} className="rotate-180" />
            </a>
          </div>

        </div>

        {/* Bouton retour bas de page */}
        <button
          onClick={onBack}
          className="mt-6 flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-accent transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Retour au blog
        </button>
      </div>
    </div>
  );
}