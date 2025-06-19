import { and, between, eq, isNull, sql } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { DateTime } from "luxon";
import { db } from "../../db/index.ts";
import {
	groupsTable,
	marksTable,
	schedulesTable,
	specialtiesTable,
	studentsTable,
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
				.innerJoin(
					teachersTable,
					eq(schedulesTable.teacherId, teachersTable.id),
				)
				.where(eq(teachersTable.userId, userId));

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
	)
	.get(
		"/subjects/:subjectId/groups",
		async ({ userId, params: { subjectId }, status }) => {
			const groups = await db
				.selectDistinctOn([groupsTable.id], {
					id: groupsTable.id,
					name: groupsTable.name,
					course: groupsTable.course,
					specialty: {
						id: specialtiesTable.id,
						name: specialtiesTable.name,
					},
				})
				.from(schedulesTable)
				.innerJoin(groupsTable, eq(schedulesTable.groupId, groupsTable.id))
				.innerJoin(
					subjectsTable,
					eq(schedulesTable.subjectId, subjectsTable.id),
				)
				.innerJoin(
					teachersTable,
					eq(schedulesTable.teacherId, teachersTable.id),
				)
				.innerJoin(
					specialtiesTable,
					eq(groupsTable.specialtyId, specialtiesTable.id),
				)
				.where(
					and(
						eq(subjectsTable.id, subjectId),
						eq(teachersTable.userId, userId),
					),
				);

			return groups;
		},
		{
			auth: true,
			response: {
				200: t.Array(
					t.Object({
						id: t.String(),
						name: t.String(),
						course: t.Number(),
						specialty: t.Object({
							id: t.String(),
							name: t.String(),
						}),
					}),
				),
			},
		},
	)
	.get(
		"/subjects/:subjectId/groups/:groupId/marks/:year/:month",
		async ({ userId, params: { subjectId, groupId, year, month } }) => {
			const start = DateTime.fromObject({
				year: Number(year),
				month: Number(month),
				day: 1,
			}).toISODate()!;
			const end = DateTime.fromObject({
				year: Number(year),
				month: Number(month),
				day: 1,
			})
				.endOf("month")
				.toISODate()!;

			const lessonDatesRes = await db
				.selectDistinct({ date: marksTable.date })
				.from(marksTable)
				.innerJoin(schedulesTable, eq(marksTable.scheduleId, schedulesTable.id))
				.where(
					and(
						eq(schedulesTable.groupId, groupId),
						eq(schedulesTable.subjectId, subjectId),
						between(marksTable.date, start, end),
					),
				)
				.orderBy(marksTable.date);

			const dates = lessonDatesRes.map((d) => d.date);

			const students = await db
				.select({
					id: studentsTable.id,
					firstName: usersTable.firstName,
					lastName: usersTable.lastName,
					patronymic: usersTable.patronymic,
				})
				.from(studentsTable)
				.innerJoin(usersTable, eq(studentsTable.userId, usersTable.id))
				.where(eq(studentsTable.groupId, groupId));

			const allMarks = await db
				.select()
				.from(marksTable)
				.innerJoin(schedulesTable, eq(marksTable.scheduleId, schedulesTable.id))
				.where(
					and(
						eq(schedulesTable.groupId, groupId),
						eq(schedulesTable.subjectId, subjectId),
						between(marksTable.date, start, end),
					),
				);

			const markDict: Record<string, Record<string, string>> = {};
			for (const { marks } of allMarks) {
				const m = marks as typeof marksTable.$inferSelect;
				if (!markDict[m.studentId]) markDict[m.studentId] = {};
				markDict[m.studentId]![m.date] = m.mark;
			}

			const rows = students.map((s) => {
				const marksByDate = dates.map((d) => markDict[s.id]?.[d] ?? null);
				const numeric = marksByDate
					.filter((m) => m && m !== "absent")
					.map((m) => Number(m));
				const avg = numeric.length
					? numeric.reduce((a, b) => a + b, 0) / numeric.length
					: null;

				return {
					studentId: s.id,
					firstName: s.firstName,
					lastName: s.lastName,
					patronymic: s.patronymic,
					marks: marksByDate,
					average: avg,
				};
			});

			return {
				dates,
				rows,
			};
		},
		{
			auth: true,
			params: t.Object({
				subjectId: t.String(),
				groupId: t.String(),
				year: t.Number(),
				month: t.Number(),
			}),
			response: {
				200: t.Object({
					dates: t.Array(t.String()),
					rows: t.Array(
						t.Object({
							studentId: t.String(),
							firstName: t.String(),
							lastName: t.String(),
							patronymic: t.Nullable(t.String()),
							marks: t.Array(t.Nullable(t.String())),
							average: t.Nullable(t.Number()),
						}),
					),
				}),
			},
		},
	);
