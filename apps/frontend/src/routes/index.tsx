import { useAppForm } from "@/hooks/demo.form";
import { api } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "react-hot-toast";
import { z } from "zod";

export const Route = createFileRoute("/")({
	component: App,
});

const schema = z.object({
	email: z
		.string()
		.trim()
		.min(1, "Почта не может быть пустой")
		.email("Неверный формат почты"),
	password: z.string().trim().min(1, "Пароль не может быть пустым"),
});

function App() {
	const navigate = useNavigate({
		from: "/",
	});

	const { mutate } = useMutation({
		mutationFn: (data: z.infer<typeof schema>) => api.auth.login.post(data),
		onSuccess: ({ data }) => {
			if (!data?.token) return toast.error("Неверный логин или пароль");

			localStorage.setItem("token", data?.token);
			toast.success("Вы успешно вошли в систему");
			navigate({ to: "/teacher" });
		},
		onError: (error) => {
			console.error(error);
			toast.error("Неверный логин или пароль");
		},
	});

	const form = useAppForm({
		defaultValues: {
			email: "",
			password: "",
		},
		validators: {
			onBlur: schema,
		},
		onSubmit: ({ value }) => {
			mutate(value);
		},
	});

	return (
		<div className="w-full h-screen bg-black flex justify-around items-center text-white">
			<div>
				<h1 className="first-letter:text-accentSecondary text-4xl font-bold">
					Московский
				</h1>
				<h1 className="first-letter:text-accentSecondary text-4xl font-bold">
					Индустриальный
				</h1>
				<h1 className="first-letter:text-accentSecondary text-4xl font-bold">
					Колледж
				</h1>
				<p className="text-textSecondary mt-2 text-2xl font-medium">
					Вход в систему
				</p>
			</div>
			<div className="bg-[#0A0A0A] text-center rounded-2xl p-6 w-1/4">
				<div className="flex flex-col gap-4">
					<h3 className="text-2xl">Авторизация</h3>
					<div className="flex flex-col gap-2 text-textSecondary">
						<form
							onSubmit={(e) => {
								e.preventDefault();
								e.stopPropagation();
								form.handleSubmit();
							}}
							className="space-y-6"
						>
							<form.AppField name="email">
								{(field) => <field.TextField label="E-mail" />}
							</form.AppField>

							<form.AppField name="password">
								{(field) => <field.TextArea label="Пароль" />}
							</form.AppField>

							<div className="flex justify-end">
								<form.AppForm>
									<form.SubscribeButton label="Войти" />
								</form.AppForm>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
