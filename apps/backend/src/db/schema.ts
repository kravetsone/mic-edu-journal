import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom(),

	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	patronymic: text("patronymic"),

	email: text("email").notNull(),
	password: text("password").notNull(),

	createdAt: timestamp("created_at").notNull().defaultNow(),
});
