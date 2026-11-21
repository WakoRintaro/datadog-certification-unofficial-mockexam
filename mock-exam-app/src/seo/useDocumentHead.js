import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getPageMeta, getHeadTags } from './meta';

// Keeps <title> and the per-page head tags in step with client-side navigation.
// The prerendered HTML already has the right tags for the first page.
export default function useDocumentHead() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = getPageMeta(pathname);
    document.title = meta.title;
    document.head.querySelectorAll('meta[data-seo], link[data-seo]').forEach((el) => el.remove());
    // Structured data only matters in the HTML crawlers fetch, so it's only removed here.
    if (!meta.jsonLd) document.head.querySelector('script[data-seo]')?.remove();
    for (const { tag, attrs } of getHeadTags(meta)) {
      const el = document.createElement(tag);
      el.setAttribute('data-seo', '');
      for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
      document.head.appendChild(el);
    }
  }, [pathname]);
}
