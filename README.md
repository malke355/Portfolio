# Melkamu Teshome — Portfolio

A personal portfolio built as a real product rather than a template: typed
content models, server-rendered SEO, a hardened security header policy, and an
interactive terminal that answers questions about my work.

**Live site:** _pending deploy_

## Stack

| Layer      | Choice                                             |
| ---------- | -------------------------------------------------- |
| Framework  | Next.js 16 (App Router, React 19, Server Components) |
| Language   | TypeScript, `strict` mode                          |
| Styling    | Tailwind CSS v4 with an OKLCH design-token system   |
| Icons      | `lucide-react` plus hand-rolled brand SVGs          |
| Analytics  | Vercel Analytics (production only)                 |
| Tooling    | ESLint, Prettier, GitHub Actions CI                 |

## Getting started

```bash
npm install
cp .env.example .env.local   # optional, see below
npm run dev
```

The site runs at http://localhost:3000.

## Environment variables

Every variable is optional — the app degrades gracefully without them.

| Variable                         | Purpose                                                          |
| -------------------------------- | ---------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`           | Canonical origin for metadata, `sitemap.xml`, `robots.txt` and OG images. |
| `GITHUB_TOKEN`                   | Raises the GitHub REST rate limit for the live activity panel.    |
| `NEXT_PUBLIC_UNOPTIMIZED_IMAGES` | Set to `1` when deploying without the Next.js image optimizer.    |

## Scripts

| Command                | Description                                        |
| ---------------------- | -------------------------------------------------- |
| `npm run dev`          | Start the dev server.                              |
| `npm run build`        | Production build.                                  |
| `npm run lint`         | ESLint across the project.                         |
| `npm run typecheck`    | `tsc --noEmit` with no build-error suppression.     |
| `npm run format`       | Format with Prettier (Tailwind class sorting).      |
| `npm run verify`       | Format check, typecheck and build — what CI runs.   |

## Project structure

```
app/            App Router routes, metadata, sitemap, robots, OG image
components/     UI components (server by default, client where needed)
lib/            Site config and shared utilities
public/         Static assets and images
```

## Engineering notes

- **No suppressed errors.** The Next config does not set
  `typescript.ignoreBuildErrors`, so a type error fails the build.
- **Content Security Policy.** `next.config.mjs` ships a CSP that pins every
  origin the page may contact, alongside HSTS, `X-Frame-Options`,
  `Referrer-Policy` and a restrictive `Permissions-Policy`.
- **Structured data.** A `Person` JSON-LD graph is emitted server-side for
  rich search results.
- **Motion respects preferences.** Every animation is disabled under
  `prefers-reduced-motion: reduce`.

## License

[MIT](./LICENSE)
