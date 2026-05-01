import { MaxWidth } from "@/components/max-width";
import { auth } from "@prosopopeia/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@prosopopeia/ui/components/card";
import { headers } from "next/headers";
import { ProfilePageForm } from "./profile-form";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return;
  }

  return (
    <MaxWidth>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Preencha suas informações para continuar</CardTitle>
          <CardDescription>
            Antes de continuar, preencha seu perfil para podermos montar seu
            currículo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfilePageForm currentUser={session.user} />
        </CardContent>
      </Card>
    </MaxWidth>
  );
}
