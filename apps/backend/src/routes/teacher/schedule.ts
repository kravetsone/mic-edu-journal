import { Elysia, t } from "elysia";
import { authPlugin } from "../../services/auth";
import { getTeacherWeekSchedule } from "../../services/schedule";

export const teacherScheduleRoutes = new Elysia({ prefix: "/teacher/schedule" })
	.use(authPlugin)
	.get(
		"/week/:weekId",
		async ({ userId, params: { weekId }, status }) => {
			const schedule = await getTeacherWeekSchedule(userId, weekId);

			if (!schedule) {
				return status(404, "NOT_FOUND");
			}

			return schedule;
		},
		{
			auth: true,
			params: t.Object({
				weekId: t.Number(),
			}),
			response: {
				404: t.Literal("NOT_FOUND"),
				200: t.Object({
					weekStart: t.String(),
					weekEnd: t.String(),
					schedule: t.Array(
						t.Object({
							id: t.String(),
							dayOfWeek: t.Number(),
							startTime: t.String(),
							endTime: t.String(),
							subject: t.Object({
								id: t.String(),
								name: t.String(),
							}),
							group: t.Object({
								id: t.String(),
								name: t.String(),
								course: t.Number(),
							}),
							classroom: t.Union([
								t.Object({
									id: t.String(),
									number: t.Number(),
								}),
								t.Null(),
							]),
						}),
					),
				}),
			},
		},
	);
