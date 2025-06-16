import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useState } from "react";

export const Route = createFileRoute("/teacher/")({
	component: App,
});

function App() {
	const [weekId, setWeekId] = useState(dayjs().week);

	const { data } = useQuery({
		queryKey: ["teacher-schedule"],
		queryFn: () => api.teacher.schedule.week({ weekId: 1 }).get(),
	});

	return (
		<div className="w-full h-screen bg-black flex justify-around items-center text-white"></div>
	);
}
