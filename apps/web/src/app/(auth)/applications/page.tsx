import { MaxWidth } from "@/components/max-width";
import { Button } from "@prosopopeia/ui/components/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@prosopopeia/ui/components/card";
import { generate } from "geopattern";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { AddApplicationModal } from "./add-application-modal";

const applicationMock = [
  {
    id: "1",
    name: "Desenvolvedor Full-Stack",
    company: "Acme corp",
    createdAt: new Date(),
  },
  {
    id: "2",
    name: "Desenvolvedor Front-end",
    company: "TechCorp",
    createdAt: new Date(),
  },
  {
    id: "3",
    name: "Engenheiro de Software",
    company: "InnovaTech",
    createdAt: new Date(),
  },
  {
    id: "4",
    name: "Designer UX/UI",
    company: "Creative Studio",
    createdAt: new Date(),
  },
  {
    id: "5",
    name: "Analista de Dados",
    company: "DataWorks",
    createdAt: new Date(),
  },
];

export default async function Page() {
  return (
    <MaxWidth>
      <div className="flex justify-between gap-6 mb-4">
        <h1 className="text-2xl font-bold">Suas últimas vagas</h1>
        <AddApplicationModal />
      </div>

      <div>
        <ol className="grid grid-cols-3 gap-4">
          {applicationMock.map((item) => (
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
