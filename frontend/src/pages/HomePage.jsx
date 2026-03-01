/**
 * pages/HomePage.jsx
 * Landing page with hero section, about section, and daily specials.
 */

import { Link } from 'react-router-dom';

// Hand-picked featured items for the daily specials section
const USD_TO_INR = 83;

const SPECIALS = [
  {
    emoji: '☕',
    name:  'Honey Latte',
    desc:  'Espresso, steamed whole milk, wildflower honey',
    price: 5.5,
    tag:   'Fan Favourite',
  },
  {
    emoji: '🥐',
    name:  'Almond Croissant',
    desc:  'Twice-baked with frangipane and toasted almonds',
    price: 4.5,
    tag:   'Baked Today',
  },
  {
    emoji: '🧊',
    name:  'Cold Brew Reserve',
    desc:  '20-hour steep, Ethiopian Yirgacheffe',
    price: 6,
    tag:   'Staff Pick',
  },
  {
    emoji: '🍳',
    name:  'Smashed Avo Toast',
    desc:  'Sourdough, avocado, poached egg, dukkah',
    price: 12.5,
    tag:   'Weekend Special',
  },
];

export default function HomePage() {
  return (
    <>
      {/* ════════════════════════════════
          HERO SECTION
      ════════════════════════════════ */}
      <section
        className="relative min-h-[92vh] flex items-center justify-center overflow-hidden grain-overlay"
        style={{
          background: 'linear-gradient(160deg, #1a0d03 0%, #3d2010 40%, #5c2e12 70%, #1a0d03 100%)',
        }}
      >
        {/* Decorative radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% 45%, rgba(212,168,83,0.12) 0%, transparent 70%)',
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 text-center px-5 sm:px-8 max-w-4xl mx-auto">

          {/* Script label */}
          <p
            className="font-script text-latte-400 text-3xl sm:text-4xl mb-3
                       animate-fade-in opacity-0 delay-100"
          >
            Welcome to
          </p>

          {/* Main heading */}
          <h1
            className="font-display text-cream-100 font-light leading-none
                       text-6xl sm:text-8xl md:text-9xl mb-6
                       animate-fade-up opacity-0 delay-200"
          >
            Velvet
            <br />
            <span className="italic text-latte-300">Bean</span>
          </h1>

          {/* Tagline */}
          <p
            className="font-body text-cream-200/60 text-base sm:text-lg max-w-md mx-auto mb-10
                       tracking-wide leading-relaxed
                       animate-fade-up opacity-0 delay-400"
          >
            Handcrafted coffee. Fresh-baked pastries.
            A corner of the city that slows down.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center
                       animate-fade-up opacity-0 delay-500"
          >
            <Link to="/menu" className="btn-primary">
              Explore Our Menu
            </Link>
            <Link to="/feedback" className="btn-outline text-cream-200/70 border-cream-200/30 hover:bg-cream-200/10 hover:border-cream-200/50">
              Share Your Experience
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-40">
          <span className="font-body text-xs tracking-widest uppercase text-cream-200">Scroll</span>
          <div className="w-px h-8 bg-cream-200/50" />
        </div>
      </section>

      {/* ════════════════════════════════
          ABOUT / STORY SECTION
      ════════════════════════════════ */}
      <section className="py-24 sm:py-32 bg-cream-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Left: decorative image block */}
            <div className="relative">
              {/* Primary colour block */}
              <div
                className="aspect-[4/5] max-w-sm mx-auto md:mx-0
                           bg-espresso-500 flex items-center justify-center"
                aria-hidden="true"
              >
                <span className="font-script text-cream-100/20 text-[10rem] select-none">
                  V
                </span>
              </div>

              {/* Floating stat cards */}
              <div className="absolute -bottom-6 -right-2 md:right-[-3rem] card px-6 py-4 bg-white">
                <p className="font-display text-4xl text-espresso-600 font-light">12+</p>
                <p className="font-body text-xs text-muted tracking-widest uppercase mt-0.5">Years of craft</p>
              </div>
              <div className="absolute -top-6 right-8 md:right-0 card px-6 py-4 bg-bark-900 border-0 shadow-card-lg">
                <p className="font-script text-2xl text-latte-400">Est. 2012</p>
              </div>
            </div>

            {/* Right: text content */}
            <div>
              <p className="section-label mb-2">Our Story</p>
              <h2 className="section-title mb-6">
                Slow craft
                <br />
                <span className="italic">in a fast city</span>
              </h2>
              <div className="space-y-4 font-body text-muted text-base leading-relaxed">
                <p>
                  Velvet Bean opened in 2012 on a quiet corner of Beantown with a
                  single espresso machine, a secondhand sofa, and a belief that
                  great coffee deserves unhurried attention.
                </p>
                <p>
                  Every bean we source is single-origin and ethically traded.
                  Our head baker Mia starts before sunrise so your croissant
                  is still warm when you arrive. We don't rush things here —
                  and we don't think you should either.
                </p>
              </div>
              <div className="ornament my-8 text-sm text-latte-500/60 tracking-widest uppercase">
                crafted with care
              </div>
              <Link to="/menu" className="btn-primary">
                View Our Full Menu →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          TODAY'S SPECIALS
      ════════════════════════════════ */}
      <section className="py-24 sm:py-32 bg-espresso-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

          {/* Section header */}
          <div className="text-center mb-14">
            <p className="section-label mb-2">Fresh today</p>
            <h2 className="section-title">Today's Specials</h2>
          </div>

          {/* Cards grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SPECIALS.map((item, i) => (
              <article
                key={item.name}
                className={`card bg-white flex flex-col
                            animate-fade-up opacity-0 delay-${(i + 1) * 100}`}
              >
                {/* Badge */}
                <div className="bg-espresso-500 text-cream-100 text-xs font-body tracking-widest uppercase px-3 py-1 self-start">
                  {item.tag}
                </div>

                {/* Emoji visual */}
                <div className="flex items-center justify-center py-8 text-6xl bg-cream-200/40">
                  {item.emoji}
                </div>

                {/* Info */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-display text-espresso-700 text-xl font-semibold leading-tight mb-1">
                    {item.name}
                  </h3>
                  <p className="font-body text-muted text-sm leading-relaxed flex-1">
                    {item.desc}
                  </p>
                  <p className="font-display text-espresso-600 text-2xl font-light mt-4">
                    Rs. {(item.price * USD_TO_INR).toFixed(0)}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/menu" className="btn-outline">
              See Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          REVIEW CTA BANNER
      ════════════════════════════════ */}
      <section
        className="py-20 text-center relative overflow-hidden grain-overlay"
        style={{ background: 'linear-gradient(135deg, #4a2409, #8B4513)' }}
      >
        <div className="relative z-10 max-w-xl mx-auto px-5">
          <p className="font-script text-latte-300 text-3xl mb-3">Enjoyed your visit?</p>
          <h2 className="font-display text-cream-100 text-4xl font-light mb-4">
            We'd love to hear from you.
          </h2>
          <p className="font-body text-cream-100/60 text-sm mb-8 leading-relaxed">
            Your feedback shapes how we brew, bake, and welcome you next time.
          </p>
          <Link to="/feedback" className="btn-outline text-cream-200/80 border-cream-200/40 hover:bg-cream-200/10">
            Leave a Review
          </Link>
        </div>
      </section>
    </>
  );
}
