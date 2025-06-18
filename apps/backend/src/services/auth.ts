import { bearer } from "@elysiajs/bearer";
import { jwt } from "@elysiajs/jwt";
import { Elysia, t } from "elysia";
import { config } from "../config.ts";

export const authPlugin = new Elysia()
	.use(bearer())
	.use(
		jwt({
			secret: config.JWT_SECRET,
			schema: t.Object({
				id: t.String(),
			}),
		}),
	)
	.macro({
		auth: {
			guard: {
				schema: "standalone",
				headers: t.Object({
					Authorization: t.String(),
				}),
				response: {
					401: t.Literal("UNAUTHORIZED"),
				},
			},
			resolve: async ({ jwt, bearer, status }) => {
				const token = bearer?.token;
				if (!token) return status(401, "UNAUTHORIZED");

				const payload = await jwt.verify(token);

				if (!payload) return status(401, "UNAUTHORIZED");

				return {
					userId: payload.id,
				};
			},
		},
	});
