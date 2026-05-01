"use client";

import { ProfileForm } from "@/components/profile-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function OnboardingForm() {
  const router = useRouter();

  return (
    <ProfileForm
      onSuccess={() => {
        toast.success("Perfil salvo com sucesso!", {
          description: "Enviando você para seu dashboard",
        });

        router.push("/applications");
      }}
    />
  );
}
