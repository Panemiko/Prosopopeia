import { MaxWidth } from "@/components/max-width";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@prosopopeia/ui/components/card";
import { LoginForm } from "./login-form";

export default async function Page() {
  return (
    <MaxWidth>
      <Card className="max-w-sm mx-auto">
        <CardHeader>
          <CardTitle>Entre em sua conta</CardTitle>
          <CardDescription>
            Insira seu e-mail abaixo para receber o código de acesso.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </MaxWidth>
  );
}
