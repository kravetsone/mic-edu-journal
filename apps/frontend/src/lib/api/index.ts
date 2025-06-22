import { treaty } from "@elysiajs/eden";
import type { App } from "../../../../backend/src/server.ts";

const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
	throw new Error("VITE_API_URL is not set");
}

export const api = treaty<App>(apiUrl, {
	headers: () => ({
		Authorization: `Bearer ${localStorage.getItem("token")}`,
	}),
});
