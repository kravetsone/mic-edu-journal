import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { db } from "../../db";
import { usersTable } from "../../db/schema";
import { authPlugin } from "../../services/auth";

export const authRoutes = new Elysia({
	prefix: "/auth",
	tags: ["auth"],
})
	.use(authPlugin)
	.post(
		"/login",
		async ({ body: { email, password }, status, jwt }) => {
			const [user] = await db
				.select()
				.from(usersTable)
				.where(eq(usersTable.email, email));
			if (!user) return status(401, "UNAUTHORIZED");

			const isPasswordValid = await Bun.password.verify(
				password,
				user.password,
			);
			if (!isPasswordValid) return status(401, "UNAUTHORIZED");

			const token = await jwt.sign({
				id: user.id,
			});

			return {
				token,
				role: user.role,
			};
		},
		{
			body: t.Object({
				email: t.String(),
				password: t.String(),
			}),
			response: {
				200: t.Object({
					token: t.String(),
					role: t.Union([t.Literal("teacher"), t.Literal("student")]),
				}),
				401: t.Literal("UNAUTHORIZED"),
			},
		},
	);
