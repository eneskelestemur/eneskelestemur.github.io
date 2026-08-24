import { useState, useEffect } from 'react';

// Vite resolves this glob at build time, so every JSON file under src/data is
// bundled and code-split into its own chunk. A bare dynamic import with a
// runtime-built path would not be analyzable, and the data would be missing
// from the production build entirely.
const dataModules = import.meta.glob('../data/**/*.json');

/**
 * Generic hook to load JSON data from the data folder
 * @param {string} dataPath - Path to the JSON file relative to src/data
 * @returns {Object} { data, loading, error }
 */
export function useDataLoader(dataPath) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      try {
        const load = dataModules[`../data/${dataPath}`];
        if (!load) {
          throw new Error(`No data file at src/data/${dataPath}`);
        }
        const importedData = await load();
        if (cancelled) return;
        setData(importedData.default || importedData);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        console.error(`Failed to load ${dataPath}:`, err);
        setError(err.message);
        setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [dataPath]);

  return { data, loading, error };
}
