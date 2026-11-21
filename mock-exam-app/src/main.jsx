import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import AppRoutes from './App.jsx'
import { getLangPreference, localizePath, splitLang } from './utils/i18n'

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

// The path inside the app, e.g. '/ja/fundamentals/'.
function currentAppPath() {
  const { pathname } = window.location
  return (pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname) || '/'
}

// Where to send the visitor before rendering, or null to stay.
function redirectTarget() {
  const saved = getLangPreference()
  const browserJa = navigator.language?.toLowerCase().startsWith('ja')

  // Old hash URLs (#/fundamentals/set/1) from bookmarks and shared links.
  // They had no language in them, so use the one the visitor would have seen.
  if (window.location.hash.startsWith('#/')) {
    const path = window.location.hash.slice(1).split('?')[0].replace(/\/?$/, '/')
    const lang = saved ?? (browserJa ? 'ja' : 'en')
    return localizePath(path, lang)
  }

  // First visit from a Japanese browser to an English page: show the Japanese page.
  // Once the visitor picks a language with the switcher, that choice wins.
  const { lang, path } = splitLang(currentAppPath())
  if (lang === 'en' && !saved && browserJa) return localizePath(path, 'ja')

  return null
}

const target = redirectTarget()
if (target && target !== currentAppPath()) {
  window.location.replace(BASE + target + window.location.search)
} else {
  const container = document.getElementById('root')
  const app = (
    <StrictMode>
      {/* basename keeps its trailing slash so links to the home page end in '/'. */}
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AppRoutes />
      </BrowserRouter>
    </StrictMode>
  )

  // Hydrate only when the HTML was prerendered for this exact path. 404.html is
  // served for any unknown path, so its markup is replaced rather than hydrated.
  if (container.dataset.path === currentAppPath()) {
    hydrateRoot(container, app)
  } else {
    container.textContent = ''
    createRoot(container).render(app)
  }
}
