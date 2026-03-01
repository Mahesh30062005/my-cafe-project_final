import { useEffect, useState } from 'react';
import { fetchCurrentOrders } from '../api/client';

const USD_TO_INR = 83; // fixed conversion for display

export default function CurrentOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchCurrentOrders()
      .then((data) => {
        if (active) setOrders(data);
      })
      .catch((err) => {
        if (active) setError(err.message || 'Unable to load orders');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  return (
    <section className="bg-cream-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 py-12">
        <div className="mb-8">
          <h1 className="font-display text-espresso-700 text-4xl font-light">Current Orders</h1>
          <p className="font-body text-muted text-sm mt-2">
            Orders are shown in first-come, first-serve order.
          </p>
        </div>

        {loading && <p className="text-sm text-muted">Loading orders...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && orders.length === 0 && (
          <p className="text-sm text-muted">No current orders.</p>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-cream-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted">Table</p>
                  <p className="font-display text-espresso-700 text-2xl">#{order.tableNumber}</p>
                </div>
                <span className="text-xs uppercase tracking-widest text-muted">
                  {new Date(order.createdAt).toLocaleTimeString()}
                </span>
              </div>

              <div className="space-y-2">
                {order.items.map((item) => {
                  const priceInInr = Number(item.unitPrice) * USD_TO_INR;
                  return (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-body text-espresso-700">
                          {item.name} x{item.quantity}
                        </p>
                        <p className="text-xs text-muted">{item.course}</p>
                      </div>
                      <p className="font-body text-espresso-600">
                        Rs. {(priceInInr * item.quantity).toFixed(0)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
