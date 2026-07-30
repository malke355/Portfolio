# Melkamu Teshome — Portfolio

Personal portfolio of a full-stack developer, built with Next.js 16 and Tailwind CSS v4.

The centrepiece is **`melkamu.sh`**, an interactive terminal that answers questions
about my work — with no language model involved.

---

## `melkamu.sh`

Press <kbd>⌘</kbd><kbd>K</kbd> / <kbd>Ctrl</kbd><kbd>K</kbd> anywhere on the site, or
just <kbd>/</kbd>.

```
$ ask are you available for work
$ gh
$ projects gebetago
$ skills backend
$ resume
```

It behaves like a real shell: tab completion, arrow-key history, <kbd>Ctrl</kbd><kbd>L</kbd>
to clear, <kbd>Ctrl</kbd><kbd>C</kbd> to abort an in-flight request. Anything that is not a
recognised command is treated as a question, because someone who types
"are you available?" at a prompt wants an answer, not a usage error.

### It cannot make things up

The interesting constraint is what it *cannot* do. There is no LLM and no API key.

1. `content/knowledge.ts` derives searchable documents from the same typed content
   that renders the page.
2. `lib/search.ts` ranks them with a BM25 implementation written from scratch —
   no search service, no embeddings.
3. `/api/ask` returns the winning document **verbatim** and refuses to answer when
   nothing scores.

So an answer can only ever be a passage published on this site. Ask about something
it does not cover and it says so, instead of inventing a credential. The knowledge
base and the page also cannot drift apart, because they are generated from one source.

BM25 rather than plain term overlap because on a corpus this small two things matter:
terms appearing in nearly every document need discounting (every one of them says
"developer"), and long documents should not win for being long. Synonyms are
canonicalised in both directions — a one-way query alias was not enough, because
`what is your tech stack` ranked the *education* document first when
"campus tech community" was the only literal "tech" in the corpus and therefore
carried the highest IDF.

The endpoint is curl-able:

```bash
curl "https://melkamu.dev/api/ask?q=what+is+your+tech+stack"
```

---

## Live GitHub data

`lib/github.ts` pulls the profile and repo list from the GitHub REST API and derives
total stars, a language breakdown and top repositories. It is rendered **on the server**,
so the numbers are in the initial HTML rather than popping in after hydration, and it
revalidates hourly.

Failures are returned as data (`{ available: false, reason }`) rather than thrown. The
section is an enhancement over the curated projects above it, so a GitHub outage
degrades it instead of breaking the page.

Set `GITHUB_TOKEN` to lift the unauthenticated ceiling of 60 requests per hour.

---

## Stack

| Concern  | Choice                                             |
| -------- | -------------------------------------------------- |
| Framework| Next.js 16 (App Router, React 19 server components)|
| Styling  | Tailwind CSS v4, OKLCH design tokens               |
| Language | TypeScript, `strict` plus `noUncheckedIndexedAccess`|
| Icons    | lucide-react                                       |
| Quality  | ESLint 9 flat config, Prettier, GitHub Actions     |

---

## Getting started

Requires Node 20.9 or newer.

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

### Environment variables

Copy `.env.example` to `.env.local`. Everything is optional for local development.

| Variable                        | Purpose                                              |
| ------------------------------- | ---------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`          | Canonical origin for metadata, sitemap and OG images |
| `GITHUB_TOKEN`                  | Raises the GitHub API rate limit from 60/h to 5000/h |
| `NEXT_PUBLIC_UNOPTIMIZED_IMAGES`| Skip image optimisation on hosts that lack it        |

### Scripts

| Script                 | Does                                            |
| ---------------------- | ----------------------------------------------- |
| `npm run dev`          | Development server                              |
| `npm run build`        | Production build                                |
| `npm run lint`         | ESLint                                          |
| `npm run typecheck`    | `tsc --noEmit`                                  |
| `npm run format`       | Prettier, with Tailwind class sorting           |
| `npm run verify`       | format check, lint, typecheck and build         |

Run `npm run verify` before pushing. Typecheck alone is not enough — Next parses
route segment config statically, and an invalid one only fails during `build`.

---

## Editing content

All copy lives in `content/`, typed and separate from the components:

```
content/
  profile.ts      bio, stats, timeline
  skills.ts       skill groups and the hero marquee
  projects.ts     projects, one per detail page
  experience.ts   roles and education
  knowledge.ts    search documents, derived from the four above
```

Identity, URLs and social handles live in `lib/site.ts`.

Editing a project in `content/projects.ts` updates the card, the
`/projects/[slug]` page, the sitemap, the résumé and the terminal's answers at once.

`links.demo` is optional. It is deliberately unset: a "Live demo" button that lands
on a profile page reads as a broken claim. Fill it in as deployments go live and the
button appears.

---

## Routes

| Route              | Rendering                        |
| ------------------ | -------------------------------- |
| `/`                | Static, revalidated hourly       |
| `/projects/[slug]` | Static per project               |
| `/resume`          | Static, print-optimised          |
| `/api/ask`         | Dynamic                          |
| `/api/github`      | Static, revalidated hourly       |

`/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest` and `/opengraph-image` are all
generated from `lib/site.ts`.

---

## Engineering notes

- **No suppressed errors.** No `ignoreBuildErrors`, no `ignoreDuringBuilds`, no `any`
  in application code. CI blocks a merge on a formatting, lint, type or build failure.
- **Themes without a flash.** An inline script applies the stored or system theme
  before first paint. `ThemeToggle` reads the `<html>` class through
  `useSyncExternalStore` rather than keeping its own copy, so React can never
  disagree with what is painted.
- **The intro plays once.** A full-viewport loader on every page view is an
  artificial delay in front of static content, so the same boot script skips it for
  repeat visits in a session, and for anyone who asked for reduced motion.
- **Motion is a preference.** Every animation, including the pointer spotlight and
  the scroll reveals, is disabled under `prefers-reduced-motion: reduce`.
- **One IntersectionObserver.** `Reveal` shares a single observer across every
  instance via a `WeakMap` instead of creating one per element.
- **Pointer effects skip React.** The spotlight writes two CSS custom properties in
  the event handler, so the browser repaints a gradient with no re-render and no
  layout. Same for the scroll progress bar, which writes its transform inside a
  `requestAnimationFrame`.
- **A strict CSP** is set in `next.config.mjs`, alongside HSTS, `X-Frame-Options`,
  `Referrer-Policy` and a `Permissions-Policy`.
- **Structured data.** `Person` JSON-LD on the home page, `CreativeWork` on each
  project.
- **The résumé is generated,** not a checked-in PDF, so it cannot fall behind the
  site. The print stylesheet forces ink-on-paper regardless of theme, sets A4
  margins, and marks roles `break-inside-avoid` so none straddle a page boundary.

---

## Deploying

Works on any Node host. On Vercel:

1. Import the repository.
2. Set `NEXT_PUBLIC_SITE_URL` to the production origin — metadata, the sitemap and
   OG image URLs derive from it.
3. Optionally set `GITHUB_TOKEN`.

Framework detection, build command and output are picked up automatically.

---

## Licence

MIT — see [LICENSE](./LICENSE).
