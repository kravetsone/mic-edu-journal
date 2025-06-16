import env from "env-var";

export const config = {
	NODE_ENV: env
		.get("NODE_ENV")
		.default("development")
		.asEnum(["production", "test", "development"]),

	PORT: env.get("PORT").default(3000).asPortNumber(),
	API_URL: env
		.get("API_URL")
		.default(`https://${env.get("PUBLIC_DOMAIN").asString()}`)
		.asString(),
	DATABASE_URL: env.get("DATABASE_URL").required().asString(),
	REDIS_HOST: env.get("REDIS_HOST").default("localhost").asString(),
	POSTHOG_API_KEY: env
		.get("POSTHOG_API_KEY")
		.default("it's a secret")
		.asString(),
	POSTHOG_HOST: env.get("POSTHOG_HOST").default("localhost").asString(),
	S3_ENDPOINT: env.get("S3_ENDPOINT").default("localhost").asString(),
	S3_ACCESS_KEY_ID: env.get("S3_ACCESS_KEY_ID").default("minio").asString(),
	S3_SECRET_ACCESS_KEY: env
		.get("S3_SECRET_ACCESS_KEY")
		.default("minio")
		.asString(),
	LOCK_STORE: env
		.get("LOCK_STORE")
		.default("memory")
		.asEnum(["memory", "redis"]),
	JWT_SECRET: env.get("JWT_SECRET").required().asString(),
};
