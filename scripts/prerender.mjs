import { readFile, rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { render } from '../.ssr/ssr.js'

const pages = [
  { file: 'dist/index.html', page: 'home' },
  { file: 'dist/download/index.html', page: 'download' },
  { file: 'dist/privacy/index.html', page: 'privacy' },
  { file: 'dist/404.html', page: 'not-found' },
]

await Promise.all(pages.map(async ({ file, page }) => {
  const path = resolve(file)
  const html = await readFile(path, 'utf8')
  const rendered = render(page)
  await writeFile(path, html.replace('<div id="root"></div>', `<div id="root">${rendered}</div>`))
}))

await rm(resolve('.ssr'), { recursive: true, force: true })
