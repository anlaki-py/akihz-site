import { DEVELOPER_URL, ICON_URL, REPO_URL } from '../constants'

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <a className="brand" href="/">
          <img src={ICON_URL} alt="" width="36" height="36" loading="lazy" />
          <span>akiHz</span>
        </a>
        <nav aria-label="Footer navigation">
          <a href="/download/">Downloads</a>
          <a href={`${REPO_URL}/blob/main/CHANGELOG.md`} target="_blank" rel="noreferrer">Changelog</a>
          <a href={`${REPO_URL}/blob/main/LICENSE`} target="_blank" rel="noreferrer">MIT License</a>
          <a href="/privacy/">Privacy</a>
        </nav>
        <p className="footer-credit">Made by <a href={DEVELOPER_URL} rel="me">anlaki</a> · © {new Date().getFullYear()}</p>
      </div>
    </footer>
  )
}
