import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function useGoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // Send a page_view event to Google Analytics whenever the URL changes
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search + location.hash,
        page_location: window.location.href,
        page_title: document.title
      });
    }
  }, [location]);

  return null;
}
