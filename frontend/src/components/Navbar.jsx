/**
 * components/Navbar.jsx
 * Fixed top navigation that elevates on scroll.
 * Mobile-first: collapses into a hamburger menu on small screens.
 */

import { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useLocation }        from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLoyaltyStatus } from '../hooks/useLoyaltyStatus';

const NAV_LINKS = [
  { path: '/',               label: 'Home' },
  { path: '/menu',           label: 'Menu' },
  { path: '/order',          label: 'Order' },
  { path: '/current_orders', label: 'Current Orders' },
  { path: '/feedback',       label: 'Feedback' },
];

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const location = useLocation();
  const { logout } = useAuth();
  const { status } = useLoyaltyStatus();

  const tier = status?.tier ?? 'REGULAR';
  const discountPercent = status?.discountPercent ?? 0;

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [location]);

  // Detect scroll to apply elevated style
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 40);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-400 ease-out
        ${scrolled
          ? 'bg-bark-900/98 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.25)]'
          : 'bg-bark-900/90 backdrop-blur-sm'
        }
      `}
    >
      <nav
        className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between h-20"
        aria-label="Main navigation"
      >

        {/*  Logo  */}
        <Link
          to="/"
          className="flex items-baseline gap-2 group focus:outline-none"
          aria-label="Velvet Bean  Home"
        >
          <span className="font-script text-3xl text-latte-400 group-hover:text-latte-300 transition-colors">
            Velvet Bean
          </span>
          <span className="hidden sm:inline text-espresso-400 font-body text-xs tracking-[0.2em] uppercase ml-1">
            Café
          </span>
        </Link>

        {/*  Desktop Links  */}
        <ul className="hidden md:flex items-center gap-8" role="list">
          {NAV_LINKS.map(({ path, label }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) => `
                  relative font-body text-sm tracking-widest uppercase
                  pb-1 transition-colors duration-200
                  after:absolute after:bottom-0 after:left-0 after:right-0
                  after:h-px after:bg-latte-400 after:origin-left
                  after:transition-transform after:duration-300
                  ${isActive
                    ? 'text-latte-300 after:scale-x-100'
                    : 'text-cream-200/70 hover:text-cream-100 after:scale-x-0 hover:after:scale-x-100'
                  }
                `}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/*  Desktop CTA  */}
        <div className="hidden md:flex items-center gap-3">
          {tier !== 'REGULAR' && (
            <div className="px-3 py-1 text-[10px] uppercase tracking-[0.2em] border border-latte-400/40 text-latte-300">
              {tier === 'PRIME' ? 'Prime Card' : 'Premium Card'} {discountPercent}% off
            </div>
          )}
          <Link
            to="/order"
            className="px-5 py-2 text-xs font-body font-medium tracking-widest uppercase
                       border border-latte-500/50 text-latte-400
                       hover:border-latte-400 hover:text-latte-300 hover:bg-latte-500/10
                       transition-all duration-200"
          >
            Start Order
          </Link>
          <button
            type="button"
            onClick={logout}
            className="px-4 py-2 text-xs font-body font-medium tracking-widest uppercase
                       border border-cream-200/40 text-cream-200/80
                       hover:text-cream-100 hover:border-cream-100/60 transition-colors"
          >
            Logout
          </button>
        </div>

        {/*  Mobile Hamburger  */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 focus:outline-none"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          <span className={`block h-0.5 w-6 bg-cream-200 transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block h-0.5 w-6 bg-cream-200 transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
          <span className={`block h-0.5 w-6 bg-cream-200 transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {/*  Mobile Dropdown Menu  */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out
                    ${mobileOpen ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="bg-bark-900 border-t border-espresso-800 px-5 py-6 flex flex-col gap-5">
          {tier !== 'REGULAR' && (
            <div className="text-xs uppercase tracking-[0.2em] text-latte-300 border border-latte-400/40 px-3 py-2">
              {tier === 'PRIME' ? 'Prime Card' : 'Premium Card'} {discountPercent}% off
            </div>
          )}
          {NAV_LINKS.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `font-body text-base tracking-widest uppercase transition-colors
                 ${isActive ? 'text-latte-300' : 'text-cream-200/70 hover:text-cream-100'}`
              }
            >
              {label}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={logout}
            className="text-left font-body text-base tracking-widest uppercase text-cream-200/70 hover:text-cream-100"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

