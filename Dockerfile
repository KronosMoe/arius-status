# --- Frontend Build ---
FROM node:24-slim AS frontend-build

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates unzip openssl libssl-dev pkg-config python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@10.0.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend ./frontend

ARG VITE_APP_VERSION
ENV VITE_APP_VERSION=$VITE_APP_VERSION

RUN pnpm install --frozen-lockfile --filter frontend --workspace-root
RUN pnpm --filter frontend run build

# --- Backend Build ---
FROM node:24-slim AS backend-build

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates unzip openssl libssl-dev pkg-config python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@10.0.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY backend ./backend

RUN pnpm install --frozen-lockfile --filter backend --workspace-root

WORKDIR /app/backend
RUN pnpm run prisma:generate && pnpm run build

# --- Final Runtime Stage ---
FROM node:24-slim AS final

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates unzip openssl libssl-dev pkg-config && \
    rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@10.0.0 --activate

# Copy root package files for pnpm workspace context
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy backend runtime essentials
COPY backend/package.json ./backend/package.json
COPY --from=backend-build /app/backend/dist ./backend/dist
COPY --from=backend-build /app/backend/prisma ./backend/prisma

# Copy the correct node_modules from backend-build stage
COPY --from=backend-build /app/backend/node_modules ./backend/node_modules
COPY --from=backend-build /app/node_modules ./node_modules

# Copy built frontend
COPY --from=frontend-build /app/frontend/dist ./backend/public

# Install production dependencies in final stage
RUN pnpm install --frozen-lockfile --filter backend --workspace-root

ENV NODE_ENV=production

# Start the server
CMD ["node", "backend/dist/main"]