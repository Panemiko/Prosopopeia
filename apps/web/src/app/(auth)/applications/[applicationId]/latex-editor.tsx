"use client";

import { Textarea } from "@prosopopeia/ui/components/textarea";
import { useState } from "react";

export function LatexEditor({
  defaultContent,
}: {
  defaultContent: string | null;
}) {
  const [editorContent, setEditorContent] = useState(defaultContent ?? "");

  return (
    <Textarea
      className="bg-background border-none h-120"
      value={editorContent}
      onChange={(e) => setEditorContent(e.target.value)}
    />
  );
}
