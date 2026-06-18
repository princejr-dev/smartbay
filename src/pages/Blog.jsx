import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Tag, ArrowRight, BookOpen } from 'lucide-react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export default function Blog({ onBack, onReadPost }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Met à jour le titre de la page pour le SEO
  useEffect(() => {
    document.title = 'Blog — SmartBay | Conseils gestion locative';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content',
        'Conseils pratiques pour les propriétaires immobiliers. Gestion locative, contrats de bail, retards de loyer et plus encore.'
      );
    }
    // Restore le titre quand on quitte
    return () => { document.title = 'SmartBay'; };
  }, []);

  // Charge les articles publiés depuis Firestore
  useEffect(() => {
    const load = async () => {
      try {
        const q = query(
          collection(db, 'blog_posts'),
          where('published', '==', true),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Convertit le timestamp Firestore en date JS
          createdAt: doc.data().createdAt?.toDate(),
        }));
        setPosts(data);
      } catch (err) {
        console.error('Erreur chargement blog:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Catégories disponibles
  const categories = ['all', ...new Set(posts.map(p => p.category).filter(Boolean))];

  // Filtre par catégorie
  const filtered = filter === 'all'
    ? posts
    : posts.filter(p => p.category === filter);

  // Formate la date en français
  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Header */}
      <div className="bg-gradient-to-br from-accent to-accent-dark px-6 pt-12 pb-16">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Retour</span>
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <BookOpen size={20} className="text-white" />
            </div>
            <h1 className="text-white text-3xl font-bold">Blog SmartBay</h1>
          </div>
          <p className="text-white/70 text-base">
            Conseils pratiques pour les propriétaires immobiliers
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 -mt-6 pb-16">

        {/* Filtres catégories */}
        {categories.length > 1 && (
          <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all
                  ${filter === cat
                    ? 'bg-accent text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm'
                  }`}
              >
                {cat === 'all' ? 'Tous les articles' : cat}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3" />
                <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
                <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          /* Aucun article */
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
              <BookOpen size={32} className="text-accent" />
            </div>
            <p className="font-semibold text-gray-700 dark:text-white text-lg">
              Aucun article disponible
            </p>
            <p className="text-gray-400 text-sm text-center max-w-sm">
              Les articles seront publiés prochainement. Revenez bientôt !
            </p>
          </div>
        ) : (
          /* Liste des articles */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((post, index) => (
              <article
                key={post.id}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden
                  ${index === 0 ? 'md:col-span-2' : ''}
                `}
              >
                {/* Card contenu */}
                <div className="p-6">
                  {/* Catégorie + date */}
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    {post.category && (
                      <span className="flex items-center gap-1.5 bg-accent/10 text-accent text-xs font-semibold px-3 py-1 rounded-full">
                        <Tag size={11} />
                        {post.category}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 text-gray-400 text-xs">
                      <Calendar size={11} />
                      {formatDate(post.createdAt)}
                    </span>
                  </div>

                  {/* Titre */}
                  <h2 className={`font-bold text-gray-800 dark:text-white mb-3 leading-snug text-lg`}>
                    {post.title}
                  </h2>

                  {/* Extrait */}
                  {post.excerpt && (
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}

                  {/* Bouton lire */}
                  <button
                    onClick={() => onReadPost(post)}
                    className="flex items-center gap-2 text-accent font-semibold text-sm hover:gap-3 transition-all"
                  >
                    Lire l&#39;article
                    <ArrowRight size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}