import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { db } from "../../db/index.ts";
import { schedulesTable, subjectsTable } from "../../db/schema.ts";
import { authPlugin } from "../../services/auth.ts";

export const teacherRoutes = new Elysia({ prefix: "/teacher" })
	.use(authPlugin)
	.get(
		"/subjects",
		async ({ userId }) => {
			const subjects = await db
				.selectDistinctOn([subjectsTable.id], {
					id: subjectsTable.id,
					name: subjectsTable.name,
				})
				.from(schedulesTable)
				.innerJoin(
					subjectsTable,
					eq(schedulesTable.subjectId, subjectsTable.id),
				)
				.where(eq(schedulesTable.teacherId, userId));

			return subjects;
		},
		{
			auth: true,
			response: {
				200: t.Array(
					t.Object({
						id: t.String(),
						name: t.String(),
					}),
				),
			},
		},
	);
