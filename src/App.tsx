import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Icon } from './components/Icon'
import { PhoneFrame } from './components/PhoneFrame'
import { REPO_URL, SCREENSHOTS, SHIZUKU_URL } from './constants'
import './App.css'

const features = [
  {
    title: 'Detects supported rates',
    body: 'Reads the refresh rates reported by your display.',
  },
  {
    title: 'Quick Settings tile',
    body: 'Cycles through rates without opening the app.',
  },
  {
    title: 'Device-specific controls',
    body: 'Supports OEM overrides and custom profiles when needed.',
  },
  {
    title: 'Verified updates',
    body: 'Checks APK downloads against published release metadata.',
  },
]

const faqs = [
  {
    id: 'root-requirement',
    question: 'Does akiHz require root?',
    answer: 'No. akiHz uses Shizuku to access the refresh-rate-related system settings that ordinary Android apps cannot change directly. You still need to start Shizuku after restarting your phone, but you do not need to unlock the bootloader, install Magisk, or modify the system partition.',
  },
  {
    id: 'shizuku-explanation',
    question: 'Why does Shizuku need to be running?',
    answer: 'Android restricts access to the settings akiHz needs. Shizuku provides a local, permission-controlled bridge to those settings through wireless debugging or ADB. akiHz asks for authorization through Shizuku and does not receive unrestricted root access.',
  },
  {
    id: 'device-compatibility',
    question: 'Will it work on my phone?',
    answer: 'akiHz detects the rates reported by your display and includes strategies for several Android manufacturers. It has only been personally tested on a Xiaomi phone, however, so other devices are not guaranteed. If automatic detection chooses the wrong settings, you can try the OEM override or create a custom profile.',
  },
  {
    id: 'project-support',
    question: 'Where can I get help or report a problem?',
    answer: 'akiHz is a personal project provided as-is, without a support commitment. The repository is not accepting support requests, bug reports, compatibility requests, or feature requests. The complete source is public under the MIT License, so you can inspect it, fork it, and adapt it for your device.',
  },
]

function App() {
  return (
    <div className="site-shell">
      <Header />

      <main id="main-content">
        <section className="hero section" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title" aria-label="One click. Set it to 120 Hz.">
              <span className="hero-title-text" aria-hidden="true">
                <span className="hero-title-prefix">One click. Set it to</span>
                <span className="rate-display">
                  <span className="rate-value">
                    <span className="rate-number is-active">120</span>
                  </span>
                  <span className="rate-unit">Hz.</span>
                </span>
              </span>
            </h1>
            <p className="hero-lede">
              akiHz switches between the refresh rates your Android device actually supports, from the app or a Quick Settings tile. It runs through Shizuku, with no root or bootloader changes.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="/download/"><Icon name="download" /> Download APK</a>
              <a className="button button-secondary" href={REPO_URL} target="_blank" rel="noreferrer"><Icon name="github" /> akiHz GitHub repository</a>
            </div>
            <p className="hero-note">
              Android 11+ · Requires <a href="#shizuku-explanation">Shizuku</a> · MIT licensed<br />
              Personally tested on Xiaomi; other OEM strategies are community-reported.
            </p>
          </div>

          <div className="hero-visual">
            <PhoneFrame
              className="hero-phone"
              src={SCREENSHOTS.homeDark}
              alt="akiHz home screen with 60 Hz active and 60 and 90 Hz included in the Quick Settings tile cycle"
              caption="Filled = active rate · Toggle = included in the Quick Settings cycle"
              priority
              interactive
            />
          </div>
        </section>

        <section className="section features" id="features" aria-labelledby="features-title">
          <header className="section-heading">
            <h2 id="features-title">What it does</h2>
          </header>
          <div className="feature-grid">
            {features.map((feature) => (
              <article className="feature-card" key={feature.title}>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section setup" id="setup" aria-labelledby="setup-title">
          <header className="section-heading">
            <h2 id="setup-title">Setup</h2>
          </header>
          <ol className="steps">
            <li><h3>Start Shizuku</h3><p>Install <a href={SHIZUKU_URL} target="_blank" rel="noreferrer">Shizuku</a> and start it using wireless debugging or ADB.</p></li>
            <li><h3>Grant access</h3><p>Open akiHz and approve its Shizuku permission request.</p></li>
            <li><h3>Choose a rate</h3><p>Select a detected rate in the app or use the Quick Settings tile.</p></li>
          </ol>
          <p className="setup-note"><strong>Requires:</strong> Android 11+, Shizuku, and a display with multiple refresh rates. Only Xiaomi has been personally tested.</p>
        </section>

        <section className="faq section" id="faq" aria-labelledby="faq-title">
          <header className="section-heading"><h2 id="faq-title">FAQ</h2></header>
          <div className="faq-list">
            {faqs.map((faq) => (
              <article className="faq-item" id={faq.id} key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default App
