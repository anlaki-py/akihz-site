import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import NotFound from './NotFound'
import './index.css'

hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <NotFound />
  </StrictMode>,
)
