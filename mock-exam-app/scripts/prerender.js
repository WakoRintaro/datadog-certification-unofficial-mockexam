// Runs after `vite build` and `vite build --ssr src/entry-server.jsx --outDir dist-ssr`.
// Writes a full HTML file for every page so search engines get the content without
// running JavaScript, then 404.html and sitemap.xml. See README for the URL layout.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const ssrDir = join(root, 'dist-ssr');

const { render, getAllPaths, getPageMeta, renderHeadTags, absoluteUrl, updates } =
  await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href);

const template = await readFile(join(dist, 'index.html'), 'utf8');
for (const marker of ['<!--app-head-->', '<!--app-html-->', '<html lang="en">', '<div id="root">']) {
  if (!template.includes(marker)) throw new Error(`index.html is missing ${marker}`);
}

function renderPage(appPath) {
  const meta = getPageMeta(appPath);
  return template
    .replace('<html lang="en">', `<html lang="${meta.htmlLang ?? meta.lang}">`)
    .replace('<!--app-head-->', renderHeadTags(meta))
    // main.jsx hydrates only when this matches the URL it's loaded at.
    .replace('<div id="root">', `<div id="root" data-path="${appPath}">`)
    .replace('<!--app-html-->', () => render(appPath));
}

async function write(file, content) {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, content);
}

const paths = getAllPaths();
for (const appPath of paths) {
  await write(join(dist, appPath, 'index.html'), renderPage(appPath));
}

// GitHub Pages serves this for any unknown path. main.jsx re-renders it for the real URL.
await write(join(dist, '404.html'), renderPage('/404/'));

const lastmod = (updates.lastUpdated ?? new Date().toISOString()).slice(0, 10);
const urls = paths.map((appPath) => {
  const { alternates, hreflangs } = getPageMeta(appPath);
  return `  <url>
    <loc>${absoluteUrl(appPath)}</loc>
    <lastmod>${lastmod}</lastmod>
${Object.entries(alternates).map(([l, href]) => `    <xhtml:link rel="alternate" hreflang="${hreflangs[l]}" href="${href}" />`).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${alternates.en}" />
  </url>`;
});
await write(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`);

await rm(ssrDir, { recursive: true, force: true });
console.log(`Prerendered ${paths.length} pages, 404.html and sitemap.xml`);
