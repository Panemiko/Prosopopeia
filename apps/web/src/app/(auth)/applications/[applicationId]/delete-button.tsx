"use client";

import { deleteApplicationAction } from "@/server/application";
import { Button } from "@prosopopeia/ui/components/button";
import { TrashIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function DeleteButton({ applicationId }: { applicationId: string }) {
  const router = useRouter();

  const { execute, isExecuting } = useAction(deleteApplicationAction, {
    onSuccess: () => {
      toast.success("Vaga excluída com sucesso!");
      router.push("/applications");
    },
    onError: () => {
      toast.error("Erro ao excluir a vaga.");
    },
  });

  return (
    <Button
      variant="destructive"
      disabled={isExecuting}
      onClick={() => {
        if (confirm("Tem certeza que deseja excluir esta vaga?")) {
          execute({ applicationId });
        }
      }}
    >
      <TrashIcon /> {isExecuting ? "Excluindo..." : "Excluir vaga"}
    </Button>
  );
}
