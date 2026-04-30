import { MaxWidth } from "@/components/max-width";
import { auth } from "@prosopopeia/auth";
import { db, eq } from "@prosopopeia/db";
import { application } from "@prosopopeia/db/schema/index";
import { Button } from "@prosopopeia/ui/components/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@prosopopeia/ui/components/card";
import { generate } from "geopattern";
import { ArrowRightIcon } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { AddApplicationModal } from "./add-application-modal";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return;
  }

  const myApplications = await db
    .select({
      id: application.id,
      name: application.name,
      company: application.company,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
    })
    .from(application)
    .where(eq(application.userId, session.user.id));

  return (
    <MaxWidth>
      <div className="flex justify-between gap-6 mb-4">
        <h1 className="text-2xl font-bold">Suas últimas vagas</h1>
        <AddApplicationModal />
      </div>

      <div>
        <ol className="grid grid-cols-3 gap-4">
          {myApplications.map((item) => (
            <li key={item.id}>
              <Link href={`/applications/${item.id}`}>
                <Card className="group">
                  <img
                    className="h-16 object-cover"
                    src={generate(item.id).toDataUri()}
                  />
                  <CardHeader>
                    <CardTitle>{item.name}</CardTitle>
                    <span className="text-sm text-muted-foreground">
                      {item.company}
                    </span>
                  </CardHeader>
                  <CardFooter className="flex justify-between">
                    <span className="text-xs text-muted-foreground">
                      {item.createdAt.toLocaleDateString("pt-BR")}
                    </span>
                    <Button
                      className="invisible group-hover:visible"
                      variant="secondary"
                      size="xs"
                    >
                      <ArrowRightIcon />
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </MaxWidth>
  );
}
