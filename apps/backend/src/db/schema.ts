import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

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

	createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const teachersTable = pgTable("teachers", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.notNull()
		.references(() => usersTable.id, { onDelete: "cascade" }),

	createdAt: timestamp("created_at").notNull().defaultNow(),
});
