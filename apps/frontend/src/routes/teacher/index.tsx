import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/teacher/")({
	component: App,
});

function App() {
    const { data } = useQuery({
        queryKey: ["teacher-schedule"],
        queryFn: () => api.teacher.schedule.get("/week/1"),
    });

	return (
		<div className="w-full h-screen bg-black flex justify-around items-center text-white"></div>
	);
}
