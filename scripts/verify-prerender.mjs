import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const [home, download, privacy] = await Promise.all([
  readFile(new URL('../dist/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../dist/download/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../dist/privacy/index.html', import.meta.url), 'utf8'),
])

assert.match(
  download,
  /href="https:\/\/github\.com\/anlaki-py\/akihz\/releases\/latest"/,
  'download HTML must include a script-independent GitHub fallback',
)
assert.match(download, /If this check does not finish/, 'download fallback must explain when to use it')

const activeRates = [...home.matchAll(/rate-number is-active[^>]*>(\d+)</g)].map((match) => match[1])
assert.deepEqual(activeRates, ['120'], 'home HTML must render one stable final refresh rate')
assert.match(home, /href="#shizuku-explanation"/, 'hero Shizuku text must link to its explanation')
assert.match(home, /Personally tested on Xiaomi/, 'hero must disclose the tested-device caveat')
assert.match(home, /Filled = active rate/, 'phone preview must explain its visual states')
assert.match(home, /aria-label="akiHz GitHub repository"/, 'repository icon must keep its accessible name')

const privacySections = [
  'summary',
  'app-data',
  'permissions',
  'third-parties',
  'website',
  'choices',
  'children',
  'changes',
  'contact',
]

for (const section of privacySections) {
  assert.match(privacy, new RegExp(`href="#${section}"`), `privacy navigation must link to #${section}`)
  assert.match(privacy, new RegExp(`id="${section}"`), `privacy policy must include #${section}`)
}

console.log('Prerender checks passed.')
