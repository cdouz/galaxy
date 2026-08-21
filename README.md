# Galaxy

A note-taking web app: Markdown notes linked to each other with `[[wikilinks]]`,
with backlinks and search.

- **Backend** — Spring Boot 4, Spring Security (JWT in an httpOnly cookie), JPA,
  Flyway, MySQL 8
- **Frontend** — React 19, Vite, TypeScript, Tailwind, shadcn/ui

## Requirements

- JDK 17+
- Node 20+
- Docker (MySQL, phpMyAdmin, and the test suite)

## Setup

```bash
cp .env.example .env          # then edit it, see below
docker compose up -d          # MySQL on 3306, phpMyAdmin on 8081

cd frontend && npm install && cd ..
```

`.env` feeds both docker-compose and the backend, which reads `DB_USERNAME`,
`DB_PASSWORD` and `JWT_SECRET` from the environment. Generate a real secret:

```bash
openssl rand -base64 48
```

`frontend/.env` holds the API URL; `frontend/.env.example` has the dev value.

## Running

```bash
npm run bdev    # backend, dev profile, http://localhost:8088
npm run fdev    # frontend, http://localhost:5173
```

The dev profile is what `frontend/.env` points at, and it issues non-secure
cookies so plain http works locally. The default profile listens on 8080 with
production cookie settings.

Flyway applies `backend/src/main/resources/db/migration` at startup and
`ddl-auto=validate` checks the entities against the result, so the schema is
never generated from the entities.

## Tests

```bash
cd backend && ./mvnw test     # needs Docker: Testcontainers starts its own MySQL
cd frontend && npm run lint && npx tsc -b
```

The suite never touches the database from docker-compose and reads no `.env`.
