import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const MEASUREMENT_ID = 'G-ZTGJHWKEQW';

function hasDoNotTrack() {
  const dnt = navigator.doNotTrack ?? window.doNotTrack ?? navigator.msDoNotTrack;
  return dnt === '1' || dnt === 'yes';
}

let scriptRequested = false;

function loadGtagScript() {
  if (scriptRequested) return;
  scriptRequested = true;
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

function initGtag() {
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };
  window.gtag('js', new Date());
  window.gtag('config', MEASUREMENT_ID, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
}

/**
 * Loads GA4 and fires a page_view on every route change. Disabled in local
 * dev and for visitors with Do Not Track enabled — enabling is a best-effort
 * signal (unsupported in current Chrome/Edge, still honored by Firefox and
 * Safari), not a guarantee, but there's no reason not to respect it when set.
 */
export function useAnalytics() {
  const location = useLocation();
  const enabledRef = useRef(import.meta.env.PROD && !hasDoNotTrack());

  useEffect(() => {
    if (!enabledRef.current) return;
    initGtag();
    loadGtagScript();
  }, []);

  useEffect(() => {
    if (!enabledRef.current) return;
    const id = setTimeout(() => {
      window.gtag?.('event', 'page_view', {
        page_path: location.pathname + location.search,
        page_location: window.location.href,
        page_title: document.title,
      });
    }, 0);
    return () => clearTimeout(id);
  }, [location.pathname, location.search]);
}
