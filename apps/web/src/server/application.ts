"use server";

import { db } from "@prosopopeia/db";
import { application } from "@prosopopeia/db/schema/index";
import { generateText } from "ai";
import z from "zod";
import { privateActionClient } from ".";
import { google } from "./utils/ai";
import { generateLatexSystemPrompt } from "./utils/generate-latex-system-prompt";

export const addNewApplicationAction = privateActionClient
  .inputSchema(z.object({ jobDescription: z.string().trim().min(1) }))
  .action(async ({ parsedInput, ctx }) => {
    const completeUserProfile = {
      name: ctx.user.name,
      email: ctx.user.email,
      ...JSON.parse(ctx.user.profileJson),
    };

    const completeUserProfileAsString = JSON.stringify(
      completeUserProfile,
      undefined,
      2,
    );

    const result = await generateText({
      model: google("gemini-2.5-flash"),
      messages: [
        {
          content: `Informações do candidato:\n\n${completeUserProfileAsString}`,
          role: "user",
        },
        {
          content: `Descrição da vaga:\n\n${parsedInput.jobDescription}`,
          role: "user",
        },
      ],
      system: generateLatexSystemPrompt,
    });

    const newApplication = await db
      .insert(application)
      .values({
        description: parsedInput.jobDescription,
        userId: ctx.user.id,
        latexContent: result.text,
      })
      .returning();

    if (!newApplication[0].id) {
      throw new Error("Não foi possível criar o item");
    }

    return {
      applicationId: newApplication[0].id,
    };
  });
