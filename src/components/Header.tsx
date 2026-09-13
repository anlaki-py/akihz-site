import { ICON_URL, REPO_URL } from '../constants'
import { Icon } from './Icon'
import { MaterialIcon } from './MaterialIcon'

type HeaderProps = { page?: 'home' | 'download' | 'privacy' | 'not-found' }

export function Header({ page = 'home' }: HeaderProps) {
  const home = page === 'home'

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <a className="brand" href="/" aria-label="akiHz home">
          <img src={ICON_URL} alt="" width={32} height={32} />
          <span>akiHz</span>
        </a>
        <nav aria-label="Main navigation">
          {home && <>
            <a className="nav-section-link" href="#features"><md-text-button>Features</md-text-button></a>
            <a className="nav-section-link" href="#setup"><md-text-button>Setup</md-text-button></a>
            <a className="nav-section-link" href="#faq"><md-text-button>FAQ</md-text-button></a>
          </>}
          {!home && <a href="/"><md-text-button><MaterialIcon name="arrow_back" slot="icon" />Home</md-text-button></a>}
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="akiHz GitHub repository"
            title="akiHz GitHub repository"
          >
            <md-icon-button className="repo-button"><Icon name="github" /></md-icon-button>
          </a>
          {page !== 'download' && <a href="/download/"><md-filled-button><MaterialIcon name="download" slot="icon" />Download</md-filled-button></a>}
        </nav>
      </div>
    </header>
  )
}
