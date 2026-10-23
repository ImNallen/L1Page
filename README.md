# L1Page

The website for L1 Software at [l1software.app](https://l1software.app). It lists the L1 desktop apps and hosts their download pages. It is a static [Astro](https://astro.build) site, deployed to GitHub Pages.

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

`src/data/products.ts` is the product registry. The home page table, each product page, and `/download/` all read from it. Each product gets a page at `/<slug>/`.

The `availability` field has two shapes:

- `{ kind: 'coming-soon', platforms }` shows a "Not released yet" state and the planned platforms.
- `{ kind: 'available', version, releasedAt, releaseNotesUrl, downloads }` lists every build and promotes the build that matches the visitor's operating system.

TypeScript rejects a released product without downloads and an unreleased product with a version.

## Add a product

1. Add an entry to the `products` array in `src/data/products.ts`. Give it a `slug`, a `name`, a one-sentence `tagline`, a `summary`, `features`, and an `availability`.
2. Run `pnpm build` and open `/<slug>/` with `pnpm preview`.

A product page shows a hero visual only if one is registered. To add one, create a component in `src/components/` and add it to the `visuals` map in `src/pages/[slug]/index.astro`. `AppMock.astro` is the visual for L1 Data.

## Publish a release

GitHub Pages hosts this site, not the app binaries. Pages has a 1 GB site limit and is not meant for large files. Put the installers on a GitHub Release in the app's own repository, and link to them from the registry.

1. Create a GitHub Release for the app, for example tag `v1.0.0`, and upload the installers as release assets.
2. In `src/data/products.ts`, change the product's `availability` to `kind: 'available'`:

	```ts
	availability: {
		kind: 'available',
		version: '1.0.0',
		releasedAt: '2026-11-02',
		releaseNotesUrl: 'https://github.com/<owner>/<repo>/releases/tag/v1.0.0',
		downloads: [
			{ platform: 'macos', arch: 'universal', format: 'dmg', url: 'https://github.com/<owner>/<repo>/releases/download/v1.0.0/L1-Data-1.0.0.dmg' },
			{ platform: 'windows', arch: 'x64', format: 'msi', url: '...' },
			{ platform: 'linux', arch: 'x64', format: 'AppImage', url: '...' },
			{ platform: 'linux', arch: 'x64', format: 'deb', url: '...' },
		],
	},
	```

3. Run `pnpm check` and `pnpm build`.
4. Merge to `main`. The deploy workflow publishes the site.

Use the versioned asset URL (`/releases/download/<tag>/<file>`), so the version on the page and the file it links to always match.

The download section promotes the first build in `downloads` that matches the visitor's platform. A browser cannot reliably tell Apple silicon from Intel, so list a `universal` or `arm64` macOS build before an `x64` one. Without JavaScript, the page lists every build.

## Deployment

`.github/workflows/deploy.yml` builds the site with `withastro/action` and deploys it with `actions/deploy-pages`. It runs on every push to `main`, and you can start it by hand from the **Actions** tab.

The first deploy needs two one-time settings in the GitHub repository:

1. In **Settings > Pages**, set **Source** to **GitHub Actions**.
2. Set the custom domain to `l1software.app` and turn on **Enforce HTTPS** after the certificate is issued.

`public/CNAME` holds the domain. For the apex domain, point the DNS `A` records at GitHub Pages: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and `185.199.111.153`.
