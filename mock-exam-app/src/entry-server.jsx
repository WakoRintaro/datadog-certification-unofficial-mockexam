// Server entry used only at build time by scripts/prerender.js.
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import AppRoutes from './App.jsx';
import { BASE_PATH, absoluteUrl, getAllPaths, getPageMeta, renderHeadTags } from './seo/meta';
import updates from './data/updates.json';

export { absoluteUrl, getAllPaths, getPageMeta, renderHeadTags, updates };

// appPath: e.g. '/ja/fundamentals/'
export function render(appPath) {
  return renderToString(
    <StrictMode>
      <StaticRouter basename={import.meta.env.BASE_URL} location={BASE_PATH + appPath}>
        <AppRoutes />
      </StaticRouter>
    </StrictMode>
  );
}
