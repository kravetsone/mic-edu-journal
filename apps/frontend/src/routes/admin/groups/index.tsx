import { Header } from "@/components/Header";
import { GroupCard } from "@/components/group-card";
import { GroupDialog } from "@/components/group-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin/groups/")({
	component: GroupsPage,
});

function GroupsPage() {
	const navigate = useNavigate();
	const qc = useQueryClient();
	const [search, setSearch] = useState("");
	const [dialogOpen, setDialogOpen] = useState(false);

	const { data: userRes } = useQuery({
		queryKey: ["admin-me"],
		queryFn: () => api.admin.get(),
	});

	const { data: teachers } = useQuery({
		queryKey: ["teachers"],
		queryFn: () => api.admin.teachers.get(),
	});

	const { data: groups, isLoading } = useQuery({
		queryKey: ["groups", search],
		queryFn: () =>
			api.admin.groups.get({
				query: { search: search.trim() ? search.trim() : undefined },
			}),
	});

	const createMutation = useMutation({
		mutationFn: (payload: {
			name: string;
			specialty: string;
			curatorId: string;
			course: number;
		}) => api.admin.groups.post(payload),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["groups"] });
		},
	});


	return (
		<div className="flex flex-col min-h-screen bg-background-content">
			<Header
				user={
					userRes?.data ?? {
						firstName: "",
						lastName: "Admin",
						patronymic: null,
					}
				}
			/>
			<div className="container mx-auto p-4">
				<div className="flex items-center gap-4 mb-4">
					<Input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Введите название группы"
						className="max-w-sm"
					/>
					<Button onClick={() => setDialogOpen(true)}>
						<Plus className="mr-2" size={16} /> Новая группа
					</Button>
				</div>
				<div className="flex gap-4 flex-wrap">
					{groups?.data?.map((g) => (
						<GroupCard
							key={g.id}
							name={g.name}
							course={g.course}
							specialty={g.specialty}
							onClick={() =>
								navigate({ to: "/admin/groups/$id", params: { id: g.id } })
							}
						/>
					))}
				</div>
			</div>
			<GroupDialog
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
				teachers={(teachers?.data ?? []).map((t) => ({
					id: t.id,
					name: t.name,
				}))}
				onCreate={(payload) => createMutation.mutate(payload)}
			/>
		</div>
	);
}
