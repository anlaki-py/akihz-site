import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { DEVELOPER_URL, REPO_URL } from './constants'
import './App.css'
import './privacy.css'

function Privacy() {
  return (
    <div className="site-shell">
      <Header page="privacy" />
      <main className="privacy-page" id="main-content">
        <header className="policy-header">
          <h1>Privacy Policy</h1>
          <p className="privacy-intro">akiHz does not include advertising, analytics, accounts, or tracking. This page explains the limited information used by the Android app and this website.</p>
          <p className="policy-meta">Effective and last updated: August 13, 2026</p>
          <nav className="policy-navigation" aria-label="Privacy policy sections">
            <p>On this page</p>
            <ol>
              <li><a href="#summary">Summary</a></li>
              <li><a href="#app-data">Information used by the app</a></li>
              <li><a href="#permissions">Permissions</a></li>
              <li><a href="#third-parties">Third-party services</a></li>
              <li><a href="#website">Website behavior</a></li>
              <li><a href="#choices">Your choices</a></li>
              <li><a href="#children">Children’s privacy</a></li>
              <li><a href="#changes">Changes</a></li>
              <li><a href="#contact">Contact</a></li>
            </ol>
          </nav>
        </header>

        <article className="policy-content">
            <section id="summary">
              <h2>Summary</h2>
              <p>akiHz is an open-source Android utility. The app does not create an account, operate a developer-controlled backend, display advertising, or include analytics or crash-reporting services. It does not collect or sell personal information.</p>
            </section>

            <section id="app-data">
              <h2>Information used by the Android app</h2>
              <h3>Information processed locally</h3>
              <p>To perform its core functions, akiHz may read your device manufacturer, brand, model, supported application binary interfaces (ABIs), available display refresh rates, and refresh-rate-related Android system settings. This information is used on your device to choose a compatible settings strategy, display supported rates, and select the correct update package. It is not sent to the developer.</p>
              <p>The app stores settings in Android private app storage, including your selected refresh rate, OEM override, theme and appearance preferences, update channel and schedule, update status, custom refresh-rate profiles, compatible settings keys, and related recovery information.</p>
              <h3>Network activity</h3>
              <p>When you manually check for an update, enable automatic update checks, or download an update, akiHz connects to GitHub’s API and download infrastructure. GitHub receives ordinary network request information such as your IP address, request time, requested URL, and the app’s <code>akiHz-Android</code> user-agent string. Update selection takes place locally. The app does not send your stored preferences, display rates, manufacturer, brand, or model to the developer.</p>
              <h3>Backups and device transfer</h3>
              <p>Android may include the app’s locally stored preferences in an operating-system backup or device-to-device transfer, depending on your Android and Google backup settings. Those backups are controlled by your device and backup provider, not by akiHz or its developer.</p>
            </section>

            <section id="permissions">
              <h2>Permissions and system access</h2>
              <div className="permission-table" role="table" aria-label="akiHz Android permissions">
                <div className="permission-row permission-head" role="row"><strong role="columnheader">Access</strong><strong role="columnheader">Why it is used</strong></div>
                <div className="permission-row" role="row"><span role="cell">Internet</span><p role="cell">Checks GitHub Releases and downloads updates you request.</p></div>
                <div className="permission-row" role="row"><span role="cell">Notifications</span><p role="cell">Shows update, download, and foreground-service status. Android may ask for permission.</p></div>
                <div className="permission-row" role="row"><span role="cell">Foreground service</span><p role="cell">Keeps Quick Settings controls ready when enabled, with a visible notification.</p></div>
                <div className="permission-row" role="row"><span role="cell">Shizuku</span><p role="cell">Reads and changes refresh-rate-related system settings with your authorization.</p></div>
                <div className="permission-row" role="row"><span role="cell">Install packages</span><p role="cell">Hands a downloaded and SHA-256-verified APK to Android’s installer. You must approve installation.</p></div>
                <div className="permission-row" role="row"><span role="cell">Battery optimization exemption</span><p role="cell">Opens an Android system prompt when you choose to allow more reliable background operation.</p></div>
                <div className="permission-row" role="row"><span role="cell">Vibration</span><p role="cell">Provides local haptic feedback.</p></div>
              </div>
              <p>akiHz does not request access to location, contacts, camera, microphone, phone calls, SMS, calendars, advertising identifiers, or user accounts.</p>
            </section>

            <section id="third-parties">
              <h2>Third-party services</h2>
              <h3>GitHub</h3>
              <p>GitHub hosts the source code, release information, checksums, metadata, screenshots, and APK downloads. Requests to GitHub are subject to <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noreferrer">GitHub’s Privacy Statement</a>.</p>
              <h3>Shizuku</h3>
              <p>Shizuku is a separately installed app and project. akiHz communicates with its local Android service after you grant permission. Your installation and use of Shizuku are governed by Shizuku’s own terms and privacy practices.</p>
              <p>No third party is used by akiHz for behavioral advertising, marketing profiles, analytics, or sale of personal information.</p>
            </section>

            <section id="website">
              <h2>This website</h2>
              <p>This website does not set cookies, provide accounts, run advertising, or include analytics. It is a static website hosted on Vercel. Like most hosting providers, Vercel may process ordinary request and security logs, including IP address, browser information, requested pages, and timestamps, to deliver and protect the site.</p>
              <p>The download page may save the last successfully validated public release metadata in your browser's local storage. This allows it to keep showing verified download information during a temporary network or GitHub outage. The cached metadata contains release details, not personal information, and you can remove it by clearing this site's data in your browser.</p>
              <p>The app icon and screenshots are loaded directly from <code>raw.githubusercontent.com</code> so they remain synchronized with the project repository. On supported mobile browsers, the homepage can use device-orientation sensor readings to move the phone preview slightly as you tilt your device. Those readings are processed only in your browser and are not stored or transmitted. A browser may ask for sensor permission after you touch the preview.</p>
              <p>The download page requests validated release information from this website’s Vercel function, which reads the project’s public <code>release-metadata.json</code> file from GitHub. Direct APK downloads are delivered by GitHub’s release infrastructure. GitHub receives ordinary network request information when your browser loads repository-hosted images or starts a download, but you do not need to visit a GitHub release page.</p>
            </section>

            <section id="choices">
              <h2>Your choices and data removal</h2>
              <p>You can disable automatic update checks in akiHz settings, deny notification permission, stop the foreground service, decline the battery-optimization exemption, or revoke akiHz’s authorization in Shizuku.</p>
              <p>You can remove locally stored app information by using akiHz’s reset option, clearing the app’s storage in Android settings, or uninstalling the app. Backup copies, if any, are managed through your Android or Google backup settings.</p>
            </section>

            <section id="children">
              <h2>Children’s privacy</h2>
              <p>akiHz is a general-purpose device utility and is not directed to children. Because the developer does not collect personal information through the app, the app does not knowingly collect personal information from children.</p>
            </section>

            <section id="changes">
              <h2>Changes to this policy</h2>
              <p>This policy may be updated when akiHz’s behavior, dependencies, website, or legal obligations change. The effective date at the top of this page will be revised when material changes are published.</p>
            </section>

            <section id="contact">
              <h2>Contact and source review</h2>
              <p>akiHz is developed by <a href={DEVELOPER_URL} rel="me">anlaki-py</a>. You can review the complete implementation and permission declarations in the <a href={REPO_URL} target="_blank" rel="noreferrer">public source repository</a>.</p>
              <p>For privacy questions, use the public contact information on the developer's website. The akiHz project does not otherwise provide technical support or accept bug reports and feature requests.</p>
            </section>
        </article>
      </main>
      <Footer />
    </div>
  )
}

export default Privacy
