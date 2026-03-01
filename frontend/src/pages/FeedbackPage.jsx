/**
 * pages/FeedbackPage.jsx
 * Customer feedback form.
 * Submits to POST /api/feedback and displays success/error states.
 */

import { useState, useId } from 'react';
import { submitFeedback }  from '../api/client';

// ── Star Rating Component ───────────────────────────────────────
function StarRating({ value, onChange, error }) {
  const [hovered, setHovered] = useState(0);
  const labels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'];

  return (
    <div>
      <div
        className="flex items-center gap-1"
        role="radiogroup"
        aria-label="Star rating"
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            aria-checked={value === star}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className={`
              text-4xl transition-all duration-150 focus:outline-none
              hover:scale-110 active:scale-95
              ${(hovered || value) >= star
                ? 'text-latte-500'
                : 'text-cream-300'
              }
            `}
          >
            ★
          </button>
        ))}
        {(hovered || value) > 0 && (
          <span className="ml-3 font-body text-sm text-muted italic">
            {labels[hovered || value]}
          </span>
        )}
      </div>
      {error && <p className="mt-1.5 text-red-500 text-xs font-body">{error}</p>}
    </div>
  );
}

// ── Form field wrapper for consistent labelling ─────────────────
function Field({ id, label, required, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="block font-body text-xs font-medium tracking-widest uppercase text-espresso-600 mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-red-500 text-xs font-body">{error}</p>}
    </div>
  );
}

// ── Success state ───────────────────────────────────────────────
function SuccessState({ name, onReset }) {
  return (
    <div className="text-center py-16 animate-fade-in">
      <div className="text-7xl mb-6">☕</div>
      <h2 className="font-display text-espresso-700 text-4xl font-light mb-3">
        Thank you, {name}!
      </h2>
      <p className="font-body text-muted text-base max-w-sm mx-auto leading-relaxed mb-8">
        Your feedback has been saved. We read every review and use it
        to keep improving — see you next time.
      </p>
      <button onClick={onReset} className="btn-outline">
        Submit Another Review
      </button>
    </div>
  );
}

// ── Initial state ───────────────────────────────────────────────
const INITIAL_FORM = { name: '', email: '', rating: 0, comment: '' };

// ── Main component ──────────────────────────────────────────────
export default function FeedbackPage() {
  const [form,       setForm]       = useState(INITIAL_FORM);
  const [errors,     setErrors]     = useState({});
  const [status,     setStatus]     = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [apiError,   setApiError]   = useState('');
  const [savedName,  setSavedName]  = useState('');

  const nameId    = useId();
  const emailId   = useId();
  const commentId = useId();

  // ── Client-side validation ──────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!form.name.trim())                       errs.name    = 'Please enter your name.';
    if (!form.email.trim())                      errs.email   = 'Please enter your email address.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email   = 'Please enter a valid email address.';
    if (!form.rating)                            errs.rating  = 'Please select a star rating.';
    if (!form.comment.trim())                    errs.comment = 'Please leave a comment.';
    else if (form.comment.trim().length < 10)    errs.comment = 'Comment must be at least 10 characters.';
    return errs;
  };

  // ── Field change handler ────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // ── Form submit ─────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus('loading');
    setApiError('');

    try {
      await submitFeedback(form);
      setSavedName(form.name);
      setStatus('success');
      setForm(INITIAL_FORM);
      setErrors({});
    } catch ({ message, fieldErrors }) {
      setStatus('error');
      setApiError(message);
      // Merge server-side field errors with client errors
      if (fieldErrors) setErrors((prev) => ({ ...prev, ...fieldErrors }));
    }
  };

  const resetForm = () => {
    setStatus('idle');
    setApiError('');
    setErrors({});
  };

  return (
    <>
      {/* ── Page header ─────────────────────────────────────── */}
      <div
        className="relative py-20 text-center overflow-hidden grain-overlay"
        style={{ background: 'linear-gradient(160deg, #1a0d03 0%, #4a2409 100%)' }}
      >
        <p className="font-script text-latte-400 text-3xl mb-2">Share your thoughts</p>
        <h1 className="font-display text-cream-100 text-5xl sm:text-6xl font-light">
          Feedback
        </h1>
        <p className="font-body text-cream-100/50 text-sm mt-3 max-w-xs mx-auto">
          Every review helps us serve you better.
        </p>
      </div>

      {/* ── Form ─────────────────────────────────────────────── */}
      <section className="bg-cream-100 py-16 sm:py-24">
        <div className="max-w-xl mx-auto px-5 sm:px-8">

          {status === 'success' ? (
            <SuccessState name={savedName} onReset={resetForm} />
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-6">

              {/* API-level error banner */}
              {status === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 font-body text-sm" role="alert">
                  <strong>Submission failed:</strong> {apiError}
                </div>
              )}

              {/* Name */}
              <Field id={nameId} label="Your Name" required error={errors.name}>
                <input
                  id={nameId}
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Ada Lovelace"
                  value={form.name}
                  onChange={handleChange}
                  className={`input-field ${errors.name ? 'border-red-400 focus:ring-red-300' : ''}`}
                />
              </Field>

              {/* Email */}
              <Field id={emailId} label="Email Address" required error={errors.email}>
                <input
                  id={emailId}
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="ada@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className={`input-field ${errors.email ? 'border-red-400 focus:ring-red-300' : ''}`}
                />
              </Field>

              {/* Star rating */}
              <div>
                <p className="font-body text-xs font-medium tracking-widest uppercase text-espresso-600 mb-3">
                  Your Rating <span className="text-red-400">*</span>
                </p>
                <StarRating
                  value={form.rating}
                  onChange={(r) => {
                    setForm((prev) => ({ ...prev, rating: r }));
                    if (errors.rating) setErrors((prev) => ({ ...prev, rating: '' }));
                  }}
                  error={errors.rating}
                />
              </div>

              {/* Comment */}
              <Field id={commentId} label="Your Comment" required error={errors.comment}>
                <textarea
                  id={commentId}
                  name="comment"
                  rows={5}
                  placeholder="Tell us about your experience — the coffee, the atmosphere, the team..."
                  value={form.comment}
                  onChange={handleChange}
                  maxLength={1000}
                  className={`textarea-field ${errors.comment ? 'border-red-400 focus:ring-red-300' : ''}`}
                />
                <p className="text-right font-body text-xs text-muted mt-1">
                  {form.comment.length} / 1000
                </p>
              </Field>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Submitting…
                  </>
                ) : 'Submit Review'}
              </button>

              <p className="text-center font-body text-xs text-muted">
                Your email will only be used to follow up on your feedback.
              </p>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
