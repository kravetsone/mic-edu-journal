import { bearer } from "@elysiajs/bearer";
import { cors } from "@elysiajs/cors";
import { jwt } from "@elysiajs/jwt";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { oauth2 } from "elysia-oauth2";
import { config } from "./config.ts";
import { adminRoutes } from "./routes/admin/index.ts";
import { authRoutes } from "./routes/auth/index.ts";
import { teacherRoutes } from "./routes/teacher/index.ts";
import { userRoutes } from "./routes/user/index.ts";

export const app = new Elysia()
	.onError(({ error, request }) => {
		console.log(error, request);
	})
	.use(swagger())
	.use(oauth2({}))
	.use(bearer())
	.use(cors())
	.use(jwt({ secret: config.JWT_SECRET }))
	.use(authRoutes)
	.use(teacherRoutes)
	.use(adminRoutes)
	.use(userRoutes);

export type App = typeof app;
