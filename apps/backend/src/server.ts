import { bearer } from "@elysiajs/bearer";
import { cors } from "@elysiajs/cors";
import { jwt } from "@elysiajs/jwt";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { oauth2 } from "elysia-oauth2";
import { config } from "./config.ts";

export const app = new Elysia()
	.use(swagger())
	.use(oauth2({}))
	.use(bearer())
	.use(cors())
	.use(jwt({ secret: config.JWT_SECRET }))
	.get("/", "Hello World");
