import { Header } from "@/components/Header";
import { GroupCard } from "@/components/group-card";
import { ScheduleItem } from "@/components/schedule-item";
import { SubjectChip } from "@/components/subject-chip";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight, GraduationCap } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/teacher/")({
	component: TeacherPage,
});

function TeacherPage() {
	const navigate = useNavigate();

	const { data: teacher } = useQuery({
		queryKey: ["teacher"],
		queryFn: () => api.teacher.get(),
	});

	const { data: subjects } = useQuery({
		queryKey: ["teacher-subjects"],
		queryFn: () => api.teacher.subjects.get(),
	});

	const [date, setDate] = useState(() => {
		const today = dayjs();
		return today.day() === 6 || today.day() === 0 ? today.day(1) : today;
	});

	const { data: schedule } = useQuery({
		queryKey: ["teacher-schedule", date.format("DD.MM.YYYY")],
		queryFn: () =>
			api.teacher.schedule.date({ date: date.format("DD.MM.YYYY") }).get(),
	});

	if (!teacher?.data || !subjects?.data)
		return (
			<div className="flex items-center justify-center h-screen">
				Loading...
			</div>
		);

	const handlePrevDay = () => {
		setDate((d) => d.subtract(d.day() === 1 ? 3 : 1, "day"));
	};
	const handleNextDay = () => {
		setDate((d) => d.add(d.day() === 5 ? 3 : 1, "day"));
	};

	const goChooseGroup = (subjectId: string) => {
		navigate({
			to: "/teacher/subjects/$subjectId/choose-group",
			params: {
				subjectId,
			},
		});
	};

	const daysRu = [
		"Понедельник",
		"Вторник",
		"Среда",
		"Четверг",
		"Пятница",
		"Суббота",
		"Воскресенье",
	];

	return (
		<div className="flex flex-col min-h-screen bg-background-content">
			<Header user={teacher.data} />

			<main className="container mx-auto px-4 pt-6 pb-10 flex flex-col lg:flex-row gap-10">
				<section className="flex-1">
					<div className="flex items-center gap-3">
						<GraduationCap className="w-10 h-10 text-accent" />
						<h1 className="text-2xl font-bold leading-none">
							{teacher.data.firstName} {teacher.data.lastName}{" "}
							{teacher.data.patronymic}
						</h1>
					</div>
					<p className="text-sm text-muted-foreground mb-6">
						{teacher.data.email}
					</p>

					<h2 className="text-lg font-semibold mb-3">Выберите предмет</h2>
					<div className="flex flex-wrap">
						{subjects.data.map((s) => (
							<SubjectChip
								key={s.id}
								title={s.name}
								onClick={() => goChooseGroup(s.id)}
							/>
						))}
					</div>
				</section>

				<aside className="w-full lg:w-[320px]">
					<div className="flex items-center justify-center mb-4">
						<button
							type="button"
							className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-white hover:bg-accent/90"
							onClick={handlePrevDay}
						>
							<ChevronLeft size={20} />
						</button>
						<div className="mx-4 font-medium">
							{date.format("DD.MM")}{" "}
							{daysRu[date.day() === 0 ? 6 : date.day() - 1]}
						</div>
						<button
							type="button"
							className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-white hover:bg-accent/90"
							onClick={handleNextDay}
						>
							<ChevronRight size={20} />
						</button>
					</div>

					<div className="flex flex-col items-center gap-2">
						{!schedule?.data?.length && (
							<div className="w-[310px] bg-gray-100 rounded-lg p-3 text-center text-sm text-muted-foreground">
								На этот день пар у вас нет
							</div>
						)}
						{schedule?.data?.map((item) => (
							<ScheduleItem
								key={item.id}
								id={item.id}
								subject={item.subject.name}
								groupName={item.group.name}
								type={"default"}
							/>
						))}
					</div>
				</aside>
			</main>
		</div>
	);
}
