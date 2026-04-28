import { useEffect, useState } from 'react';
import { fetchFeedbackSummary } from '../api/client';

export function useCafeRating() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    fetchFeedbackSummary()
      .then((data) => {
        if (active) setSummary(data);
      })
      .catch((err) => {
        if (active) setError(err.message || 'Unable to load rating');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  return { summary, loading, error };
}
