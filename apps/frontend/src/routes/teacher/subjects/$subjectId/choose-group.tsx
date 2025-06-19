import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/teacher/subjects/$subjectId/choose-group",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { subjectId } = Route.useParams();

	return <div>Hello! {subjectId}</div>;
}
