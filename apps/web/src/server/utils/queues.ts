import { env } from "@prosopopeia/env/server";
import { Queue } from "bullmq";

export const queues = new Queue("prosopopeia-queue", {
  connection: {
    host: env.UPSTASH_REDIS_REST_URL,
    password: env.UPSTASH_REDIS_REST_TOKEN,
    tls: {},
    port: 6379,
  },
});
