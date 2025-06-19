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

	const goChooseGroup = (subject: string) => {
		// TODO route to choose group with subject param
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
						{subjects.data.map((s: string) => (
							<SubjectChip key={s} title={s} onClick={() => goChooseGroup(s)} />
						))}
					</div>

					{/* <h2 className="text-lg font-semibold mt-10 mb-3">
						Курируемые группы
					</h2>
					<div className="flex flex-col max-w-md">
						{teacher.data.groups?.map((g: any) => (
							<GroupCard
								key={g.id}
								name={g.name}
								course={g.course}
								specialty={g.specialty}
							/>
						))}
					</div> */}
				</section>

				<aside className="w-full lg:w-[320px]">
					<div className="flex items-center justify-center mb-4">
						<button
							type="button"
							className="change-day"
							onClick={handlePrevDay}
						>
							<ChevronLeft size={24} className="text-white" />
						</button>
						<div className="mx-4 font-medium">
							{date.format("DD.MM")}{" "}
							{daysRu[date.day() === 0 ? 6 : date.day() - 1]}
						</div>
						<button
							type="button"
							className="change-day"
							onClick={handleNextDay}
						>
							<ChevronRight size={24} className="text-white" />
						</button>
					</div>

					<div className="flex flex-col items-center gap-2">
						{!schedule?.length && (
							<div className="w-[310px] bg-gray-100 rounded-lg p-3 text-center text-sm text-muted-foreground">
								На этот день пар у вас нет
							</div>
						)}
						{schedule?.map((item: any, idx: number) => (
							<ScheduleItem
								key={idx}
								id={item.id}
								subject={item.name}
								groupName={item.groupName}
								type={item.type}
							/>
						))}
					</div>
				</aside>
			</main>
		</div>
	);
}
