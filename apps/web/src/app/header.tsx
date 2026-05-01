import { MaxWidth } from "@/components/max-width";
import { Button } from "@prosopopeia/ui/components/button";
import Link from "next/link";

export function Header() {
  return (
    <div className="fixed z-50 top-0 left-0 pointer-events-none w-screen py-2">
      <MaxWidth>
        <header className="flex bg-background pointer-events-auto border px-4 py-2 rounded-full border-border justify-between items-center">
          <div>
            <span className="uppercase font-heading text-lg text-primary">
              Prosopopeia
            </span>
          </div>
          <div>
            <Button asChild>
              <Link href="/login">Entrar</Link>
            </Button>
          </div>
        </header>
      </MaxWidth>
    </div>
  );
}
