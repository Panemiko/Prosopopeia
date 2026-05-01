import { MaxWidth } from "@/components/max-width";
import { auth } from "@prosopopeia/auth";
import { and, db, eq } from "@prosopopeia/db";
import { application } from "@prosopopeia/db/schema/index";
import { Button } from "@prosopopeia/ui/components/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@prosopopeia/ui/components/card";
import { DownloadIcon, RefreshCwIcon, TrashIcon } from "lucide-react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import z from "zod";
import { LatexEditor } from "./latex-editor";

export default async function Page({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = await params;

  const { success } = await z.cuid2().safeParseAsync(applicationId);

  if (!success) {
    return notFound();
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return;
  }

  const queriedApplications = await db
    .select({
      id: application.id,
      name: application.name,
      company: application.company,
      description: application.description,
      latexContent: application.latexContent,
      createdAt: application.createdAt,
    })
    .from(application)
    .where(
      and(
        eq(application.id, applicationId),
        eq(application.userId, session.user.id),
      ),
    )
    .limit(1);

  if (!queriedApplications[0]) {
    return notFound();
  }

  const myApplication = queriedApplications[0];
  const applicationHash = myApplication.id.slice(0, 4).toUpperCase();

  return (
    <MaxWidth className="grid grid-cols-8 gap-8">
      <div className="col-span-3">
        <Card className="mb-8">
          <CardHeader className="mb-6">
            <h1 className="text-2xl mb-2 font-heading font-bold">
              {myApplication.name ?? `Posição desconhecida #${applicationHash}`}
            </h1>
            <span className="text-muted-foreground text-sm">
              {myApplication.company ?? `Empresa desconhecida`}
            </span>
          </CardHeader>
          <CardFooter>
            <span className="text-muted-foreground text-xs">
              Criado em {myApplication.createdAt.toLocaleDateString("pt-BR")}
            </span>
          </CardFooter>
        </Card>
        <Card>
          <CardContent className="space-y-2">
            <div className="flex justify-between gap-4">
              <Button variant="secondary" size="icon">
                <RefreshCwIcon />
              </Button>
              <Button variant="destructive">
                <TrashIcon /> Excluir vaga
              </Button>
            </div>
            <Button className="w-full">
              <DownloadIcon /> Exportar PDF
            </Button>
          </CardContent>
        </Card>
      </div>
      <Card className="col-span-5">
        <CardHeader>
          <CardTitle>Código LaTeX para geração do curríulo</CardTitle>
          <CardDescription>
            Modifique para alterar o conteúdo gerado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LatexEditor defaultContent={myApplication.latexContent} />
        </CardContent>
      </Card>
    </MaxWidth>
  );
}
