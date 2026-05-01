import { auth } from "@prosopopeia/auth";
import { MaxWidth } from "@/components/max-width";
import { Button } from "@prosopopeia/ui/components/button";
import Link from "next/link";
import { headers } from "next/headers";

export async function Header() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="fixed z-50 top-0 left-0 pointer-events-none w-screen py-2">
      <MaxWidth>
        <header className="flex bg-background pointer-events-auto border px-4 py-2 rounded-full border-border justify-between items-center">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="uppercase font-heading text-lg text-primary"
            >
              Prosopopeia
            </Link>

            {session && (
              <nav className="flex items-center gap-4">
                <Link
                  href="/applications"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  Aplicações
                </Link>
                <Link
                  href="/profile"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  Perfil
                </Link>
              </nav>
            )}
          </div>
          <div>
            {session ? (
              <span className="text-sm font-medium px-4">
                Olá, {session.user.name}
              </span>
            ) : (
              <Button asChild>
                <Link href="/login">Entrar</Link>
              </Button>
            )}
          </div>
        </header>
      </MaxWidth>
    </div>
  );
}
