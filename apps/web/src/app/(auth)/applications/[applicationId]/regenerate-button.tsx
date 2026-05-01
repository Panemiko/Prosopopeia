"use client";

import { regenerateApplicationLatexAction } from "@/server/application";
import { Button } from "@prosopopeia/ui/components/button";
import { RefreshCwIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function RegenerateButton({ applicationId }: { applicationId: string }) {
  const router = useRouter();

  const { execute, isExecuting } = useAction(regenerateApplicationLatexAction, {
    onSuccess: () => {
      toast.success("Código LaTeX regenerado com sucesso!");
      router.refresh();
    },
    onError: () => {
      toast.error("Erro ao regenerar o código LaTeX.");
    },
  });

  return (
    <Button
      variant="secondary"
      size="icon"
      disabled={isExecuting}
      onClick={() => execute({ applicationId })}
      title="Regenerar LaTeX"
    >
      <RefreshCwIcon className={isExecuting ? "animate-spin" : ""} />
    </Button>
  );
}
