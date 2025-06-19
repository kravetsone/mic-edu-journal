import { Header } from "@/components/Header";
import { GroupCard } from "@/components/group-card";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
	createFileRoute,
	useNavigate,
	useParams,
} from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute(
	"/teacher/subjects/$subjectId/choose-group",
)({
	component: ChooseGroupPage,
});

function ChooseGroupPage() {
	const navigate = useNavigate();
	const { subjectId } = Route.useParams();

	const { data: teacher } = useQuery({
		queryKey: ["teacher"],
		queryFn: () => api.teacher.get(),
	});

	const { data: subjects } = useQuery({
		queryKey: ["subjects"],
		queryFn: () => api.teacher.subjects.get(),
	});

	const { data: groups } = useQuery({
		queryKey: ["subject-groups", subjectId],
		queryFn: () => api.teacher.subjects({ subjectId }).groups.get(),
		enabled: !!subjectId,
	});

	const subject = subjects?.data?.find((s) => s.id === subjectId);

	if (!subject || !teacher?.data)
		return (
			<div className="flex items-center justify-center h-screen">Loading…</div>
		);

	const backToSubjects = () => navigate({ to: "/teacher" });

	const handleSelectGroup = (group: any) => {
		// navigate({
		// 	to: "/teacher/students",
		// 	state: { group, subject: subject.data },
		// });
	};

	return (
		<div className="flex flex-col min-h-screen bg-background-content">
			<Header user={teacher?.data ?? undefined} />

			<div className="container mx-auto px-4 pt-6">
				<button
					type="button"
					onClick={backToSubjects}
					className="flex items-center bg-accent text-white rounded-full px-5 py-2 mb-6 hover:bg-accent/90"
				>
					<ChevronLeft className="mr-2" size={20} />
					{subject.name}
				</button>

				<div className="flex flex-wrap gap-3">
					{groups?.data?.map((g) => (
						<GroupCard
							key={g.id}
							name={g.name}
							course={g.course}
							specialty={g.specialty.name}
							onClick={() => handleSelectGroup(g)}
							className="bg-[#0f0324] text-white hover:opacity-90 hover:text-black"
						/>
					))}
					{!groups?.data?.length && (
						<p className="text-muted-foreground">
							Групп для этого предмета не найдено
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
