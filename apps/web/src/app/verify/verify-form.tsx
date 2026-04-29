"use client";

import { authClient } from "@/lib/auth-client";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@prosopopeia/ui/components/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@prosopopeia/ui/components/input-otp";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  otpCode: z.string().length(6),
});

export function VerifyForm({ email }: { email: string }) {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      otpCode: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    async onSubmit({ value }) {
      const { data, error } = await authClient.signIn.emailOtp({
        email,
        otp: value.otpCode,
      });

      if (error) {
        toast.error("Erro ao entrar. Tente novamente mais tarde");
        return;
      }

      if (data.user.name) {
        router.push(`/applications`);
        return;
      }

      router.push("/onboarding");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field
          name="otpCode"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Seu código de acesso
                </FieldLabel>
                <InputOTP
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  aria-invalid={isInvalid}
                  onComplete={form.handleSubmit}
                  maxLength={6}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </FieldGroup>
    </form>
  );
}
