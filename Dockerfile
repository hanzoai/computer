# syntax=docker/dockerfile:1
# Multi-stage build for hanzo.computer (Vite + React 19 SPA storefront).
# Stage 1 builds the static bundle with npm; stage 2 serves it from a
# minimal Node runtime via `serve` (SPA history-API fallback). No nginx/caddy.
#
# Note: the repo's api/ directory holds Vercel serverless functions used by
# the hosted Vercel deploy; the container ships ONLY the static SPA (the same
# self-contained artifact the existing GitHub Pages deploy publishes).

# ---- deps + build ----
FROM node:22-slim AS build
WORKDIR /app

# Install deps first (cached unless lockfile/manifest change)
COPY package.json package-lock.json ./
RUN npm ci

# Build the static site -> /app/dist
COPY . .
RUN npm run build

# ---- runtime (self-contained static file server) ----
FROM node:22-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
RUN npm install -g serve@14 && npm cache clean --force
COPY --from=build /app/dist ./dist
EXPOSE 3000
# --single = SPA history-API fallback (client-side routing).
CMD ["serve", "-s", "dist", "-l", "3000"]
