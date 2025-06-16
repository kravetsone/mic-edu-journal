import { integer, pgEnum, pgTable, primaryKey, smallint, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["student", "teacher"]);

export const usersTable = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom(),

	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	patronymic: text("patronymic"),

	email: text("email").notNull().unique(),
	password: text("password").notNull(),

	role: userRoleEnum("role").notNull(),

	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const studentsTable = pgTable("students", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.notNull()
		.references(() => usersTable.id, { onDelete: "cascade" }),

	groupId: uuid("group_id")
		.notNull()
		.references(() => groupsTable.id, { onDelete: "cascade" }),

	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const teachersTable = pgTable("teachers", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.notNull()
		.references(() => usersTable.id, { onDelete: "cascade" }),

	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const groupsTable = pgTable("groups", {
	id: uuid("id").primaryKey().defaultRandom(),

	curatorId: uuid("curator_id")
		.notNull()
		.references(() => teachersTable.id, { onDelete: "cascade" }),

	name: text("name").notNull().unique(),

	course: smallint("course").notNull(),
    durationYears: integer("duration_years").notNull(),

	specialtyId: uuid("specialty_id")
		.notNull()
		.references(() => specialtiesTable.id, { onDelete: "cascade" }),

	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const specialtiesTable = pgTable("specialties", {
	id: uuid("id").primaryKey().defaultRandom(),

    code: text("code").notNull().unique(),
	name: text("name").notNull().unique(),
    durationYears: integer("duration_years").notNull(),

	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const subjectsTable = pgTable("subjects", {
	id: uuid("id").primaryKey().defaultRandom(),

	name: text("name").notNull().unique(),

	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const subjectTeacherGroupsTable = pgTable("subject_teacher_groups", {
	subjectId: uuid("subject_id")
		.notNull()
		.references(() => subjectsTable.id, { onDelete: "cascade" }),

	teacherId: uuid("teacher_id")
		.notNull()
		.references(() => teachersTable.id, { onDelete: "cascade" }),

	groupId: uuid("group_id")
		.notNull()
		.references(() => groupsTable.id, { onDelete: "cascade" }),

	createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	(table) => [
		primaryKey({ columns: [table.subjectId, table.teacherId, table.groupId] }),
	],
);
