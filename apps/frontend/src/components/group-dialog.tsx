import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface TeacherOption {
	id: string;
	name: string;
}

interface GroupDialogProps {
	open: boolean;
	onClose: () => void;
	teachers: TeacherOption[];
	onCreate: (payload: {
		name: string;
		specialty: string;
		curatorId: string;
		course: number;
	}) => void;
}

export function GroupDialog({
	open,
	onClose,
	teachers,
	onCreate,
}: GroupDialogProps) {
	const [name, setName] = useState("");
	const [specialty, setSpecialty] = useState("");
	const [curatorId, setCuratorId] = useState("");
	const [course, setCourse] = useState(1);

	const handleSave = () => {
		if (!name || !specialty || !curatorId || !course) return;
		onCreate({ name, specialty, curatorId, course });
		onClose();
		setName("");
		setSpecialty("");
		setCuratorId("");
		setCourse(1);
	};

	return (
		<AlertDialog open={open} onOpenChange={(o) => !o && onClose()}>
			<AlertDialogContent className="w-[90vw] sm:max-w-lg">
				<AlertDialogHeader>
					<AlertDialogTitle>Создать новую группу</AlertDialogTitle>
				</AlertDialogHeader>

				<div className="space-y-4 py-2">
					<div>
						<label className="text-sm font-medium mb-1 inline-block">
							Название группы
						</label>
						<Input
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="ИСП-2-21"
						/>
					</div>
					<div>
						<label className="text-sm font-medium mb-1 inline-block">
							Специальность
						</label>
						<Textarea
							value={specialty}
							onChange={(e) => setSpecialty(e.target.value)}
							placeholder="Технология машиностроения"
						/>
					</div>
					<div>
						<label className="text-sm font-medium mb-1 inline-block">
							Куратор
						</label>
						<Select value={curatorId} onValueChange={setCuratorId}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Выберите куратора" />
							</SelectTrigger>
							<SelectContent>
								{teachers.map((t) => (
									<SelectItem key={t.id} value={t.id}>
										{t.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div>
						<label className="text-sm font-medium mb-1 inline-block">
							Курс
						</label>
						<Select
							value={course.toString()}
							onValueChange={(v) => setCourse(Number(v))}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Выберите курс" />
							</SelectTrigger>
							<SelectContent>
								{Array.from({ length: 4 }, (_, i) => i + 1).map((c) => (
									<SelectItem key={c} value={c.toString()}>
										{c}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				<AlertDialogFooter>
					<AlertDialogCancel onClick={onClose}>Отмена</AlertDialogCancel>
					<Button onClick={handleSave}>Создать</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
