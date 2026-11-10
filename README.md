# Vaibhav Mahore Portfolio

Personal portfolio site, built from scratch with **Next.js 14 (App Router) + TypeScript + Tailwind CSS**.

Design system: a hybrid of premium dark AI-engineer typography, a terminal/CLI
information layer, and restrained cinematic motion (canvas state-space visual,
scroll reveals). No animation or 3D libraries; the hero visual is a hand-rolled
2D canvas scene that pauses off-screen and respects `prefers-reduced-motion`.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

## Production build (static export)

```bash
npm run build      # emits the fully static site to out/
npm run preview    # serves out/ at http://localhost:4321 (no deps, node only)
```

The site exports as pure static assets (`output: "export"`), so `next start`
is intentionally not used.

## Deployment (GitHub Pages)

Automatic: every push to `main` runs `.github/workflows/deploy.yml`, which
builds the static export with the right site URL and base path, checks the
output (no `localhost` URLs, résumé present) and publishes `out/` to the
`gh-pages` branch that GitHub Pages serves (source: `gh-pages`, path `/`).
Pull requests run the same build and checks, then publish a preview to
`https://vaibhav3000.github.io/portfolio/preview/` (hidden from search
engines); the next deploy from `main` removes it.

Manual fallback, if you ever need it:

    # bash / Git Bash
    NEXT_PUBLIC_SITE_URL=https://vaibhav3000.github.io NEXT_PUBLIC_BASE_PATH=/portfolio npm run build

    # PowerShell
    $env:NEXT_PUBLIC_SITE_URL="https://vaibhav3000.github.io"; $env:NEXT_PUBLIC_BASE_PATH="/portfolio"; npm run build

    # then push the contents of out/ to gh-pages (with .nojekyll)

The deployed URL is controlled by two build-time env vars, set in the workflow:

- `NEXT_PUBLIC_SITE_URL` — canonical/OG origin (single source of truth for SEO)
- `NEXT_PUBLIC_BASE_PATH` — path prefix. Required (e.g. `/portfolio`) while the
  site is served from `https://<user>.github.io/portfolio/`; must be empty once
  a custom domain is connected.

### Connecting the custom domain (vaibhav.is-a.dev)

After the is-a.dev DNS records exist and the PR on `is-a-dev/domains` merges:

1. Set the repository variable `PAGES_CUSTOM_DOMAIN=vaibhav.is-a.dev`
   (Settings > Secrets and variables > Actions > Variables).
2. Push to `main` (or re-run the workflow). The build then targets
   `https://vaibhav.is-a.dev` with no base path, updates canonical/OG URLs,
   and the deploy writes the `CNAME` file to `gh-pages`.
3. Confirm the domain in Settings > Pages and enable "Enforce HTTPS" once the
   certificate is issued.

## Notes

- `public/resume.pdf` is the downloadable résumé linked from the hero, nav and
  contact sections. Links to it are relative, so they work both under
  `github.io/<repo>/` and at a custom-domain root. To update it, upload the new
  PDF as `public/resume.pdf` (on GitHub: Add file > Upload files) and the
  deploy workflow republishes the site.
- Set `NEXT_PUBLIC_SITE_URL` locally (optional) to preview SEO tags against a
  real origin; it defaults to `https://vaibhav3000.github.io`, so a build
  without it still emits correct canonical and Open Graph URLs.
