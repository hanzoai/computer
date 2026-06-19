# syntax=docker/dockerfile:1
# hanzo.computer (Vite + React 19 SPA) — served via the canonical hanzoai/spa
# static server (one way for static SPAs). No node runtime in the final stage.
# The repo api/ dir holds Vercel serverless funcs (hosted deploy only); the
# container ships ONLY the static SPA bundle.
FROM node:22-slim AS build
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
FROM ghcr.io/hanzoai/spa
COPY --from=build /app/dist /public
