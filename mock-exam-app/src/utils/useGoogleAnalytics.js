import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function useGoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // Send a pageview event to Google Analytics whenever the URL changes
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'G-N7JDZLWZ18', {
        page_path: location.pathname + location.search + location.hash
      });
    }
  }, [location]);

  return null;
}
