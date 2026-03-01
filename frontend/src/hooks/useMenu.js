/**
 * hooks/useMenu.js
 * Custom hook that fetches menu data from the Spring Boot API.
 * Provides loading, error, and data states to consumer components.
 */

import { useState, useEffect } from 'react';
import { fetchMenu } from '../api/client';

/**
 * @returns {{ menu: Object|null, loading: boolean, error: string|null }}
 */
export function useMenu() {
  const [menu,    setMenu]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    let cancelled = false; // Prevent state updates on unmounted component

    setLoading(true);
    setError(null);

    fetchMenu()
      .then((data) => {
        if (!cancelled) setMenu(data);
      })
      .catch(({ message }) => {
        if (!cancelled) setError(message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { menu, loading, error };
}
