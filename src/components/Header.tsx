import { REPO_URL } from '../constants'
import { Icon } from './Icon'

type HeaderProps = { page?: 'download' | 'privacy' | 'not-found' }

export function Header({ page = 'download' }: HeaderProps) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <a className="brand" href="/" aria-label="akiHz home">akiHz</a>
        <nav aria-label="Main navigation">
          {page !== 'download' && <a href="/">Download</a>}
          <a className="repo-link" href={REPO_URL} target="_blank" rel="noreferrer" aria-label="akiHz GitHub repository">
            <Icon name="github" />
            <span>GitHub</span>
          </a>
          <a href={`${REPO_URL}/blob/main/LICENSE`} target="_blank" rel="noreferrer" aria-label="MIT License">MIT</a>
        </nav>
      </div>
    </header>
  )
}
