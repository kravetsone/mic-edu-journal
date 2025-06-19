import { Elysia, t } from "elysia";
import { authPlugin } from "../../services/auth.ts";
import { getTeacherDateSchedule } from "../../services/schedule.ts";

export const teacherScheduleRoutes = new Elysia({ prefix: "/schedule" })
	.use(authPlugin)
	.get(
		"/date/:date",
		async ({ userId, params: { date }, status }) => {
			const schedule = await getTeacherDateSchedule(userId, date);

			if (!schedule?.length) {
				return status(404, "NOT_FOUND");
			}

			return schedule;
		},
		{
			auth: true,
			params: t.Object({
				date: t.String(),
			}),
			response: {
				404: t.Literal("NOT_FOUND"),
				200: t.Array(
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
			},
		},
	);
