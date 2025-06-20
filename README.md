# flight-alerts-backend

Backend built with **NestJS + TypeScript** for a flight alerts system.

## Technologies Used

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL (via Docker)
- Jest (testing)
- ESLint (code quality)

## How to Run Locally

### Prerequisites

- Node.js 23.x+
- Docker and Docker Compose
- Yarn or npm

### Steps

1. Clone the repository:

```bash
git clone https://github.com/siegdev/flight-alerts-backend.git

cd flight-alerts-backend
```

2. Install dependencies

```
yarn install
```

3. Configure the database in the .env file (example):

```
DATABASE_URL="postgresql://dev:dev@localhost:5432/flight_alerts"
```

4. Start the database with Docker:

```
docker-compose up -d
```

5. Run migrations and generate Prisma client:

```
npx prisma migrate dev --name init
npx prisma generate
```

6. Start the server in development mode:

```
yarn start:dev
```

## Project Structure

- `src/` — source code
- `src/app.module.ts` — main module
- `src/user/` — user module (example)
- `prisma/` — database schema and migrations

---

## Next Steps

- Implement magic link authentication (email MFA code)
- Create flight alerts module
- Develop Next.js frontend consuming this API
- Set up linting, testing, and CI/CD
