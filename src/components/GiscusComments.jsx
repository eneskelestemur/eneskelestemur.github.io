import React, { useEffect, useRef } from 'react';
import styles from './GiscusComments.module.css';

// From giscus.app's generator — these values are tied to the repo/category
// IDs, not secrets, so hardcoding them here is fine.
const GISCUS_ATTRIBUTES = {
  'data-repo': 'eneskelestemur/eneskelestemur.github.io',
  'data-repo-id': 'R_kgDOQvF3xg',
  'data-category': 'Announcements',
  'data-category-id': 'DIC_kwDOQvF3xs4DE4-g',
  'data-mapping': 'pathname',
  'data-strict': '0',
  'data-reactions-enabled': '1',
  'data-emit-metadata': '0',
  'data-input-position': 'bottom',
  'data-theme': 'preferred_color_scheme',
  'data-lang': 'en',
  'data-loading': 'lazy',
};

/**
 * Embeds a giscus comment thread for the current post.
 *
 * Render with `key={slug}` at the call site — giscus's script reads
 * location.pathname once, at the moment it loads, and has no way to notice a
 * client-side route change on its own. Keying by slug forces React to
 * unmount and remount this component (tearing down the old script/iframe and
 * loading a fresh one) whenever the post changes, so the SPA navigation from
 * one post to another still lands on the right thread instead of a stale one.
 */
export function GiscusComments() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    for (const [attr, value] of Object.entries(GISCUS_ATTRIBUTES)) {
      script.setAttribute(attr, value);
    }
    container.appendChild(script);

    return () => {
      container.replaceChildren();
    };
  }, []);

  return <div ref={containerRef} className={styles.wrapper} />;
}
