import { treaty } from "@elysiajs/eden";
import type { App } from "../../../../backend/src/server.ts";

export const api = treaty<App>("http://localhost:3000", {
	headers: () => ({
		Authorization: `Bearer ${localStorage.getItem("token")}`,
	}),
});

