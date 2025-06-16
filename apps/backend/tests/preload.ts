import { mock } from "bun:test";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import redis from "ioredis-mock"

console.time("PGLite init");

const pglite = new PGlite();
export const db = drizzle(pglite);

mock.module("postgres", () => ({ default: () => pglite }));

mock.module("drizzle-orm/postgres-js", () => ({ drizzle }));
mock.module('ioredis', () => ({ Redis: redis, default: redis }))

await migrate(db, {
  migrationsFolder: join(import.meta.dir, "..", "drizzle"),
});

console.timeEnd("PGLite init");