FROM node:24-slim

RUN corepack enable

WORKDIR /app

COPY package.json ./

RUN corepack prepare pnpm@latest --activate \
    && pnpm install

COPY . .

RUN pnpm build

CMD ["node", "dist/index.js"]
