import { useState, useEffect } from 'react';

// Build-time glob (see useDataLoader for why): every post becomes its own chunk,
// fetched only when that post is opened.
const postModules = import.meta.glob('../data/notebooks/*.md', {
  query: '?raw',
  import: 'default',
});

/**
 * Loads markdown content from src/data/notebooks/ and calculates read time
 * @param {string} slug - Post slug/filename (without .md extension)
 * @returns {Object} { content, loading, error, readTime }
 */
export function useMarkdownLoader(slug) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [readTime, setReadTime] = useState('');

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;

    const loadMarkdown = async () => {
      setLoading(true);
      try {
        const load = postModules[`../data/notebooks/${slug}.md`];
        if (!load) {
          throw new Error(`No post at src/data/notebooks/${slug}.md`);
        }
        const text = await load();
        if (cancelled) return;

        setContent(text);

        // Calculate read time (average 200 words per minute)
        const wordCount = text.trim().split(/\s+/).length;
        const minutes = Math.max(1, Math.ceil(wordCount / 200));
        setReadTime(`${minutes} min read`);

        setError(null);
      } catch (err) {
        if (cancelled) return;
        console.error(`Failed to load markdown for ${slug}:`, err);
        setError(err.message);
        setContent('');
        setReadTime('');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadMarkdown();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { content, loading, error, readTime };
}
