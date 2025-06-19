import { cn } from "@/lib/utils";

interface SubjectChipProps {
	title: string;
	onClick?: () => void;
	className?: string;
}

export function SubjectChip({ title, onClick, className }: SubjectChipProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"bg-[color:var(--subject-background)] text-white px-4 py-2 rounded-lg text-sm font-medium mr-2 mb-2 hover:opacity-90",
				className,
			)}
		>
			{title}
		</button>
	);
}
