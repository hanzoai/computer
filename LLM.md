# Hanzo Computer

## Overview
A modern ecommerce platform for purchasing AI compute hardware, featuring the DGX Spark instance ($4,000) as the only credit card purchasable item, with enterprise solutions requiring sales consultati

## Tech Stack
- **Language**: TypeScript/JavaScript

## Build & Run
```bash
pnpm install && pnpm build
pnpm test
```

## Structure
```
computer/
  App.tsx
  CHANGELOG.md
  CONTENT_IMPROVEMENTS.md
  ECOMMERCE_FEATURES.md
  EMAIL_NOTIFICATIONS.md
  LICENSE
  LLM.md
  README.md
  api/
  components/
  docs/
  e2e/
  index.html
  index.tsx
  metadata.json
```

## Key Files
- `README.md` -- Project documentation
- `package.json` -- Dependencies and scripts

## Analytics and deploy

- `src/telemetry.tsx` is the docs.hanzo.ai pattern, mounted inside the router:
  `@hanzo/event`'s provider sends the pageview to `POST api.hanzo.ai/v1/event`
  with project `computer`'s publishable key, for every visitor (first party), `startTags` loads GA4 and the Meta
  pixel from cloud (`GET /v1/project/tags`) under cloud's rule for the visitor's
  region (@hanzo/event 0.3.66: at once in the US, on consent in the EU), and
  `src/banner.tsx` is `@hanzo/ui/consent` under its own `GuiProvider`, loaded
  lazily so the gui renderer stays off the first paint. No tag id lives here;
  the key is stated because @hanzo/event's SITE_KEY does not list hanzo.computer.
- gui is react-native-web on the browser, so `vite.config.ts` aliases
  `react-native` to `react-native-web` and prefers `.web.*` extensions.
- `package.json` overrides hold one `@hanzo/gui`, one `@hanzo/event` and
  `react-native` 0.87 (the peer npm would otherwise pull wants React 19.3).
- Deploy: push to main. `.github/workflows/cicd.yml` runs hanzoai/ci, which
  builds `dist/` and publishes it as Sites project `computer`
  (`s3://hanzo-sites/hanzo/computer`), the root hanzo.computer and
  computer.hanzo.ai both serve. A caller under `.hanzo/workflows/` never ran:
  the forge copy of this repo is a mirror with Actions off.
