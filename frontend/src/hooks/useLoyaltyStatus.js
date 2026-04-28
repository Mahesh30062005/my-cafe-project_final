import { useEffect, useState } from 'react';
import { fetchLoyaltyStatus } from '../api/client';

export function useLoyaltyStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const load = () => {
      setLoading(true);
      setError(null);

      fetchLoyaltyStatus()
        .then((data) => {
          if (active) setStatus(data);
        })
        .catch((err) => {
          if (active) setError(err.message || 'Unable to load loyalty status');
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    };

    load();
    window.addEventListener('loyalty:refresh', load);

    return () => {
      active = false;
      window.removeEventListener('loyalty:refresh', load);
    };
  }, []);

  return { status, loading, error };
}
