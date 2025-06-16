import { treaty } from "@elysiajs/eden";
import { app } from "../src/server.ts";

export const api = treaty(app);