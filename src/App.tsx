import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { MaterialIcon } from './components/MaterialIcon'
import { REPO_URL, SHIZUKU_URL } from './constants'
import './App.css'

const features = [
  {
    icon: 'smartphone',
    title: 'Detects supported rates',
    body: 'Reads the refresh rates reported by your display.',
  },
  {
    icon: 'widgets',
    title: 'Quick Settings tile',
    body: 'Cycles through the rates you pick on Home, without opening the app.',
  },
  {
    icon: 'speed',
    title: 'Live FPS overlay',
    body: 'Shows real app FPS from SurfaceFlinger in a draggable pill, with its own Quick Settings tile.',
  },
  {
    icon: 'tune',
    title: 'Device-specific controls',
    body: 'Supports OEM overrides and custom profiles when needed.',
  },
  {
    icon: 'verified',
    title: 'Verified updates',
    body: 'Verifies APK downloads against published release metadata. Update checks run daily, every 3 days, or weekly.',
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
    id: 'fps-overlay',
    question: 'Does the FPS overlay show my refresh rate?',
    answer: 'No. The pill shows real presented app FPS read from SurfaceFlinger, not screen Hz. A 120 Hz screen can still show a 30 FPS game. Start it from Settings, FPS Monitor, or the FPS tile. It needs Shizuku and overlay permission, and Settings controls its size, opacity, color, shape, and label.',
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

const steps = [
  {
    title: 'Start Shizuku',
    body: (
      <>Install <a href={SHIZUKU_URL} target="_blank" rel="noreferrer">Shizuku</a> and start it using wireless debugging or ADB.</>
    ),
  },
  {
    title: 'Grant access',
    body: 'Open akiHz and approve its Shizuku permission request, plus notification and overlay access when asked.',
  },
  {
    title: 'Choose a rate',
    body: 'Select a detected rate in the app or use the Quick Settings tile.',
  },
  {
    title: 'See live FPS',
    body: 'Start the FPS monitor from Settings or its Quick Settings tile, then drag the pill where you want it.',
  },
]

function App() {
  return (
    <div className="site-shell">
      <Header />

      <main id="main-content">
        <section className="hero section" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title">One click. Set it to 120 Hz.</h1>
            <p className="hero-lede">
              akiHz switches between the refresh rates your Android device actually supports, from the app or a Quick Settings tile. It also shows live app FPS in a floating pill you can drag anywhere. It runs through Shizuku, with no root or bootloader changes.
            </p>
            <div className="hero-actions">
              <a href="/download/"><md-filled-button><MaterialIcon name="download" slot="icon" />Download APK</md-filled-button></a>
              <a href={REPO_URL} target="_blank" rel="noreferrer"><md-outlined-button><MaterialIcon name="code" slot="icon" />GitHub repository</md-outlined-button></a>
            </div>
            <p className="hero-note">
              Android 11+ · Requires <a href="#shizuku-explanation">Shizuku</a> · MIT licensed<br />
              Personally tested on Xiaomi; other OEM strategies are community-reported.
            </p>
          </div>
        </section>

        <section className="section features" id="features" aria-labelledby="features-title">
          <h2 id="features-title">What it does</h2>
          <p className="section-sub">Five things, no more.</p>
          <div className="feature-grid">
            {features.map((feature) => (
              <md-filled-card className="feature-card" key={feature.title}>
                <MaterialIcon name={feature.icon} />
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </md-filled-card>
            ))}
          </div>
        </section>

        <section className="section setup" id="setup" aria-labelledby="setup-title">
          <h2 id="setup-title">Setup</h2>
          <p className="section-sub">Four steps, about five minutes.</p>
          <md-list className="steps">
            {steps.map((step, index) => (
              <md-list-item key={step.title}>
                <span slot="start" className="step-avatar" aria-hidden="true">{index + 1}</span>
                <div slot="headline">{step.title}</div>
                <div slot="supporting-text">{step.body}</div>
              </md-list-item>
            ))}
          </md-list>
          <p className="setup-note">Requires Android 11+, Shizuku, and a display with multiple refresh rates. Only Xiaomi has been personally tested. A Background setting keeps the tile ready, and Appearance offers a true-black AMOLED theme.</p>
        </section>

        <section className="faq section" id="faq" aria-labelledby="faq-title">
          <h2 id="faq-title">FAQ</h2>
          <div className="faq-list">
            {faqs.map((faq) => (
              <article className="faq-item" id={faq.id} key={faq.id}>
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
