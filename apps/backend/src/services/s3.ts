import { S3Client } from "bun";
import { config } from "../config.ts";

export const s3 = new S3Client({
	endpoint: config.S3_ENDPOINT,
	accessKeyId: config.S3_ACCESS_KEY_ID,
	secretAccessKey: config.S3_SECRET_ACCESS_KEY,
});
