/**
 * components/Footer.jsx
 * Site-wide footer with business hours, address, and social media links.
 */

import { Link } from 'react-router-dom';

const HOURS = [
  { day: 'Monday – Friday', time: '7:00 AM – 8:00 PM' },
  { day: 'Saturday',        time: '8:00 AM – 9:00 PM' },
  { day: 'Sunday',          time: '9:00 AM – 6:00 PM' },
];

const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    href: '#',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    name: 'Twitter / X',
    href: '#',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: '#',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-bark-900 text-cream-200/70">

      {/* ── Top accent line ─────────────────────────────────── */}
      <div className="h-px bg-gradient-to-r from-transparent via-latte-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* ── Brand column ──────────────────────────────────── */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <span className="font-script text-3xl text-latte-400">Velvet Bean</span>
            </Link>
            <p className="font-body text-sm leading-relaxed max-w-xs">
              A slow café for fast days. We believe the best things in life
              take a little longer — especially coffee.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-4 mt-6">
              {SOCIAL_LINKS.map(({ name, href, icon }) => (
                <a
                  key={name}
                  href={href}
                  aria-label={name}
                  className="text-cream-200/40 hover:text-latte-400 transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Hours column ──────────────────────────────────── */}
          <div>
            <h3 className="font-display text-cream-100 text-lg font-light tracking-wide mb-5">
              Opening Hours
            </h3>
            <ul className="space-y-2.5">
              {HOURS.map(({ day, time }) => (
                <li key={day} className="flex justify-between gap-4 font-body text-sm">
                  <span>{day}</span>
                  <span className="text-latte-400 whitespace-nowrap">{time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Location column ───────────────────────────────── */}
          <div>
            <h3 className="font-display text-cream-100 text-lg font-light tracking-wide mb-5">
              Find Us
            </h3>
            <address className="not-italic font-body text-sm leading-relaxed space-y-1.5">
              <p>24 Roast Lane, Beantown</p>
              <p>New York, NY 10001</p>
              <p className="pt-2">
                <a href="tel:+12125550170" className="hover:text-latte-400 transition-colors">
                  +1 (212) 555-0170
                </a>
              </p>
              <p>
                <a href="mailto:hello@velvetbean.co" className="hover:text-latte-400 transition-colors">
                  hello@velvetbean.co
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* ── Bottom bar ────────────────────────────────────────── */}
        <div className="pt-8 border-t border-espresso-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Velvet Bean Café. All rights reserved.</p>
          <nav className="flex gap-5" aria-label="Footer navigation">
            <Link to="/"         className="hover:text-latte-400 transition-colors">Home</Link>
            <Link to="/menu"     className="hover:text-latte-400 transition-colors">Menu</Link>
            <Link to="/feedback" className="hover:text-latte-400 transition-colors">Feedback</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
