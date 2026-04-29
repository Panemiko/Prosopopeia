import { MaxWidth } from "@/components/max-width";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@prosopopeia/ui/components/card";
import { redirect } from "next/navigation";
import z from "zod";
import { VerifyForm } from "./verify-form";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ email: string }>;
}) {
  const { email } = await searchParams;
  const { success } = await z.email().safeParseAsync(email);

  if (!success) {
    redirect("/login");
  }

  return (
    <MaxWidth>
      <Card className="max-w-sm mx-auto">
        <CardHeader>
          <CardTitle>Verifique sua caixa de entrada</CardTitle>
          <CardDescription>
            Enviamos para você um e-mail com seu código de acesso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VerifyForm email={email} />
        </CardContent>
      </Card>
    </MaxWidth>
  );
}
