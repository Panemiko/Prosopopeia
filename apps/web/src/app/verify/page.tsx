import { MaxWidth } from "@/components/max-width";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@prosopopeia/ui/components/card";
import { VerifyForm } from "./verify-form";

export default async function Page() {
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
          <VerifyForm />
        </CardContent>
      </Card>
    </MaxWidth>
  );
}
