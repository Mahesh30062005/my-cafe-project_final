/**
 * pages/MenuPage.jsx
 * Displays the cafe menu grouped by category in a tabbed interface.
 * Fetches live data from GET /api/menu via the useMenu() hook.
 */

import { useState, useEffect }  from 'react';
import { useMenu }               from '../hooks/useMenu';

// Human-readable labels and icons for each API category key
const CATEGORY_META = {
  HOT_BEVERAGES:  { label: 'Hot Beverages',  emoji: '☕' },
  COLD_BEVERAGES: { label: 'Cold Beverages', emoji: '🧊' },
  PASTRIES:       { label: 'Pastries',       emoji: '🥐' },
  STARTERS:       { label: 'Starters',       emoji: '🥗' },
  MAINS:          { label: 'Mains',          emoji: '🍳' },
  DESSERTS:       { label: 'Desserts',       emoji: '🍰' },
};

const USD_TO_INR = 83;

// ── Skeleton loader for a single card ──────────────────────────
function SkeletonCard() {
  return (
    <div className="card bg-white p-5 animate-pulse">
      <div className="h-5 bg-cream-300 rounded w-3/4 mb-3" />
      <div className="h-4 bg-cream-200 rounded w-full mb-2" />
      <div className="h-4 bg-cream-200 rounded w-2/3 mb-4" />
      <div className="h-6 bg-cream-300 rounded w-1/4 mt-auto" />
    </div>
  );
}

// ── Single menu item card ───────────────────────────────────────
function MenuCard({ item }) {
  const formatted = (Number(item.price) * USD_TO_INR).toFixed(0);
  return (
    <article className="card bg-white flex flex-col p-5 group">
      <h3 className="font-display text-espresso-700 text-xl font-semibold leading-snug mb-1.5 group-hover:text-espresso-500 transition-colors">
        {item.name}
      </h3>
      <p className="font-body text-muted text-sm leading-relaxed flex-1">
        {item.description}
      </p>
      <p className="font-display text-espresso-600 text-2xl font-light mt-4">
        Rs. {formatted}
      </p>
    </article>
  );
}

// ── Fallback error state ────────────────────────────────────────
function ErrorState({ message }) {
  return (
    <div className="text-center py-20">
      <p className="text-5xl mb-4">☕</p>
      <p className="font-display text-espresso-700 text-2xl font-light mb-2">
        The kitchen is busy
      </p>
      <p className="font-body text-muted text-sm">{message}</p>
    </div>
  );
}

export default function MenuPage() {
  const { menu, loading, error } = useMenu();
  const [activeCategory, setActiveCategory] = useState(null);

  // Set the first available category when data loads
  useEffect(() => {
    if (menu && !activeCategory) {
      const keys = Object.keys(menu);
      if (keys.length > 0) setActiveCategory(keys[0]);
    }
  }, [menu, activeCategory]);

  const categories  = menu ? Object.keys(menu) : [];
  const activeItems = menu && activeCategory ? (menu[activeCategory] ?? []) : [];

  return (
    <>
      {/* ── Page header ───────────────────────────────────────── */}
      <div
        className="relative py-20 text-center overflow-hidden grain-overlay"
        style={{ background: 'linear-gradient(160deg, #1a0d03 0%, #4a2409 100%)' }}
      >
        <p className="font-script text-latte-400 text-3xl mb-2">What we serve</p>
        <h1 className="font-display text-cream-100 text-5xl sm:text-6xl font-light">
          Our Menu
        </h1>
        <p className="font-body text-cream-100/50 text-sm mt-3 max-w-xs mx-auto">
          Seasonal ingredients. Honest craft. Made to order.
        </p>
      </div>

      {/* ── Tab bar ───────────────────────────────────────────── */}
      <div className="sticky top-20 z-40 bg-white/95 backdrop-blur border-b border-cream-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div
            className="flex overflow-x-auto gap-1 py-2 scrollbar-none"
            role="tablist"
            aria-label="Menu categories"
          >
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 w-36 bg-cream-200 animate-pulse rounded flex-shrink-0" />
                ))
              : categories.map((key) => {
                  const meta = CATEGORY_META[key] ?? { label: key, emoji: '🍽️' };
                  const isActive = key === activeCategory;
                  return (
                    <button
                      key={key}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveCategory(key)}
                      className={`
                        flex-shrink-0 flex items-center gap-2 px-5 py-2.5 text-sm
                        font-body font-medium tracking-wide transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-espresso-400
                        ${isActive
                          ? 'bg-espresso-500 text-cream-100 shadow-sm'
                          : 'text-muted hover:bg-espresso-50 hover:text-espresso-600'
                        }
                      `}
                    >
                      <span aria-hidden="true">{meta.emoji}</span>
                      {meta.label}
                    </button>
                  );
                })
            }
          </div>
        </div>
      </div>

      {/* ── Items grid ────────────────────────────────────────── */}
      <section className="bg-cream-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-12">

          {error ? (
            <ErrorState message={error} />
          ) : loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <>
              {/* Category heading */}
              {activeCategory && (
                <div className="mb-8">
                  <h2 className="font-display text-espresso-700 text-3xl font-light">
                    {CATEGORY_META[activeCategory]?.emoji} {CATEGORY_META[activeCategory]?.label ?? activeCategory}
                  </h2>
                  <p className="font-body text-muted text-sm mt-1">
                    {activeItems.length} item{activeItems.length !== 1 ? 's' : ''} available
                  </p>
                </div>
              )}

              {/* Items */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeItems.map((item, i) => (
                  <div
                    key={item.id}
                    className={`animate-fade-up opacity-0 delay-${Math.min(i + 1, 5) * 100}`}
                  >
                    <MenuCard item={item} />
                  </div>
                ))}
              </div>

              {activeItems.length === 0 && (
                <p className="text-center font-body text-muted py-16">
                  Nothing available in this category right now.
                </p>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
