FROM node:24-slim AS backend-build

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates unzip openssl libssl-dev pkg-config python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@10.0.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY services/notify ./services/notify
COPY packages/db ./packages/db

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @package/db run generate
RUN pnpm --filter @package/db run build

WORKDIR /app/services/notify
RUN pnpm run build

FROM node:24-slim AS final

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates unzip openssl libssl-dev pkg-config && \
    rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@10.0.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY services/notify/package.json ./services/notify/package.json
COPY packages/db/package.json ./packages/db/package.json
COPY packages/db/prisma ./packages/db/prisma

COPY --from=backend-build /app/services/notify/dist ./services/notify/dist
COPY --from=backend-build /app/packages/db/dist ./packages/db/dist

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @package/db run generate
RUN pnpm prune --prod

ENV NODE_ENV=production

CMD ["node", "services/notify/dist/main"]
