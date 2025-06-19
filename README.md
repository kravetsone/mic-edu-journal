# mic-edu-journal

Проект «Электронный журнал» созданный в рамках дипломной работы.

### Stack

-   Web framework - [ElysiaJS](https://elysiajs.com/)
-   Linter - [Biome](https://biomejs.dev/)
-   ORM - [Drizzle](https://orm.drizzle.team/) ([PostgreSQL](https://www.postgresql.org/)) (mocked with [PGLite](https://pglite.dev/) in [tests](tree/main/tests))
-   Elysia plugins - [CORS](https://elysiajs.com/plugins/cors.html), [Swagger](https://elysiajs.com/plugins/swagger.html), [JWT](https://elysiajs.com/plugins/jwt.html), [Oauth 2.0](https://github.com/kravetsone/elysia-oauth2), [Bearer](https://elysiajs.com/plugins/bearer.html)
-   Others tools - [Docker](https://www.docker.com/), [Redis](https://redis.io/) + [ioredis](https://github.com/redis/ioredis) + [ioredis-mock](https://www.npmjs.com/package/ioredis-mock) in tests, [Minio](https://github.com/minio/minio), [Posthog](https://posthog.com/docs/libraries/node), [Jobify](https://github.com/kravetsone/jobify)

## Development

Start development services (DB, Redis etc):

```bash
docker compose -f docker-compose.dev.yml up
```

Start the project:

```bash
bun dev
```

## Migrations

Push schema to Database:

```bash
bunx drizzle-kit push
```

Generate new migration:

```bash
bunx drizzle-kit generate
```

Apply migrations:

```bash
bunx drizzle-kit migrate
```

## Tests

Tests are written with [Bun](https://bun.sh/):test.

Mocks:

-   Postgres usage is mocked with [PGLite](https://pglite.dev/)
-   Redis usage is mocked with [ioredis-mock](https://www.npmjs.com/package/ioredis-mock)

```bash
bun test
```

## Production

Run project in `production` mode:

```bash
docker compose up -d
```
