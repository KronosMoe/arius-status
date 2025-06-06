FROM node:24-slim

RUN apt-get update \
  && apt-get install -y iputils-ping \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable

WORKDIR /app

COPY package.json ./

RUN corepack prepare pnpm@latest --activate \
    && pnpm install

COPY . .

RUN pnpm build

CMD ["node", "dist/index.js"]
