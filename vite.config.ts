import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { GET as getLatestRelease } from './api/latest-release.ts'

const configuredUrl = process.env.SITE_URL
const host = configuredUrl || 'akihz.anlaki.dev'
const siteUrl = (host.startsWith('http') ? host : `https://${host}`).replace(/\/$/, '')

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'inject-site-url',
      enforce: 'pre',
      transformIndexHtml: {
        order: 'pre',
        handler: (html) => html.replaceAll('__SITE_URL__', siteUrl),
      },
    },
    {
      name: 'local-release-metadata-api',
      configureServer(server) {
        server.middlewares.use('/api/latest-release', async (_request, response) => {
          const releaseResponse = await getLatestRelease()
          response.statusCode = releaseResponse.status
          releaseResponse.headers.forEach((value: string, name: string) => response.setHeader(name, value))
          response.end(await releaseResponse.text())
        })
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        download: resolve(import.meta.dirname, 'download/index.html'),
        privacy: resolve(import.meta.dirname, 'privacy/index.html'),
        notFound: resolve(import.meta.dirname, '404.html'),
      },
    },
  },
})
