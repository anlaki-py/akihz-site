import { DEVELOPER_URL } from '../constants'

export function Footer() {
  return (
    <footer className="footer">
      <p className="footer-credit">© {new Date().getFullYear()} <a href={DEVELOPER_URL} rel="me">anlaki</a></p>
      <nav aria-label="Footer navigation">
        <a href="/privacy/">Privacy</a>
      </nav>
    </footer>
  )
}
