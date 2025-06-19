import { cn } from "@/lib/utils";

interface GroupCardProps {
	name: string;
	course: number;
	specialty: string;
	onClick?: () => void;
	className?: string;
}

export function GroupCard({
	name,
	course,
	specialty,
	onClick,
	className,
}: GroupCardProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"flex items-center p-3 border rounded-lg shadow-sm bg-white hover:bg-accent/10 transition-colors mb-2",
				className,
			)}
		>
			<div className="flex flex-col items-center justify-center w-10 h-10 rounded-full bg-accent text-white mr-4">
				<span className="text-sm font-bold leading-none">{course}</span>
				<span className="text-[10px] leading-none">курс</span>
			</div>
			<div className="text-left">
				<div className="font-medium text-sm">{name}</div>
				<div className="text-xs text-muted-foreground">{specialty}</div>
			</div>
		</button>
	);
}
