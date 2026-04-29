import { cn } from "@prosopopeia/ui/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

export function MaxWidth({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("max-w-[1500px] mx-auto px-8 lg:px-20", className)}
      {...props}
    />
  );
}
