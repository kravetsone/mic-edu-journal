import { Link, useNavigate } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { useState } from "react";
import { ExitConfirmationModal } from "./exit-confirmation-modal";

export function Header({
	user,
}: {
	user: {
		firstName: string;
		lastName: string;
		patronymic: string | null;
	};
}) {
	const navigate = useNavigate();

	const [isShown, setIsShown] = useState(true);
	const [exitConfirmationModalOpen, setExitConfirmationModalOpen] =
		useState(false);

	const shortName = (
		firstName: string,
		lastName: string,
		patronymic: string,
	) => {
		const name = [firstName, lastName, patronymic]
			.filter(Boolean)
			.map((w, i) => (i === 0 ? w : `${w[0]}.`))
			.join(" ");

		return name;
	};

	return (
		<>
			<ExitConfirmationModal
				open={exitConfirmationModalOpen}
				onClose={() => setExitConfirmationModalOpen(false)}
				onConfirm={() => {
					localStorage.removeItem("token");
					navigate({ to: "/" });
				}}
			/>

			<header
				className={`fixed top-0 w-screen h-[70px] bg-[color:var(--accent)] flex items-center justify-between transition-transform duration-300 z-[1000] ${
					isShown ? "translate-y-0" : "-translate-y-full"
				}`}
			>
				<div className="ml-5 text-[25px] font-extrabold text-white">МИК</div>

				<div className="mr-5 flex items-center">
					<button
						type="button"
						className="flex items-center text-sm text-white hover:font-extrabold"
					>
						<Info size={17} />
						<span className="mx-[5px]">
							{shortName(
								user.firstName ?? "",
								user.lastName ?? "",
								user.patronymic ?? "",
							)}
						</span>
						<span className="mx-5 h-5 w-px bg-white/60" />
					</button>

					<button
						type="button"
						className="text-white hover:text-red-400 hover:font-extrabold"
						onClick={() => setExitConfirmationModalOpen(true)}
					>
						Выйти
					</button>
				</div>
			</header>

			<div className="h-[70px]" />
		</>
	);
}
