"use server";

import z from "zod";
import { privateActionClient } from ".";
import { queues } from "./utils/queues";

export const viewJobStatusAction = privateActionClient
  .inputSchema(
    z.object({
      jobId: z.string(),
    }),
  )
  .action(async ({ parsedInput, ctx }) => {
    const job = await queues.getJob(parsedInput.jobId);

    if (!job || job.data.ownerId !== ctx.user.id) {
      throw new Error("Job não existe");
    }

    return {
      jobStatus: await job.getState(),
    };
  });
