# L1Page

The website for L1 Software at [l1software.app](https://l1software.app). It lists the L1 desktop apps, their downloads, and their release notes. It is a static [Astro](https://astro.build) site, deployed to GitHub Pages.

## Run it locally

You need Node 22.23 or later and pnpm.

```sh
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # writes the site to dist/
pnpm preview    # serves dist/
pnpm check      # type-checks .astro and .ts files
```

## Where the content lives

`src/data/products.ts` is the app registry. The home page, each app page at `/<slug>/`, `/download/`, and `/release-notes/` all read from it. The order of the `products` array is the display order. `featured` names the app shown in the home page hero.

Each product has a `releases` list, newest first. An empty list means the app is not released yet. The site then shows "Coming soon" and no download buttons. A release has a `version`, an ISO `date`, at least one line of `notes`, and at least one build in `downloads`. TypeScript rejects a release without notes or downloads.

Assets live in `src/assets/`:

- `icons/` holds the app tiles from the L1 logo kit.
- `logo/` holds the black and white L1 marks for the header and footer.
- `screenshots/` holds app screenshots. Astro resizes them at build time.

Colors are CSS custom properties at the top of `src/styles/global.css`, with one set for light mode and one for dark mode. The site follows the visitor's system setting.

## Add an app

1. Add its tile to `src/assets/icons/` and, if you have one, a screenshot to `src/assets/screenshots/`.
2. Add an entry to `src/data/products.ts` with a `slug`, `name`, one-sentence `tagline`, `summary`, `icon`, optional `screenshot` with alt text, `platforms`, `features`, and `releases: []`. Add it to the `products` array.
3. Run `pnpm check` and `pnpm build`, then open `/<slug>/` with `pnpm preview`.

## Publish a release

GitHub Pages hosts this site, not the app binaries. Pages has a 1 GB site limit and is not meant for large files. Put the installers on a GitHub Release in the app's own repository, and link to them from the registry.

1. Create a GitHub Release for the app, for example tag `v1.0.0`, and upload the installers as release assets.
2. In `src/data/products.ts`, add the release to the front of the app's `releases` list:

	```ts
	releases: [
		{
			version: '1.0.0',
			date: '2026-11-02',
			notes: ['First release.'],
			downloads: [
				{ platform: 'macos', arch: 'universal', format: 'dmg', url: 'https://github.com/<owner>/<repo>/releases/download/v1.0.0/L1-Data-1.0.0.dmg' },
				{ platform: 'windows', arch: 'x64', format: 'msi', url: '...' },
				{ platform: 'linux', arch: 'x64', format: 'AppImage', url: '...' },
				{ platform: 'linux', arch: 'x64', format: 'deb', url: '...' },
			],
		},
		...older releases
	],
	```

3. Run `pnpm check` and `pnpm build`.
4. Merge to `main`. The deploy workflow publishes the site.

Use the versioned asset URL (`/releases/download/<tag>/<file>`), so the version on the page and the file it links to always match.

The download buttons offer the first build in `downloads` that matches the visitor's platform. A browser cannot reliably tell Apple silicon from Intel, so list a `universal` or `arm64` macOS build before an `x64` one. Without JavaScript, the buttons link to the app page, which lists every build.

## Social preview image

`public/og.png` is a 1200 by 630 screenshot of `scripts/og.html`. After you change that file, open it in a browser at that size and save a screenshot over `public/og.png`.

## Deployment

`.github/workflows/deploy.yml` builds the site with `withastro/action` and deploys it with `actions/deploy-pages`. It runs on every push to `main`, and you can start it by hand from the **Actions** tab.

The first deploy needs two one-time settings in the GitHub repository:

1. In **Settings > Pages**, set **Source** to **GitHub Actions**.
2. Set the custom domain to `l1software.app` and turn on **Enforce HTTPS** after the certificate is issued.

`public/CNAME` holds the domain. For the apex domain, point the DNS `A` records at GitHub Pages: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and `185.199.111.153`.
