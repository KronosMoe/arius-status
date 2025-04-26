<p align="center"><img src="./docs/Logo.svg" width="120" alt="Nest Logo" />
</p>

<p align="center">An uptime status platform for your private applications across networks</p>

## Pre-requisites

- NodeJS 20+
- pnpm
- PostgreSQL

## Setup 

```bash
pnpm install
```

create a `.env` file in `backend/` directory

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/arius?schema=public"
SESSION_SECRET=""
```

In `agent/src/index.ts` directory, replace `SERVER_URL` and `AGENT_TOKEN` (after you created in postgresql database)

apply database migrations to your database and generate prisma client

```bash
cd backend && pnpx prisma db push && pnpx prisma generate
```

## Development

### Run the backend

```bash
cd backend && pnpm run start:dev
```

### Run the frontend

```bash
cd frontend && pnpm run dev
```

### Run the agent service

```bash
cd agent && pnpm run dev
```
