/**
 * pages/NotFoundPage.jsx
 * Displayed when the user navigates to a route that doesn't exist.
 */

import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center px-5">
      <div className="text-center">
        <p className="font-script text-latte-400 text-5xl mb-2">Oops…</p>
        <h1 className="font-display text-espresso-700 text-7xl font-light mb-4">404</h1>
        <p className="font-body text-muted text-base max-w-xs mx-auto mb-8">
          Looks like this page wandered off. Let's get you back to something warm.
        </p>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
