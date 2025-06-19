import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/teacher/subjects/$subjectId/groups/$groupId/marks",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { subjectId, groupId } = Route.useParams();

	const { data: marks } = useQuery({
		queryKey: ["marks", subjectId, groupId],
		queryFn: () =>
			api.teacher
				.subjects({ subjectId })
				.groups({ groupId })
				.marks({
					year: 2025,
				})({ month: 6 })
				.get(),
	});

	return <div>Hello "/teacher/subjects/$subjectId/groups/$groupId/marks"!</div>;
}
