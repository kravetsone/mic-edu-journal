import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { db } from "../../db/index.ts";
import { usersTable } from "../../db/schema.ts";
import { authPlugin } from "../../services/auth.ts";

export const userRoutes = new Elysia({ prefix: "/user", tags: ["user"] })
	.use(authPlugin)
	.get(
		"/",
		async ({ userId, status }) => {
			const [user] = await db
				.select({
					role: usersTable.role,
				})
				.from(usersTable)
				.where(eq(usersTable.id, userId));

			if (!user) return status(401, "Unauthorized");
			return user;
		},
		{
			auth: true,
			response: {
				401: t.Literal("Unauthorized"),
				200: t.Object({
					role: t.Union([
						t.Literal("student"),
						t.Literal("teacher"),
						t.Literal("admin"),
					]),
				}),
			},
		},
	);
