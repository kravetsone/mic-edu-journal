import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { config } from "../config.ts";

const client = postgres(config.DATABASE_URL);
export const db = drizzle({
	client,
	casing: "snake_case",
});
