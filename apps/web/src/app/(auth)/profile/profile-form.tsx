"use client";

import { ProfileForm } from "@/components/profile-form";
import type { userProfileSchema } from "@/lib/schema";
import { toast } from "sonner";
import type z from "zod";

export function ProfilePageForm({
  currentUser,
}: {
  currentUser: { name: string; email: string; profileJson: string };
}) {
  const parsedProfileInfo = JSON.parse(currentUser.profileJson) as z.infer<
    typeof userProfileSchema
  >;

  const defaultValues = {
    name: currentUser.name,
    email: currentUser.name,
    ...parsedProfileInfo,
  };

  return (
    <ProfileForm
      defaultValues={defaultValues}
      onSuccess={() => {
        toast.success("Perfil atualizado com sucesso!");
      }}
    />
  );
}
