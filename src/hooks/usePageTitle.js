import { useEffect } from 'react';

const SITE_NAME = 'Enes Kelestemur';
const DEFAULT_TITLE = `${SITE_NAME} — Computational Chemistry & Machine Learning`;

/**
 * Sets document.title for the current route. React Router doesn't do this on
 * its own, so without it every page — and every GA pageview — would show the
 * static title from index.html regardless of which page is open.
 *
 * @param {string} [title] - Page title, e.g. "About". Omit for the site default.
 */
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE_NAME}` : DEFAULT_TITLE;
  }, [title]);
}
