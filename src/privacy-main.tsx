import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import Privacy from './Privacy'

const app = (
  <StrictMode>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <Privacy />
  </StrictMode>
)

const root = document.getElementById('root')!
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
