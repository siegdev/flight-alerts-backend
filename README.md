# ✈️ Flight Alerts Backend

Backend API built with **NestJS + TypeScript** for managing flight price alerts.

> Track cheap flights and get notified — powered by PostgreSQL and Prisma.

---

## 📚 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Authentication](#api-authentication)
- [Next Steps](#next-steps)

---

## Features

- Magic link authentication (MFA via email)
- JWT-based sessions stored in **secure HTTP-only cookies**
- Auth-protected routes with `@UseGuards`
- Prisma ORM with PostgreSQL (Docker)
- Request validation using DTOs
- Full CRUD for flight alerts
- Designed for frontend integration via REST

---

## Tech Stack

| Layer     | Tech                    |
| --------- | ----------------------- |
| Language  | TypeScript              |
| Framework | NestJS                  |
| ORM       | Prisma                  |
| Database  | PostgreSQL (Dockerized) |
| Auth      | JWT (via cookie)        |
| Linting   | ESLint                  |
| Testing   | Jest                    |

---

## Project Structure

```txt
flight-alerts-backend/
│
├── src/
│   ├── auth/         # Login, JWT, code validation
│   ├── alerts/       # CRUD for flight alerts
│   ├── prisma/       # PrismaService + DB access
│   └── app.module.ts # Main application module
│
├── prisma/
│   ├── schema.prisma # Database models
│   └── migrations/
│
├── docker-compose.yml
└── .env
```

## Getting Started

### 1. Prerequisites

- Node.js **v23.x**
- Docker + Docker Compose
- Yarn or npm

### 2. Clone and install

```bash
git clone https://github.com/siegdev/flight-alerts-backend.git
cd flight-alerts-backend
yarn install
```

### 3. Configure `.env`

Create a `.env` file in the project root with the following content:

```env
DATABASE_URL="postgresql://dev:dev@localhost:5432/flight_alerts"
JWT_SECRET="supersecret"
```

### 4. Start DB and run migrations

```bash
docker-compose up -d
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Start the server

```bash
yarn start:dev
```

## API Authentication

Auth is based on **email MFA (magic code)**.

After verifying the code, a **JWT** is sent via **HTTP-only cookie**.

Authenticated routes extract the token from the cookie automatically.

You can test protected routes using Postman or any frontend client.

---

## Next Steps

- [ ] Integrate with SendGrid or Resend to email the magic code
- [ ] Deploy backend to Heroku / AWS / Render
- [ ] Build frontend with Next.js (consuming this API)
- [ ] Add CI (GitHub Actions) and E2E tests
- [ ] Add rate limiting and basic analytics

---

## License

MIT — do whatever you want 😄
