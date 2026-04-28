import { useEffect, useState } from 'react';
import { fetchCurrentOrders } from '../api/client';

const USD_TO_INR = 83; // fixed conversion for display

export default function CurrentOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatInr = (value) => {
    if (value === null || value === undefined) return '0';
    return (Number(value) * USD_TO_INR).toFixed(0);
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchCurrentOrders()
      .then((data) => {
        if (active) {
          const sorted = [...data].sort((a, b) => (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          ));
          setOrders(sorted);
        }
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
                  <p className="text-xs uppercase tracking-widest text-muted">Order</p>
                  <p className="font-display text-espresso-700 text-2xl">
                    #{order.orderNumber || order.id}
                  </p>
                  {(order.orderType || 'DINE_IN') === 'DINE_IN' && (
                    <p className="text-xs uppercase tracking-widest text-muted mt-1">
                      Table #{order.tableNumber}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-xs uppercase tracking-widest text-muted block">
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-espresso-600 block mt-1">
                    {(order.orderType || 'DINE_IN') === 'DELIVERY' && '🛵 DELIVERY'}
                    {(order.orderType || 'DINE_IN') === 'TAKEAWAY' && '📦 PARCEL'}
                    {(order.orderType || 'DINE_IN') === 'DINE_IN' && '🍽️ DINE-IN'}
                  </span>
                  {order.pricing && order.pricing.total !== null && order.pricing.total !== undefined && (
                    <span className="text-xs uppercase tracking-widest text-espresso-600 block mt-1">
                      Total Rs. {formatInr(order.pricing.total)}
                    </span>
                  )}
                </div>
              </div>

              {(order.orderType || 'DINE_IN') === 'DELIVERY' && (
                <div className="mb-3 text-sm text-muted">
                  {order.deliveryAddress && (
                    <p><span className="text-espresso-700">Address:</span> {order.deliveryAddress}</p>
                  )}
                  {order.pickupOrDeliveryTime && (
                    <p>
                      <span className="text-espresso-700">Delivery Time:</span>{' '}
                      {new Date(order.pickupOrDeliveryTime).toLocaleString()}
                    </p>
                  )}
                  {order.customerContactNumber && (
                    <p><span className="text-espresso-700">Contact:</span> {order.customerContactNumber}</p>
                  )}
                </div>
              )}

              {(order.orderType || 'DINE_IN') === 'TAKEAWAY' && (
                <div className="mb-3 text-sm text-muted">
                  {order.pickupOrDeliveryTime && (
                    <p>
                      <span className="text-espresso-700">Pickup Time:</span>{' '}
                      {new Date(order.pickupOrDeliveryTime).toLocaleString()}
                    </p>
                  )}
                  {order.customerContactNumber && (
                    <p><span className="text-espresso-700">Contact:</span> {order.customerContactNumber}</p>
                  )}
                </div>
              )}

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
