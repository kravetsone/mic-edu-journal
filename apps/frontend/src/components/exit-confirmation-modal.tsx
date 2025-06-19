import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ExitConfirmationModalProps {
	open: boolean;
	onClose: () => void;
	onConfirm?: () => void;
}

export function ExitConfirmationModal({
	open,
	onClose,
	onConfirm,
}: ExitConfirmationModalProps) {
	return (
		<AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Подтвердите выход</AlertDialogTitle>
					<AlertDialogDescription>
						Вы уверены, что хотите выйти из аккаунта?
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel onClick={onClose}>Отмена</AlertDialogCancel>
					<AlertDialogAction
						onClick={() => {
							onConfirm?.();
							onClose();
						}}
						className="bg-destructive text-white hover:bg-destructive/90"
					>
						Выйти
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
