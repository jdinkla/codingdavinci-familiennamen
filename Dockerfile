# syntax=docker/dockerfile:1

FROM node:22-slim AS base
WORKDIR /app

# ---- deps: install everything (incl. devDependencies) needed to build ----
FROM base AS deps
COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/package.json
COPY server/package.json server/package.json
COPY client/package.json client/package.json
RUN npm ci

# ---- build: compile server + client, bake the SQLite DB from committed data ----
FROM deps AS build
COPY . .
RUN npm run build -w server
RUN npm run build -w client
RUN npm run import -w server

# ---- runtime: minimal image, production dependencies only ----
FROM base AS runtime
ENV NODE_ENV=production
COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/package.json
COPY server/package.json server/package.json
COPY client/package.json client/package.json
RUN npm ci --omit=dev

COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/server/data ./server/data
COPY --from=build /app/client/dist ./client/dist
COPY healthcheck.js ./healthcheck.js

RUN groupadd --system nodejs \
  && useradd --system --gid nodejs --create-home famvis \
  && chown -R famvis:nodejs /app
USER famvis

ENV PORT=80
ENV FAMVIS_SQLITE_PATH=/app/server/data/familiennamen.db
ENV FAMVIS_CLIENT_DIST=/app/client/dist
EXPOSE 80

HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=3 \
  CMD ["node", "healthcheck.js"]

CMD ["node", "server/dist/index.js"]
