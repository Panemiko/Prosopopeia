"use server";

import { db } from "@prosopopeia/db";
import { application } from "@prosopopeia/db/schema/index";
import { generateText, tool } from "ai";
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

    let applicationMeta = {
      name: undefined as string | undefined,
      company: undefined as string | undefined,
    };

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
      tools: {
        edit_job_info: tool({
          description:
            "Extrai e registra o nome da empresa e o cargo da vaga com base na descrição fornecida. Esta ferramenta deve ser chamada para processar os metadados da vaga.",
          inputSchema: z.object({
            company: z
              .string()
              .describe("O nome da empresa que postou a vaga")
              .optional(),
            name: z
              .string()
              .describe(
                "O cargo requerido para vaga (Desenvolvedor Full-Stack, Designer UX, etc)",
              )
              .optional(),
          }),
          execute: async ({ company, name }) => {
            console.log("> Executando tool");

            applicationMeta = {
              company,
              name,
            };
          },
        }),
      },
      system: generateLatexSystemPrompt,
    });

    const latexContentCleaned = result.text
      .replaceAll("```latex ", "")
      .replaceAll("```", "");

    const newApplication = await db
      .insert(application)
      .values({
        description: parsedInput.jobDescription,
        userId: ctx.user.id,
        latexContent: latexContentCleaned,
        company: applicationMeta.company,
        name: applicationMeta.name,
      })
      .returning();

    if (!newApplication[0].id) {
      throw new Error("Não foi possível criar o item");
    }

    return {
      applicationId: newApplication[0].id,
    };
  });
