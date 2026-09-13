import { DEVELOPER_URL, ICON_URL, REPO_URL } from '../constants'

export function Footer() {
  return (
    <footer className="footer">
      <md-divider />
      <div className="footer-content">
        <a className="brand" href="/">
          <img src={ICON_URL} alt="" width={28} height={28} loading="lazy" />
          <span>akiHz</span>
        </a>
        <nav aria-label="Footer navigation">
          <a href="/download/"><md-text-button>Downloads</md-text-button></a>
          <a href={`${REPO_URL}/blob/main/CHANGELOG.md`} target="_blank" rel="noreferrer"><md-text-button>Changelog</md-text-button></a>
          <a href={`${REPO_URL}/blob/main/LICENSE`} target="_blank" rel="noreferrer"><md-text-button>MIT License</md-text-button></a>
          <a href="/privacy/"><md-text-button>Privacy</md-text-button></a>
        </nav>
        <p className="footer-credit">Made by <a href={DEVELOPER_URL} rel="me">anlaki</a> · © {new Date().getFullYear()}</p>
      </div>
    </footer>
  )
}
