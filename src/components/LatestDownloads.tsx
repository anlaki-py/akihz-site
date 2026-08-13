import { useEffect, useState } from 'react'
import { LATEST_RELEASE_ENDPOINT } from '../constants'
import { Icon } from './Icon'

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
  const [release, setRelease] = useState<ReleaseMetadata | null>(() => readCachedMetadata())
  const [usingCached, setUsingCached] = useState(() => Boolean(readCachedMetadata()))
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
      <div className="download-glow" />
      <h1 id="download-title">Download akiHz</h1>
      <p>Download the universal APK. It works across supported Android device architectures.</p>

      {!release && loading && (
        <div className="download-loading" role="status">
          <span className="loading-spinner" /> Verifying the latest release…
        </div>
      )}

      {!release && error && (
        <div className="download-error" role="alert">
          <strong>Downloads unavailable</strong>
          <p>{error.message}</p>
          {error.retryable && <button className="button button-secondary" type="button" onClick={loadRelease}>Try again</button>}
        </div>
      )}

      {release && downloads && (
        <div className="release-downloads">
          {(usingCached || error) && (
            <div className="download-warning" role="status">
              Showing the last verified release saved by this browser.
              {error?.retryable && <button type="button" onClick={loadRelease}>Check again</button>}
            </div>
          )}
          {universalDownload ? (
            <div className="primary-download">
              <strong>Universal APK</strong>
              <p>Works on supported Android devices.</p>
              <a
                className="primary-download-action"
                href={universalDownload.url}
                download={universalDownload.file}
                aria-label={`Download akiHz ${release.versionName} universal APK, ${formatSize(universalDownload.size)}`}
              >
                <Icon name="download" /> Download APK
              </a>
              <small>Version {release.versionName} · {formatSize(universalDownload.size)}</small>
            </div>
          ) : (
            <div className="download-error" role="alert">
              <strong>Universal APK unavailable</strong>
              <p>This release does not include a universal build. Architecture-specific builds are available below.</p>
            </div>
          )}

          <details className="advanced-downloads">
            <summary>Advanced options</summary>
            <div className="advanced-content">
              <div className="release-meta">
                <span>Stable v{release.versionName}</span>
                <span>Android API {release.minSdk}+ · {new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(release.releaseDate))}</span>
              </div>
              <div className="download-list">
                {advancedDownloads?.map((asset) => {
                  const info = DOWNLOAD_INFO[asset.abi]
                  return (
                    <a className="download-row" href={asset.url} download={asset.file} key={asset.abi}>
                      <span className="download-name">
                        <span>{info.architecture}</span>
                        <small>{info.description}</small>
                        <small className="download-sha" title={asset.sha256}>SHA-256 {asset.sha256}</small>
                      </span>
                      <code>{info.label}</code>
                      <span className="download-size">{formatSize(asset.size)}</span>
                      <span className="download-action"><Icon name="download" /></span>
                    </a>
                  )
                })}
              </div>
              <div className="download-footnote">
                <span title={release.signingCertificate.sha256}><Icon name="shield" /> Signing certificate {release.signingCertificate.sha256}</span>
                <span>
                  <a href={release.changelog} target="_blank" rel="noreferrer">Changelog</a>
                  <a href={release.releaseUrl} target="_blank" rel="noreferrer">Release details</a>
                </span>
              </div>
            </div>
          </details>
          {loading && release && <p className="download-refreshing" role="status">Checking for a newer release…</p>}
        </div>
      )}
    </section>
  )
}
