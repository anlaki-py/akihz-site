import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const configuredUrl = process.env.SITE_URL
const host = configuredUrl || 'akihz.anlaki.dev'
const siteUrl = (host.startsWith('http') ? host : `https://${host}`).replace(/\/$/, '')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${siteUrl}/</loc><priority>1.0</priority></url>
  <url><loc>${siteUrl}/download/</loc><priority>0.8</priority></url>
  <url><loc>${siteUrl}/privacy/</loc><priority>0.4</priority></url>
</urlset>
`

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`

await Promise.all([
  writeFile(resolve('dist/sitemap.xml'), sitemap),
  writeFile(resolve('dist/robots.txt'), robots),
])
