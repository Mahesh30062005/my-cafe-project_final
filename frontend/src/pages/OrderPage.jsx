import { useMemo, useState } from 'react';
import { useMenu } from '../hooks/useMenu';
import { createOrder } from '../api/client';

const COURSE_OPTIONS = [
  { key: 'STARTER', label: 'Starter' },
  { key: 'MAIN', label: 'Main Course' },
  { key: 'DESSERT', label: 'Dessert' },
];

const USD_TO_INR = 83;
const COURSE_CATEGORY_MAP = {
  STARTER: ['STARTERS'],
  MAIN: ['MAINS'],
  DESSERT: ['DESSERTS', 'PASTRIES'],
};

const NEXT_COURSE = {
  STARTER: 'MAIN',
  MAIN: 'DESSERT',
  DESSERT: null,
};

export default function OrderPage() {
  const { menu, loading, error } = useMenu();
  const [tableNumber, setTableNumber] = useState('');
  const [course, setCourse] = useState('STARTER');
  const [quantities, setQuantities] = useState({});
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [lastCourse, setLastCourse] = useState(null);

  const itemsForCourse = useMemo(() => {
    if (!menu) return [];
    const categories = COURSE_CATEGORY_MAP[course] ?? [];
    const items = categories.flatMap((cat) => menu[cat] ?? []);
    return items;
  }, [menu, course]);

  const handleQuantityChange = (id, value) => {
    setQuantities((prev) => ({ ...prev, [id]: value }));
  };

  const resetSelection = () => {
    setQuantities({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);

    if (!tableNumber) {
      setMessage('Please enter your table number.');
      return;
    }

    const items = Object.entries(quantities)
      .filter(([, qty]) => Number(qty) > 0)
      .map(([id, qty]) => ({
        menuItemId: Number(id),
        quantity: Number(qty),
        course,
      }));

    if (items.length === 0) {
      setMessage('Select at least one item to place the order.');
      return;
    }

    setSubmitting(true);
    try {
      await createOrder({
        tableNumber: Number(tableNumber),
        items,
      });
      setMessage('Order placed. Would you like to continue to the next course?');
      setLastCourse(course);
      resetSelection();
    } catch (err) {
      setMessage(err.message || 'Unable to place order.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextCourse = () => {
    const next = NEXT_COURSE[lastCourse];
    if (next) {
      setCourse(next);
      setMessage(null);
    }
  };

  const handleFinishTable = () => {
    setMessage('Table marked as finished. If you want more, start again from starters.');
    setLastCourse('DESSERT');
  };

  return (
    <section className="bg-cream-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 py-12">
        <div className="mb-8">
          <h1 className="font-display text-espresso-700 text-4xl font-light">Order Flow</h1>
          <p className="font-body text-muted text-sm mt-2">
            Start with starters, move to mains, then desserts. You can jump ahead if you want.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr,1.2fr] gap-8">
          <div className="bg-white border border-cream-200 p-6 shadow-sm">
            <h2 className="font-display text-espresso-700 text-2xl font-light mb-4">Table & Course</h2>

            <label className="block text-xs uppercase tracking-widest text-muted mb-1">Table Number</label>
            <input
              type="number"
              min="1"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className="w-full border border-cream-300 px-3 py-2 mb-5 focus:outline-none focus:ring-2 focus:ring-espresso-300"
              placeholder="e.g. 12"
            />

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-widest text-muted">Choose course</p>
              <div className="flex flex-wrap gap-2">
                {COURSE_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setCourse(opt.key)}
                    className={`px-4 py-2 text-xs uppercase tracking-widest border transition-colors
                      ${course === opt.key
                        ? 'bg-espresso-600 text-cream-100 border-espresso-600'
                        : 'border-cream-300 text-muted hover:border-espresso-400 hover:text-espresso-600'
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {lastCourse === 'DESSERT' && (
              <div className="mt-6 p-4 bg-cream-100 border border-cream-200 text-sm">
                <p className="font-body text-muted">Dessert-only is allowed. Is your table finished?</p>
                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={handleFinishTable}
                    className="px-4 py-2 text-xs uppercase tracking-widest border border-espresso-500 text-espresso-600"
                  >
                    Yes, finished
                  </button>
                  <button
                    type="button"
                    onClick={() => setCourse('STARTER')}
                    className="px-4 py-2 text-xs uppercase tracking-widest border border-cream-300 text-muted"
                  >
                    Start again
                  </button>
                </div>
              </div>
            )}

            {message && (
              <div className="mt-6 p-3 bg-cream-50 border border-cream-200 text-sm text-espresso-700">
                {message}
              </div>
            )}

            {lastCourse && NEXT_COURSE[lastCourse] && (
              <button
                type="button"
                onClick={handleNextCourse}
                className="mt-4 w-full py-2 text-xs uppercase tracking-widest border border-espresso-500 text-espresso-600"
              >
                Go to {NEXT_COURSE[lastCourse].toLowerCase()} course
              </button>
            )}
          </div>

          <div className="bg-white border border-cream-200 p-6 shadow-sm">
            <h2 className="font-display text-espresso-700 text-2xl font-light mb-2">
              {COURSE_OPTIONS.find((opt) => opt.key === course)?.label} Menu
            </h2>
            <p className="font-body text-muted text-sm mb-4">
              Pick quantities and place the order for this course.
            </p>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {loading ? (
              <p className="text-sm text-muted">Loading menu...</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {itemsForCourse.length === 0 && (
                  <p className="text-sm text-muted">No items available for this course.</p>
                )}

                {itemsForCourse.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b border-cream-200 pb-3">
                    <div>
                      <p className="font-body text-espresso-700">{item.name}</p>
                      <p className="text-xs text-muted">
                        Rs. {(Number(item.price) * USD_TO_INR).toFixed(0)}
                      </p>
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={quantities[item.id] ?? ''}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      className="w-20 border border-cream-300 px-2 py-1 text-center"
                      placeholder="0"
                    />
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-espresso-600 text-cream-100 py-2.5 text-xs uppercase tracking-widest hover:bg-espresso-500"
                >
                  {submitting ? 'Placing order...' : 'Place Order'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
