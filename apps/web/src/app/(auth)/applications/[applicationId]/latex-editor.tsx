"use client";

import { updateApplicationLatexAction } from "@/server/application";
import { Button } from "@prosopopeia/ui/components/button";
import { Textarea } from "@prosopopeia/ui/components/textarea";
import { SaveIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";

export function LatexEditor({
  applicationId,
  defaultContent,
}: {
  applicationId: string;
  defaultContent: string | null;
}) {
  const [editorContent, setEditorContent] = useState(defaultContent ?? "");

  const { execute, isExecuting } = useAction(updateApplicationLatexAction, {
    onSuccess: () => {
      toast.success("Código LaTeX salvo com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao salvar o código LaTeX.");
    },
  });

  return (
    <div className="space-y-4">
      <Textarea
        className="bg-background border-none h-120 font-mono text-xs"
        value={editorContent}
        onChange={(e) => setEditorContent(e.target.value)}
      />
      <div className="flex justify-end">
        <Button
          disabled={isExecuting}
          onClick={() => execute({ applicationId, latexContent: editorContent })}
        >
          <SaveIcon className="mr-2 h-4 w-4" />
          {isExecuting ? "Salvando..." : "Salvar LaTeX"}
        </Button>
      </div>
    </div>
  );
}
