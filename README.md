# akiHz website

Official product website for [akiHz](https://github.com/anlaki-py/akihz), built with React, TypeScript, and Vite.

## Development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

The build prerenders the landing page, `/download/`, and `/privacy/` for strong initial-load performance and search-engine visibility. It also generates `sitemap.xml` and `robots.txt`.

## Deployment

The project is configured for Vercel through `vercel.json` and uses `https://akihz.anlaki.dev` as its canonical production URL. `SITE_URL` can override that URL for an alternate deployment. Vercel preview domains intentionally retain the production canonical so they do not compete with the custom domain in search results.

The app icon, screenshots, favicon, and social preview are served directly from the akiHz repository's `main` branch, so those visuals update without a website deployment.

The download selector calls a cached Vercel function that retrieves the latest stable release's `release-metadata.json`. The function validates the package name, channel, SDK requirements, APK URLs, sizes, SHA-256 digests, and signing certificate before returning the downloads to the browser.

During `npm run dev`, Vite serves the same validation handler at `/api/latest-release`, so the live download selector works without installing the Vercel CLI.

## Launch checklist

After importing the repository into Vercel:

1. Confirm the production branch, `npm run build` command, and `dist` output directory.
2. Add `akihz.anlaki.dev` in Project Settings → Domains and use the exact CNAME record Vercel provides.
3. Make `akihz.anlaki.dev` the primary production domain. Do not point another public hostname at the same deployment without redirecting it to the primary domain.
4. Test `/`, `/download/`, `/privacy/`, `/robots.txt`, `/sitemap.xml`, a nonexistent URL, and `/api/latest-release` on the deployed domain.
5. Download the universal APK once and confirm Android receives the expected filename and signing identity.
6. Add the domain to Google Search Console and submit `https://akihz.anlaki.dev/sitemap.xml`.

No runtime environment variables or secrets are required. `SITE_URL` is an optional build-time override and should remain unset for the production domain above.
