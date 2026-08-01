export const GA_MEASUREMENT_ID = 'G-N7JDZLWZ18';

export function trackEvent(eventName, params = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}

export function setUserProperties(props) {
  if (typeof window.gtag === 'function') {
    window.gtag('set', 'user_properties', props);
  }
}
