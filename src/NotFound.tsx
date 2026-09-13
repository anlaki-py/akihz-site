import { Footer } from './components/Footer'
import { Header } from './components/Header'
import './App.css'

function NotFound() {
  return (
    <div className="site-shell">
      <Header page="not-found" />
      <main className="not-found-page" id="main-content">
        <p className="not-found-code">404</p>
        <h1>Page not found</h1>
        <p>The page you requested does not exist or may have moved.</p>
        <a href="/"><md-filled-button>Go to home</md-filled-button></a>
      </main>
      <Footer />
    </div>
  )
}

export default NotFound
