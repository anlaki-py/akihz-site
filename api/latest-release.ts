const METADATA_URL =
  'https://github.com/anlaki-py/akihz/releases/latest/download/release-metadata.json'
const LATEST_RELEASE_API = 'https://api.github.com/repos/anlaki-py/akihz/releases/latest'
const PACKAGE_NAME = 'akihz.anlaki.dev'
const RELEASE_PREFIX = 'https://github.com/anlaki-py/akihz/releases/download/'
const SUPPORTED_ABIS = new Set(['arm64-v8a', 'armeabi-v7a', 'universal', 'x86', 'x86_64'])
const SHA256 = /^[a-f0-9]{64}$/
const REQUEST_TIMEOUT_MS = 7_000
const FRESH_CACHE_MS = 5 * 60_000

let lastGoodMetadata: { value: ReleaseMetadata; fetchedAt: number } | undefined

class MetadataError extends Error {
  readonly code: 'network_error' | 'upstream_error' | 'invalid_metadata'

  constructor(
    message: string,
    code: 'network_error' | 'upstream_error' | 'invalid_metadata',
  ) {
    super(message)
    this.code = code
  }
}

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
  channel: string
  prerelease: boolean
  releaseDate: string
  repository: string
  releaseUrl: string
  changelog: string
  minSdk: number
  targetSdk: number
  requirements: { shizuku: { required: boolean; url: string } }
  signingCertificate: { sha256: string }
  assets: ReleaseAsset[]
}

function isValidAsset(asset: ReleaseAsset, versionName: string) {
  const versionedReleasePrefix = `${RELEASE_PREFIX}v${versionName}/`
  return SUPPORTED_ABIS.has(asset.abi) &&
    asset.file.endsWith(`-${asset.abi}.apk`) &&
    asset.url.startsWith(versionedReleasePrefix) &&
    asset.url.endsWith(`/${asset.file}`) &&
    SHA256.test(asset.sha256) &&
    Number.isSafeInteger(asset.size) && asset.size > 0
}

function isValidMetadata(value: unknown): value is ReleaseMetadata {
  if (!value || typeof value !== 'object') return false
  const metadata = value as ReleaseMetadata
  return metadata.schemaVersion === 1 &&
    metadata.packageName === PACKAGE_NAME &&
    typeof metadata.versionName === 'string' && metadata.versionName.length > 0 &&
    Number.isSafeInteger(metadata.versionCode) && metadata.versionCode > 0 &&
    metadata.channel === 'stable' && metadata.prerelease === false &&
    !Number.isNaN(Date.parse(metadata.releaseDate)) &&
    metadata.repository === 'https://github.com/anlaki-py/akihz' &&
    metadata.releaseUrl === `https://github.com/anlaki-py/akihz/releases/tag/v${metadata.versionName}` &&
    metadata.changelog === `https://github.com/anlaki-py/akihz/blob/v${metadata.versionName}/CHANGELOG.md` &&
    Number.isSafeInteger(metadata.minSdk) && metadata.minSdk >= 30 &&
    Number.isSafeInteger(metadata.targetSdk) && metadata.targetSdk >= metadata.minSdk &&
    metadata.requirements?.shizuku?.required === true &&
    metadata.requirements.shizuku.url === 'https://shizuku.rikka.app/' &&
    SHA256.test(metadata.signingCertificate?.sha256) &&
    Array.isArray(metadata.assets) && metadata.assets.length > 0 &&
    metadata.assets.every((asset) => isValidAsset(asset, metadata.versionName)) &&
    new Set(metadata.assets.map((asset) => asset.abi)).size === metadata.assets.length
}

async function requestJson(url: string, accept: string): Promise<unknown> {
  let response: Response
  try {
    response = await fetch(url, {
      headers: {
        Accept: accept,
        'User-Agent': 'akiHz-website',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
  } catch {
    throw new MetadataError('Could not connect to GitHub', 'network_error')
  }

  if (!response.ok) {
    throw new MetadataError(`GitHub returned HTTP ${response.status}`, 'upstream_error')
  }

  try {
    return await response.json()
  } catch {
    throw new MetadataError('GitHub returned malformed JSON', 'invalid_metadata')
  }
}

async function fetchDirectMetadata() {
  return requestJson(METADATA_URL, 'application/json, application/octet-stream')
}

async function fetchMetadataViaApi() {
  const release = await requestJson(LATEST_RELEASE_API, 'application/vnd.github+json') as {
    draft?: boolean
    prerelease?: boolean
    assets?: Array<{ name?: string; url?: string }>
  }
  if (release.draft || release.prerelease || !Array.isArray(release.assets)) {
    throw new MetadataError('The latest GitHub release is not stable', 'invalid_metadata')
  }

  const assetUrl = release.assets.find((asset) => asset.name === 'release-metadata.json')?.url
  if (!assetUrl?.startsWith('https://api.github.com/repos/anlaki-py/akihz/releases/assets/')) {
    throw new MetadataError('The latest release has no metadata asset', 'invalid_metadata')
  }
  return requestJson(assetUrl, 'application/octet-stream')
}

async function fetchValidatedMetadata() {
  const errors: MetadataError[] = []
  for (const strategy of [fetchDirectMetadata, fetchMetadataViaApi]) {
    try {
      const metadata = await strategy()
      if (!isValidMetadata(metadata)) {
        throw new MetadataError('Release metadata failed validation', 'invalid_metadata')
      }
      return metadata
    } catch (error) {
      errors.push(error instanceof MetadataError
        ? error
        : new MetadataError('Unexpected metadata error', 'upstream_error'))
    }
  }
  throw errors[errors.length - 1] ?? new MetadataError('Release metadata is unavailable', 'upstream_error')
}

function metadataResponse(metadata: ReleaseMetadata, stale = false) {
  return Response.json(metadata, {
    headers: {
      'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=3600',
      'X-Robots-Tag': 'noindex, nofollow',
      'X-akiHz-Metadata': stale ? 'stale' : 'fresh',
    },
  })
}

export async function GET() {
  if (lastGoodMetadata && Date.now() - lastGoodMetadata.fetchedAt < FRESH_CACHE_MS) {
    return metadataResponse(lastGoodMetadata.value)
  }

  try {
    const metadata = await fetchValidatedMetadata()
    lastGoodMetadata = { value: metadata, fetchedAt: Date.now() }
    return metadataResponse(metadata)
  } catch (error) {
    if (lastGoodMetadata) return metadataResponse(lastGoodMetadata.value, true)

    const failure = error instanceof MetadataError
      ? error
      : new MetadataError('Unexpected metadata error', 'upstream_error')
    console.warn(`[akiHz downloads] ${failure.code}: ${failure.message}`)
    return Response.json(
      {
        error: 'Latest verified downloads are temporarily unavailable.',
        code: failure.code,
        retryable: failure.code !== 'invalid_metadata',
      },
      {
        status: failure.code === 'invalid_metadata' ? 502 : 503,
        headers: {
          'Cache-Control': 'no-store',
          'Retry-After': '30',
          'X-Robots-Tag': 'noindex, nofollow',
        },
      },
    )
  }
}
