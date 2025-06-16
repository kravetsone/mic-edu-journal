import { describe, it, expect } from "bun:test";
import { api } from "../api.ts";

describe("API - /", () => {
    it("/ - should return hello world", async () => {
        const response = await api.index.get();

        expect(response.status).toBe(200);
        expect(response.data).toBe("Hello World");
    });
});
