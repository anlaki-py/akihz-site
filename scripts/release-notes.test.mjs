import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { createServer } from 'vite'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
after(() => server.close())
const { ReleaseNotes } = await server.ssrLoadModule('/src/components/ReleaseNotes.tsx')

const metadata = {
  schemaVersion: 1, packageName: 'akihz.anlaki.dev', versionName: '1.2.3', versionCode: 123,
  channel: 'stable', prerelease: false, releaseDate: '2026-10-28',
  repository: 'https://github.com/anlaki-py/akihz',
  releaseUrl: 'https://github.com/anlaki-py/akihz/releases/tag/v1.2.3',
  changelog: 'https://github.com/anlaki-py/akihz/blob/v1.2.3/CHANGELOG.md',
  minSdk: 30, targetSdk: 36,
  requirements: { shizuku: { required: true, url: 'https://shizuku.rikka.app/' } },
  signingCertificate: { sha256: 'a'.repeat(64) },
  assets: [{ abi: 'universal', file: 'akihz-universal.apk',
    url: 'https://github.com/anlaki-py/akihz/releases/download/v1.2.3/akihz-universal.apk',
    sha256: 'b'.repeat(64), size: 1024 }],
}

for (const scenario of ['valid', 'empty', 'oversized', 'wrong-tag', 'failure']) {
  test(`GitHub notes: ${scenario}`, async (t) => {
    const calls = []
    t.mock.method(globalThis, 'fetch', async (url) => {
      calls.push(url)
      if (url.endsWith('release-metadata.json')) return Response.json(metadata)
      assert.equal(url, 'https://api.github.com/repos/anlaki-py/akihz/releases/tags/v1.2.3')
      if (scenario === 'failure') throw new Error('Network unavailable')
      return Response.json({
        tag_name: scenario === 'wrong-tag' ? 'v9.0.0' : 'v1.2.3',
        body: scenario === 'empty' ? '' : scenario === 'oversized' ? 'x'.repeat(50_001) : '### Fixed\n\n- Fixed switching.',
      })
    })
    const { GET } = await import(`../api/latest-release.ts?scenario=${scenario}`)
    const response = await GET()
    assert.equal(response.status, 200, 'Notes failures must not break downloads')
    const body = await response.json()
    assert.deepEqual(body.assets, metadata.assets)
    assert.equal(body.releaseNotes, scenario === 'valid' ? '### Fixed\n\n- Fixed switching.' : undefined)
    await GET()
    assert.equal(calls.length, 2, 'Cached requests must not fetch GitHub again')
  })
}

test('renders notes as safe headings and lists with full changelog link', () => {
  const html = renderToStaticMarkup(createElement(ReleaseNotes, {
    version: '1.2.3', loading: false,
    notes: '### Fixed\n\n- Fixed switching.\n- <script>alert(1)</script>\n\n[Full changelog](https://github.com/anlaki-py/akihz/blob/v1.2.3/CHANGELOG.md)',
  }))
  assert.match(html, /What&#x27;s new in 1.2.3/)
  assert.match(html, /<h3>Fixed<\/h3>/)
  assert.match(html, /<li>Fixed switching\.<\/li>/)
  assert.doesNotMatch(html, /<script>|\[Full changelog\]/)
  assert.match(html, /href="https:\/\/github.com\/anlaki-py\/akihz\/blob\/main\/CHANGELOG.md"/)
})

test('missing notes keep GitHub release and full history accessible', () => {
  const html = renderToStaticMarkup(createElement(ReleaseNotes, { version: '1.2.3', loading: false }))
  assert.match(html, /Release notes are unavailable here/)
  assert.match(html, /releases\/tag\/v1.2.3/)
  assert.match(html, /View full changelog/)
})
