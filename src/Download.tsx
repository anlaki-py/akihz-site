import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { LatestDownloads } from './components/LatestDownloads'
import './App.css'

function Download() {
  return (
    <div className="site-shell">
      <Header page="download" />
      <main className="download-page" id="main-content">
        <LatestDownloads />
      </main>
      <Footer />
    </div>
  )
}

export default Download
