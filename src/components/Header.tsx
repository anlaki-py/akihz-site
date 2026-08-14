import { ICON_URL, REPO_URL } from '../constants'
import { Icon } from './Icon'

type HeaderProps = { page?: 'home' | 'download' | 'privacy' | 'not-found' }

export function Header({ page = 'home' }: HeaderProps) {
  const home = page === 'home'

  return (
    <header className="topbar">
      <a className="brand" href="/" aria-label="akiHz home">
        <img src={ICON_URL} alt="" width="36" height="36" />
        <span>akiHz</span>
      </a>
      <nav aria-label="Main navigation">
        {home && <>
          <a href="#features">Features</a>
          <a href="#setup">Setup</a>
          <a href="#faq">FAQ</a>
        </>}
        {!home && <a className="nav-home" href="/"><Icon name="arrow-left" /> Back to home</a>}
        <a className="nav-repository" href={REPO_URL} target="_blank" rel="noreferrer"><Icon name="github" /> akiHz GitHub repository</a>
        {page !== 'download' && <a className="nav-download" href="/download/">Download <Icon name="arrow" /></a>}
      </nav>
    </header>
  )
}
