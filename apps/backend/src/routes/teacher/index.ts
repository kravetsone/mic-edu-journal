import { eq } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { db } from "../../db/index.ts";
import {
	schedulesTable,
	subjectsTable,
	teachersTable,
	usersTable,
} from "../../db/schema.ts";
import { authPlugin } from "../../services/auth.ts";
import { teacherScheduleRoutes } from "./schedule.ts";

export const teacherRoutes = new Elysia({ prefix: "/teacher" })
	.use(teacherScheduleRoutes)
	.use(authPlugin)
	.get(
		"/",
		async ({ userId, status }) => {
			const [teacher] = await db
				.select({
					id: usersTable.id,
					firstName: usersTable.firstName,
					lastName: usersTable.lastName,
					patronymic: usersTable.patronymic,
					email: usersTable.email,
				})
				.from(usersTable)
				.where(eq(usersTable.id, userId));

			if (!teacher) {
				return status(404, "NOT_FOUND");
			}

			return teacher;
		},
		{
			auth: true,
			response: {
				404: t.Literal("NOT_FOUND"),
				200: t.Object({
					id: t.String(),
					firstName: t.String(),
					lastName: t.String(),
					patronymic: t.Nullable(t.String()),
					email: t.String(),
				}),
			},
		},
	)
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
