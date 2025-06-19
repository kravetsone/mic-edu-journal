import { and, eq } from "drizzle-orm";
import { DateTime } from "luxon";
import { db } from "../db/index.ts";
import {
	classroomsTable,
	groupsTable,
	schedulesTable,
	subjectsTable,
	teachersTable,
	usersTable,
} from "../db/schema.ts";
import type {
	WeekScheduleItem,
	WeekScheduleResponse,
} from "../types/schedule.ts";

export const getTeacherDateSchedule = async (
	userId: string,
	dateRaw: string,
): Promise<WeekScheduleItem[] | null> => {
	const date = DateTime.fromFormat(dateRaw, "dd.MM.yyyy", {
		zone: "Europe/Moscow",
	});

	const scheduleItems = await db
		.select({
			id: schedulesTable.id,
			dayOfWeek: schedulesTable.dayOfWeek,
			startTime: schedulesTable.startTime,
			endTime: schedulesTable.endTime,
			subject: {
				id: subjectsTable.id,
				name: subjectsTable.name,
			},
			group: {
				id: groupsTable.id,
				name: groupsTable.name,
				course: groupsTable.course,
			},
			classroom: {
				id: classroomsTable.id,
				number: classroomsTable.number,
			},
		})
		.from(schedulesTable)
		.innerJoin(subjectsTable, eq(schedulesTable.subjectId, subjectsTable.id))
		.innerJoin(groupsTable, eq(schedulesTable.groupId, groupsTable.id))
		.innerJoin(
			classroomsTable,
			eq(schedulesTable.classroomId, classroomsTable.id),
		)
		.innerJoin(teachersTable, eq(schedulesTable.teacherId, teachersTable.id))
		.where(
			and(
				eq(teachersTable.userId, userId),
				eq(schedulesTable.dayOfWeek, date.weekday),
			),
		)
		.orderBy(schedulesTable.dayOfWeek, schedulesTable.startTime);

	return scheduleItems;
};

export const getTeacherWeekSchedule = async (
	userId: string,
	weekId: number,
): Promise<WeekScheduleResponse | null> => {
	const [teacher] = await db
		.select({
			teacherId: teachersTable.id,
			firstName: usersTable.firstName,
			lastName: usersTable.lastName,
			patronymic: usersTable.patronymic,
		})
		.from(teachersTable)
		.innerJoin(usersTable, eq(teachersTable.userId, usersTable.id))
		.where(eq(usersTable.id, userId))
		.limit(1);

	if (!teacher) {
		return null;
	}

	const now = DateTime.now().setZone("Europe/Moscow");
	const weekStart = now.set({ weekNumber: weekId }).startOf("week");
	const weekEnd = weekStart.endOf("week");

	const scheduleItems = await db
		.select({
			id: schedulesTable.id,
			dayOfWeek: schedulesTable.dayOfWeek,
			startTime: schedulesTable.startTime,
			endTime: schedulesTable.endTime,
			subject: {
				id: subjectsTable.id,
				name: subjectsTable.name,
			},
			group: {
				id: groupsTable.id,
				name: groupsTable.name,
				course: groupsTable.course,
			},
			classroom: {
				id: classroomsTable.id,
				number: classroomsTable.number,
			},
		})
		.from(schedulesTable)
		.innerJoin(subjectsTable, eq(schedulesTable.subjectId, subjectsTable.id))
		.innerJoin(groupsTable, eq(schedulesTable.groupId, groupsTable.id))
		.leftJoin(
			classroomsTable,
			eq(schedulesTable.classroomId, classroomsTable.id),
		)
		.where(eq(schedulesTable.teacherId, teacher.teacherId))
		.orderBy(schedulesTable.dayOfWeek, schedulesTable.startTime);

	return {
		weekStart: weekStart.toISODate()!,
		weekEnd: weekEnd.toISODate()!,
		schedule: scheduleItems,
	};
};
