import {
	date,
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	smallint,
	text,
	time,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

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

export const schedulesTable = pgTable("schedules", {
	id: uuid("id").primaryKey().defaultRandom(),
	dayOfWeek: smallint("day_of_week").notNull(),
	startTime: time("start_time").notNull(),
	endTime: time("end_time").notNull(),
	groupId: uuid("group_id")
		.notNull()
		.references(() => groupsTable.id),
	subjectId: uuid("subject_id")
		.notNull()
		.references(() => subjectsTable.id),
	teacherId: uuid("teacher_id")
		.notNull()
		.references(() => teachersTable.id),
	classroomId: uuid("classroom_id").references(() => classroomsTable.id),

	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const classroomsTable = pgTable("classrooms", {
	id: uuid("id").primaryKey().defaultRandom(),

	number: smallint("number").notNull(),

	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const markEnum = pgEnum("mark", ["absent", "1", "2", "3", "4", "5"]);

export const marksTable = pgTable("marks", {
	id: uuid("id").primaryKey().defaultRandom(),
	studentId: uuid("student_id")
		.notNull()
		.references(() => studentsTable.id),
	scheduleId: uuid("schedule_id")
		.notNull()
		.references(() => schedulesTable.id),

	mark: markEnum("mark").notNull(),

	date: date("date").notNull(),

	createdAt: timestamp("created_at").notNull().defaultNow(),
});
