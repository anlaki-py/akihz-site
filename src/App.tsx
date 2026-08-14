import { useEffect, useState } from 'react'
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
    question: 'Does akiHz require root?',
    answer: 'No. akiHz uses Shizuku to access the refresh-rate-related system settings that ordinary Android apps cannot change directly. You still need to start Shizuku after restarting your phone, but you do not need to unlock the bootloader, install Magisk, or modify the system partition.',
  },
  {
    question: 'Why does Shizuku need to be running?',
    answer: 'Android restricts access to the settings akiHz needs. Shizuku provides a local, permission-controlled bridge to those settings through wireless debugging or ADB. akiHz asks for authorization through Shizuku and does not receive unrestricted root access.',
  },
  {
    question: 'Will it work on my phone?',
    answer: 'akiHz detects the rates reported by your display and includes strategies for several Android manufacturers. It has only been personally tested on a Xiaomi phone, however, so other devices are not guaranteed. If automatic detection chooses the wrong settings, you can try the OEM override or create a custom profile.',
  },
  {
    question: 'Where can I get help or report a problem?',
    answer: 'akiHz is a personal project provided as-is, without a support commitment. The repository is not accepting support requests, bug reports, compatibility requests, or feature requests. The complete source is public under the MIT License, so you can inspect it, fork it, and adapt it for your device.',
  },
]

const REFRESH_RATES = [45, 48, 50, 60, 72, 75, 90, 96, 120, 144, 165]

function AnimatedRefreshRate() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [previousIndex, setPreviousIndex] = useState<number | null>(null)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((currentIndex) => {
        setPreviousIndex(currentIndex)
        return (currentIndex + 1) % REFRESH_RATES.length
      })
    }, 2200)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <span className="rate-display" aria-hidden="true">
      <span className="rate-value">
        {REFRESH_RATES.map((rate, index) => (
          <span
            className={`rate-number${index === activeIndex ? ' is-active' : ''}${index === previousIndex ? ' is-previous' : ''}`}
            key={rate}
          >
            {rate}
          </span>
        ))}
      </span>
      <span className="rate-unit">Hz.</span>
    </span>
  )
}

function App() {
  return (
    <div className="site-shell">
      <Header />

      <main id="main-content">
        <section className="hero section" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title" aria-label="Set it to a refresh rate supported by your display.">
              <span className="hero-title-text" aria-hidden="true">
                <span className="hero-title-prefix">Set it to</span>
                <AnimatedRefreshRate />
              </span>
            </h1>
            <p className="hero-lede">
              akiHz switches between the refresh rates your Android device actually supports, from the app or a Quick Settings tile. It runs through Shizuku, with no root or bootloader changes.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="/download/"><Icon name="download" /> Download APK</a>
              <a className="button button-secondary" href={REPO_URL} target="_blank" rel="noreferrer"><Icon name="github" /> akiHz GitHub repository</a>
            </div>
            <p className="hero-note">Android 11+ · Requires Shizuku · MIT licensed</p>
          </div>

          <div className="hero-visual">
            <PhoneFrame
              className="hero-phone"
              src={SCREENSHOTS.homeDark}
              alt="akiHz home screen showing 60, 90, and 120 Hz controls"
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
              <article className="faq-item" key={faq.question}>
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
