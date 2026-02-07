import { useState, useEffect } from 'react';

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
    const loadData = async () => {
      try {
        setLoading(true);
        // Dynamically import the JSON file with vite-ignore to suppress warning
        // This allows runtime flexibility while being explicit about the data folder
        const importedData = await import(/* @vite-ignore */`../data/${dataPath}`);
        setData(importedData.default || importedData);
        setError(null);
      } catch (err) {
        console.error(`Failed to load ${dataPath}:`, err);
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dataPath]);

  return { data, loading, error };
}
