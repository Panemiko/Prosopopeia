"use client";

import { deleteApplicationAction } from "@/server/application";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@prosopopeia/ui/components/alert-dialog";
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
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={isExecuting}>
          <TrashIcon /> {isExecuting ? "Excluindo..." : "Excluir vaga"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente os
            dados desta vaga e removerá o código LaTeX gerado.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => execute({ applicationId })}
          >
            Confirmar Exclusão
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
