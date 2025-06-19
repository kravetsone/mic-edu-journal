import { Header } from "@/components/Header";
import { MarkDialog } from "@/components/mark-dialog";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { Mark } from "../../../../../../../../backend/src/db/schema";

export const Route = createFileRoute(
	"/teacher/subjects/$subjectId/groups/$groupId/marks",
)({
	component: MarksPage,
});

function MarksPage() {
	const navigate = useNavigate();
	const { subjectId, groupId } = Route.useParams();
	const [date, setDate] = useState(() => dayjs());
	const [editing, setEditing] = useState<{
		studentId: string;
		studentName: string;
		date: string;
		currentMark: Mark | null;
	} | null>(null);

	const { data: teacher } = useQuery({
		queryKey: ["teacher"],
		queryFn: () => api.teacher.get(),
	});

	const { data: marksRes, isLoading } = useQuery({
		queryKey: ["marks", subjectId, groupId, date.year(), date.month()],
		queryFn: () =>
			api.teacher
				.subjects({ subjectId })
				.groups({ groupId })
				.marks({
					year: date.year(),
				})({ month: date.month() + 1 })
				.get(),
	});

	const qc = useQueryClient();

	const setMarkMutation = useMutation({
		mutationFn: (input: { studentId: string; date: string; mark: Mark }) =>
			api.teacher.subjects({ subjectId }).groups({ groupId }).marks.post(input),
		onSuccess: () => {
			qc.invalidateQueries({
				queryKey: ["marks", subjectId, groupId, date.year(), date.month()],
			});
		},
	});

	const daysRu = [
		"Январь",
		"Февраль",
		"Март",
		"Апрель",
		"Май",
		"Июнь",
		"Июль",
		"Август",
		"Сентябрь",
		"Октябрь",
		"Ноябрь",
		"Декабрь",
	];

	const prevMonth = () => setDate((d) => d.subtract(1, "month"));
	const nextMonth = () => setDate((d) => d.add(1, "month"));

	if (isLoading || !marksRes?.data || !teacher?.data)
		return (
			<div className="flex items-center justify-center h-screen">Loading…</div>
		);

	const { dates, rows } = marksRes.data;

	return (
		<div className="flex flex-col min-h-screen bg-background-content">
			<Header user={teacher?.data ?? undefined} />

			<div className="container mx-auto px-4 pt-6">
				{/* Top bar with back */}
				<button
					type="button"
					onClick={() => navigate({ to: "/teacher" })}
					className="flex items-center bg-accent text-white rounded-full px-4 py-2 mb-4 hover:bg-accent/90"
				>
					<ChevronLeft className="mr-2" /> Назад
				</button>

				<div className="flex items-center justify-center mb-4 gap-4">
					<button
						type="button"
						className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-white hover:bg-accent/90"
						onClick={prevMonth}
					>
						<ChevronLeft size={18} />
					</button>
					<span className="font-medium">
						{daysRu[date.month()]} {date.year()}
					</span>
					<button
						type="button"
						className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-white hover:bg-accent/90"
						onClick={nextMonth}
					>
						<ChevronRight size={18} />
					</button>
				</div>

				<div className="overflow-x-auto">
					<table className="min-w-full text-center border divide-y">
						<thead>
							<tr className="bg-accent text-white">
								<th className="p-2">ФИО</th>
								{dates.map((d) => (
									<th key={d} className="p-2 whitespace-nowrap">
										{dayjs(d).format("DD")}
									</th>
								))}
								<th className="p-2 whitespace-nowrap">Σ</th>
							</tr>
						</thead>
						<tbody>
							{rows.map((row, idx) => (
								<tr
									key={row.studentId}
									className={cn(idx % 2 ? "bg-gray-50" : "bg-white")}
								>
									<td className="p-2 text-left">
										{row.lastName} {row.firstName[0]}.
										{row.patronymic ? `${row.patronymic[0]}.` : ""}
									</td>
									{row.marks.map((m, i) => (
										// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
										<td
											key={`${row.studentId}-${i}`}
											className="p-2 cursor-pointer bg-violet-50 hover:bg-accent/30"
											onClick={() =>
												setEditing({
													studentId: row.studentId,
													studentName:
														`${row.lastName} ${row.firstName} ${row.patronymic ?? ""}`.trim(),
													date: dates[i],
													currentMark: m,
												})
											}
										>
											{m === "absent" ? "Н" : (m ?? "")}
										</td>
									))}
									<td className="p-2 font-semibold">
										{row.average?.toFixed(2) ?? "-"}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{editing && (
					<MarkDialog
						open={Boolean(editing)}
						studentName={editing.studentName}
						date={editing.date}
						currentMark={editing.currentMark}
						onClose={() => setEditing(null)}
						onSave={(mark) =>
							setMarkMutation.mutate({
								studentId: editing.studentId,
								date: editing.date.slice(0, 10),
								mark,
							})
						}
					/>
				)}
			</div>
		</div>
	);
}
