import { env } from "@prosopopeia/env/server";
import { Worker } from "bullmq";
import { execSync } from "child_process";
import {
  createReadStream,
  existsSync,
  mkdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "fs";
import { tmpdir } from "os";
import { join } from "path";

const worker = new Worker(
  "prosopopeia-queue",
  async (job) => {
    console.log(`Processing job ${job.id} (type: ${job.name})`);

    const { latexContent, uploadUrl } = job.data;

    if (!latexContent || !uploadUrl) {
      throw new Error("Missing latexContent or uploadUrl");
    }

    const workDir = join(tmpdir(), `latex-${job.id}`);
    if (!existsSync(workDir)) {
      mkdirSync(workDir, { recursive: true });
    }

    const texFilePath = join(workDir, "main.tex");
    const pdfFilePath = join(workDir, "main.pdf");

    try {
      // Escape unescaped ampersands to prevent LaTeX compilation errors
      // Matches '&' only if not preceded by '\'
      const safeLatexContent = latexContent.replace(/(?<!\\)&/g, "\\&");

      // Write latex content to file
      writeFileSync(texFilePath, safeLatexContent);

      console.log(`Compiling LaTeX for job ${job.id}...`);

      // Run pdflatex
      try {
        execSync(
          `pdflatex -interaction=nonstopmode -output-directory="${workDir}" "${texFilePath}"`,
          {
            stdio: "inherit",
          },
        );
      } catch (compileError) {
        // pdflatex often returns status 1 even if it produces a PDF (due to warnings/minor errors)
        console.warn(
          `pdflatex exited with an error for job ${job.id}, checking if PDF was still generated...`,
        );
      }

      if (!existsSync(pdfFilePath)) {
        throw new Error("PDF file was not generated. Check LaTeX logs.");
      }

      console.log(`Uploading PDF for job ${job.id}...`);
      const fileStream = createReadStream(pdfFilePath);
      const fileSize = statSync(pdfFilePath).size;

      const response = await fetch(uploadUrl, {
        method: "PUT",
        body: fileStream,
        duplex: "half",
        headers: {
          "Content-Type": "application/pdf",
          "Content-Length": fileSize.toString(),
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to upload PDF: ${response.statusText} - ${errorText}`,
        );
      }

      console.log(`Job ${job.id} completed successfully.`);
      return { status: "completed" };
    } catch (error) {
      console.error(`Error processing job ${job.id}:`, error);
      throw error;
    } finally {
      // Cleanup
      try {
        rmSync(workDir, { recursive: true, force: true });
      } catch (cleanupError) {
        console.error(`Error cleaning up workDir ${workDir}:`, cleanupError);
      }
    }
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
