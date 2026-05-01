"use client";

import { exportPDFFromApplicationLatexAction } from "@/server/application";
import { viewJobStatusAction } from "@/server/job";
import { Button } from "@prosopopeia/ui/components/button";
import { DownloadIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

async function downloadUrl(url: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = url.split("/").pop() ?? "";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function ExportButton({ applicationId }: { applicationId: string }) {
  const router = useRouter();
  const [isExecuting, setIsExecuting] = useState(false);

  const { executeAsync: viewJobStatus } = useAction(viewJobStatusAction);

  const { executeAsync: exportPdf } = useAction(
    exportPDFFromApplicationLatexAction,
    {
      async onSuccess({ data }) {
        toast("Arquivo sendo gerado. Aguarde");
        console.log(data);

        let jobCompleted = false;

        async function processJobStatus() {
          const { serverError, data: jobData } = await viewJobStatus({
            jobId: data.jobId,
          });

          if (serverError || !jobData) {
            toast.error(
              "Ocorreu um erro ao processar a solicitação. Saia da página e tente novamente.",
            );

            return;
          }

          if (jobData.jobStatus === "completed") {
            await downloadUrl(data.pdfDownloadUrl);
            return;
          }

          if (jobData.jobStatus === "failed") {
            toast.error(
              "Ocorreu um erro ao processar a solicitação. Saia da página e tente novamente.",
            );

            return;
          }

          if (!jobCompleted) {
            setTimeout(processJobStatus, 3000);
          }
        }

        await processJobStatus();
        setIsExecuting(false);
      },
      onError(args) {
        toast.error(
          "Houve um erro para realizar sua solicitação. Tente novamente mais tarde.",
        );

        setIsExecuting(false);
      },
    },
  );

  async function handleSubmit() {
    setIsExecuting(true);

    await exportPdf({
      applicationId,
    });
  }

  return (
    <Button className="w-full" onClick={handleSubmit}>
      <DownloadIcon /> Exportar PDF
    </Button>
  );
}
