import { renderToString } from 'react-dom/server'
import App from './App'
import Download from './Download'
import NotFound from './NotFound'
import Privacy from './Privacy'

export function render(page: 'home' | 'download' | 'privacy' | 'not-found') {
  const content = page === 'home'
    ? <App />
    : page === 'download'
      ? <Download />
      : page === 'privacy'
        ? <Privacy />
        : <NotFound />
  return renderToString(
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      {content}
    </>,
  )
}
