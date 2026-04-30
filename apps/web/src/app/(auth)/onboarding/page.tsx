import { MaxWidth } from "@/components/max-width";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@prosopopeia/ui/components/card";
import { OnboardingForm } from "./onboarding-form";

export default async function Page() {
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
          <OnboardingForm />
        </CardContent>
      </Card>
    </MaxWidth>
  );
}
