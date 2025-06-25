# --- Frontend Build ---
FROM node:24-slim AS frontend-build

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates unzip openssl libssl-dev pkg-config python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@10.0.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/frontend ./apps/frontend

ARG VITE_APP_VERSION
ENV VITE_APP_VERSION=$VITE_APP_VERSION

ARG VITE_GA_MEASUREMENT_ID
ENV VITE_GA_MEASUREMENT_ID=$VITE_GA_MEASUREMENT_ID

RUN pnpm install --frozen-lockfile --filter frontend --workspace-root
RUN pnpm --filter frontend run i18n:build
RUN pnpm --filter frontend run build

# --- Backend Build ---
FROM node:24-slim AS backend-build

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates unzip openssl libssl-dev pkg-config python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@10.0.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend ./apps/backend
COPY packages/db ./packages/db

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @package/db run generate
RUN pnpm --filter @package/db run build

WORKDIR /app/apps/backend
RUN pnpm run build

# --- Final Runtime Stage ---
FROM node:24-slim AS final

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates unzip openssl libssl-dev pkg-config && \
    rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@10.0.0 --activate

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY packages/db/package.json ./packages/db/package.json
COPY packages/db/prisma ./packages/db/prisma

# Copy built backend and frontend
COPY --from=backend-build /app/apps/backend/dist ./apps/backend/dist
COPY --from=frontend-build /app/apps/frontend/dist ./apps/backend/public
COPY --from=backend-build /app/packages/db/dist ./packages/db/dist

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @package/db run generate
RUN pnpm prune --prod

ENV NODE_ENV=production

CMD ["node", "apps/backend/dist/main"]