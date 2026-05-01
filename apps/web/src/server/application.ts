"use server";

import { and, db, eq } from "@prosopopeia/db";
import { application } from "@prosopopeia/db/schema/index";
import { generateText, stepCountIs, tool } from "ai";
import z from "zod";
import { privateActionClient } from ".";
import { google } from "./utils/ai";
import { generateLatexSystemPrompt } from "./utils/generate-latex-system-prompt";
import { queues } from "./utils/queues";
import { createPresignedUrl } from "./utils/r2";

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
      stopWhen: stepCountIs(5),
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

    console.log(result.text);

    const latexContentCleaned = result.text
      .replace("```latex ", "")
      .replace("```", "");

    console.log(latexContentCleaned);

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

export const exportPDFFromApplicationLatexAction = privateActionClient
  .inputSchema(
    z.object({
      applicationId: z.cuid2(),
    }),
  )
  .action(async ({ parsedInput, ctx }) => {
    // Enviar para fila no bucket
    // Registrar key no db
    // Criar link assinado para leitura do documento
    // Retornar pro usuário o link de leitura e o jobId

    const queriedApplications = await db
      .select({
        id: application.id,
        latexContent: application.latexContent,
      })
      .from(application)
      .where(
        and(
          eq(application.id, parsedInput.applicationId),
          eq(application.userId, ctx.user.id),
        ),
      );

    if (queriedApplications.length === 0) {
      throw new Error("Application não encontrada");
    }

    const queriedApplication = queriedApplications[0];

    if (!queriedApplication.latexContent) {
      throw new Error("Conteúdo do currículo vazio. Gere um antes");
    }

    const exportedFileKey = `exported/${queriedApplication.id}/${ctx.user.name}.pdf`;

    const uploadPresignedUrl = await createPresignedUrl({
      action: "PUT",
      filename: exportedFileKey,
      expiresIn: 3600,
    });

    const job = await queues.add("export-pdf", {
      uploadUrl: uploadPresignedUrl,
    });
  });
