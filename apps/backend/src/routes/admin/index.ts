import { eq, ilike, sql } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { db } from "../../db/index.ts";
import {
	groupsTable,
	specialtiesTable,
	teachersTable,
	usersTable,
} from "../../db/schema.ts";
import { authPlugin } from "../../services/auth.ts";

function requireAdmin(userId: string) {
	return db
		.select({ role: usersTable.role })
		.from(usersTable)
		.where(eq(usersTable.id, userId))
		.then(([u]) => u?.role === "admin");
}

export const adminRoutes = new Elysia({ prefix: "/admin" })
	.use(authPlugin)
	// ---------------- Teachers ----------------
	.get(
		"/teachers",
		async ({ userId, status }) => {
			if (!(await requireAdmin(userId))) return status(403, "FORBIDDEN");

			const teachers = await db
				.select({
					id: teachersTable.id,
					firstName: usersTable.firstName,
					lastName: usersTable.lastName,
					patronymic: usersTable.patronymic,
				})
				.from(teachersTable)
				.innerJoin(usersTable, eq(teachersTable.userId, usersTable.id));

			return teachers.map((t) => ({
				id: t.id,
				name: `${t.lastName} ${t.firstName} ${t.patronymic ?? ""}`.trim(),
			}));
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
				403: t.Literal("FORBIDDEN"),
			},
		},
	)
	// ---------------- Groups list ----------------
	.get(
		"/groups",
		async ({ userId, query: { search = "" }, status }) => {
			if (!(await requireAdmin(userId))) return status(403, "FORBIDDEN");

			const where = search
				? ilike(groupsTable.name, sql`${`%${search}%`}`)
				: undefined;

			const q = db
				.select({
					id: groupsTable.id,
					name: groupsTable.name,
					course: groupsTable.course,
					specialty: specialtiesTable.name,
					curatorLast: usersTable.lastName,
					curatorFirst: usersTable.firstName,
					curatorPatr: usersTable.patronymic,
				})
				.from(groupsTable)
				.innerJoin(
					specialtiesTable,
					eq(groupsTable.specialtyId, specialtiesTable.id),
				)
				.innerJoin(teachersTable, eq(groupsTable.curatorId, teachersTable.id))
				.innerJoin(usersTable, eq(teachersTable.userId, usersTable.id));

			if (where) q.where(where);

			const rows = await q;

			return rows.map((r) => ({
				id: r.id,
				name: r.name,
				course: r.course,
				specialty: r.specialty,
				curator:
					`${r.curatorLast} ${r.curatorFirst} ${r.curatorPatr ?? ""}`.trim(),
			}));
		},
		{
			auth: true,
			query: t.Object({ search: t.Optional(t.String()) }),
			response: {
				200: t.Array(
					t.Object({
						id: t.String(),
						name: t.String(),
						course: t.Number(),
						specialty: t.String(),
						curator: t.String(),
					}),
				),
				403: t.Literal("FORBIDDEN"),
			},
		},
	)
	// ---------------- Create group ----------------
	.post(
		"/groups",
		async ({
			userId,
			body: { name, course, specialty, curatorId },
			status,
		}) => {
			if (!(await requireAdmin(userId))) return status(403, "FORBIDDEN");

			let [spec] = await db
				.select()
				.from(specialtiesTable)
				.where(eq(specialtiesTable.name, specialty));

			if (!spec) {
				const [inserted] = await db
					.insert(specialtiesTable)
					.values({ name: specialty, code: "", durationYears: 4 })
					.returning();
				spec = inserted;
			}

			const [group] = await db
				.insert(groupsTable)
				.values({
					name,
					course,
					durationYears: spec!.durationYears,
					specialtyId: spec!.id,
					curatorId,
				})
				.returning();

			return group!;
		},
		{
			auth: true,
			body: t.Object({
				name: t.String(),
				course: t.Number(),
				specialty: t.String(),
				curatorId: t.String(),
			}),
			response: {
				200: t.Object({ id: t.String(), name: t.String() }),
				403: t.Literal("FORBIDDEN"),
			},
		},
	)
	.get(
		"/",
		async ({ userId, status }) => {
			const [user] = await db
				.select({
					firstName: usersTable.firstName,
					lastName: usersTable.lastName,
					patronymic: usersTable.patronymic,
					role: usersTable.role,
				})
				.from(usersTable)
				.where(eq(usersTable.id, userId));

			if (!user) return status(404, "NOT_FOUND");
			if (user.role !== "admin") return status(403, "FORBIDDEN");

			return {
				firstName: user.firstName,
				lastName: user.lastName,
				patronymic: user.patronymic,
			};
		},
		{
			auth: true,
			response: {
				200: t.Object({
					firstName: t.String(),
					lastName: t.String(),
					patronymic: t.Nullable(t.String()),
				}),
				403: t.Literal("FORBIDDEN"),
				404: t.Literal("NOT_FOUND"),
			},
		},
	);
