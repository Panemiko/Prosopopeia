import { env } from "@prosopopeia/env/server";
import { Worker } from "bullmq";
import { createReadStream, statSync } from "fs";

const filePath = "./package.json";
const fileStream = createReadStream(filePath);
const fileSize = statSync(filePath).size;

const worker = new Worker(
  "prosopopeia-queue",
  async (job) => {
    console.log(`Processing job ${job.id} with data:`, job.data);

    await fetch(job.data.uploadUrl, {
      method: "PUT",
      body: fileStream,
      duplex: "half",
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": fileSize.toString(),
      },
    });

    return { status: "completed" };
  },
  {
    connection: {
      host: env.UPSTASH_REDIS_REST_URL,
      password: env.UPSTASH_REDIS_REST_TOKEN,
      tls: {},
      port: 6379,
    },
  },
);

worker.on("completed", (job) => {
  console.log(`${job.id} completou!`);
});

worker.on("failed", (job, err) => {
  console.log(`${job?.id} falhou com a mensagem ${err.message}`);
});

console.log(`Worker iniciado.`);
