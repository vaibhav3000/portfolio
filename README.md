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

Fully automated via GitHub Actions: `git push` to `main` builds the static
export and deploys it with the official `actions/deploy-pages` flow
(workflow: `.github/workflows/deploy.yml`).

The deployed URL is controlled by two build-time env vars, set in the workflow:

- `NEXT_PUBLIC_SITE_URL` — canonical/OG origin (single source of truth for SEO)
- `NEXT_PUBLIC_BASE_PATH` — path prefix. Required (e.g. `/portfolio`) while the
  site is served from `https://<user>.github.io/portfolio/`; must be empty once
  a custom domain is connected.

### Connecting the custom domain (vaibhav.is-a.dev)

After the is-a.dev DNS records exist and the PR on `is-a-dev/domains` merges:

1. Set the repository variable `PAGES_CUSTOM_DOMAIN=vaibhav.is-a.dev`
   (Settings > Secrets and variables > Actions > Variables).
2. Push (or re-run the workflow). The next build automatically targets
   `https://vaibhav.is-a.dev` with no base path and updates canonical/OG URLs.
3. Add the custom domain in Settings > Pages (GitHub saves it server-side for
   Actions deployments; a `CNAME` artifact file is not required, but one is
   kept ready in `deploy/CNAME` if you ever switch to branch-based deploys).
4. Enable "Enforce HTTPS" once the certificate is issued.

## Notes

- `public/resume.pdf` is the downloadable résumé linked from the nav and
  contact sections. Links to it are relative, so they work both under
  `github.io/<repo>/` and at a custom-domain root.
- Set `NEXT_PUBLIC_SITE_URL` locally (optional) to preview SEO tags against a
  real origin; it defaults to `http://localhost:3000`.
