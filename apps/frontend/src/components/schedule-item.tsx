import { cn } from "@/lib/utils";

interface ScheduleItemProps {
	id: string | number;
	subject: string;
	groupName: string;
	type?: "default" | "replacement" | "cancelled" | "added";
	onClick?: () => void;
	className?: string;
}

const typeStyles: Record<NonNullable<ScheduleItemProps["type"]>, string> = {
	default: "bg-gray-100 hover:bg-gray-200",
	replacement: "bg-yellow-100 hover:bg-yellow-200",
	cancelled: "bg-red-100 text-red-700 line-through",
	added: "bg-green-100 hover:bg-green-200",
};

export function ScheduleItem({
	id,
	subject,
	groupName,
	type = "default",
	onClick,
	className,
}: ScheduleItemProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"flex items-start p-3 rounded-lg w-[310px] text-left",
				typeStyles[type],
				className,
			)}
		>
			<div className="flex-none w-8 h-8 flex items-center justify-center rounded bg-accent text-white mr-3 text-xs font-bold">
				{id}
			</div>
			<div>
				<div className="font-medium text-sm mb-0.5">
					{type === "cancelled" ? "Отменена" : subject}
				</div>
				<div className="text-xs text-muted-foreground">{groupName}</div>
			</div>
		</button>
	);
}
