import { useEffect, useState } from 'react'
import { ICON_URL, LATEST_RELEASE_ENDPOINT, RELEASES_URL, REPO_URL } from '../constants'
import { MaterialIcon } from './MaterialIcon'
import { ReleaseNotes } from './ReleaseNotes'

type ReleaseAsset = {
  abi: string
  file: string
  url: string
  sha256: string
  size: number
}

type ReleaseMetadata = {
  schemaVersion: number
  packageName: string
  versionName: string
  versionCode: number
  channel: 'stable'
  prerelease: false
  releaseDate: string
  releaseUrl: string
  changelog: string
  minSdk: number
  targetSdk: number
  requirements: { shizuku: { required: true; url: string } }
  signingCertificate: { sha256: string }
  assets: ReleaseAsset[]
  releaseNotes?: string
}

type DownloadInfo = {
  architecture: string
  label: string
  description: string
}

const DOWNLOAD_INFO: Record<string, DownloadInfo> = {
  'arm64-v8a': {
    architecture: 'ARM 64-bit',
    label: 'arm64-v8a',
    description: 'Most modern Android phones and tablets',
  },
  universal: {
    architecture: 'Universal',
    label: 'universal',
    description: 'Works across architectures; choose this if unsure',
  },
  'armeabi-v7a': {
    architecture: 'ARM 32-bit',
    label: 'armeabi-v7a',
    description: 'Older 32-bit Android devices',
  },
  'x86_64': {
    architecture: 'x86 64-bit',
    label: 'x86_64',
    description: '64-bit emulators and Intel-based devices',
  },
  x86: {
    architecture: 'x86 32-bit',
    label: 'x86',
    description: 'Older 32-bit emulators and Intel devices',
  },
}

const ORDER = ['arm64-v8a', 'universal', 'armeabi-v7a', 'x86_64', 'x86']
const STORAGE_KEY = 'akihz:last-good-release-metadata'
const CLIENT_TIMEOUT_MS = 15_000
let metadataRequest: Promise<ReleaseMetadata> | undefined

class DownloadError extends Error {
  readonly retryable: boolean

  constructor(message: string, retryable = true) {
    super(message)
    this.retryable = retryable
  }
}

function isUsableMetadata(value: unknown): value is ReleaseMetadata {
  if (!value || typeof value !== 'object') return false
  const metadata = value as ReleaseMetadata
  return metadata.schemaVersion === 1 &&
    metadata.packageName === 'akihz.anlaki.dev' &&
    metadata.channel === 'stable' && metadata.prerelease === false &&
    typeof metadata.versionName === 'string' &&
    (metadata.releaseNotes === undefined ||
      (typeof metadata.releaseNotes === 'string' && metadata.releaseNotes.length <= 50_000)) &&
    Array.isArray(metadata.assets) && metadata.assets.length > 0 &&
    metadata.assets.every((asset) =>
      typeof asset.abi === 'string' &&
      typeof asset.file === 'string' && asset.file.endsWith('.apk') &&
      typeof asset.url === 'string' && asset.url.startsWith('https://github.com/anlaki-py/akihz/releases/download/') &&
      typeof asset.sha256 === 'string' && /^[a-f0-9]{64}$/.test(asset.sha256) &&
      Number.isSafeInteger(asset.size) && asset.size > 0,
    )
}

function readCachedMetadata() {
  if (typeof window === 'undefined') return null
  try {
    const cached: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
    return isUsableMetadata(cached) ? cached : null
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

function cacheMetadata(metadata: ReleaseMetadata) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(metadata))
  } catch {
    // Downloads still work when storage is unavailable or full.
  }
}

function fetchLatestMetadata() {
  metadataRequest ??= fetch(LATEST_RELEASE_ENDPOINT, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(CLIENT_TIMEOUT_MS),
  }).then(async (response) => {
    const body: unknown = await response.json().catch(() => null)
    if (!response.ok) {
      const failure = body as { error?: unknown; retryable?: unknown } | null
      const message = typeof failure?.error === 'string'
        ? failure.error
        : 'The download service returned an unexpected response.'
      throw new DownloadError(message, failure?.retryable !== false)
    }
    if (!isUsableMetadata(body)) {
      throw new DownloadError('The download service returned invalid release information.', false)
    }
    cacheMetadata(body)
    return body
  }).catch((error: unknown) => {
    metadataRequest = undefined
    if (error instanceof DownloadError) throw error
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      throw new DownloadError('You appear to be offline. Reconnect and try again.')
    }
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      throw new DownloadError('The release check timed out. GitHub may be temporarily unreachable.')
    }
    throw new DownloadError('The latest downloads could not be reached. Please try again shortly.')
  })
  return metadataRequest
}

function formatSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export function LatestDownloads() {
  const [release, setRelease] = useState<ReleaseMetadata | null>(null)
  const [usingCached, setUsingCached] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<DownloadError | null>(null)

  const loadRelease = () => {
    setLoading(true)
    setError(null)
    metadataRequest = undefined
    fetchLatestMetadata()
      .then((metadata) => {
        setRelease(metadata)
        setUsingCached(false)
      })
      .catch((failure: DownloadError) => setError(failure))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    let active = true
    const cachedMetadata = readCachedMetadata()
    if (cachedMetadata) {
      setRelease(cachedMetadata)
      setUsingCached(true)
    }

    fetchLatestMetadata()
      .then((metadata) => {
        if (!active) return
        setRelease(metadata)
        setUsingCached(false)
      })
      .catch((failure: DownloadError) => {
        if (active) setError(failure)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [])

  const downloads = release?.assets
    .filter((asset) => DOWNLOAD_INFO[asset.abi])
    .sort((a, b) => ORDER.indexOf(a.abi) - ORDER.indexOf(b.abi))
  const universalDownload = downloads?.find((asset) => asset.abi === 'universal')
  const advancedDownloads = downloads?.filter((asset) => asset.abi !== 'universal')

  return (
    <section className="download section" id="downloads" aria-labelledby="download-title">
      <img className="download-icon" src={ICON_URL} alt="" width={80} height={80} />
      <h1 id="download-title">Download akiHz</h1>
      <p className="download-description">Official website · Refresh rate control for Android.</p>
      <p className="download-requirements">Android 11+ · Requires Shizuku</p>

      {!release && loading && (
        <div className="download-loading" role="status">
          <md-circular-progress indeterminate aria-label="Verifying the latest release" />
          <span>Verifying the latest release…</span>
        </div>
      )}

      {!release && error && (
        <div className="download-error" role="alert">
          <strong>Downloads unavailable</strong>
          <p>{error.message}</p>
          {error.retryable && <md-text-button type="button" onClick={loadRelease}><MaterialIcon name="refresh" slot="icon" />Try again</md-text-button>}
        </div>
      )}

      {!release && (
        <p className="download-fallback">
          If this check does not finish, <a href={RELEASES_URL}>get the latest release on GitHub</a>.
        </p>
      )}

      {release && downloads && (
        <div className="release-downloads">
          {(usingCached || error) && (
            <div className="download-warning" role="status">
              <span>Showing the last verified release saved by this browser.</span>
              {error?.retryable && <md-text-button type="button" onClick={loadRelease}>Check again</md-text-button>}
            </div>
          )}
          {universalDownload ? (
            <md-elevated-card className="primary-download">
              <div className="primary-head">
                <MaterialIcon name="smartphone" />
                <strong>Universal APK</strong>
              </div>
              <p>One APK for all supported architectures.</p>
              <a
                href={universalDownload.url}
                download={universalDownload.file}
                aria-label={`Download akiHz ${release.versionName} universal APK, ${formatSize(universalDownload.size)}`}
              >
                <md-filled-button><MaterialIcon name="download" slot="icon" />Download APK</md-filled-button>
              </a>
              <small>Version {release.versionName} · {formatSize(universalDownload.size)}</small>
            </md-elevated-card>
          ) : (
            <div className="download-error" role="alert">
              <strong>Universal APK unavailable</strong>
              <p>This release does not include a universal build. Architecture-specific builds are available below.</p>
            </div>
          )}

          <details className="advanced-downloads">
            <summary>Other architectures</summary>
            <md-list className="download-list">
              {advancedDownloads?.map((asset) => {
                const info = DOWNLOAD_INFO[asset.abi]
                return (
                  <a href={asset.url} download={asset.file} key={asset.abi} title={`SHA-256 ${asset.sha256}`}>
                    <md-list-item>
                      <div slot="headline">{info.architecture} · {info.label}</div>
                      <div slot="supporting-text">{info.description}</div>
                      <div slot="trailing-supporting-text" className="download-row-end">
                        <span className="download-size">{formatSize(asset.size)}</span>
                        <MaterialIcon name="download" />
                      </div>
                    </md-list-item>
                  </a>
                )
              })}
            </md-list>
          </details>
          {loading && release && <p className="download-refreshing" role="status">Checking for a newer release…</p>}
        </div>
      )}
      <ReleaseNotes version={release?.versionName} notes={release?.releaseNotes} loading={loading} />
      <a className="project-link" href={REPO_URL} target="_blank" rel="noreferrer">Setup &amp; documentation on GitHub</a>
    </section>
  )
}
