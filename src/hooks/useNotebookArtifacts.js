// Figures and images for notebook posts, co-located at
// src/data/notebooks/artifacts/. Globbed eagerly so Vite fingerprints each file
// and we can map a markdown src to its built URL synchronously while rendering.
//
// A relative path in markdown would otherwise resolve against the page URL
// (/notebook/some-slug/…) rather than the source file, and 404.
const artifacts = import.meta.glob(
  '../data/notebooks/artifacts/**/*.{png,jpg,jpeg,gif,svg,webp,avif}',
  { eager: true, query: '?url', import: 'default' }
);

// Key by the path an author would actually write, e.g. "artifacts/plot.png"
const byRelativePath = new Map(
  Object.entries(artifacts).map(([full, url]) => [
    full.replace('../data/notebooks/', ''),
    url,
  ])
);

/**
 * Resolves an image src from post markdown to its built asset URL.
 * Accepts "artifacts/fig.png", "./artifacts/fig.png", or a bare "fig.png".
 * External URLs and absolute paths are returned untouched.
 *
 * @param {string} src - The src as written in the markdown
 * @returns {string} A URL the browser can load
 */
export function resolveArtifact(src) {
  if (!src) return src;
  if (/^(https?:)?\/\//.test(src) || src.startsWith('/') || src.startsWith('data:')) {
    return src;
  }

  const clean = src.replace(/^\.\//, '');
  return (
    byRelativePath.get(clean) ??
    byRelativePath.get(`artifacts/${clean}`) ??
    src
  );
}
