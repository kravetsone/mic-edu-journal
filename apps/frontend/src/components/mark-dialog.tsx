import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import type { Mark } from "../../../backend/src/db/schema";

interface MarkDialogProps {
	open: boolean;
	studentName: string;
	date: string;
	currentMark: Mark | null;
	onSave: (value: Mark) => void;
	onClose: () => void;
}

export function MarkDialog({
	open,
	studentName,
	date,
	currentMark,
	onSave,
	onClose,
}: MarkDialogProps) {
	const [value, setValue] = useState<Mark>(currentMark ?? "absent");
	const submit = () => {
		if (!value) return;
		onSave(value);
		onClose();
	};
	return (
		<AlertDialog open={open} onOpenChange={(o) => !o && onClose()}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{studentName} — {new Date(date).toLocaleDateString()}
					</AlertDialogTitle>
				</AlertDialogHeader>
				<div className="flex flex-col gap-4 py-2">
					<Label htmlFor="mark">Оценка</Label>
					<Select value={value} onValueChange={(v) => setValue(v as Mark)}>
						<SelectTrigger id="mark" className="min-w-[120px]">
							<SelectValue placeholder="-" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="absent">Н</SelectItem>
							<SelectItem value="1">1</SelectItem>
							<SelectItem value="2">2</SelectItem>
							<SelectItem value="3">3</SelectItem>
							<SelectItem value="4">4</SelectItem>
							<SelectItem value="5">5</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={onClose}>Отмена</AlertDialogCancel>
					<Button onClick={submit}>Сохранить</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
