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

for (const [name, html] of [['home', home], ['download', download]]) {
  assert.match(html, /<h1 id="download-title">Download akiHz<\/h1>/, `${name} must show downloads immediately`)
  assert.match(html, /href="https:\/\/github\.com\/anlaki-py\/akihz\/releases\/latest"/, `${name} must offer downloads without JavaScript or a working API`)
  assert.match(html, /aria-label="akiHz GitHub repository"/, `${name} repository link must keep its accessible name`)
  assert.doesNotMatch(html, /href="#(?:features|setup|faq|shizuku-explanation)"/, `${name} must not link to removed sections`)
  assert.doesNotMatch(html, /FAQPage|What it does|One click\. Set it to 120 Hz\./, `${name} must not retain the old marketing content`)
}

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
