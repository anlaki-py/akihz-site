import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import Download from './Download'

const app = (
  <StrictMode>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <Download />
  </StrictMode>
)

const root = document.getElementById('root')!
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
